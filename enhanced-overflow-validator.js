/**
 * Enhanced Page Overflow Validation System
 * Provides detailed analysis and fixes for content overflow issues
 */

class EnhancedOverflowValidator {
    constructor(options = {}) {
        this.options = {
            maxPageHeight: 9.5 * 96, // 9.5 inches at 96 DPI
            warningThreshold: 0.9, // 90% of max height
            autoFix: false,
            verboseLogging: true,
            pageSelector: '.paper-page',
            contentAnalysis: true,
            ...options
        };
        
        this.results = {
            overflowPages: [],
            warningPages: [],
            validPages: [],
            contentBlocks: [],
            fixes: [],
            totalPages: 0
        };
        
        this.init();
    }
    
    init() {
        this.log('📏 Initializing Enhanced Overflow Validation System');
        this.log(`   Max page height: ${this.options.maxPageHeight}px (${this.options.maxPageHeight / 96}")`);
        this.log(`   Warning threshold: ${this.options.warningThreshold * 100}%`);
        
        // Create test interface
        this.createTestInterface();
        
        // Auto-run validation
        this.validateAllPages();
    }
    
    createTestInterface() {
        const existingInterface = document.getElementById('overflow-validator-interface');
        if (existingInterface) {
            existingInterface.remove();
        }
        
        const testInterface = document.createElement('div');
        testInterface.id = 'overflow-validator-interface';
        testInterface.innerHTML = `
            <style>
                #overflow-validator-interface {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    width: 450px;
                    max-height: 80vh;
                    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    z-index: 999998;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
                    color: #2c3e50;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .overflow-header {
                    background: rgba(255,255,255,0.2);
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.3);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .overflow-title {
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #2c3e50;
                }
                
                .overflow-controls {
                    display: flex;
                    gap: 8px;
                }
                
                .overflow-btn {
                    background: rgba(255,255,255,0.3);
                    border: 1px solid rgba(255,255,255,0.4);
                    color: #2c3e50;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s;
                    font-weight: 500;
                }
                
                .overflow-btn:hover {
                    background: rgba(255,255,255,0.5);
                    transform: translateY(-1px);
                }
                
                .overflow-body {
                    max-height: 60vh;
                    overflow-y: auto;
                    padding: 16px 20px;
                }
                
                .overflow-summary {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 16px;
                }
                
                .summary-metric {
                    background: rgba(255,255,255,0.2);
                    padding: 12px;
                    border-radius: 8px;
                    text-align: center;
                }
                
                .summary-value {
                    font-size: 18px;
                    font-weight: bold;
                    display: block;
                    color: #2c3e50;
                }
                
                .summary-label {
                    font-size: 10px;
                    opacity: 0.8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #34495e;
                }
                
                .overflow-results {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .overflow-item {
                    background: rgba(255,255,255,0.2);
                    border-radius: 8px;
                    padding: 12px;
                    border-left: 4px solid #e74c3c;
                    font-size: 11px;
                    line-height: 1.4;
                }
                
                .overflow-item.success {
                    border-left-color: #27ae60;
                }
                
                .overflow-item.warning {
                    border-left-color: #f39c12;
                }
                
                .overflow-item.error {
                    border-left-color: #e74c3c;
                }
                
                .overflow-header-text {
                    font-weight: 600;
                    margin-bottom: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: #2c3e50;
                }
                
                .overflow-details {
                    opacity: 0.9;
                    font-size: 10px;
                    margin-top: 4px;
                    color: #34495e;
                }
                
                .content-analysis {
                    background: rgba(52, 152, 219, 0.2);
                    border: 1px solid rgba(52, 152, 219, 0.4);
                    padding: 8px;
                    border-radius: 4px;
                    margin-top: 8px;
                    font-size: 10px;
                }
                
                .fix-recommendation {
                    background: rgba(46, 204, 113, 0.2);
                    border: 1px solid rgba(46, 204, 113, 0.4);
                    padding: 8px;
                    border-radius: 4px;
                    margin-top: 8px;
                    font-size: 10px;
                    color: #27ae60;
                }
                
                .highlight-btn {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 9px;
                }
                
                .overflow-footer {
                    background: rgba(255,255,255,0.2);
                    padding: 12px 20px;
                    border-top: 1px solid rgba(255,255,255,0.3);
                    font-size: 10px;
                    text-align: center;
                    color: #2c3e50;
                }
                
                .minimized .overflow-body,
                .minimized .overflow-footer {
                    display: none;
                }
                
                .hidden {
                    transform: translateX(-120%);
                }
                
                .page-highlight {
                    outline: 3px solid #e74c3c !important;
                    outline-offset: 2px !important;
                    background-color: rgba(231, 76, 60, 0.1) !important;
                    animation: overflowPulse 2s infinite;
                }
                
                @keyframes overflowPulse {
                    0%, 100% { outline-color: #e74c3c; }
                    50% { outline-color: #f39c12; }
                }
                
                .content-block-highlight {
                    outline: 2px solid #f39c12 !important;
                    outline-offset: 1px !important;
                    background-color: rgba(243, 156, 18, 0.1) !important;
                }
            </style>
            
            <div class="overflow-header">
                <div class="overflow-title">
                    <span>📏</span>
                    <span>Overflow Validator</span>
                    <span id="overflow-status">Ready</span>
                </div>
                <div class="overflow-controls">
                    <button class="overflow-btn" onclick="overflowValidator.validateAllPages()">Scan</button>
                    <button class="overflow-btn" onclick="overflowValidator.analyzeContent()">Analyze</button>
                    <button class="overflow-btn" onclick="overflowValidator.toggleMinimize()">−</button>
                    <button class="overflow-btn" onclick="overflowValidator.hide()">×</button>
                </div>
            </div>
            
            <div class="overflow-body">
                <div class="overflow-summary">
                    <div class="summary-metric">
                        <span class="summary-value" id="total-pages">0</span>
                        <span class="summary-label">Pages</span>
                    </div>
                    <div class="summary-metric">
                        <span class="summary-value" id="overflow-pages">0</span>
                        <span class="summary-label">Overflow</span>
                    </div>
                    <div class="summary-metric">
                        <span class="summary-value" id="warning-pages">0</span>
                        <span class="summary-label">Warnings</span>
                    </div>
                </div>
                
                <div class="overflow-results" id="overflow-results">
                    <div class="overflow-item">
                        <div class="overflow-header-text">Ready to validate page overflow</div>
                        <div class="overflow-details">Click "Scan" to check all pages for content overflow</div>
                    </div>
                </div>
            </div>
            
            <div class="overflow-footer">
                Enhanced Overflow Detection • Content Analysis Available
            </div>
        `;
        
        document.body.appendChild(testInterface);
        this.interface = testInterface;
    }
    
    validateAllPages() {
        this.log('📏 Starting comprehensive page overflow validation...');
        this.updateStatus('Scanning...');
        this.clearResults();
        
        const pages = document.querySelectorAll(this.options.pageSelector);
        this.results.totalPages = pages.length;
        
        pages.forEach((page, index) => {
            this.validatePage(page, index + 1);
        });
        
        this.updateSummary();
        this.displayResults();
        this.updateStatus('Complete');
        
        this.log(`✅ Overflow validation complete: ${this.results.totalPages} pages checked`);
        this.log(`   🔴 Overflow: ${this.results.overflowPages.length}`);
        this.log(`   🟡 Warnings: ${this.results.warningPages.length}`);
        this.log(`   🟢 Valid: ${this.results.validPages.length}`);
    }
    
    validatePage(page, pageNumber) {
        const rect = page.getBoundingClientRect();
        const utilizationPercent = rect.height / this.options.maxPageHeight;
        
        const result = {
            element: page,
            pageNumber,
            height: rect.height,
            maxHeight: this.options.maxPageHeight,
            utilizationPercent,
            status: 'unknown',
            details: [],
            contentBlocks: [],
            recommendations: [],
            timestamp: new Date()
        };
        
        // Determine status
        if (utilizationPercent > 1) {
            result.status = 'overflow';
            result.details.push(`Page content overflows by ${Math.round((utilizationPercent - 1) * 100)}%`);
            result.details.push(`Actual height: ${Math.round(rect.height)}px (${(rect.height / 96).toFixed(2)}")`);
            result.details.push(`Max height: ${Math.round(this.options.maxPageHeight)}px (${(this.options.maxPageHeight / 96).toFixed(2)}")`);
            
            // Analyze content blocks causing overflow
            this.analyzePageContent(page, result);
            
            this.results.overflowPages.push(result);
        } else if (utilizationPercent > this.options.warningThreshold) {
            result.status = 'warning';
            result.details.push(`Page is ${Math.round(utilizationPercent * 100)}% full (warning threshold: ${Math.round(this.options.warningThreshold * 100)}%)`);
            result.details.push(`Height: ${Math.round(rect.height)}px (${(rect.height / 96).toFixed(2)}")`);
            result.details.push(`Available space: ${Math.round(this.options.maxPageHeight - rect.height)}px`);
            
            this.results.warningPages.push(result);
        } else {
            result.status = 'valid';
            result.details.push(`Page utilization: ${Math.round(utilizationPercent * 100)}%`);
            result.details.push(`Height: ${Math.round(rect.height)}px (${(rect.height / 96).toFixed(2)}")`);
            result.details.push(`Available space: ${Math.round(this.options.maxPageHeight - rect.height)}px`);
            
            this.results.validPages.push(result);
        }
        
        return result;
    }
    
    analyzePageContent(page, result) {
        const elements = page.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, table, img, .section-content, .large-content');
        
        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const pageRect = page.getBoundingClientRect();
            
            // Check if element contributes significantly to height
            const elementHeight = rect.height;
            const heightPercentage = (elementHeight / pageRect.height) * 100;
            
            if (heightPercentage > 10) { // Elements taking up more than 10% of page height
                const blockInfo = {
                    element,
                    tagName: element.tagName.toLowerCase(),
                    height: elementHeight,
                    heightPercentage,
                    content: this.getElementSummary(element),
                    position: rect.top - pageRect.top
                };
                
                result.contentBlocks.push(blockInfo);
                
                // Generate recommendations
                if (heightPercentage > 30) {
                    result.recommendations.push(`Large ${blockInfo.tagName} element (${Math.round(heightPercentage)}% of page) could be split`);
                }
                
                if (element.tagName.toLowerCase() === 'table' && heightPercentage > 20) {
                    result.recommendations.push('Consider breaking large table across multiple pages');
                }
                
                if (element.tagName.toLowerCase() === 'img' && heightPercentage > 25) {
                    result.recommendations.push('Large image could be resized or moved to dedicated page');
                }
            }
        });
        
        // Check for orphaned headings
        const headings = page.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const headingRect = heading.getBoundingClientRect();
            const pageRect = page.getBoundingClientRect();
            const distanceFromBottom = pageRect.bottom - headingRect.bottom;
            
            if (distanceFromBottom < 100) { // Less than ~1 inch from bottom
                result.recommendations.push(`Heading "${this.getElementSummary(heading)}" may be orphaned at page bottom`);
            }
        });
    }
    
    getElementSummary(element) {
        let text = element.textContent || element.alt || element.title || '';
        text = text.trim();
        
        if (text.length > 50) {
            text = text.substring(0, 47) + '...';
        }
        
        if (element.tagName.toLowerCase() === 'img') {
            const src = element.src.split('/').pop();
            return `Image: ${src}`;
        }
        
        return text || `${element.tagName} element`;
    }
    
    analyzeContent() {
        this.log('🔍 Starting detailed content analysis...');
        this.updateStatus('Analyzing...');
        
        // Run validation first if not done
        if (this.results.totalPages === 0) {
            this.validateAllPages();
            return;
        }
        
        // Deep analysis of problematic pages
        const problematicPages = [...this.results.overflowPages, ...this.results.warningPages];
        
        problematicPages.forEach(pageResult => {
            this.performDeepContentAnalysis(pageResult);
        });
        
        this.displayResults();
        this.updateStatus('Analysis Complete');
        
        this.log(`🔍 Content analysis complete for ${problematicPages.length} pages`);
    }
    
    performDeepContentAnalysis(pageResult) {
        const page = pageResult.element;
        
        // Analyze text density
        const textElements = page.querySelectorAll('p, li, td, th');
        let totalTextLength = 0;
        let longParagraphs = 0;
        
        textElements.forEach(element => {
            const text = element.textContent.trim();
            totalTextLength += text.length;
            
            if (text.length > 500) {
                longParagraphs++;
            }
        });
        
        // Analyze white space
        const computedStyle = getComputedStyle(page);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const fontSize = parseFloat(computedStyle.fontSize);
        
        // Add detailed analysis to recommendations
        if (longParagraphs > 0) {
            pageResult.recommendations.push(`${longParagraphs} long paragraphs detected - consider breaking into smaller sections`);
        }
        
        if (totalTextLength > 3000) {
            pageResult.recommendations.push('High text density - consider redistributing content');
        }
        
        // Check for tight spacing
        if (lineHeight < fontSize * 1.2) {
            pageResult.recommendations.push('Line height may be too tight for optimal readability');
        }
        
        // Analyze image placement
        const images = page.querySelectorAll('img');
        if (images.length > 3) {
            pageResult.recommendations.push(`Multiple images (${images.length}) - consider moving some to other pages`);
        }
    }
    
    highlightPage(pageNumber) {
        // Remove existing highlights
        document.querySelectorAll('.page-highlight').forEach(el => {
            el.classList.remove('page-highlight');
        });
        
        // Find and highlight the page
        const pages = document.querySelectorAll(this.options.pageSelector);
        const targetPage = pages[pageNumber - 1];
        
        if (targetPage) {
            targetPage.classList.add('page-highlight');
            targetPage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Remove highlight after 5 seconds
            setTimeout(() => {
                targetPage.classList.remove('page-highlight');
            }, 5000);
        }
    }
    
    updateSummary() {
        document.getElementById('total-pages').textContent = this.results.totalPages;
        document.getElementById('overflow-pages').textContent = this.results.overflowPages.length;
        document.getElementById('warning-pages').textContent = this.results.warningPages.length;
    }
    
    displayResults() {
        const resultsContainer = document.getElementById('overflow-results');
        resultsContainer.innerHTML = '';
        
        // Display overflow pages first
        this.results.overflowPages.forEach(result => {
            const item = this.createResultItem(result, 'error');
            resultsContainer.appendChild(item);
        });
        
        // Display warning pages
        this.results.warningPages.forEach(result => {
            const item = this.createResultItem(result, 'warning');
            resultsContainer.appendChild(item);
        });
        
        // Display valid pages summary
        if (this.results.validPages.length > 0) {
            const validItem = document.createElement('div');
            validItem.className = 'overflow-item success';
            validItem.innerHTML = `
                <div class="overflow-header-text">
                    <span>✅ ${this.results.validPages.length} pages within limits</span>
                </div>
                <div class="overflow-details">
                    Average utilization: ${Math.round(
                        this.results.validPages.reduce((sum, p) => sum + p.utilizationPercent, 0) / 
                        this.results.validPages.length * 100
                    )}%
                </div>
            `;
            resultsContainer.appendChild(validItem);
        }
        
        if (this.results.totalPages === 0) {
            resultsContainer.innerHTML = `
                <div class="overflow-item">
                    <div class="overflow-header-text">No pages found</div>
                    <div class="overflow-details">No elements matching selector "${this.options.pageSelector}" detected</div>
                </div>
            `;
        }
    }
    
    createResultItem(result, type) {
        const item = document.createElement('div');
        item.className = `overflow-item ${type}`;
        
        const statusIcon = {
            'error': '🔴',
            'warning': '🟡',
            'success': '🟢'
        }[type] || '⚪';
        
        const highlightButton = `<button class="highlight-btn" onclick="overflowValidator.highlightPage(${result.pageNumber})">Highlight</button>`;
        
        let contentAnalysis = '';
        if (result.contentBlocks.length > 0) {
            contentAnalysis = `
                <div class="content-analysis">
                    📊 Content blocks: ${result.contentBlocks.length} large elements detected<br>
                    ${result.contentBlocks.map(block => 
                        `• ${block.tagName}: ${Math.round(block.heightPercentage)}% of page`
                    ).join('<br>')}
                </div>
            `;
        }
        
        let recommendations = '';
        if (result.recommendations.length > 0) {
            recommendations = `
                <div class="fix-recommendation">
                    💡 Recommendations:<br>
                    ${result.recommendations.map(rec => `• ${rec}`).join('<br>')}
                </div>
            `;
        }
        
        item.innerHTML = `
            <div class="overflow-header-text">
                <span>${statusIcon} Page ${result.pageNumber}: ${Math.round(result.utilizationPercent * 100)}% utilization</span>
                ${highlightButton}
            </div>
            <div class="overflow-details">
                ${result.details.join('<br>')}
            </div>
            ${contentAnalysis}
            ${recommendations}
        `;
        
        return item;
    }
    
    clearResults() {
        this.results = {
            overflowPages: [],
            warningPages: [],
            validPages: [],
            contentBlocks: [],
            fixes: [],
            totalPages: 0
        };
    }
    
    updateStatus(status) {
        document.getElementById('overflow-status').textContent = status;
    }
    
    toggleMinimize() {
        this.interface.classList.toggle('minimized');
        const btn = this.interface.querySelector('.overflow-controls .overflow-btn:nth-child(3)');
        btn.textContent = this.interface.classList.contains('minimized') ? '+' : '−';
    }
    
    hide() {
        this.interface.classList.add('hidden');
    }
    
    show() {
        this.interface.classList.remove('hidden');
    }
    
    log(message) {
        if (this.options.verboseLogging) {
            console.log(message);
        }
    }
    
    generateReport() {
        const timestamp = new Date().toLocaleString();
        return {
            timestamp,
            summary: {
                totalPages: this.results.totalPages,
                overflowPages: this.results.overflowPages.length,
                warningPages: this.results.warningPages.length,
                validPages: this.results.validPages.length,
                averageUtilization: this.results.totalPages > 0 ? 
                    Math.round([...this.results.overflowPages, ...this.results.warningPages, ...this.results.validPages]
                        .reduce((sum, p) => sum + p.utilizationPercent, 0) / this.results.totalPages * 100) : 0
            },
            details: {
                overflowPages: this.results.overflowPages.map(p => ({
                    pageNumber: p.pageNumber,
                    utilization: Math.round(p.utilizationPercent * 100),
                    height: Math.round(p.height),
                    contentBlocks: p.contentBlocks.length,
                    recommendations: p.recommendations
                })),
                warningPages: this.results.warningPages.map(p => ({
                    pageNumber: p.pageNumber,
                    utilization: Math.round(p.utilizationPercent * 100),
                    height: Math.round(p.height),
                    availableSpace: Math.round(this.options.maxPageHeight - p.height)
                }))
            }
        };
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.overflowValidator = new EnhancedOverflowValidator({
            verboseLogging: true,
            contentAnalysis: true
        });
    });
} else {
    window.overflowValidator = new EnhancedOverflowValidator({
        verboseLogging: true,
        contentAnalysis: true
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedOverflowValidator;
}