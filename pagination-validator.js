/**
 * Enhanced Pagination Validator and Testing Utility
 * Real-time content overflow detection and pagination optimization
 */

class PaginationValidator {
    constructor(options = {}) {
        this.options = {
            pageHeight: 9.5, // inches
            pageWidth: 8.5,  // inches
            padding: 0.75,   // inches
            warningThreshold: 0.9, // 90% of page height
            ...options
        };
        
        this.contentHeight = this.options.pageHeight - (this.options.padding * 2);
        this.contentWidth = this.options.pageWidth - (this.options.padding * 2);
        this.dpi = 96; // Standard screen DPI
        
        this.init();
    }
    
    init() {
        this.createOverflowDetectors();
        this.setupResizeObserver();
        this.createTestingInterface();
        
        // Run initial validation
        setTimeout(() => this.validateAllPages(), 1000);
        
        console.log('🔍 Pagination Validator initialized');
        console.log(`📏 Page dimensions: ${this.options.pageWidth}" × ${this.options.pageHeight}"`);
        console.log(`📝 Content area: ${this.contentWidth}" × ${this.contentHeight}"`);
    }
    
    createOverflowDetectors() {
        const style = document.createElement('style');
        style.textContent = `
            .pagination-warning {
                position: relative;
            }
            
            .pagination-warning::after {
                content: "⚠️ Content overflow detected";
                position: absolute;
                top: -2rem;
                right: 0;
                background: #e74c3c;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-size: 0.75rem;
                font-weight: bold;
                z-index: 1000;
                animation: warningPulse 2s infinite;
            }
            
            @keyframes warningPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            .pagination-near-limit {
                border-left: 3px solid #f39c12 !important;
            }
            
            .pagination-overflow {
                border-left: 4px solid #e74c3c !important;
                box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupResizeObserver() {
        if (!window.ResizeObserver) return;
        
        this.resizeObserver = new ResizeObserver(entries => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.validateAllPages();
            }, 250);
        });
        
        // Observe all pages
        document.querySelectorAll('.paper-page').forEach(page => {
            this.resizeObserver.observe(page);
        });
    }
    
    validateAllPages() {
        const pages = document.querySelectorAll('.paper-page');
        const results = [];
        
        pages.forEach((page, index) => {
            const result = this.validatePage(page, index + 1);
            results.push(result);
        });
        
        this.displayValidationSummary(results);
        return results;
    }
    
    validatePage(page, pageNumber) {
        // Reset previous states
        page.classList.remove('pagination-warning', 'pagination-near-limit', 'pagination-overflow');
        page.removeAttribute('data-overflow');
        
        const rect = page.getBoundingClientRect();
        const contentHeight = rect.height;
        const maxHeight = this.contentHeight * this.dpi;
        const warningHeight = maxHeight * this.options.warningThreshold;
        
        const result = {
            pageNumber,
            contentHeight: contentHeight,
            maxHeight: maxHeight,
            utilizationPercent: Math.round((contentHeight / maxHeight) * 100),
            status: 'ok',
            warnings: [],
            errors: []
        };
        
        // Check for overflow
        if (contentHeight > maxHeight) {
            result.status = 'overflow';
            result.errors.push(`Content exceeds page height by ${Math.round(contentHeight - maxHeight)}px`);
            page.classList.add('pagination-overflow', 'pagination-warning');
            page.setAttribute('data-overflow', 'true');
        } else if (contentHeight > warningHeight) {
            result.status = 'warning';
            result.warnings.push(`Content near page limit (${result.utilizationPercent}% full)`);
            page.classList.add('pagination-near-limit');
        }
        
        // Check for problematic elements
        this.checkProblematicElements(page, result);
        
        // Check image sizes
        this.checkImageSizes(page, result);
        
        // Check table pagination
        this.checkTablePagination(page, result);
        
        return result;
    }
    
    checkProblematicElements(page, result) {
        // Check for large single elements that might cause issues
        const elements = page.querySelectorAll('div, section, article, table, img');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const maxElementHeight = this.contentHeight * this.dpi * 0.8; // 80% of page
            
            if (rect.height > maxElementHeight) {
                result.warnings.push(`Large element detected: ${element.tagName} (${Math.round(rect.height)}px)`);
            }
        });
        
        // Check for orphaned headings
        const headings = page.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const nextElement = heading.nextElementSibling;
            if (!nextElement || this.getElementDistanceFromBottom(heading, page) < 50) {
                result.warnings.push(`Potential orphaned heading: ${heading.textContent.slice(0, 30)}...`);
            }
        });
    }
    
    checkImageSizes(page, result) {
        const images = page.querySelectorAll('img');
        const maxImageWidth = this.contentWidth * this.dpi;
        const maxImageHeight = this.contentHeight * this.dpi * 0.6; // 60% of page
        
        images.forEach(img => {
            if (img.naturalWidth > maxImageWidth) {
                result.warnings.push(`Image too wide: ${img.src.split('/').pop()}`);
            }
            if (img.naturalHeight > maxImageHeight) {
                result.warnings.push(`Image too tall: ${img.src.split('/').pop()}`);
            }
        });
    }
    
    checkTablePagination(page, result) {
        const tables = page.querySelectorAll('table');
        
        tables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            if (rows.length > 20) {
                result.warnings.push(`Large table detected (${rows.length} rows) - consider splitting`);
            }
            
            // Check if table has proper break-inside: avoid
            const computedStyle = getComputedStyle(table);
            if (computedStyle.breakInside !== 'avoid' && computedStyle.pageBreakInside !== 'avoid') {
                result.warnings.push('Table missing page-break protection');
            }
        });
    }
    
    getElementDistanceFromBottom(element, page) {
        const elementRect = element.getBoundingClientRect();
        const pageRect = page.getBoundingClientRect();
        return pageRect.bottom - elementRect.bottom;
    }
    
    displayValidationSummary(results) {
        const summary = {
            total: results.length,
            ok: results.filter(r => r.status === 'ok').length,
            warning: results.filter(r => r.status === 'warning').length,
            overflow: results.filter(r => r.status === 'overflow').length,
            totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
            totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0)
        };
        
        console.group('📋 Pagination Validation Summary');
        console.log(`📄 Total pages: ${summary.total}`);
        console.log(`✅ OK: ${summary.ok}`);
        console.log(`⚠️ Warnings: ${summary.warning}`);
        console.log(`❌ Overflow: ${summary.overflow}`);
        console.log(`📊 Total issues: ${summary.totalWarnings + summary.totalErrors}`);
        
        if (summary.overflow > 0) {
            console.warn('🚨 Content overflow detected! Pages may not print correctly.');
            results.filter(r => r.status === 'overflow').forEach(r => {
                console.warn(`   Page ${r.pageNumber}: ${r.utilizationPercent}% full`);
            });
        }
        
        console.groupEnd();
        
        // Update UI indicator
        this.updateUIIndicator(summary);
    }
    
    updateUIIndicator(summary) {
        let indicator = document.getElementById('pagination-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pagination-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                z-index: 10000;
                cursor: pointer;
                transition: all 0.3s;
            `;
            document.body.appendChild(indicator);
            
            indicator.addEventListener('click', () => {
                this.showDetailedReport();
            });
        }
        
        if (summary.overflow > 0) {
            indicator.style.backgroundColor = '#e74c3c';
            indicator.textContent = `🚨 ${summary.overflow} pages overflow`;
        } else if (summary.warning > 0) {
            indicator.style.backgroundColor = '#f39c12';
            indicator.textContent = `⚠️ ${summary.warning} pages near limit`;
        } else {
            indicator.style.backgroundColor = '#27ae60';
            indicator.textContent = `✅ All ${summary.total} pages OK`;
        }
    }
    
    createTestingInterface() {
        // Add pagination testing tools to browser console
        window.paginationTest = {
            validate: () => this.validateAllPages(),
            addContent: (pageNumber, content) => this.addTestContent(pageNumber, content),
            removeOverflow: () => this.removeOverflowContent(),
            generateReport: () => this.generateDetailedReport(),
            togglePreview: () => this.togglePrintPreview()
        };
        
        console.log('🧪 Pagination testing tools available:');
        console.log('   paginationTest.validate() - Run validation');
        console.log('   paginationTest.addContent(pageNum, content) - Add test content');
        console.log('   paginationTest.removeOverflow() - Auto-fix overflow');
        console.log('   paginationTest.generateReport() - Detailed report');
        console.log('   paginationTest.togglePreview() - Toggle print preview');
    }
    
    addTestContent(pageNumber, content) {
        const pages = document.querySelectorAll('.paper-page');
        const targetPage = pages[pageNumber - 1];
        
        if (!targetPage) {
            console.error(`Page ${pageNumber} not found`);
            return;
        }
        
        const testElement = document.createElement('div');
        testElement.className = 'test-content';
        testElement.textContent = content || 'Test content added for pagination testing';
        testElement.style.cssText = 'padding: 1rem; background: #fff3cd; border: 1px solid #ffeaa7; margin: 0.5rem 0;';
        
        targetPage.appendChild(testElement);
        
        setTimeout(() => this.validateAllPages(), 100);
    }
    
    removeOverflowContent() {
        const overflowPages = document.querySelectorAll('.pagination-overflow');
        let removedCount = 0;
        
        overflowPages.forEach(page => {
            const testContent = page.querySelectorAll('.test-content');
            if (testContent.length > 0) {
                testContent.forEach(el => el.remove());
                removedCount++;
            }
        });
        
        if (removedCount > 0) {
            console.log(`🧹 Removed test content from ${removedCount} pages`);
            setTimeout(() => this.validateAllPages(), 100);
        } else {
            console.log('ℹ️ No test content found to remove');
        }
    }
    
    showDetailedReport() {
        const results = this.validateAllPages();
        this.generateDetailedReport(results);
    }
    
    generateDetailedReport(results = null) {
        if (!results) results = this.validateAllPages();
        
        const reportWindow = window.open('', '_blank', 'width=800,height=600');
        const reportHTML = this.createReportHTML(results);
        
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
    }
    
    createReportHTML(results) {
        const timestamp = new Date().toLocaleString();
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Pagination Validation Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 2rem; }
                .header { background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 2rem; }
                .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
                .metric { background: white; padding: 1rem; border-radius: 8px; border-left: 4px solid #007bff; }
                .page-result { background: white; margin: 1rem 0; padding: 1rem; border-radius: 8px; border-left: 4px solid #28a745; }
                .page-result.warning { border-left-color: #ffc107; }
                .page-result.error { border-left-color: #dc3545; }
                .warnings, .errors { margin-top: 0.5rem; }
                .warnings li { color: #856404; }
                .errors li { color: #721c24; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📋 Pagination Validation Report</h1>
                <p><strong>Generated:</strong> ${timestamp}</p>
                <p><strong>Page Size:</strong> ${this.options.pageWidth}" × ${this.options.pageHeight}" (US Letter)</p>
                <p><strong>Content Area:</strong> ${this.contentWidth}" × ${this.contentHeight}"</p>
            </div>
            
            <div class="summary">
                <div class="metric">
                    <h3>📄 Total Pages</h3>
                    <div style="font-size: 2rem; font-weight: bold;">${results.length}</div>
                </div>
                <div class="metric">
                    <h3>✅ OK Pages</h3>
                    <div style="font-size: 2rem; font-weight: bold; color: #28a745;">${results.filter(r => r.status === 'ok').length}</div>
                </div>
                <div class="metric">
                    <h3>⚠️ Warnings</h3>
                    <div style="font-size: 2rem; font-weight: bold; color: #ffc107;">${results.filter(r => r.status === 'warning').length}</div>
                </div>
                <div class="metric">
                    <h3>❌ Overflow</h3>
                    <div style="font-size: 2rem; font-weight: bold; color: #dc3545;">${results.filter(r => r.status === 'overflow').length}</div>
                </div>
            </div>
            
            <h2>📊 Page Details</h2>
            ${results.map(result => `
                <div class="page-result ${result.status}">
                    <h3>Page ${result.pageNumber} - ${result.utilizationPercent}% Full</h3>
                    <p><strong>Status:</strong> ${result.status.toUpperCase()}</p>
                    <p><strong>Content Height:</strong> ${Math.round(result.contentHeight)}px / ${Math.round(result.maxHeight)}px</p>
                    
                    ${result.warnings.length > 0 ? `
                        <div class="warnings">
                            <strong>⚠️ Warnings:</strong>
                            <ul>${result.warnings.map(w => `<li>${w}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    
                    ${result.errors.length > 0 ? `
                        <div class="errors">
                            <strong>❌ Errors:</strong>
                            <ul>${result.errors.map(e => `<li>${e}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </body>
        </html>
        `;
    }
    
    togglePrintPreview() {
        document.body.classList.toggle('print-preview');
        console.log('🖨️ Print preview mode toggled');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.paginationValidator = new PaginationValidator();
    });
} else {
    window.paginationValidator = new PaginationValidator();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaginationValidator;
}