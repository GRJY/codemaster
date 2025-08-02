# 🔒 Güvenlik Dokümantasyonu

Bu dokümantasyon, kod analiz uygulamasının güvenlik önlemlerini ve yapılandırmalarını detaylandırır.

## 🛡️ Uygulanan Güvenlik Önlemleri

### 1. API Anahtarı Güvenliği

**Önceki Durum:**
- API anahtarı client-side JavaScript'te açık metin olarak saklanıyordu
- Kullanıcılar tarayıcı geliştirici araçlarından API anahtarını görebiliyordu
- API anahtarı version control'e commit edilebiliyordu

**Yeni Güvenlik Önlemleri:**
- ✅ API anahtarı server-side'da environment variable olarak saklanır
- ✅ Client-side'da API anahtarı hiçbir zaman görünmez
- ✅ `.env` dosyası `.gitignore` ile korunur
- ✅ Production'da environment variables kullanılır

### 2. Rate Limiting

**Uygulanan Limitler:**
- IP başına dakikada 10 istek sınırı
- Otomatik retry-after header'ları
- DDoS koruması

**Yapılandırma:**
```javascript
{
    windowMs: 60 * 1000, // 1 dakika
    max: 10, // IP başına maksimum 10 istek
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: 60
    }
}
```

### 3. Input Validation ve Sanitization

**Kod Validasyonu:**
- Maksimum kod uzunluğu: 10KB
- Desteklenen diller: JavaScript, Python, HTML, CSS, Java, C++, C#, PHP, Ruby, Go, Rust, Swift, Kotlin, TypeScript
- Boş kod kontrolü

**XSS Koruması:**
- Script tag'leri otomatik olarak temizlenir
- JavaScript: URL'leri engellenir
- Event handler'ları engellenir

**Sanitization Örneği:**
```javascript
const sanitizedCode = code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
```

### 4. Security Headers

**Helmet ile Uygulanan Başlıklar:**
- `Content-Security-Policy`: Script ve style kaynaklarını kısıtlar
- `X-Frame-Options: DENY`: Clickjacking koruması
- `X-Content-Type-Options: nosniff`: MIME type sniffing koruması
- `X-XSS-Protection: 1; mode=block`: XSS koruması

**CSP Direktifleri:**
```javascript
{
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com", "https://cdn.jsdelivr.net"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    connectSrc: ["'self'", "https://generativelanguage.googleapis.com"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"]
}
```

### 5. CORS Koruması

**Development:**
- Origin: `http://localhost:3000`, `http://127.0.0.1:3000`

**Production:**
- Origin: Sadece belirtilen domain'ler (güvenlik için güncellenmeli)

**Yapılandırma:**
```javascript
{
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
```

### 6. Request Size Limiting

**Body Parser Limitleri:**
- JSON: Maksimum 1MB
- URL Encoded: Maksimum 1MB
- Strict mode aktif

### 7. Error Handling

**Güvenli Hata Mesajları:**
- Hassas bilgiler kullanıcıya gösterilmez
- Standardized error codes
- User-friendly Türkçe mesajlar

**Error Code'ları:**
- `RATE_LIMIT_EXCEEDED`: Rate limit aşıldı
- `INVALID_CODE_SIZE`: Kod boyutu geçersiz
- `UNSUPPORTED_LANGUAGE`: Desteklenmeyen dil
- `API_ACCESS_DENIED`: API erişimi reddedildi
- `REQUEST_TIMEOUT`: İstek zaman aşımı
- `INTERNAL_ERROR`: Sunucu hatası

### 8. Request Logging

**Loglanan Bilgiler:**
- Timestamp
- HTTP Method
- Request Path
- IP Adresi
- User-Agent
- Response Status

**Log Formatı:**
```
[2024-01-15T10:30:00.000Z] POST /api/analyze-code - IP: 192.168.1.1 - User-Agent: Mozilla/5.0...
```

### 9. API Timeout

**Timeout Yapılandırması:**
- Maksimum 30 saniye timeout
- AbortController ile graceful cancellation
- Timeout durumunda kullanıcıya bilgi verilir

### 10. Environment Variables

**Gerekli Environment Variables:**
```bash
# .env dosyası
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

**Production Environment:**
```bash
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=your_production_api_key
```

## 🔧 Güvenlik Yapılandırması

### Security Config Dosyası

Tüm güvenlik ayarları `security-config.js` dosyasında merkezi olarak yönetilir:

```javascript
export const SECURITY_CONFIG = {
    rateLimit: { /* Rate limiting ayarları */ },
    cors: { /* CORS ayarları */ },
    validation: { /* Input validation ayarları */ },
    helmet: { /* Security headers ayarları */ },
    // ... diğer ayarlar
};
```

### Security Utility Functions

```javascript
export const SecurityUtils = {
    sanitizeInput: (input) => { /* Input sanitization */ },
    validateLanguage: (language) => { /* Language validation */ },
    validateCodeLength: (code) => { /* Code length validation */ },
    generateErrorResponse: (code, message) => { /* Error response generation */ },
    logSecurityEvent: (event, details) => { /* Security event logging */ }
};
```

## 🚨 Güvenlik Uyarıları

### Kritik Güvenlik Noktaları

1. **API Anahtarı**: Asla client-side'da saklamayın
2. **Environment Variables**: Production'da mutlaka kullanın
3. **HTTPS**: Production'da HTTPS zorunludur
4. **Firewall**: Sunucu firewall'ını yapılandırın
5. **Monitoring**: Güvenlik loglarını düzenli kontrol edin

### Production Deployment Checklist

- [ ] API anahtarı environment variable olarak ayarlandı
- [ ] HTTPS sertifikası yüklendi
- [ ] CORS origin'leri production domain'lerle güncellendi
- [ ] Firewall kuralları yapılandırıldı
- [ ] Monitoring ve alerting sistemi kuruldu
- [ ] Backup stratejisi belirlendi
- [ ] Incident response planı hazırlandı

## 📊 Güvenlik Metrikleri

### İzlenen Metrikler

- **Request Count per IP**: IP başına istek sayısı
- **Response Times**: Yanıt süreleri
- **Error Rates**: Hata oranları
- **Rate Limit Violations**: Rate limit ihlalleri
- **Security Events**: Güvenlik olayları

### Monitoring Dashboard

```
Health Check: GET /health
Response: {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "uptime": 3600
}
```

## 🔍 Güvenlik Testleri

### Manuel Test Senaryoları

1. **Rate Limiting Testi**
   - 10 istek gönder, 11. istekte rate limit hatası al

2. **Input Validation Testi**
   - Çok büyük kod gönder (10KB+)
   - Desteklenmeyen dil gönder
   - XSS payload'ı gönder

3. **CORS Testi**
   - Farklı origin'den istek gönder
   - CORS hatası al

4. **Error Handling Testi**
   - Geçersiz API anahtarı ile test
   - Network timeout testi

### Otomatik Testler

```bash
npm test
```

15 test senaryosu güvenlik önlemlerini test eder.

## 🆘 Incident Response

### Güvenlik Olayı Durumunda

1. **Hemen Müdahale**
   - Sunucuyu geçici olarak kapatın
   - Logları analiz edin
   - API anahtarını değiştirin

2. **Analiz**
   - Hangi endpoint etkilendi?
   - Hangi veriler sızıntıya uğradı?
   - Saldırının kaynağı nedir?

3. **Düzeltme**
   - Güvenlik açığını kapatın
   - Ek güvenlik önlemleri ekleyin
   - Monitoring'i güçlendirin

4. **Bildirim**
   - Kullanıcıları bilgilendirin
   - Gerekirse yasal otoritelere bildirin

## 📞 Güvenlik İletişimi

Güvenlik sorunları için:
- **Email**: security@yourdomain.com
- **Güvenlik Raporu**: https://yourdomain.com/security
- **Responsible Disclosure**: 30 gün içinde yanıt

## 📚 Ek Kaynaklar

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practices-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [API Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/API_Security_Cheat_Sheet.html)

---

**Son Güncelleme**: 2024-01-15
**Versiyon**: 1.0.0
**Güvenlik Seviyesi**: Yüksek 