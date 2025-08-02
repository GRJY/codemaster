// Test script to validate Gemini API key
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const testApiKey = async () => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'your_actual_gemini_api_key_here') {
        console.log('❌ API anahtarı ayarlanmamış!');
        console.log('📝 .env dosyasında GEMINI_API_KEY=your_actual_key_here satırını gerçek API anahtarınızla değiştirin');
        return;
    }
    
    console.log('🔑 API anahtarı formatı kontrol ediliyor...');
    console.log('API Key:', apiKey.substring(0, 10) + '...');
    
    if (!apiKey.startsWith('AIza')) {
        console.log('❌ API anahtarı geçersiz format! Gemini API anahtarları "AIza" ile başlamalıdır');
        return;
    }
    
    console.log('✅ API anahtarı formatı doğru görünüyor');
    console.log('🌐 Test isteği gönderiliyor...');
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: "Merhaba, bu bir test mesajıdır."
                    }]
                }]
            })
        });
        
        if (response.ok) {
            console.log('✅ API anahtarı çalışıyor!');
        } else {
            const error = await response.json();
            console.log('❌ API anahtarı hatası:', error.error?.message || 'Bilinmeyen hata');
        }
    } catch (error) {
        console.log('❌ Bağlantı hatası:', error.message);
    }
};

testApiKey(); 