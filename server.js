// Secure Node.js Express server with comprehensive security measures
import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security: API key from environment variable
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

// Security: Validate API key exists
if (!GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY environment variable is not set!');
    console.error('Please set your Gemini API key in a .env file or environment variable.');
    process.exit(1);
}

// Security: Rate limiting - 10 requests per minute per IP
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 60
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security: Apply rate limiting to all routes
app.use(limiter);

// Security: Helmet for security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
            fontSrc: ["'self'", "https:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

// Security: CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] // Replace with your actual domain
        : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Security: Body parser with size limits
app.use(express.json({ 
    limit: '1mb', // Limit request body size
    strict: true 
}));
app.use(express.urlencoded({ 
    extended: true, 
    limit: '1mb' 
}));

// Security: Input validation middleware
const validateCodeAnalysisRequest = (req, res, next) => {
    const { code, language } = req.body;
    
    // Check if required fields exist
    if (!code || !language) {
        return res.status(400).json({ 
            error: 'Code and language are required.',
            code: 'MISSING_REQUIRED_FIELDS'
        });
    }
    
    // Validate code length (max 10KB)
    if (typeof code !== 'string' || code.length > 10240) {
        return res.status(400).json({ 
            error: 'Code must be a string and cannot exceed 10KB.',
            code: 'INVALID_CODE_SIZE'
        });
    }
    
    // Validate language
    const allowedLanguages = ['javascript', 'python', 'html', 'css', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript'];
    if (!allowedLanguages.includes(language.toLowerCase())) {
        return res.status(400).json({ 
            error: 'Unsupported programming language.',
            code: 'UNSUPPORTED_LANGUAGE',
            allowedLanguages
        });
    }
    
    // Sanitize input (basic XSS prevention)
    const sanitizedCode = code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    const sanitizedLanguage = language.toLowerCase().trim();
    
    req.body.code = sanitizedCode;
    req.body.language = sanitizedLanguage;
    
    next();
};

// Security: Request logging middleware
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${ip} - User-Agent: ${req.get('User-Agent')}`);
    next();
};

app.use(requestLogger);

// Serve static files with security headers
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, path) => {
        // Security headers for static files
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Secure endpoint for code analysis
app.post('/api/analyze-code', validateCodeAnalysisRequest, async (req, res) => {
    const { code, language } = req.body;
    
    try {
        // Security: Additional validation
        if (code.trim().length === 0) {
            return res.status(400).json({ 
                error: 'Code cannot be empty.',
                code: 'EMPTY_CODE'
            });
        }

        const prompt = `Aşağıdaki ${language} kodunu incele ve hatalar, güvenlik açıkları ve refactoring önerileri açısından analiz et. Sonuçları aşağıdaki gibi Türkçe Markdown formatında sun:

1.  **Hata ve Güvenlik Çıktıları:**
    * [varsa, her hatayı veya güvenlik açığını madde madde listele]
2.  **Refactoring Önerileri:**
    * [varsa, her iyileştirme önerisini madde madde listele]

---
${code}
---`;

        const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
        const payload = { contents: chatHistory };

        // Security: Timeout for external API calls
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'User-Agent': 'CodeAnalyzer/1.0'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!geminiResponse.ok) {
            const errorText = await geminiResponse.text();
            console.error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
            
            if (geminiResponse.status === 429) {
                return res.status(429).json({ 
                    error: 'API rate limit exceeded. Please try again later.',
                    code: 'RATE_LIMIT_EXCEEDED',
                    retryAfter: geminiResponse.headers.get('Retry-After') || 60
                });
            }
            
            if (geminiResponse.status === 403) {
                return res.status(403).json({ 
                    error: 'API access denied. Please check your API key.',
                    code: 'API_ACCESS_DENIED'
                });
            }
            
            throw new Error(`Gemini API call failed with status: ${geminiResponse.status}`);
        }

        const result = await geminiResponse.json();

        if (result.candidates && result.candidates.length > 0) {
            const geminiText = result.candidates[0].content.parts[0].text;
            
            // Security: Validate response
            if (typeof geminiText !== 'string' || geminiText.length > 50000) {
                return res.status(500).json({ 
                    error: 'Invalid response from analysis service.',
                    code: 'INVALID_RESPONSE'
                });
            }
            
            res.json({ 
                analysis: geminiText,
                timestamp: new Date().toISOString(),
                language: language
            });
        } else {
            res.status(500).json({ 
                error: 'Unexpected response from analysis service.',
                code: 'UNEXPECTED_RESPONSE'
            });
        }
    } catch (error) {
        console.error('Error during code analysis:', error);
        
        if (error.name === 'AbortError') {
            return res.status(408).json({ 
                error: 'Request timeout. Please try again.',
                code: 'REQUEST_TIMEOUT'
            });
        }
        
        res.status(500).json({ 
            error: 'Failed to analyze code. Please try again later.',
            code: 'INTERNAL_ERROR'
        });
    }
});

// Security: 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found.',
        code: 'NOT_FOUND'
    });
});

// Security: Global error handler
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error.',
        code: 'INTERNAL_ERROR'
    });
});

// Start server with error handling
const server = app.listen(port, () => {
    console.log(`🚀 Secure server running at http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`🔒 Security measures: Rate limiting, CORS, Helmet, Input validation`);
    
    if (process.env.NODE_ENV === 'production') {
        console.log(`🌍 Production mode enabled`);
    } else {
        console.log(`🔧 Development mode - Open http://localhost:${port}/index.html`);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

export default app;
