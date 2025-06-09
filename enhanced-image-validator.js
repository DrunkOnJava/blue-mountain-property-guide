/**
 * Enhanced Image Validation Testing System
 * Provides detailed error messages and automated fixes for image path issues
 */

class EnhancedImageValidator {
    constructor(options = {}) {
        this.options = {
            autoFix: false,
            verboseLogging: true,
            timeout: 10000,
            imageDirs: ['public/', 'optimized/', './'],
            validExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
            ...options
        };
        
        this.results = {
            brokenImages: [],
            fixedImages: [],
            validImages: [],
            missingImages: [],
            pathSuggestions: new Map(),
            totalChecked: 0
        };
        
        this.init();
    }
    
    init() {
        this.log('🔍 Initializing Enhanced Image Validation System');
        this.log(`   Auto-fix enabled: ${this.options.autoFix}`);
        this.log(`   Search directories: ${this.options.imageDirs.join(', ')}`);
        this.log(`   Valid extensions: ${this.options.validExtensions.join(', ')}`);
        
        // Create test interface
        this.createTestInterface();
        
        // Auto-run validation
        this.validateAllImages();
    }
    
    createTestInterface() {
        const existingInterface = document.getElementById('image-validator-interface');
        if (existingInterface) {
            existingInterface.remove();
        }
        
        const testInterface = document.createElement('div');
        testInterface.id = 'image-validator-interface';
        testInterface.innerHTML = `
            <style>
                #image-validator-interface {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 450px;
                    max-height: 80vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
                    color: white;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .validator-header {
                    background: rgba(255,255,255,0.1);
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .validator-title {
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .validator-controls {
                    display: flex;
                    gap: 8px;
                }
                
                .validator-btn {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s;
                }
                
                .validator-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-1px);
                }
                
                .validator-body {
                    max-height: 60vh;
                    overflow-y: auto;
                    padding: 16px 20px;
                }
                
                .validator-summary {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    margin-bottom: 16px;
                }
                
                .summary-metric {
                    background: rgba(255,255,255,0.1);
                    padding: 12px;
                    border-radius: 8px;
                    text-align: center;
                }
                
                .summary-value {
                    font-size: 18px;
                    font-weight: bold;
                    display: block;
                }
                
                .summary-label {
                    font-size: 10px;
                    opacity: 0.8;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .validator-results {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .result-item {
                    background: rgba(255,255,255,0.1);
                    border-radius: 8px;
                    padding: 12px;
                    border-left: 4px solid #e74c3c;
                    font-size: 11px;
                    line-height: 1.4;
                }
                
                .result-item.success {
                    border-left-color: #2ecc71;
                }
                
                .result-item.warning {
                    border-left-color: #f39c12;
                }
                
                .result-item.error {
                    border-left-color: #e74c3c;
                }
                
                .result-header {
                    font-weight: 600;
                    margin-bottom: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .result-details {
                    opacity: 0.9;
                    font-size: 10px;
                    margin-top: 4px;
                }
                
                .fix-suggestion {
                    background: rgba(46, 204, 113, 0.2);
                    border: 1px solid rgba(46, 204, 113, 0.4);
                    padding: 8px;
                    border-radius: 4px;
                    margin-top: 8px;
                    font-size: 10px;
                }
                
                .fix-btn {
                    background: #2ecc71;
                    color: white;
                    border: none;
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 9px;
                }
                
                .validator-footer {
                    background: rgba(255,255,255,0.1);
                    padding: 12px 20px;
                    border-top: 1px solid rgba(255,255,255,0.2);
                    font-size: 10px;
                    text-align: center;
                    opacity: 0.8;
                }
                
                .minimized .validator-body,
                .minimized .validator-footer {
                    display: none;
                }
                
                .hidden {
                    transform: translateX(120%);
                }
                
                @keyframes resultSlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .result-item {
                    animation: resultSlideIn 0.3s ease-out;
                }
            </style>
            
            <div class="validator-header">
                <div class="validator-title">
                    <span>🖼️</span>
                    <span>Image Validator</span>
                    <span id="validation-status">Ready</span>
                </div>
                <div class="validator-controls">
                    <button class="validator-btn" onclick="imageValidator.validateAllImages()">Scan</button>
                    <button class="validator-btn" onclick="imageValidator.fixAllImages()">Fix All</button>
                    <button class="validator-btn" onclick="imageValidator.toggleMinimize()">−</button>
                    <button class="validator-btn" onclick="imageValidator.hide()">×</button>
                </div>
            </div>
            
            <div class="validator-body">
                <div class="validator-summary">
                    <div class="summary-metric">
                        <span class="summary-value" id="total-images">0</span>
                        <span class="summary-label">Total</span>
                    </div>
                    <div class="summary-metric">
                        <span class="summary-value" id="broken-images">0</span>
                        <span class="summary-label">Broken</span>
                    </div>
                    <div class="summary-metric">
                        <span class="summary-value" id="valid-images">0</span>
                        <span class="summary-label">Valid</span>
                    </div>
                    <div class="summary-metric">
                        <span class="summary-value" id="fixed-images">0</span>
                        <span class="summary-label">Fixed</span>
                    </div>
                </div>
                
                <div class="validator-results" id="validation-results">
                    <div class="result-item">
                        <div class="result-header">Ready to validate images</div>
                        <div class="result-details">Click "Scan" to check all images in the document</div>
                    </div>
                </div>
            </div>
            
            <div class="validator-footer">
                Enhanced Image Validation • Auto-fix available
            </div>
        `;
        
        document.body.appendChild(testInterface);
        this.interface = testInterface;
    }
    
    async validateAllImages() {
        this.log('🔍 Starting comprehensive image validation...');
        this.updateStatus('Scanning...');
        this.clearResults();
        
        const images = document.querySelectorAll('img');
        const promises = Array.from(images).map((img, index) => 
            this.validateImage(img, index)
        );
        
        await Promise.all(promises);
        
        this.updateSummary();
        this.displayResults();
        this.updateStatus('Complete');
        
        this.log(`✅ Validation complete: ${this.results.totalChecked} images checked`);
        this.log(`   🔴 Broken: ${this.results.brokenImages.length}`);
        this.log(`   🟢 Valid: ${this.results.validImages.length}`);
        this.log(`   🔧 Fixable: ${this.results.pathSuggestions.size}`);
    }
    
    async validateImage(img, index) {
        this.results.totalChecked++;
        
        const src = img.src;
        const filename = src.split('/').pop();
        const result = {
            element: img,
            index: index + 1,
            originalSrc: src,
            filename: filename,
            status: 'unknown',
            details: [],
            suggestion: null,
            timestamp: new Date()
        };
        
        // Check if image has src
        if (!src || src === window.location.href) {
            result.status = 'missing-src';
            result.details.push('Image element has no src attribute');
            this.results.brokenImages.push(result);
            return result;
        }
        
        // Check if image is loaded
        if (img.complete) {
            if (img.naturalHeight === 0) {
                result.status = 'broken';
                result.details.push(`Image failed to load: ${src}`);
                
                // Try to find the correct path
                const suggestion = await this.findCorrectImagePath(filename);
                if (suggestion) {
                    result.suggestion = suggestion;
                    result.details.push(`Suggested fix: ${suggestion}`);
                    this.results.pathSuggestions.set(img, suggestion);
                }
                
                this.results.brokenImages.push(result);
            } else {
                result.status = 'valid';
                result.details.push(`Image loaded successfully (${img.naturalWidth}×${img.naturalHeight}px)`);
                
                // Check for optimal sizing
                const rect = img.getBoundingClientRect();
                const scale = rect.width / img.naturalWidth;
                if (scale > 1.5) {
                    result.details.push(`⚠️ Image may appear pixelated (scaled ${Math.round(scale * 100)}%)`);
                }
                
                this.results.validImages.push(result);
            }
        } else {
            // Image still loading, wait for it
            result.status = 'loading';
            result.details.push('Image is still loading...');
            
            try {
                await this.waitForImageLoad(img);
                return this.validateImage(img, index); // Re-validate after loading
            } catch (error) {
                result.status = 'timeout';
                result.details.push(`Image load timeout: ${error.message}`);
                this.results.brokenImages.push(result);
            }
        }
        
        return result;
    }
    
    async findCorrectImagePath(filename) {
        for (const dir of this.options.imageDirs) {
            const testPath = `${dir}${filename}`;
            
            try {
                const response = await fetch(testPath, { method: 'HEAD' });
                if (response.ok) {
                    return testPath;
                }
            } catch (error) {
                // Path doesn't exist, continue searching
            }
        }
        
        return null;
    }
    
    waitForImageLoad(img, timeout = this.options.timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Timeout after ${timeout}ms`));
            }, timeout);
            
            img.onload = () => {
                clearTimeout(timer);
                resolve();
            };
            
            img.onerror = () => {
                clearTimeout(timer);
                reject(new Error('Image failed to load'));
            };
        });
    }
    
    async fixAllImages() {
        this.log('🔧 Starting automatic image path fixes...');
        this.updateStatus('Fixing...');
        
        let fixedCount = 0;
        
        for (const [img, suggestion] of this.results.pathSuggestions) {
            try {
                this.log(`   Fixing: ${img.src} → ${suggestion}`);
                img.src = suggestion;
                
                // Wait for image to load with new path
                await this.waitForImageLoad(img, 5000);
                
                this.results.fixedImages.push({
                    element: img,
                    originalSrc: img.getAttribute('data-original-src') || img.src,
                    newSrc: suggestion,
                    timestamp: new Date()
                });
                
                fixedCount++;
            } catch (error) {
                this.log(`   ❌ Failed to fix ${img.src}: ${error.message}`);
            }
        }
        
        this.log(`✅ Fixed ${fixedCount} images`);
        
        // Re-validate to update results
        await this.validateAllImages();
    }
    
    updateSummary() {
        document.getElementById('total-images').textContent = this.results.totalChecked;
        document.getElementById('broken-images').textContent = this.results.brokenImages.length;
        document.getElementById('valid-images').textContent = this.results.validImages.length;
        document.getElementById('fixed-images').textContent = this.results.fixedImages.length;
    }
    
    displayResults() {
        const resultsContainer = document.getElementById('validation-results');
        resultsContainer.innerHTML = '';
        
        // Display broken images first
        this.results.brokenImages.forEach(result => {
            const item = this.createResultItem(result, 'error');
            resultsContainer.appendChild(item);
        });
        
        // Display fixed images
        this.results.fixedImages.forEach(result => {
            const item = this.createFixedResultItem(result);
            resultsContainer.appendChild(item);
        });
        
        // Display valid images (limit to first 5 to save space)
        this.results.validImages.slice(0, 5).forEach(result => {
            const item = this.createResultItem(result, 'success');
            resultsContainer.appendChild(item);
        });
        
        if (this.results.validImages.length > 5) {
            const moreItem = document.createElement('div');
            moreItem.className = 'result-item success';
            moreItem.innerHTML = `
                <div class="result-header">+ ${this.results.validImages.length - 5} more valid images</div>
                <div class="result-details">All additional images loaded successfully</div>
            `;
            resultsContainer.appendChild(moreItem);
        }
        
        if (this.results.totalChecked === 0) {
            resultsContainer.innerHTML = `
                <div class="result-item">
                    <div class="result-header">No images found</div>
                    <div class="result-details">No img elements detected in the document</div>
                </div>
            `;
        }
    }
    
    createResultItem(result, type) {
        const item = document.createElement('div');
        item.className = `result-item ${type}`;
        
        const statusIcon = {
            'error': '🔴',
            'success': '🟢',
            'warning': '🟡'
        }[type] || '⚪';
        
        const fixButton = result.suggestion ? 
            `<button class="fix-btn" onclick="imageValidator.fixSingleImage('${result.index}')">Fix</button>` : '';
        
        item.innerHTML = `
            <div class="result-header">
                <span>${statusIcon} Image ${result.index}: ${result.filename}</span>
                ${fixButton}
            </div>
            <div class="result-details">
                ${result.details.join('<br>')}
            </div>
            ${result.suggestion ? `
                <div class="fix-suggestion">
                    💡 Suggested fix: <code>${result.suggestion}</code>
                </div>
            ` : ''}
        `;
        
        return item;
    }
    
    createFixedResultItem(result) {
        const item = document.createElement('div');
        item.className = 'result-item success';
        
        item.innerHTML = `
            <div class="result-header">
                <span>🔧 Fixed: ${result.newSrc.split('/').pop()}</span>
            </div>
            <div class="result-details">
                Updated path: ${result.originalSrc} → ${result.newSrc}
            </div>
        `;
        
        return item;
    }
    
    async fixSingleImage(index) {
        const result = this.results.brokenImages.find(r => r.index === parseInt(index));
        if (!result || !result.suggestion) return;
        
        try {
            result.element.src = result.suggestion;
            await this.waitForImageLoad(result.element, 5000);
            
            this.results.fixedImages.push({
                element: result.element,
                originalSrc: result.originalSrc,
                newSrc: result.suggestion,
                timestamp: new Date()
            });
            
            // Re-validate to update display
            await this.validateAllImages();
        } catch (error) {
            this.log(`❌ Failed to fix image ${index}: ${error.message}`);
        }
    }
    
    clearResults() {
        this.results = {
            brokenImages: [],
            fixedImages: [],
            validImages: [],
            missingImages: [],
            pathSuggestions: new Map(),
            totalChecked: 0
        };
    }
    
    updateStatus(status) {
        document.getElementById('validation-status').textContent = status;
    }
    
    toggleMinimize() {
        this.interface.classList.toggle('minimized');
        const btn = this.interface.querySelector('.validator-controls .validator-btn:nth-child(3)');
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
        const report = {
            timestamp,
            summary: {
                totalImages: this.results.totalChecked,
                brokenImages: this.results.brokenImages.length,
                validImages: this.results.validImages.length,
                fixedImages: this.results.fixedImages.length,
                successRate: this.results.totalChecked > 0 ? 
                    Math.round((this.results.validImages.length / this.results.totalChecked) * 100) : 0
            },
            details: {
                brokenImages: this.results.brokenImages.map(r => ({
                    filename: r.filename,
                    originalSrc: r.originalSrc,
                    status: r.status,
                    details: r.details,
                    suggestion: r.suggestion
                })),
                fixedImages: this.results.fixedImages.map(r => ({
                    filename: r.newSrc.split('/').pop(),
                    originalSrc: r.originalSrc,
                    newSrc: r.newSrc
                }))
            }
        };
        
        return report;
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageValidator = new EnhancedImageValidator({
            autoFix: false,
            verboseLogging: true
        });
    });
} else {
    window.imageValidator = new EnhancedImageValidator({
        autoFix: false,
        verboseLogging: true
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedImageValidator;
}