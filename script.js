// CodeMaster - Advanced Code Analysis System
// Modern JavaScript with slideable sidebar, shimmer effects, and enhanced AI analysis

// ====================================================================
// API Configuration
// ====================================================================
const API_BASE_URL = window.location.port === '5500' || window.location.port === '3000' 
    ? 'http://localhost:3000' 
    : window.location.origin;
const SECURE_ANALYSIS_ENDPOINT = `${API_BASE_URL}/api/analyze-code`;

// Debug logging
console.log('🚀 CodeMaster Initialized');
console.log('📡 API Endpoint:', SECURE_ANALYSIS_ENDPOINT);
console.log('🌐 Current Location:', window.location.href);

// ====================================================================
// Global Application State
// ====================================================================
window.appState = {
    code: '',
    result: '',
    currentAnalysisId: null,
    pastAnalyses: [],
    selectedLanguage: 'javascript',
    isSidebarCollapsed: false,
    sidebarWidth: 320,
    isAnalyzing: false
};

// ====================================================================
// Enhanced Example Codes for All Languages
// ====================================================================
const exampleCodes = {
    javascript: `// JavaScript Example - Array Operations
function processArray(arr) {
    let result = [];
    
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > 0) {
            result.push(arr[i] * 2);
        }
    }
    
    return result;
}

// Usage
const numbers = [1, -2, 3, -4, 5];
const processed = processArray(numbers);
console.log(processed);`,

    python: `# Python Example - Data Processing
def process_data(data_list):
    """
    Process a list of data and return filtered results
    """
    result = []
    
    for item in data_list:
        if isinstance(item, (int, float)) and item > 0:
            result.append(item * 2)
    
    return result

# Usage
data = [1, -2, 3.5, -4, 5]
processed_data = process_data(data)
print(processed_data)`,

    java: `// Java Example - Class Implementation
public class DataProcessor {
    private List<Integer> data;
    
    public DataProcessor(List<Integer> data) {
        this.data = data;
    }
    
    public List<Integer> processData() {
        List<Integer> result = new ArrayList<>();
        
        for (Integer item : data) {
            if (item != null && item > 0) {
                result.add(item * 2);
            }
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, -2, 3, -4, 5);
        DataProcessor processor = new DataProcessor(numbers);
        System.out.println(processor.processData());
    }
}`,

    csharp: `// C# Example - LINQ Operations
using System;
using System.Collections.Generic;
using System.Linq;

public class DataProcessor
{
    public List<int> ProcessData(List<int> data)
    {
        return data
            .Where(x => x > 0)
            .Select(x => x * 2)
            .ToList();
    }
    
    public static void Main()
    {
        var numbers = new List<int> { 1, -2, 3, -4, 5 };
        var processor = new DataProcessor();
        var result = processor.ProcessData(numbers);
        
        foreach (var item in result)
        {
            Console.WriteLine(item);
        }
    }
}`,

    php: `<?php
// PHP Example - Array Processing
class DataProcessor {
    private $data;
    
    public function __construct(array $data) {
        $this->data = $data;
    }
    
    public function processData(): array {
        $result = [];
        
        foreach ($this->data as $item) {
            if (is_numeric($item) && $item > 0) {
                $result[] = $item * 2;
            }
        }
        
        return $result;
    }
}

// Usage
$numbers = [1, -2, 3, -4, 5];
$processor = new DataProcessor($numbers);
$processed = $processor->processData();
print_r($processed);
?>`,

    cpp: `// C++ Example - Vector Operations
#include <iostream>
#include <vector>
#include <algorithm>

class DataProcessor {
private:
    std::vector<int> data;
    
public:
    DataProcessor(const std::vector<int>& input) : data(input) {}
    
    std::vector<int> processData() {
        std::vector<int> result;
        
        for (const auto& item : data) {
            if (item > 0) {
                result.push_back(item * 2);
            }
        }
        
        return result;
    }
};

int main() {
    std::vector<int> numbers = {1, -2, 3, -4, 5};
    DataProcessor processor(numbers);
    auto result = processor.processData();
    
    for (const auto& item : result) {
        std::cout << item << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,

    c: `// C Example - Array Processing
#include <stdio.h>
#include <stdlib.h>

int* processData(int* data, int size, int* resultSize) {
    int* result = malloc(size * sizeof(int));
    *resultSize = 0;
    
    for (int i = 0; i < size; i++) {
        if (data[i] > 0) {
            result[*resultSize] = data[i] * 2;
            (*resultSize)++;
        }
    }
    
    return result;
}

int main() {
    int data[] = {1, -2, 3, -4, 5};
    int size = 5;
    int resultSize;
    
    int* result = processData(data, size, &resultSize);
    
    for (int i = 0; i < resultSize; i++) {
        printf("%d ", result[i]);
    }
    printf("\\n");
    
    free(result);
    return 0;
}`,

    go: `// Go Example - Slice Operations
package main

import "fmt"

type DataProcessor struct {
    data []int
}

func NewDataProcessor(data []int) *DataProcessor {
    return &DataProcessor{data: data}
}

func (dp *DataProcessor) ProcessData() []int {
    var result []int
    
    for _, item := range dp.data {
        if item > 0 {
            result = append(result, item*2)
        }
    }
    
    return result
}

func main() {
    numbers := []int{1, -2, 3, -4, 5}
    processor := NewDataProcessor(numbers)
    result := processor.ProcessData()
    
    fmt.Println(result)
}`,

    rust: `// Rust Example - Iterator Operations
struct DataProcessor {
    data: Vec<i32>,
}

impl DataProcessor {
    fn new(data: Vec<i32>) -> Self {
        DataProcessor { data }
    }
    
    fn process_data(&self) -> Vec<i32> {
        self.data
            .iter()
            .filter(|&&x| x > 0)
            .map(|&x| x * 2)
            .collect()
    }
}

fn main() {
    let numbers = vec![1, -2, 3, -4, 5];
    let processor = DataProcessor::new(numbers);
    let result = processor.process_data();
    
    println!("{:?}", result);
}`,

    swift: `// Swift Example - Array Operations
class DataProcessor {
    private let data: [Int]
    
    init(data: [Int]) {
        self.data = data
    }
    
    func processData() -> [Int] {
        return data
            .filter { $0 > 0 }
            .map { $0 * 2 }
    }
}

// Usage
let numbers = [1, -2, 3, -4, 5]
let processor = DataProcessor(data: numbers)
let result = processor.processData()
print(result)`,

    kotlin: `// Kotlin Example - Collection Operations
class DataProcessor(private val data: List<Int>) {
    
    fun processData(): List<Int> {
        return data
            .filter { it > 0 }
            .map { it * 2 }
    }
}

fun main() {
    val numbers = listOf(1, -2, 3, -4, 5)
    val processor = DataProcessor(numbers)
    val result = processor.processData()
    
    println(result)
}`,

    typescript: `// TypeScript Example - Generic Types
interface DataProcessor<T> {
    processData(data: T[]): T[];
}

class NumberProcessor implements DataProcessor<number> {
    processData(data: number[]): number[] {
        return data
            .filter(item => item > 0)
            .map(item => item * 2);
    }
}

// Usage
const numbers: number[] = [1, -2, 3, -4, 5];
const processor = new NumberProcessor();
const result = processor.processData(numbers);
console.log(result);`
};

// ====================================================================
// Enhanced Analysis Prompts
// ====================================================================
const getAnalysisPrompt = (code, language) => {
    const languageNames = {
        javascript: 'JavaScript',
        python: 'Python',
        java: 'Java',
        csharp: 'C#',
        php: 'PHP',
        cpp: 'C++',
        c: 'C',
        go: 'Go',
        rust: 'Rust',
        swift: 'Swift',
        kotlin: 'Kotlin',
        typescript: 'TypeScript'
    };

    return `Aşağıdaki ${languageNames[language]} kodunu detaylı bir şekilde analiz et ve aşağıdaki kategorilerde kapsamlı bir rapor hazırla:

## 🔍 **Kod Analizi Raporu**

### 📊 **Genel Değerlendirme**
- Kod kalitesi puanı (1-10)
- Okunabilirlik seviyesi
- Karmaşıklık analizi

### ⚠️ **Tespit Edilen Sorunlar**
- **Güvenlik Açıkları**: Varsa güvenlik riskleri
- **Performans Sorunları**: Optimizasyon gereken alanlar
- **Kod Kalitesi**: Best practice ihlalleri
- **Hata Yönetimi**: Eksik hata kontrolü

### 🛠️ **İyileştirme Önerileri**
- **Refactoring Önerileri**: Kod yapısını iyileştirme
- **Modern Yaklaşımlar**: Güncel teknikler
- **Optimizasyon**: Performans artırma
- **Güvenlik**: Güvenlik iyileştirmeleri

### 📝 **Örnek Kod**
Her öneri için pratik kod örnekleri ver.

### 🎯 **Sonuç**
Genel değerlendirme ve öncelikli iyileştirme alanları.

---

**Analiz Edilecek Kod:**
\`\`\`${language}
${code}
\`\`\`

Lütfen yanıtını Türkçe olarak, markdown formatında ve detaylı bir şekilde hazırla.`;
};

// ====================================================================
// Core Functions
// ====================================================================

// Enhanced Analysis Function with Shimmer Effect
export async function handleAnalyze() {
    const code = window.appState.code.trim();
    const language = window.appState.selectedLanguage;

    if (!code) {
        showMessage('Uyarı', 'Lütfen analiz etmek için bir kod girin.', 'warning');
        return;
    }

    if (window.appState.isAnalyzing) {
        return; // Prevent multiple simultaneous analyses
    }
    
    // Show shimmer overlay
    showShimmerOverlay();
    window.appState.isAnalyzing = true;
    
    try {
        const prompt = getAnalysisPrompt(code, language);
        
        const response = await fetch(SECURE_ANALYSIS_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
            body: JSON.stringify({
                code: code,
                language: language
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        console.log('📊 Server Response:', result);
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        window.appState.result = result.analysis;
        console.log('💾 App State Result:', window.appState.result);
        renderAnalysisResults();

        // Auto-save analysis with smart naming
        const analysisName = generateAnalysisName(code, language);
        saveAnalysis(analysisName, code, result.analysis, language);
        
        showMessage('Başarılı', 'Kod analizi tamamlandı ve kaydedildi!', 'success');

    } catch (error) {
        console.error('Analiz hatası:', error);
        showMessage('Hata', `Analiz sırasında bir sorun oluştu: ${error.message}`, 'error');
    } finally {
        hideShimmerOverlay();
        window.appState.isAnalyzing = false;
    }
}

// Shimmer Overlay Functions
function showShimmerOverlay() {
    const overlay = document.getElementById('shimmer-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        overlay.classList.add('fade-in');
    }
}

function hideShimmerOverlay() {
    const overlay = document.getElementById('shimmer-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('fade-in');
    }
}

// Enhanced Results Rendering
export function renderAnalysisResults() {
    const container = document.getElementById('results-container');
    if (!container) return;

    if (window.appState.result) {
        // Parse markdown and add syntax highlighting
        const html = marked.parse(window.appState.result);
        
        // Split content into info and code sections
        const infoContent = extractInfoContent(html);
        const codeContent = extractCodeContent(html);
        
        container.innerHTML = `
            <div class="info-content" style="display: block;">
                ${infoContent}
            </div>
            <div class="code-content" style="display: none;">
                ${codeContent}
            </div>
        `;
        
        // Apply syntax highlighting to code blocks
        if (window.Prism) {
            Prism.highlightAllUnder(container);
        }
        
        container.classList.add('fade-in');
        
        // Set default view to info
        toggleResultsView('info');
    } else {
        container.innerHTML = `
            <div class="text-center text-slate-500">
                <i class="fas fa-chart-line text-4xl mb-4"></i>
                <p>Analiz sonuçları burada görünecek</p>
            </div>
        `;
    }
}

function extractInfoContent(html) {
    // Extract non-code content (explanations, analysis, refactoring, etc.)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove code blocks
    const codeBlocks = tempDiv.querySelectorAll('pre, code');
    codeBlocks.forEach(block => block.remove());
    
    // Keep everything else including refactoring sections
    return tempDiv.innerHTML || '<p class="text-theme-muted">Analiz bilgileri burada görünecek</p>';
}

function extractCodeContent(html) {
    // Extract code blocks with headers and examples
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const codeBlocks = tempDiv.querySelectorAll('pre');
    if (codeBlocks.length > 0) {
        let codeContent = '<div class="code-sections">';
        
        codeBlocks.forEach((block, index) => {
            const header = block.previousElementSibling?.tagName?.match(/^H[1-6]$/) ? 
                          block.previousElementSibling.textContent : 
                          `Kod Örneği ${index + 1}`;
            
            codeContent += `
                <div class="code-section mb-6">
                    <h4 class="text-lg font-semibold text-theme-primary mb-3 border-b border-theme-border pb-2">
                        ${header}
                    </h4>
                    ${block.outerHTML}
                </div>
            `;
        });
        
        codeContent += '</div>';
        return codeContent;
    } else {
        return '<p class="text-theme-muted">Kod örnekleri burada görünecek</p>';
    }
}

// Working Sidebar Management
export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    
    if (!sidebar) {
        console.error('❌ Sidebar not found');
        return;
    }
    
    // Check if we're on mobile
    const isMobile = window.innerWidth <= 1024;
    const isCollapsed = sidebar.classList.contains('collapsed');
    
    console.log('🔄 Toggle sidebar:', isCollapsed ? 'expanding' : 'collapsing', 'Mobile:', isMobile);
    
    if (isMobile) {
        // Mobile sidebar toggle
        sidebar.classList.toggle('open');
        console.log('📱 Mobile sidebar toggled, open:', sidebar.classList.contains('open'));
    } else {
        // Desktop sidebar collapse/expand
        if (isCollapsed) {
            // Expand sidebar
            sidebar.classList.remove('collapsed');
            sidebar.style.width = '320px';
            sidebar.style.minWidth = '320px';
            sidebar.style.maxWidth = '320px';
            
            // Reset toggle button styles
            const toggleBtn = document.querySelector('.sidebar-toggle-btn');
            if (toggleBtn) {
                toggleBtn.style.position = '';
                toggleBtn.style.left = '';
                toggleBtn.style.top = '';
                toggleBtn.style.transform = '';
                toggleBtn.style.zIndex = '';
                toggleBtn.style.background = '';
                toggleBtn.style.border = '';
                toggleBtn.style.borderRadius = '';
                toggleBtn.style.boxShadow = '';
            }
            
            console.log('✅ Sidebar expanded to 320px, toggle button reset');
        } else {
            // Collapse sidebar
            sidebar.classList.add('collapsed');
            sidebar.style.width = '60px';
            sidebar.style.minWidth = '60px';
            sidebar.style.maxWidth = '60px';
            
            // Position toggle button at top
            const toggleBtn = document.querySelector('.sidebar-toggle-btn');
            if (toggleBtn) {
                toggleBtn.style.position = 'absolute';
                toggleBtn.style.left = '50%';
                toggleBtn.style.top = '20px';
                toggleBtn.style.transform = 'translateX(-50%)';
                toggleBtn.style.zIndex = '50';
                toggleBtn.style.background = 'transparent';
                toggleBtn.style.border = 'none';
                toggleBtn.style.borderRadius = '0';
                toggleBtn.style.boxShadow = 'none';
            }
            
            console.log('✅ Sidebar collapsed to 60px, toggle button at top');
        }
    }
}

// Sidebar Resizer
function initializeSidebarResizer() {
    const resizer = document.getElementById('sidebar-resizer');
    const sidebar = document.getElementById('sidebar');
    
    if (!resizer || !sidebar) return;
    
    let isResizing = false;
    let startX, startWidth;
    
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = parseInt(getComputedStyle(sidebar).width, 10);
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        e.preventDefault();
    });
    
    function handleMouseMove(e) {
        if (!isResizing) return;
        
        const width = startWidth + (e.clientX - startX);
        const minWidth = 280;
        const maxWidth = 500;
        
        if (width >= minWidth && width <= maxWidth) {
            sidebar.style.width = `${width}px`;
            sidebar.style.minWidth = `${width}px`;
            window.appState.sidebarWidth = width;
        }
    }
    
    function handleMouseUp() {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}

// Content Resizer
function initializeContentResizer() {
    const resizer = document.getElementById('content-resizer');
    const codeSection = document.querySelector('.flex-1.flex.flex-col.p-4.lg\\:p-6');
    const resultsSection = document.querySelector('.w-full.lg\\:w-1\\/2');
    
    console.log('Content resizer initialization:', { resizer, codeSection, resultsSection });
    
    if (!resizer || !codeSection || !resultsSection) {
        console.log('Content resizer elements not found:', { resizer, codeSection, resultsSection });
        return;
    }
    
    let isResizing = false;
    let startX, startCodeWidth, startResultsWidth;
    
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startCodeWidth = codeSection.offsetWidth;
        startResultsWidth = resultsSection.offsetWidth;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        e.preventDefault();
    });
    
    function handleMouseMove(e) {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const containerWidth = codeSection.parentElement.offsetWidth;
        const minWidth = 300; // Minimum width for each section
        
        // Calculate new widths
        let newCodeWidth = startCodeWidth + deltaX;
        let newResultsWidth = startResultsWidth - deltaX;
        
        // Ensure minimum widths
        if (newCodeWidth < minWidth) {
            newCodeWidth = minWidth;
            newResultsWidth = containerWidth - minWidth - resizer.offsetWidth;
        }
        if (newResultsWidth < minWidth) {
            newResultsWidth = minWidth;
            newCodeWidth = containerWidth - minWidth - resizer.offsetWidth;
        }
        
        // Apply new widths
        codeSection.style.width = `${newCodeWidth}px`;
        codeSection.style.flex = 'none';
        resultsSection.style.width = `${newResultsWidth}px`;
        resultsSection.style.flex = 'none';
    }
    
    function handleMouseUp() {
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}

// Language Selection
export function selectLanguage(language) {
    window.appState.selectedLanguage = language;
    
    // Update UI for header panel
    const headerIconButtons = document.querySelectorAll('.header-language-icon-btn');
    
    headerIconButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === language) {
            btn.classList.add('active');
        }
    });
    
    // Update code editor title
    updateCodeEditorTitle(language);
    
    // Load example code
    if (exampleCodes[language]) {
        window.appState.code = exampleCodes[language];
        updateCodeEditor();
    }
}

// Code Editor Management
function updateCodeEditor() {
    const editor = document.getElementById('code-editor');
    if (editor) {
        editor.value = window.appState.code;
    }
}

// Update Code Editor Title
function updateCodeEditorTitle(language) {
    const codeEditorTitle = document.querySelector('.flex.items-center.justify-between.p-4.border-b.border-theme-border h3');
    if (codeEditorTitle) {
        const languageNames = {
            'javascript': 'JavaScript',
            'python': 'Python',
            'java': 'Java',
            'csharp': 'C#',
            'php': 'PHP',
            'cpp': 'C++',
            'c': 'C',
            'go': 'Go',
            'rust': 'Rust',
            'swift': 'Swift',
            'kotlin': 'Kotlin',
            'typescript': 'TypeScript'
        };
        
        const languageName = languageNames[language] || language.charAt(0).toUpperCase() + language.slice(1);
        codeEditorTitle.textContent = `${languageName} Kod Editörü`;
    }
}

// New Analysis
export function handleNewAnalysis() {
    window.appState.code = exampleCodes[window.appState.selectedLanguage];
    window.appState.result = '';
    window.appState.currentAnalysisId = null;
    
    updateCodeEditor();
    renderAnalysisResults();
    
    showMessage('Bilgi', 'Yeni analiz başlatıldı!', 'info');
}

// Clear Code
export function clearCode() {
    window.appState.code = '';
    updateCodeEditor();
    showMessage('Bilgi', 'Kod editörü temizlendi!', 'info');
}

    // Enhanced Message System
    function showMessage(title, text, type = 'info') {
        const modal = document.getElementById('message-modal');
        const content = document.getElementById('message-content');
        
        if (!modal || !content) return;
        
        const icons = {
            success: 'fas fa-check-circle text-green-500',
            error: 'fas fa-exclamation-circle text-red-500',
            warning: 'fas fa-exclamation-triangle text-yellow-500',
            info: 'fas fa-info-circle text-blue-500'
        };
        
        const iconClass = icons[type] || icons.info;
        
        content.innerHTML = `
            <i class="${iconClass} text-4xl mb-4"></i>
            <h3 class="text-xl font-semibold text-theme-primary mb-2">${title}</h3>
            <p class="text-theme-secondary">${text}</p>
        `;
        
        // Reset modal footer to default
        const modalFooter = modal.querySelector('.mt-6');
        if (modalFooter) {
            modalFooter.innerHTML = `
                <div class="mt-6 flex justify-center">
                    <button id="close-message-modal" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                        Tamam
                    </button>
                </div>
            `;
            
            // Add event listener to the new button
            const closeBtn = modalFooter.querySelector('#close-message-modal');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.add('hidden');
                });
            }
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('fade-in');
    }

// Smart Analysis Name Generation
function generateAnalysisName(code, language) {
    const lines = code.trim().split('\n');
    const firstLine = lines[0].trim();
    
    // Extract meaningful name from first line
    let name = '';
    
    // Remove comments and get function/class name
    if (firstLine.includes('function')) {
        const match = firstLine.match(/function\s+(\w+)/);
        if (match) name = match[1];
    } else if (firstLine.includes('class')) {
        const match = firstLine.match(/class\s+(\w+)/);
        if (match) name = match[1];
    } else if (firstLine.includes('def')) {
        const match = firstLine.match(/def\s+(\w+)/);
        if (match) name = match[1];
    } else if (firstLine.includes('public class')) {
        const match = firstLine.match(/public class\s+(\w+)/);
        if (match) name = match[1];
    } else if (firstLine.includes('public class')) {
        const match = firstLine.match(/public class\s+(\w+)/);
        if (match) name = match[1];
    }
    
    // If no meaningful name found, use first few words
    if (!name) {
        const words = firstLine.replace(/[^\w\s]/g, '').split(/\s+/).filter(word => word.length > 2);
        name = words.slice(0, 3).join(' ');
    }
    
    // Limit length and add language
    const maxLength = 30;
    if (name.length > maxLength) {
        name = name.substring(0, maxLength) + '...';
    }
    
    const languageNames = {
        javascript: 'JS',
        python: 'Python',
        java: 'Java',
        csharp: 'C#',
        php: 'PHP',
        cpp: 'C++',
        c: 'C',
        go: 'Go',
        rust: 'Rust',
        swift: 'Swift',
        kotlin: 'Kotlin',
        typescript: 'TS'
    };
    
    const langCode = languageNames[language] || language.toUpperCase();
    const timestamp = new Date().toLocaleString('tr-TR', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `${name} (${langCode}) - ${timestamp}`;
}

// History Management (Simplified for demo)
function saveAnalysis(name, code, result, language) {
    const analysis = {
        id: Date.now().toString(),
        name: name,
        code: code,
        result: result,
        language: language,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('tr-TR')
    };
    
    window.appState.pastAnalyses.unshift(analysis);
    updateHistoryList();
    
    // Save to localStorage
    localStorage.setItem('codemaster_analyses', JSON.stringify(window.appState.pastAnalyses));
}

function updateHistoryList() {
    const container = document.getElementById('history-list');
    if (!container) return;
    
    if (window.appState.pastAnalyses.length === 0) {
        container.innerHTML = `
            <div class="text-center text-slate-500 py-8">
                <i class="fas fa-history text-2xl mb-2"></i>
                <p class="text-sm">Henüz analiz yok</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = window.appState.pastAnalyses.map((analysis, index) => {
        // Get code preview (first few lines)
        const codeLines = analysis.code.split('\n');
        const previewLines = codeLines.slice(0, 3); // First 3 lines
        const codePreview = previewLines.join('\n');
        
        return `
            <div class="history-item" data-id="${analysis.id}">
                <div class="history-content">
                    <div class="history-title">${analysis.name}</div>
                    <div class="history-meta">
                        <span class="history-language">${analysis.language.toUpperCase()}</span>
                        <span>${analysis.date}</span>
                    </div>
                    <div class="history-code-preview">
                        <pre class="text-xs text-slate-500 font-mono p-2 rounded mt-2 overflow-hidden">${codePreview}</pre>
                    </div>
                </div>
                <button class="history-delete-btn" title="Bu analizi sil" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
    
    // Add event listeners for delete buttons
    container.querySelectorAll('.history-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index);
            deleteHistoryItem(index);
        });
    });
    
    // Add event listeners for history items
    container.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking delete button
            if (e.target.closest('.history-delete-btn')) return;
            
            const analysisId = item.dataset.id;
            const analysis = window.appState.pastAnalyses.find(a => a.id === analysisId);
            
            if (analysis) {
                window.appState.code = analysis.code;
                window.appState.result = analysis.result;
                window.appState.currentAnalysisId = analysis.id;
                window.appState.selectedLanguage = analysis.language;
                
                updateCodeEditor();
                renderAnalysisResults();
                
                // Update active history item
                document.querySelectorAll('.history-item').forEach(hi => hi.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });
}

function loadHistory() {
    const saved = localStorage.getItem('codemaster_analyses');
    if (saved) {
        try {
            window.appState.pastAnalyses = JSON.parse(saved);
            updateHistoryList();
        } catch (error) {
            console.error('History load error:', error);
        }
    }
}

function deleteHistoryItem(index) {
    if (index >= 0 && index < window.appState.pastAnalyses.length) {
        const analysis = window.appState.pastAnalyses[index];
        
        // Show custom confirmation modal
        showDeleteConfirmation(analysis.name, () => {
            // Remove from array
            window.appState.pastAnalyses.splice(index, 1);
            
            // Save to localStorage
            localStorage.setItem('codemaster_analyses', JSON.stringify(window.appState.pastAnalyses));
            
            // Update UI
            updateHistoryList();
            
            // Show success message
            showMessage('Başarılı', 'Analiz başarıyla silindi!', 'success');
        });
    }
}

function clearAllHistory() {
    if (window.appState.pastAnalyses.length === 0) {
        showMessage('Bilgi', 'Silinecek analiz bulunmuyor.', 'info');
        return;
    }
    
    // Show custom confirmation modal for all
    showClearAllConfirmation(() => {
        // Clear all analyses
        window.appState.pastAnalyses = [];
        
        // Save to localStorage
        localStorage.setItem('codemaster_analyses', JSON.stringify(window.appState.pastAnalyses));
        
        // Update UI
        updateHistoryList();
        
        // Show success message
        showMessage('Başarılı', 'Tüm analizler başarıyla silindi!', 'success');
    });
}

function showClearAllConfirmation(onConfirm) {
    const modal = document.getElementById('message-modal');
    const content = document.getElementById('message-content');
    
    if (!modal || !content) return;
    
    content.innerHTML = `
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h3 class="text-xl font-semibold text-theme-primary mb-2">Tüm Analizleri Sil</h3>
        <p class="text-theme-secondary mb-6">Tüm geçmiş analizleri silmek istediğinizden emin misiniz?</p>
        <p class="text-sm text-theme-muted">Bu işlem geri alınamaz ve tüm analizleriniz kaybolacak.</p>
    `;
    
    // Update modal buttons
    const modalFooter = modal.querySelector('.mt-6');
    if (modalFooter) {
        modalFooter.innerHTML = `
            <div class="flex justify-center space-x-3">
                <button id="cancel-clear-all-btn" class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
                    İptal
                </button>
                <button id="confirm-clear-all-btn" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                    <i class="fas fa-trash-alt mr-2"></i>
                    Tümünü Sil
                </button>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('cancel-clear-all-btn')?.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        document.getElementById('confirm-clear-all-btn')?.addEventListener('click', () => {
            modal.classList.add('hidden');
            onConfirm();
        });
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('fade-in');
}

function showDeleteConfirmation(analysisName, onConfirm) {
    const modal = document.getElementById('message-modal');
    const content = document.getElementById('message-content');
    
    if (!modal || !content) return;
    
    content.innerHTML = `
        <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h3 class="text-xl font-semibold text-theme-primary mb-2">Analizi Sil</h3>
        <p class="text-theme-secondary mb-6">"<strong>${analysisName}</strong>" analizini silmek istediğinizden emin misiniz?</p>
        <p class="text-sm text-theme-muted">Bu işlem geri alınamaz.</p>
    `;
    
    // Update modal buttons
    const modalFooter = modal.querySelector('.mt-6');
    if (modalFooter) {
        modalFooter.innerHTML = `
            <div class="flex justify-center space-x-3">
                <button id="cancel-delete-btn" class="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors">
                    İptal
                </button>
                <button id="confirm-delete-btn" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                    <i class="fas fa-trash mr-2"></i>
                    Sil
                </button>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('cancel-delete-btn')?.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
        
        document.getElementById('confirm-delete-btn')?.addEventListener('click', () => {
            modal.classList.add('hidden');
            onConfirm();
        });
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('fade-in');
}

// ====================================================================
// Event Listeners
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 DOM loaded, initializing CodeMaster...');
    
    // Initialize components
    initializeSidebarResizer();
    initializeContentResizer();
    loadHistory();
    initializeTheme();
    
    // Set initial code editor title
    updateCodeEditorTitle(window.appState.selectedLanguage);
    
    // Event listeners
    document.getElementById('analyze-btn')?.addEventListener('click', handleAnalyze);
    document.getElementById('new-analysis-btn')?.addEventListener('click', handleNewAnalysis);
    document.getElementById('clear-code-btn')?.addEventListener('click', clearCode);
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('sidebar-toggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-toggle-mobile')?.addEventListener('click', toggleSidebar);
    
    // Mobile sidebar overlay click to close
    document.querySelector('.sidebar-overlay')?.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth < 1024) {
            sidebar.classList.remove('open');
        }
    });
    
    // Message modal close button
    document.getElementById('close-message-modal')?.addEventListener('click', () => {
        document.getElementById('message-modal')?.classList.add('hidden');
    });
    
    // Clear all history button
    document.getElementById('clear-all-history-btn')?.addEventListener('click', clearAllHistory);
    
    // Search functionality
    document.getElementById('search-input')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const historyItems = document.querySelectorAll('.history-item');
        
        console.log('🔍 Searching for:', searchTerm);
        console.log('📋 Found history items:', historyItems.length);
        
        historyItems.forEach(item => {
            const title = item.querySelector('.history-title')?.textContent.toLowerCase() || '';
            const code = item.querySelector('.history-code-preview')?.textContent.toLowerCase() || '';
            const language = item.querySelector('.history-language')?.textContent.toLowerCase() || '';
            
            console.log('🔍 Item:', { title, code: code.substring(0, 50), language });
            
            if (searchTerm === '' || 
                title.includes(searchTerm) || 
                code.includes(searchTerm) || 
                language.includes(searchTerm)) {
                item.style.display = 'block';
                console.log('✅ Showing item');
            } else {
                item.style.display = 'none';
                console.log('❌ Hiding item');
            }
        });
    });
    
    // Premium section click
    document.querySelector('.bg-gradient-to-r.from-yellow-400')?.addEventListener('click', () => {
        showMessage('Premium Özellik', 'Premium özellikler yakında gelecek!', 'info');
    });
    
    // Mobile overlay click handler
    document.querySelector('.sidebar-overlay')?.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    });
    document.getElementById('close-message-modal')?.addEventListener('click', () => {
        document.getElementById('message-modal')?.classList.add('hidden');
    });
    

    
    // Header language toggle
    document.getElementById('header-language-toggle-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleHeaderLanguagePanel();
    });
    
    // Header language icon buttons
    document.getElementById('header-language-panel')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.header-language-icon-btn');
        if (btn) {
            selectLanguage(btn.dataset.lang);
        }
    });
    

    
    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#header-language-toggle-btn') && !e.target.closest('#header-language-panel')) {
            closeHeaderLanguagePanel();
        }
    });
    
    // Code editor
    const codeEditor = document.getElementById('code-editor');
    if (codeEditor) {
        codeEditor.addEventListener('input', (e) => {
            window.appState.code = e.target.value;
        });
    }

    // Results toggle buttons
    document.getElementById('toggle-info-btn')?.addEventListener('click', () => {
        toggleResultsView('info');
    });
    
    document.getElementById('toggle-code-btn')?.addEventListener('click', () => {
        toggleResultsView('code');
    });
    
    // History items
    document.getElementById('history-list')?.addEventListener('click', (e) => {
        const item = e.target.closest('.history-item');
        if (item) {
            const analysis = window.appState.pastAnalyses.find(a => a.id === item.dataset.id);
            if (analysis) {
                window.appState.code = analysis.code;
                window.appState.result = analysis.result;
                window.appState.selectedLanguage = analysis.language;
                window.appState.currentAnalysisId = analysis.id;
                
                updateCodeEditor();
                renderAnalysisResults();
                selectLanguage(analysis.language);
                
                // Update active state
                document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        }
    });
    
    // Initialize with default language
    selectLanguage('javascript');
    
    console.log('✅ CodeMaster initialized successfully!');
});

// ====================================================================
// Language Dropdown Management
// ====================================================================

function toggleHeaderLanguagePanel() {
    const panel = document.getElementById('header-language-panel');
    const toggleIcon = document.getElementById('header-toggle-icon');
    
    if (!panel) return;
    
    const isOpen = panel.classList.contains('open');
    
    if (isOpen) {
        closeHeaderLanguagePanel();
    } else {
        openHeaderLanguagePanel();
    }
}

function openHeaderLanguagePanel() {
    const panel = document.getElementById('header-language-panel');
    const toggleIcon = document.getElementById('header-toggle-icon');
    
    if (!panel) return;
    
    panel.classList.add('open');
    toggleIcon.classList.add('rotated');
    
    console.log('➡️ Header language panel opened');
}

function closeHeaderLanguagePanel() {
    const panel = document.getElementById('header-language-panel');
    const toggleIcon = document.getElementById('header-toggle-icon');
    
    if (!panel) return;
    
    panel.classList.remove('open');
    toggleIcon.classList.remove('rotated');
    
    console.log('⬅️ Header language panel closed');
}



// ====================================================================
// Results View Management
// ====================================================================

function toggleResultsView(view) {
    const infoBtn = document.getElementById('toggle-info-btn');
    const codeBtn = document.getElementById('toggle-code-btn');
    const container = document.getElementById('results-container');
    
    if (!container) return;
    
    // Update button states
    if (view === 'info') {
        infoBtn.classList.add('active');
        infoBtn.classList.remove('text-theme-secondary');
        codeBtn.classList.remove('active');
        codeBtn.classList.add('text-theme-secondary');
    } else {
        codeBtn.classList.add('active');
        codeBtn.classList.remove('text-theme-secondary');
        infoBtn.classList.remove('active');
        infoBtn.classList.add('text-theme-secondary');
    }
    
    // Update content visibility
    const infoContent = container.querySelector('.info-content');
    const codeContent = container.querySelector('.code-content');
    
    if (infoContent) infoContent.style.display = view === 'info' ? 'block' : 'none';
    if (codeContent) codeContent.style.display = view === 'code' ? 'block' : 'none';
}

// ====================================================================
// Theme Management
// ====================================================================

function initializeTheme() {
    const savedTheme = localStorage.getItem('codemaster_theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('codemaster_theme', theme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun text-yellow-500 text-lg';
            themeToggle.title = 'Gündüz Moduna Geç';
        } else {
            icon.className = 'fas fa-moon text-theme-primary text-lg';
            themeToggle.title = 'Gece Moduna Geç';
        }
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ====================================================================
// Utility Functions
// ====================================================================
export function updateUI() {
    updateCodeEditor();
    renderAnalysisResults();
    updateHistoryList();
}

// Export for testing
export { exampleCodes, getAnalysisPrompt };
