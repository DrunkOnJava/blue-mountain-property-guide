/**
 * Human-Readable Error Display System
 * Displays errors outside document rendering area in browser webpage view
 */

class ErrorDisplaySystem {
    constructor(options = {}) {
        this.options = {
            position: 'top-right', // top-right, top-left, bottom-right, bottom-left
            maxErrors: 50,
            autoHide: false,
            autoHideDelay: 10000,
            enableSound: false,
            enableNotifications: true,
            updateInterval: 2000,
            publicMode: true, // Always visible to all users
            startVisible: true, // Start in visible state
            ...options
        };
        
        this.errors = [];
        this.warnings = [];
        this.isVisible = true;
        this.updateTimer = null;
        
        this.init();
    }
    
    init() {
        this.createErrorConsole();
        this.startMonitoring();
        this.setupKeyboardShortcuts();
        
        console.log('🚨 Error Display System initialized');
        console.log('   Press Ctrl+E to toggle error console');
        console.log('   Press Ctrl+Shift+E to clear all errors');
    }
    
    createErrorConsole() {
        // Remove existing console if any
        const existing = document.getElementById('error-console');
        if (existing) {
            existing.remove();
        }
        
        const console = document.createElement('div');
        console.id = 'error-console';
        console.className = 'error-console';
        
        // Position based on options
        const positions = {
            'top-right': { top: '20px', right: '20px' },
            'top-left': { top: '20px', left: '20px' },
            'bottom-right': { bottom: '20px', right: '20px' },
            'bottom-left': { bottom: '20px', left: '20px' }
        };
        
        const position = positions[this.options.position] || positions['top-right'];
        
        console.style.cssText = `
            position: fixed;
            ${Object.entries(position).map(([key, value]) => `${key}: ${value}`).join('; ')};
            width: 400px;
            max-height: 60vh;
            background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
            border: 2px solid #dc3545;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(220, 53, 69, 0.2);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
            font-size: 12px;
            overflow: hidden;
            transform: translateX(${this.options.position.includes('right') ? '100%' : '-100%'});
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        `;
        
        console.innerHTML = `
            <div class="error-console-header">
                <div class="error-console-title">
                    <span class="error-icon">🚨</span>
                    <span class="error-title-text">Document Quality Monitor</span>
                    <span class="error-count-badge">0</span>
                </div>
                <div class="error-console-controls">
                    <button class="error-btn error-btn-clear" title="Clear all errors">🗑️</button>
                    <button class="error-btn error-btn-refresh" title="Refresh scan">🔄</button>
                    <button class="error-btn error-btn-report" title="Generate report">📊</button>
                    <button class="error-btn error-btn-minimize" title="Minimize console">➖</button>
                    <button class="error-btn error-btn-close" title="Close console">✖️</button>
                </div>
            </div>
            <div class="error-console-body">
                <div class="error-console-summary">
                    <div class="error-summary-item error-summary-errors">
                        <span class="error-summary-count">0</span>
                        <span class="error-summary-label">Errors</span>
                    </div>
                    <div class="error-summary-item error-summary-warnings">
                        <span class="error-summary-count">0</span>
                        <span class="error-summary-label">Warnings</span>
                    </div>
                    <div class="error-summary-item error-summary-images">
                        <span class="error-summary-count">0</span>
                        <span class="error-summary-label">Images</span>
                    </div>
                </div>
                <div class="error-console-content">
                    <div class="error-list"></div>
                </div>
            </div>
            <div class="error-console-footer">
                <div class="error-last-update">Last scan: Never</div>
                <div class="error-build-info">Build: <span id="build-hash">Unknown</span></div>
            </div>
        `;
        
        this.addErrorConsoleStyles();
        document.body.appendChild(console);
        
        // Add event listeners
        this.setupEventListeners(console);
        
        // Show console immediately if in public mode
        if (this.options.startVisible || this.options.publicMode) {
            setTimeout(() => {
                console.style.transform = 'translateX(0)';
            }, 100);
        }
        
        this.console = console;
    }
    
    addErrorConsoleStyles() {
        if (document.getElementById('error-console-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'error-console-styles';
        style.textContent = `
            .error-console-header {
                background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                color: white;
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.2);
            }
            
            .error-console-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
            }
            
            .error-icon {
                font-size: 16px;
                animation: errorPulse 2s infinite;
            }
            
            .error-title-text {
                font-size: 14px;
            }
            
            .error-count-badge {
                background: rgba(255,255,255,0.2);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: bold;
                min-width: 20px;
                text-align: center;
            }
            
            .error-console-controls {
                display: flex;
                gap: 4px;
            }
            
            .error-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 24px;
                height: 24px;
            }
            
            .error-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.05);
            }
            
            .error-console-body {
                max-height: 50vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .error-console-summary {
                background: #f8f9fa;
                padding: 12px 16px;
                display: flex;
                gap: 16px;
                border-bottom: 1px solid #e9ecef;
            }
            
            .error-summary-item {
                text-align: center;
                flex: 1;
            }
            
            .error-summary-count {
                display: block;
                font-size: 18px;
                font-weight: bold;
                line-height: 1;
            }
            
            .error-summary-errors .error-summary-count { color: #dc3545; }
            .error-summary-warnings .error-summary-count { color: #ffc107; }
            .error-summary-images .error-summary-count { color: #17a2b8; }
            
            .error-summary-label {
                display: block;
                font-size: 10px;
                color: #6c757d;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 2px;
            }
            
            .error-console-content {
                flex: 1;
                overflow-y: auto;
                padding: 8px;
            }
            
            .error-list {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            
            .error-item {
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                padding: 12px;
                border-left: 4px solid #dc3545;
                transition: all 0.2s;
                cursor: pointer;
            }
            
            .error-item:hover {
                border-color: #dc3545;
                box-shadow: 0 2px 8px rgba(220, 53, 69, 0.1);
                transform: translateY(-1px);
            }
            
            .error-item.warning {
                border-left-color: #ffc107;
            }
            
            .error-item.info {
                border-left-color: #17a2b8;
            }
            
            .error-item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 4px;
            }
            
            .error-item-type {
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .error-item-type.error { color: #dc3545; }
            .error-item-type.warning { color: #ffc107; }
            .error-item-type.info { color: #17a2b8; }
            
            .error-item-time {
                font-size: 10px;
                color: #6c757d;
            }
            
            .error-item-message {
                font-size: 12px;
                line-height: 1.4;
                color: #495057;
                margin-bottom: 4px;
            }
            
            .error-item-details {
                font-size: 10px;
                color: #6c757d;
                font-family: monospace;
                background: #f8f9fa;
                padding: 4px 8px;
                border-radius: 4px;
                margin-top: 4px;
                word-break: break-word;
            }
            
            .error-item-actions {
                display: flex;
                gap: 4px;
                margin-top: 8px;
            }
            
            .error-action-btn {
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                color: #495057;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 9px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .error-action-btn:hover {
                background: #e9ecef;
            }
            
            .error-console-footer {
                background: #f8f9fa;
                padding: 8px 16px;
                border-top: 1px solid #e9ecef;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 10px;
                color: #6c757d;
            }
            
            .error-last-update {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .error-build-info {
                font-family: monospace;
            }
            
            .error-console.minimized .error-console-body,
            .error-console.minimized .error-console-footer {
                display: none;
            }
            
            .error-console.hidden {
                transform: translateX(${this.options.position.includes('right') ? '100%' : '-100%'}) !important;
            }
            
            @keyframes errorPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            @keyframes errorSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .error-item {
                animation: errorSlideIn 0.3s ease-out;
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .error-console {
                    width: calc(100vw - 40px) !important;
                    left: 20px !important;
                    right: 20px !important;
                    max-width: none !important;
                }
            }
            
            /* Scrollbar styling */
            .error-console-content::-webkit-scrollbar {
                width: 6px;
            }
            
            .error-console-content::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 3px;
            }
            
            .error-console-content::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 3px;
            }
            
            .error-console-content::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupEventListeners(console) {
        // Header buttons
        console.querySelector('.error-btn-clear').addEventListener('click', () => {
            this.clearAllErrors();
        });
        
        console.querySelector('.error-btn-refresh').addEventListener('click', () => {
            this.refreshScan();
        });
        
        console.querySelector('.error-btn-report').addEventListener('click', () => {
            this.generateReport();
        });
        
        console.querySelector('.error-btn-minimize').addEventListener('click', () => {
            this.toggleMinimize();
        });
        
        console.querySelector('.error-btn-close').addEventListener('click', () => {
            this.hideConsole();
        });
        
        // Make console draggable
        this.makeDraggable(console);
    }
    
    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        const header = element.querySelector('.error-console-header');
        
        header.style.cursor = 'move';
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.error-btn')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = element.offsetLeft;
            startTop = element.offsetTop;
            
            element.style.transition = 'none';
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            element.style.left = (startLeft + deltaX) + 'px';
            element.style.top = (startTop + deltaY) + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        };
        
        const handleMouseUp = () => {
            isDragging = false;
            element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+E to toggle console
            if (e.ctrlKey && e.key === 'e' && !e.shiftKey) {
                e.preventDefault();
                this.toggleConsole();
            }
            
            // Ctrl+Shift+E to clear errors
            if (e.ctrlKey && e.shiftKey && e.key === 'E') {
                e.preventDefault();
                this.clearAllErrors();
            }
            
            // Ctrl+Shift+R to refresh scan
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.refreshScan();
            }
        });
    }
    
    startMonitoring() {
        // Initial scan
        this.scanForErrors();
        
        // Set up periodic scanning
        this.updateTimer = setInterval(() => {
            this.scanForErrors();
        }, this.options.updateInterval);
        
        // Monitor DOM changes
        if (window.MutationObserver) {
            this.observer = new MutationObserver((mutations) => {
                let shouldScan = false;
                
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || 
                        mutation.type === 'attributes' ||
                        (mutation.type === 'characterData' && mutation.target.nodeType === Node.TEXT_NODE)) {
                        shouldScan = true;
                    }
                });
                
                if (shouldScan) {
                    clearTimeout(this.scanTimeout);
                    this.scanTimeout = setTimeout(() => {
                        this.scanForErrors();
                    }, 1000);
                }
            });
            
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'style', 'class'],
                characterData: true
            });
        }
    }
    
    scanForErrors() {
        const newErrors = [];
        const newWarnings = [];
        
        // Scan for broken images
        this.scanBrokenImages(newErrors, newWarnings);
        
        // Scan for content overflow
        this.scanContentOverflow(newErrors, newWarnings);
        
        // Scan for page size issues
        this.scanPageSizeIssues(newErrors, newWarnings);
        
        // Scan for missing assets
        this.scanMissingAssets(newErrors, newWarnings);
        
        // Scan for accessibility issues
        this.scanAccessibilityIssues(newErrors, newWarnings);
        
        // Update error lists
        this.updateErrorLists(newErrors, newWarnings);
        
        // Update display
        this.updateDisplay();
        
        // Update last scan time
        this.updateLastScanTime();
    }
    
    scanBrokenImages(errors, warnings) {
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            const filename = img.src ? img.src.split('/').pop() : 'unknown';
            
            if (!img.src || img.src === window.location.href) {
                errors.push({
                    type: 'error',
                    category: 'image',
                    title: 'Missing Image Source',
                    message: `Image #${index + 1} has no src attribute`,
                    details: `Element: ${img.outerHTML.slice(0, 100)}...`,
                    element: img,
                    fix: 'Add a valid src attribute to the image'
                });
            } else if (img.complete && img.naturalHeight === 0) {
                errors.push({
                    type: 'error',
                    category: 'image',
                    title: 'Broken Image',
                    message: `Failed to load image: ${filename}`,
                    details: `Source: ${img.src}`,
                    element: img,
                    fix: 'Check if the image file exists and the path is correct'
                });
            } else if (img.complete && img.naturalWidth > 0) {
                // Check image size for print
                const rect = img.getBoundingClientRect();
                const maxWidth = 6.5 * 96; // 6.5 inches at 96 DPI
                const maxHeight = 4 * 96; // 4 inches at 96 DPI
                
                if (rect.width > maxWidth || rect.height > maxHeight) {
                    warnings.push({
                        type: 'warning',
                        category: 'image',
                        title: 'Image Too Large for Print',
                        message: `Image "${filename}" exceeds print dimensions`,
                        details: `Size: ${Math.round(rect.width)}×${Math.round(rect.height)}px (max: ${maxWidth}×${maxHeight}px)`,
                        element: img,
                        fix: 'Resize image or add CSS max-width/max-height constraints'
                    });
                }
            }
            
            // Check for missing alt text
            if (!img.hasAttribute('alt')) {
                warnings.push({
                    type: 'warning',
                    category: 'accessibility',
                    title: 'Missing Alt Text',
                    message: `Image "${filename}" has no alt attribute`,
                    details: 'Alt text is important for screen readers and accessibility',
                    element: img,
                    fix: 'Add an alt attribute describing the image content'
                });
            }
        });
    }
    
    scanContentOverflow(errors, warnings) {
        const pages = document.querySelectorAll('.paper-page');
        const maxHeight = 9.5 * 96; // 9.5 inches at 96 DPI
        
        pages.forEach((page, index) => {
            const rect = page.getBoundingClientRect();
            const pageNumber = index + 1;
            const utilizationPercent = Math.round((rect.height / maxHeight) * 100);
            
            if (rect.height > maxHeight) {
                errors.push({
                    type: 'error',
                    category: 'overflow',
                    title: 'Page Content Overflow',
                    message: `Page ${pageNumber} content overflows page boundaries`,
                    details: `Height: ${Math.round(rect.height)}px (${utilizationPercent}% of page)`,
                    element: page,
                    fix: 'Reduce content or split into multiple pages'
                });
            } else if (utilizationPercent > 90) {
                warnings.push({
                    type: 'warning',
                    category: 'overflow',
                    title: 'Page Nearly Full',
                    message: `Page ${pageNumber} is ${utilizationPercent}% full`,
                    details: `Height: ${Math.round(rect.height)}px (warning threshold: 90%)`,
                    element: page,
                    fix: 'Consider moving some content to the next page'
                });
            }
            
            // Check for large individual elements
            const largeElements = page.querySelectorAll('table, .large-content, .section-content');
            largeElements.forEach((element, elemIndex) => {
                const elemRect = element.getBoundingClientRect();
                const maxElementHeight = 8 * 96; // 8 inches
                
                if (elemRect.height > maxElementHeight) {
                    warnings.push({
                        type: 'warning',
                        category: 'overflow',
                        title: 'Large Content Block',
                        message: `Large element on page ${pageNumber} may cause page breaks`,
                        details: `Element height: ${Math.round(elemRect.height)}px (${element.tagName})`,
                        element: element,
                        fix: 'Consider breaking into smaller sections'
                    });
                }
            });
        });
    }
    
    scanPageSizeIssues(errors, warnings) {
        const pages = document.querySelectorAll('.paper-page');
        const expectedWidth = 8.5 * 96; // 8.5 inches at 96 DPI
        const expectedHeight = 9.5 * 96; // 9.5 inches (content area)
        const tolerance = 50; // 50px tolerance
        
        pages.forEach((page, index) => {
            const rect = page.getBoundingClientRect();
            const pageNumber = index + 1;
            
            // Check width
            if (Math.abs(rect.width - expectedWidth) > tolerance) {
                warnings.push({
                    type: 'warning',
                    category: 'page-size',
                    title: 'Incorrect Page Width',
                    message: `Page ${pageNumber} width doesn't match US Letter`,
                    details: `Width: ${Math.round(rect.width)}px (expected: ~${expectedWidth}px)`,
                    element: page,
                    fix: 'Check CSS width settings for .paper-page'
                });
            }
            
            // Check if page is too small
            if (rect.height < 200) {
                warnings.push({
                    type: 'warning',
                    category: 'page-size',
                    title: 'Page Too Small',
                    message: `Page ${pageNumber} appears to be empty or very small`,
                    details: `Height: ${Math.round(rect.height)}px`,
                    element: page,
                    fix: 'Add content or remove empty page'
                });
            }
        });
    }
    
    scanMissingAssets(errors, warnings) {
        // Check for missing CSS files
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach((link, index) => {
            if (link.href && !link.href.startsWith('data:')) {
                // We can't easily check if external CSS loaded, but we can check for 404s
                // This would require fetch requests which might have CORS issues
                // For now, just check if href is valid
                try {
                    new URL(link.href);
                } catch (e) {
                    errors.push({
                        type: 'error',
                        category: 'asset',
                        title: 'Invalid CSS URL',
                        message: `CSS link #${index + 1} has invalid URL`,
                        details: `URL: ${link.href}`,
                        element: link,
                        fix: 'Check the CSS file path and ensure it exists'
                    });
                }
            }
        });
        
        // Check for missing fonts
        const computedStyles = getComputedStyle(document.body);
        const fontFamily = computedStyles.fontFamily;
        
        if (fontFamily.includes('serif') && !fontFamily.includes('Roboto')) {
            warnings.push({
                type: 'warning',
                category: 'asset',
                title: 'Font Fallback Detected',
                message: 'Custom fonts may not have loaded properly',
                details: `Current font: ${fontFamily}`,
                element: document.body,
                fix: 'Check if Google Fonts or custom fonts are loading correctly'
            });
        }
    }
    
    scanAccessibilityIssues(errors, warnings) {
        // Check heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let currentLevel = 0;
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            
            if (index === 0 && level !== 1) {
                warnings.push({
                    type: 'warning',
                    category: 'accessibility',
                    title: 'Heading Hierarchy Issue',
                    message: 'Document should start with h1',
                    details: `First heading is: ${heading.tagName}`,
                    element: heading,
                    fix: 'Start document with an h1 heading'
                });
            } else if (level > currentLevel + 1) {
                warnings.push({
                    type: 'warning',
                    category: 'accessibility',
                    title: 'Heading Level Skip',
                    message: `Heading level skips from h${currentLevel} to h${level}`,
                    details: `Heading text: "${heading.textContent.slice(0, 50)}..."`,
                    element: heading,
                    fix: 'Use sequential heading levels (h1, h2, h3...)'
                });
            }
            
            currentLevel = level;
        });
        
        // Check for sufficient color contrast (simplified)
        const coloredElements = document.querySelectorAll('[style*="color"], .text-danger, .text-warning');
        coloredElements.forEach((element, index) => {
            const style = getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            // Simple check for very light text
            if (color.includes('rgb(') && this.isColorTooLight(color)) {
                warnings.push({
                    type: 'warning',
                    category: 'accessibility',
                    title: 'Low Color Contrast',
                    message: 'Text color may be too light for good readability',
                    details: `Color: ${color}`,
                    element: element,
                    fix: 'Use darker colors for better contrast'
                });
            }
        });
    }
    
    isColorTooLight(color) {
        const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgb) {
            const [, r, g, b] = rgb.map(Number);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 200;
        }
        return false;
    }
    
    updateErrorLists(newErrors, newWarnings) {
        // Add timestamps
        const timestamp = new Date();
        newErrors.forEach(error => error.timestamp = timestamp);
        newWarnings.forEach(warning => warning.timestamp = timestamp);
        
        // Remove duplicates and add new errors
        this.errors = this.removeDuplicates([...this.errors, ...newErrors]);
        this.warnings = this.removeDuplicates([...this.warnings, ...newWarnings]);
        
        // Limit total errors
        if (this.errors.length > this.options.maxErrors) {
            this.errors = this.errors.slice(-this.options.maxErrors);
        }
        if (this.warnings.length > this.options.maxErrors) {
            this.warnings = this.warnings.slice(-this.options.maxErrors);
        }
    }
    
    removeDuplicates(errorList) {
        const seen = new Set();
        return errorList.filter(error => {
            const key = `${error.type}-${error.title}-${error.message}`;
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    }
    
    updateDisplay() {
        if (!this.console) return;
        
        // Update counts
        const totalErrors = this.errors.length;
        const totalWarnings = this.warnings.length;
        const totalImages = document.querySelectorAll('img').length;
        const brokenImages = this.errors.filter(e => e.category === 'image').length;
        
        this.console.querySelector('.error-count-badge').textContent = totalErrors + totalWarnings;
        this.console.querySelector('.error-summary-errors .error-summary-count').textContent = totalErrors;
        this.console.querySelector('.error-summary-warnings .error-summary-count').textContent = totalWarnings;
        this.console.querySelector('.error-summary-images .error-summary-count').textContent = `${brokenImages}/${totalImages}`;
        
        // Update error list
        const errorList = this.console.querySelector('.error-list');
        errorList.innerHTML = '';
        
        // Combine and sort errors by timestamp (newest first)
        const allIssues = [...this.errors, ...this.warnings]
            .sort((a, b) => b.timestamp - a.timestamp);
        
        allIssues.forEach((issue, index) => {
            const errorItem = this.createErrorItem(issue, index);
            errorList.appendChild(errorItem);
        });
        
        // Update console visibility based on error count
        if (totalErrors > 0) {
            this.console.style.borderColor = '#dc3545';
            this.console.querySelector('.error-icon').textContent = '🚨';
        } else if (totalWarnings > 0) {
            this.console.style.borderColor = '#ffc107';
            this.console.querySelector('.error-icon').textContent = '⚠️';
        } else {
            this.console.style.borderColor = '#28a745';
            this.console.querySelector('.error-icon').textContent = '✅';
        }
        
        // Show notification for new critical errors
        if (this.options.enableNotifications && totalErrors > 0) {
            this.showNotification(totalErrors, totalWarnings);
        }
    }
    
    createErrorItem(issue, index) {
        const item = document.createElement('div');
        item.className = `error-item ${issue.type}`;
        
        const timeStr = issue.timestamp.toLocaleTimeString();
        
        item.innerHTML = `
            <div class="error-item-header">
                <span class="error-item-type ${issue.type}">${issue.type}</span>
                <span class="error-item-time">${timeStr}</span>
            </div>
            <div class="error-item-message">${issue.title}: ${issue.message}</div>
            <div class="error-item-details">${issue.details}</div>
            <div class="error-item-actions">
                <button class="error-action-btn" onclick="window.errorDisplay.scrollToElement(${index})">Locate</button>
                <button class="error-action-btn" onclick="window.errorDisplay.dismissError(${index})">Dismiss</button>
                ${issue.fix ? `<button class="error-action-btn" title="${issue.fix}">Fix Info</button>` : ''}
            </div>
        `;
        
        // Click to highlight element
        item.addEventListener('click', () => {
            this.highlightElement(issue.element);
        });
        
        return item;
    }
    
    highlightElement(element) {
        if (!element || !element.scrollIntoView) return;
        
        // Remove previous highlights
        document.querySelectorAll('.error-highlight').forEach(el => {
            el.classList.remove('error-highlight');
        });
        
        // Add highlight to element
        element.classList.add('error-highlight');
        
        // Scroll to element
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
        });
        
        // Add highlight styles if not already added
        this.addHighlightStyles();
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            element.classList.remove('error-highlight');
        }, 3000);
    }
    
    addHighlightStyles() {
        if (document.getElementById('error-highlight-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'error-highlight-styles';
        style.textContent = `
            .error-highlight {
                outline: 3px solid #dc3545 !important;
                outline-offset: 2px !important;
                background-color: rgba(220, 53, 69, 0.1) !important;
                animation: errorHighlight 1s ease-in-out !important;
            }
            
            @keyframes errorHighlight {
                0%, 100% { outline-color: #dc3545; }
                50% { outline-color: #ffc107; }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    scrollToElement(index) {
        const allIssues = [...this.errors, ...this.warnings]
            .sort((a, b) => b.timestamp - a.timestamp);
        
        if (allIssues[index]) {
            this.highlightElement(allIssues[index].element);
        }
    }
    
    dismissError(index) {
        const allIssues = [...this.errors, ...this.warnings]
            .sort((a, b) => b.timestamp - a.timestamp);
        
        if (allIssues[index]) {
            const issue = allIssues[index];
            
            if (issue.type === 'error') {
                this.errors = this.errors.filter(e => e !== issue);
            } else {
                this.warnings = this.warnings.filter(w => w !== issue);
            }
            
            this.updateDisplay();
        }
    }
    
    updateLastScanTime() {
        const lastUpdate = this.console?.querySelector('.error-last-update');
        if (lastUpdate) {
            lastUpdate.textContent = `Last scan: ${new Date().toLocaleTimeString()}`;
        }
    }
    
    showNotification(errorCount, warningCount) {
        if (!('Notification' in window)) return;
        
        if (Notification.permission === 'granted') {
            new Notification('Document Errors Detected', {
                body: `${errorCount} errors, ${warningCount} warnings found`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text y="18" font-size="18">🚨</text></svg>',
                tag: 'pagination-errors'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showNotification(errorCount, warningCount);
                }
            });
        }
    }
    
    // Public methods
    clearAllErrors() {
        this.errors = [];
        this.warnings = [];
        this.updateDisplay();
        console.log('🧹 All errors cleared');
    }
    
    refreshScan() {
        console.log('🔄 Refreshing error scan...');
        this.scanForErrors();
    }
    
    toggleConsole() {
        if (this.isVisible) {
            this.hideConsole();
        } else {
            this.showConsole();
        }
    }
    
    hideConsole() {
        if (this.console) {
            this.console.classList.add('hidden');
            this.isVisible = false;
        }
    }
    
    showConsole() {
        if (this.console) {
            this.console.classList.remove('hidden');
            this.isVisible = true;
        }
    }
    
    toggleMinimize() {
        if (this.console) {
            this.console.classList.toggle('minimized');
            const btn = this.console.querySelector('.error-btn-minimize');
            btn.textContent = this.console.classList.contains('minimized') ? '➕' : '➖';
        }
    }
    
    generateReport() {
        console.log('📊 Generating error report...');
        
        const timestamp = new Date().toLocaleString();
        const totalErrors = this.errors.length;
        const totalWarnings = this.warnings.length;
        
        const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Error Report - ${timestamp}</title>
            <meta charset="UTF-8">
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 2rem; }
                .header { background: #dc3545; color: white; padding: 2rem; border-radius: 8px; }
                .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
                .metric { background: #f8f9fa; padding: 1rem; border-radius: 8px; text-align: center; }
                .metric h3 { margin: 0; color: #6c757d; }
                .metric .value { font-size: 2rem; font-weight: bold; }
                .errors .value { color: #dc3545; }
                .warnings .value { color: #ffc107; }
                .issue { background: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 1rem; margin: 1rem 0; }
                .issue.error { border-left: 4px solid #dc3545; }
                .issue.warning { border-left: 4px solid #ffc107; }
                .issue-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
                .issue-type { font-weight: bold; text-transform: uppercase; font-size: 0.8rem; }
                .issue-type.error { color: #dc3545; }
                .issue-type.warning { color: #ffc107; }
                .issue-message { font-size: 1.1rem; margin-bottom: 0.5rem; }
                .issue-details { color: #6c757d; font-family: monospace; font-size: 0.9rem; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🚨 Document Error Report</h1>
                <p>Generated: ${timestamp}</p>
            </div>
            
            <div class="summary">
                <div class="metric errors">
                    <h3>Errors</h3>
                    <div class="value">${totalErrors}</div>
                </div>
                <div class="metric warnings">
                    <h3>Warnings</h3>
                    <div class="value">${totalWarnings}</div>
                </div>
                <div class="metric">
                    <h3>Total Issues</h3>
                    <div class="value">${totalErrors + totalWarnings}</div>
                </div>
            </div>
            
            <h2>Issues Found</h2>
            ${[...this.errors, ...this.warnings]
                .sort((a, b) => b.timestamp - a.timestamp)
                .map(issue => `
                    <div class="issue ${issue.type}">
                        <div class="issue-header">
                            <span class="issue-type ${issue.type}">${issue.type}</span>
                            <span>${issue.timestamp.toLocaleTimeString()}</span>
                        </div>
                        <div class="issue-message">${issue.title}: ${issue.message}</div>
                        <div class="issue-details">${issue.details}</div>
                        ${issue.fix ? `<div class="issue-fix"><strong>Fix:</strong> ${issue.fix}</div>` : ''}
                    </div>
                `).join('')}
        </body>
        </html>
        `;
        
        const reportWindow = window.open('', '_blank', 'width=1000,height=700');
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
    }
    
    getBuildInfo() {
        // Try to get build info from various sources
        const buildInfo = {
            hash: 'unknown',
            timestamp: new Date().toISOString(),
            branch: 'unknown'
        };
        
        // Check for meta tags
        const buildMeta = document.querySelector('meta[name="build"]');
        if (buildMeta) {
            buildInfo.hash = buildMeta.getAttribute('content');
        }
        
        // Check for git info in scripts
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const content = script.textContent;
            if (content.includes('BUILD_HASH') || content.includes('GIT_HASH')) {
                const match = content.match(/(?:BUILD_HASH|GIT_HASH)['"]?\s*[:=]\s*['"]?([a-f0-9]+)['"]?/i);
                if (match) {
                    buildInfo.hash = match[1];
                }
            }
        });
        
        return buildInfo;
    }
    
    updateBuildInfo() {
        const buildInfo = this.getBuildInfo();
        const buildElement = this.console?.querySelector('#build-hash');
        if (buildElement) {
            buildElement.textContent = buildInfo.hash.slice(0, 8);
            buildElement.title = `Full hash: ${buildInfo.hash}\nTimestamp: ${buildInfo.timestamp}`;
        }
    }
    
    destroy() {
        // Clean up
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.console) {
            this.console.remove();
        }
        
        // Remove styles
        const styles = document.getElementById('error-console-styles');
        if (styles) styles.remove();
        
        const highlightStyles = document.getElementById('error-highlight-styles');
        if (highlightStyles) highlightStyles.remove();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.errorDisplay = new ErrorDisplaySystem();
        
        // Update build info
        window.errorDisplay.updateBuildInfo();
    });
} else {
    window.errorDisplay = new ErrorDisplaySystem();
    window.errorDisplay.updateBuildInfo();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorDisplaySystem;
}