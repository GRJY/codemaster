# 🛠️ Admin Kılavuzu - CodeMaster

## 1. Kurulum
1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/GRJY/codemaster.git
   cd codemaster
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. `.env` dosyasını oluşturun ve Gemini API anahtarınızı ekleyin:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   NODE_ENV=development
   ```
4. Sunucuyu başlatın:
   ```bash
   npm run dev
   # veya
   npm start
   ```

---

## 2. Güvenlik
- API anahtarı **sadece sunucu tarafında** saklanır, client'a gönderilmez.
- `.env` dosyası `.gitignore` ile korunur.
- Rate limiting, helmet, CORS ve input validation sunucu tarafında aktiftir.
- Sunucuya dışarıdan erişim gerekiyorsa güvenlik duvarı ve HTTPS önerilir.

---

## 3. API Anahtarı Yönetimi
- Gemini API anahtarınızı [Google AI Console](https://ai.google.dev/) üzerinden alın.
- Anahtarı `.env` dosyasına ekleyin.
- Anahtar sızıntılarını önlemek için `.env` dosyasını asla paylaşmayın.

---

## 4. Sunucu Yönetimi
- Sunucu loglarını takip edin (console veya bir log yönetim aracı ile).
- API hatalarını ve rate limit uyarılarını izleyin.
- Gerektiğinde sunucuyu yeniden başlatın.
- `npm test` ile unit testleri çalıştırarak kodun bütünlüğünü kontrol edin.

---

## 5. Yedekleme ve Geri Yükleme
- Kullanıcı analiz geçmişi **localStorage**'da tutulur (her kullanıcı kendi tarayıcısında).
- Sunucu tarafında ek veri tabanı yoktur.
- Sunucu dosyalarını ve `.env` dosyasını düzenli yedekleyin.

---

## 6. Sorun Giderme
- **API anahtarı hatası:** `.env` dosyasını ve anahtarı kontrol edin.
- **CORS hatası:** Sunucu ve istemci portlarının uyumlu olduğundan emin olun.
- **Sunucu başlamıyor:** Bağımlılıkları (`npm install`) ve Node.js sürümünü kontrol edin.
- **Analiz sonucu gelmiyor:** Gemini API anahtarının geçerli ve aktif olduğundan emin olun.
- **Testler geçmiyor:** `npm test` çıktısındaki hata mesajlarını inceleyin.

---

## 7. Ekstra
- Güvenlik ve katkı rehberi için `SECURITY.md` ve `CONTRIBUTING.md` dosyalarını inceleyin.
- Gelişmiş loglama, yedekleme veya kullanıcı yönetimi için ek modüller entegre edilebilir.