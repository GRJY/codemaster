// Security Configuration for Code Analysis Application
// This file contains all security-related configurations

export const SECURITY_CONFIG = {
    // Rate Limiting Configuration
    rateLimit: {
        windowMs: 60 * 1000, // 1 minute
        max: 10, // limit each IP to 10 requests per windowMs
        message: {
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: 60
        },
        standardHeaders: true,
        legacyHeaders: false,
    },

    // CORS Configuration
    cors: {
        development: {
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            credentials: true,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        },
        production: {
            origin: ['https://yourdomain.com'], // Replace with your actual domain
            credentials: true,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }
    },

    // Input Validation Configuration
    validation: {
        maxCodeLength: 10240, // 10KB
        allowedLanguages: [
            'javascript', 'python', 'html', 'css', 'java', 
            'c++', 'c#', 'php', 'ruby', 'go', 'rust', 
            'swift', 'kotlin', 'typescript'
        ],
        maxResponseLength: 50000, // 50KB
    },

    // Security Headers Configuration
    helmet: {
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
    },

    // Request Size Limits
    bodyParser: {
        json: {
            limit: '1mb',
            strict: true
        },
        urlencoded: {
            extended: true,
            limit: '1mb'
        }
    },

    // API Timeout Configuration
    api: {
        timeout: 30000, // 30 seconds
        maxRetries: 3,
        baseDelay: 1000, // 1 second
    },

    // Logging Configuration
    logging: {
        enabled: true,
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        format: '[{timestamp}] {method} {path} - IP: {ip} - User-Agent: {userAgent}'
    },

    // Error Messages (User-friendly)
    errorMessages: {
        RATE_LIMIT_EXCEEDED: 'Rate limit aşıldı. Lütfen 60 saniye sonra tekrar deneyin.',
        INVALID_CODE_SIZE: 'Kod boyutu çok büyük. Maksimum 10KB olmalıdır.',
        UNSUPPORTED_LANGUAGE: 'Desteklenmeyen programlama dili.',
        API_ACCESS_DENIED: 'API erişimi reddedildi. Lütfen sistem yöneticisi ile iletişime geçin.',
        REQUEST_TIMEOUT: 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.',
        INTERNAL_ERROR: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
        MISSING_REQUIRED_FIELDS: 'Gerekli alanlar eksik.',
        EMPTY_CODE: 'Kod boş olamaz.',
        INVALID_RESPONSE: 'Geçersiz yanıt alındı.',
        UNEXPECTED_RESPONSE: 'Beklenmeyen yanıt alındı.',
        NOT_FOUND: 'Endpoint bulunamadı.',
    },

    // Security Headers for Static Files
    staticHeaders: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
    },

    // Environment-specific configurations
    environment: {
        development: {
            logLevel: 'debug',
            corsOrigin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            enableDetailedErrors: true,
        },
        production: {
            logLevel: 'info',
            corsOrigin: ['https://yourdomain.com'], // Replace with actual domain
            enableDetailedErrors: false,
        }
    }
};

// Security utility functions
export const SecurityUtils = {
    // Sanitize user input
    sanitizeInput: (input) => {
        if (typeof input !== 'string') return '';
        
        // Remove script tags and other potentially dangerous content
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
    },

    // Validate language
    validateLanguage: (language) => {
        return SECURITY_CONFIG.validation.allowedLanguages.includes(language.toLowerCase());
    },

    // Validate code length
    validateCodeLength: (code) => {
        return typeof code === 'string' && code.length <= SECURITY_CONFIG.validation.maxCodeLength;
    },

    // Generate secure error response
    generateErrorResponse: (code, message, details = null) => {
        const response = {
            error: message || SECURITY_CONFIG.errorMessages[code] || 'Unknown error',
            code: code,
            timestamp: new Date().toISOString()
        };

        if (details && process.env.NODE_ENV === 'development') {
            response.details = details;
        }

        return response;
    },

    // Log security events
    logSecurityEvent: (event, details) => {
        if (SECURITY_CONFIG.logging.enabled) {
            const timestamp = new Date().toISOString();
            console.log(`[SECURITY] [${timestamp}] ${event}:`, details);
        }
    },

    // Check if request is from allowed origin
    isAllowedOrigin: (origin) => {
        const allowedOrigins = process.env.NODE_ENV === 'production' 
            ? SECURITY_CONFIG.cors.production.origin 
            : SECURITY_CONFIG.cors.development.origin;
        
        return allowedOrigins.includes(origin);
    }
};

// Export default configuration
export default SECURITY_CONFIG; 