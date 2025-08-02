// Fallback script for HTML Live Server (temporary solution)
// This version works without Node.js server but exposes API key (NOT RECOMMENDED FOR PRODUCTION)

// ====================================================================
// FALLBACK API Yapılandırması (Sadece Development İçin)
// ====================================================================
// ⚠️ UYARI: Bu dosya sadece development için kullanılmalıdır!
// Production'da asla API anahtarını client-side'da saklamayın!

const FALLBACK_API_KEY = "your_gemini_api_key_here"; // ⚠️ Buraya API anahtarınızı yazın
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent";

// Debug için endpoint'i konsola yazdır
console.log('⚠️ FALLBACK MODE: API key is exposed (development only)');
console.log('Gemini API URL:', GEMINI_API_URL);

// Ortam tarafından sağlanan global değişkenleri kullanarak Firebase'i başlatıyoruz.
let firebaseConfig = null;
let appId = 'default-app-id';
let initialAuthToken = null;

if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    try {
        firebaseConfig = JSON.parse(__firebase_config);
        console.log("Firebase yapılandırması yüklendi.");
    } catch (e) {
        console.error("Firebase yapılandırması JSON parse hatası:", e);
    }
}

if (typeof __app_id !== 'undefined') {
    appId = __app_id;
}

if (typeof __initial_auth_token !== 'undefined') {
    initialAuthToken = __initial_auth_token;
}

// Global uygulama durumu
window.appState = {
    code: '',
    result: '',
    currentAnalysisId: null,
    pastAnalyses: [],
    selectedLanguage: 'javascript',
    isSidebarExpanded: window.innerWidth >= 768,
};

// Firebase başlatma ve durum değişkenleri
let app, db, auth;
let userId = null;
let dbReady = false;
let userAuthReady = false;

// Firebase hazır olduğunda dinleyiciyi başlatacak fonksiyon
const initializeFirestoreListener = () => {
    if (!db || !userAuthReady || !userId) {
        console.log("Firestore dinleyicisi başlatılamadı: Veritabanı veya kullanıcı hazır değil.");
        return;
    }
    console.log("Firestore dinleyicisi başlatılıyor.");

    const analysesRef = collection(db, 'artifacts', appId, 'users', userId, 'analyses');
    onSnapshot(analysesRef, (snapshot) => {
        const analyses = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            analyses.push({
                id: doc.id,
                name: data.name,
                code: data.code,
                result: data.result,
                timestamp: data.createdAt ? data.createdAt.toDate().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) : '',
            });
        });
        analyses.sort((a, b) => b.timestamp - a.timestamp);
        window.appState.pastAnalyses = analyses;
        updateUI();
    });
};

if (firebaseConfig) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        dbReady = true;

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                userId = user.uid;
                userAuthReady = true;
                console.log("Kullanıcı kimliği alındı:", userId);
                initializeFirestoreListener();
            } else {
                console.warn("Kullanıcı oturumu kapalı, anonim olarak oturum açılıyor.");
                await signInAnonymously(auth);
            }
        });

        if (initialAuthToken) {
            try {
                await signInWithCustomToken(auth, initialAuthToken);
                console.log("Önceden tanımlı token ile oturum açıldı.");
            } catch (e) {
                console.error("Token ile oturum açma hatası:", e);
            }
        }
    } catch (e) {
        console.error("Firebase başlatma hatası:", e);
        dbReady = false;
        userAuthReady = true; // Auth olmadan da çalışmaya devam etmesi için
    }
} else {
    console.warn("Firebase yapılandırması eksik, Firestore devre dışı.");
    dbReady = false;
    userAuthReady = true; // Auth olmadan da çalışmaya devam etmesi için
}

// Örnek kodlar
const exampleCodes = {
    javascript: `// JavaScript için örnek kod
function topla(a, b) {
    return a + b;
}

// Hata: Fonksiyon çağrılmıyor
// Güvenlik açığı: Yok
`,
    python: `# Python için örnek kod
def topla(a, b):
    return a + b

# Hata: Fonksiyon çağrılmıyor
# Güvenlik açığı: Yok
`,
    html: `<!-- HTML için örnek kod -->
<!DOCTYPE html>
<html>
<head>
    <title>Örnek Sayfa</title>
</head>
<body>
    <h1>Merhaba Dünya</h1>
</body>
</html>`,
};

// FALLBACK: Doğrudan Gemini API'ye istek gönder
export async function handleAnalyze() {
    const code = window.appState.code;
    const language = window.appState.selectedLanguage;
    const loadingIndicator = document.getElementById('loading-indicator');
    const analyzeButton = document.getElementById('analyze-button');

    if (!code) {
        showMessage('Uyarı', 'Lütfen analiz etmek için bir kod girin.', 'warning');
        return;
    }

    loadingIndicator.classList.remove('hidden');
    analyzeButton.disabled = true;

    try {
        const prompt = `Aşağıdaki ${language} kodunu incele ve hatalar, güvenlik açıkları ve refactoring önerileri açısından analiz et. Sonuçları aşağıdaki gibi Türkçe Markdown formatında sun:\n\n1.  **Hata ve Güvenlik Çıktıları:**\n    * [varsa, her hatayı veya güvenlik açığını madde madde listele]\n2.  **Refactoring Önerileri:**\n    * [varsa, her iyileştirme önerisini madde madde listele]\n\n---\n${code}\n---`;
        
        const chatHistory = [{
            role: "user",
            parts: [{
                text: prompt
            }]
        }];
        
        const payload = {
            contents: chatHistory
        };
        
        const apiUrl = `${GEMINI_API_URL}?key=${FALLBACK_API_KEY}`;

        console.log('⚠️ FALLBACK: Direct API call to Gemini');
        console.log('API URL:', apiUrl);

        const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!geminiResponse.ok) {
            throw new Error(`Gemini API call failed with status: ${geminiResponse.status}`);
        }

        const result = await geminiResponse.json();
        const geminiText = result.candidates[0].content.parts[0].text;

        window.appState.result = geminiText;
        renderAnalysisResults();

        // Eğer geçerli bir analiz yoksa yeni bir analiz kaydet
        if (!window.appState.currentAnalysisId) {
            const analysisName = prompt("Analiz için bir ad girin:", "Yeni Analiz");
            if (analysisName) {
                saveAnalysis(analysisName, code, geminiText);
            }
        }

    } catch (error) {
        console.error('Kod analizi sırasında hata oluştu:', error);
        showMessage('Hata', 'Kod analizi sırasında bir sorun oluştu. Lütfen tekrar deneyin.', 'error');
    } finally {
        loadingIndicator.classList.add('hidden');
        analyzeButton.disabled = false;
    }
}

// Diğer fonksiyonlar aynı kalacak...
export async function saveAnalysis(name, code, result) {
    if (!dbReady || !userAuthReady || !userId) {
        console.error("Firebase'e kaydedilemedi: Veritabanı hazır değil veya kullanıcı kimliği yok.");
        return;
    }
    const newAnalysis = {
        name,
        code,
        result,
        createdAt: serverTimestamp(),
    };
    try {
        const analysesRef = collection(db, 'artifacts', appId, 'users', userId, 'analyses');
        const newDocRef = doc(analysesRef);
        await setDoc(newDocRef, newAnalysis);
        window.appState.currentAnalysisId = newDocRef.id;
        console.log("Analiz başarıyla kaydedildi.");
    } catch (e) {
        console.error("Analiz kaydedilirken hata oluştu:", e);
        showMessage('Hata', 'Analiz kaydedilirken bir sorun oluştu.', 'error');
    }
}

export async function handleHistoryClick(analysisId) {
    if (!dbReady || !userAuthReady || !userId) {
        console.error("Analiz yüklenemedi: Veritabanı hazır değil veya kullanıcı kimliği yok.");
        return;
    }

    try {
        const analysisRef = doc(db, 'artifacts', appId, 'users', userId, 'analyses', analysisId);
        const docSnap = await getDoc(analysisRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            window.appState.code = data.code;
            window.appState.result = data.result;
            window.appState.currentAnalysisId = analysisId;
            updateUI();
            console.log("Analiz başarıyla yüklendi.");
        } else {
            console.error("Belirtilen ID'ye sahip analiz bulunamadı.");
            showMessage('Hata', 'İstenen analiz bulunamadı.', 'error');
        }
    } catch (e) {
        console.error("Analiz yüklenirken hata oluştu:", e);
        showMessage('Hata', 'Analiz yüklenirken bir sorun oluştu.', 'error');
    }
}

export async function handleDeleteAnalysis(analysisId) {
    if (!dbReady || !userAuthReady || !userId) {
        console.error("Analiz silinemedi: Veritabanı hazır değil veya kullanıcı kimliği yok.");
        return;
    }
    const analysisRef = doc(db, 'artifacts', appId, 'users', userId, 'analyses', analysisId);
    try {
        await deleteDoc(analysisRef);
        if (window.appState.currentAnalysisId === analysisId) {
            window.appState.currentAnalysisId = null;
        }
        console.log("Analiz başarıyla silindi.");
    } catch (e) {
        console.error("Analiz silinirken hata oluştu:", e);
        showMessage('Hata', 'Analiz silinirken bir sorun oluştu.', 'error');
    }
}

export async function handleUpdateAnalysisName(analysisId, newName) {
    if (!dbReady || !userAuthReady || !userId) {
        console.error("Analiz adı güncellenemedi: Veritabanı hazır değil veya kullanıcı kimliği yok.");
        return;
    }
    const analysisRef = doc(db, 'artifacts', appId, 'users', userId, 'analyses', analysisId);
    try {
        await updateDoc(analysisRef, { name: newName });
        console.log("Analiz adı başarıyla güncellendi.");
    } catch (e) {
        console.error("Analiz adı güncellenirken hata oluştu:", e);
        showMessage('Hata', 'Analiz adı güncellenirken bir sorun oluştu.', 'error');
    }
}

export function handleNewTab() {
    window.appState.code = exampleCodes[window.appState.selectedLanguage];
    window.appState.result = '';
    window.appState.currentAnalysisId = null;
    updateUI();
}

export function renderAnalysisResults() {
    const analysisViewer = document.getElementById('analysis-viewer');
    if (!analysisViewer) return;

    if (window.appState.result) {
        analysisViewer.innerHTML = marked.parse(window.appState.result);
    } else {
        analysisViewer.innerHTML = `<p class="text-slate-500">Analiz sonuçları burada gösterilecektir.</p>`;
    }
}

export function updateUI() {
    const codeEditor = document.getElementById('code-editor');
    const analysisViewer = document.getElementById('analysis-viewer');
    const historyList = document.getElementById('history-list');
    const mainContent = document.getElementById('main-content');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const languageButtons = document.querySelectorAll('.language-button');

    if (codeEditor) {
        codeEditor.value = window.appState.code;
    }

    renderAnalysisResults();

    if (historyList) {
        historyList.innerHTML = window.appState.pastAnalyses.map(analysis => `
            <div class="card p-3 rounded-xl flex items-center justify-between mb-2 cursor-pointer relative" data-id="${analysis.id}">
                <div class="flex-grow min-w-0">
                    <p class="font-medium text-slate-700 truncate">${analysis.name}</p>
                    <p class="text-xs text-slate-400">${analysis.timestamp}</p>
                </div>
                <button class="options-button p-2 ml-2 text-slate-400 hover:text-slate-600 transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                </button>
            </div>
        `).join('');
    }
    
    if (window.appState.isSidebarExpanded) {
        document.body.classList.add('sidebar-expanded');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('hidden');
    } else {
        document.body.classList.remove('sidebar-expanded');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('hidden');
    }

    if (window.innerWidth >= 768) {
        document.body.classList.add('sidebar-expanded');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('hidden');
    } else {
        if (!window.appState.isSidebarExpanded) {
             document.body.classList.remove('sidebar-expanded');
        }
    }
    
    languageButtons.forEach(button => {
        if (button.dataset.lang === window.appState.selectedLanguage) {
            button.classList.add('bg-slate-200', 'text-slate-800');
            button.classList.remove('text-slate-500', 'hover:bg-slate-100');
        } else {
            button.classList.remove('bg-slate-200', 'text-slate-800');
            button.classList.add('text-slate-500', 'hover:bg-slate-100');
        }
    });
}

function showMessage(title, text, type) {
    const modal = document.getElementById('message-modal');
    const modalContent = document.getElementById('message-modal-content');
    const modalIcon = document.getElementById('message-modal-icon');
    const modalTitle = document.getElementById('message-modal-title');
    const modalText = document.getElementById('message-modal-text');

    if (!modal || !modalContent || !modalIcon || !modalTitle || !modalText) {
        console.error("Mesaj modalı elemanları bulunamadı.");
        return;
    }
    
    modalContent.className = 'bg-white p-6 rounded-xl shadow-2xl transition-transform transform-gpu scale-95 opacity-0 duration-300';
    modalIcon.innerHTML = '';
    modalIcon.classList.remove('text-green-500', 'text-red-500', 'text-yellow-500');

    switch (type) {
        case 'success':
            modalIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>`;
            modalIcon.classList.add('text-green-500');
            modalContent.classList.add('scale-100', 'opacity-100');
            break;
        case 'error':
            modalIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>`;
            modalIcon.classList.add('text-red-500');
            modalContent.classList.add('scale-100', 'opacity-100');
            break;
        case 'warning':
            modalIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.325 2.568-1.325 3.332 0l4.56 7.9A2 2 0 0115 14H5a2 2 0 01-1.667-3.001l4.56-7.9z" clip-rule="evenodd" /><path d="M10 13a1 1 0 110-2 1 1 0 010 2zm1-4a1 1 0 10-2 0v2a1 1 0 102 0V9z" /></svg>`;
            modalIcon.classList.add('text-yellow-500');
            modalContent.classList.add('scale-100', 'opacity-100');
            break;
    }

    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.classList.remove('hidden');
}

// Olay dinleyicileri
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('analyze-button').addEventListener('click', handleAnalyze);

    const codeEditor = document.getElementById('code-editor');
    if (codeEditor) {
        codeEditor.addEventListener('input', (e) => {
            window.appState.code = e.target.value;
        });
    }

    document.getElementById('close-message-modal').addEventListener('click', () => {
        document.getElementById('message-modal').classList.add('hidden');
    });

    document.getElementById('sidebar-toggle-button').addEventListener('click', () => {
        window.appState.isSidebarExpanded = !window.appState.isSidebarExpanded;
        updateUI();
    });

    document.getElementById('sidebar-backdrop').addEventListener('click', () => {
        window.appState.isSidebarExpanded = false;
        updateUI();
    });

    document.getElementById('new-tab-button').addEventListener('click', handleNewTab);
    
    document.getElementById('language-buttons-container').addEventListener('click', (e) => {
        const button = e.target.closest('.language-button');
        if (!button) return;
        const newLanguage = button.dataset.lang;
        window.appState.selectedLanguage = newLanguage;
        if (exampleCodes[newLanguage]) {
            window.appState.code = exampleCodes[newLanguage];
            updateUI();
            console.log(`Dil seçimi değiştirildi: ${newLanguage}`);
        }
    });

    document.getElementById('history-list').addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card && !e.target.closest('.options-button')) {
            const analysisId = card.dataset.id;
            handleHistoryClick(analysisId);
        }
    });

    window.addEventListener('resize', updateUI);
    updateUI();
    handleNewTab();
}); 