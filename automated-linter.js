/**
 * Automated Linting System
 * Comprehensive code quality checking with real-time feedback
 */

class AutomatedLinter {
    constructor(options = {}) {
        this.options = {
            enableHTMLLinting: true,
            enableCSSLinting: true,
            enableJSLinting: true,
            enableAccessibilityLinting: true,
            enablePerformanceLinting: true,
            autoFix: false,
            verboseLogging: true,
            realTimeChecking: true,
            ...options
        };
        
        this.results = {
            htmlIssues: [],
            cssIssues: [],
            jsIssues: [],
            accessibilityIssues: [],
            performanceIssues: [],
            fixes: [],
            stats: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                infos: 0
            }
        };
        
        this.rules = this.initializeRules();
        this.init();
    }
    
    initializeRules() {
        return {
            html: [
                {
                    id: 'missing-alt-text',
                    severity: 'error',
                    description: 'Images must have alt attributes',
                    check: (element) => element.tagName === 'IMG' && !element.hasAttribute('alt'),
                    fix: (element) => element.setAttribute('alt', 'Image description needed'),
                    message: (element) => `Image missing alt text: ${element.src.split('/').pop()}`
                },
                {
                    id: 'empty-headings',
                    severity: 'error',
                    description: 'Headings should not be empty',
                    check: (element) => /^H[1-6]$/.test(element.tagName) && !element.textContent.trim(),
                    message: (element) => `Empty ${element.tagName} heading found`
                },
                {
                    id: 'missing-page-lang',
                    severity: 'warning',
                    description: 'HTML should have lang attribute',
                    check: () => !document.documentElement.hasAttribute('lang'),
                    fix: () => document.documentElement.setAttribute('lang', 'en'),
                    message: () => 'Missing lang attribute on html element'
                },
                {
                    id: 'duplicate-ids',
                    severity: 'error',
                    description: 'IDs must be unique',
                    check: this.checkDuplicateIds.bind(this),
                    message: (element) => `Duplicate ID found: ${element.id}`
                },
                {
                    id: 'broken-links',
                    severity: 'warning',
                    description: 'Links should be valid',
                    check: (element) => element.tagName === 'A' && element.href && element.href.startsWith('#') && !document.getElementById(element.href.substring(1)),
                    message: (element) => `Broken internal link: ${element.href}`
                }
            ],
            css: [
                {
                    id: 'missing-print-styles',
                    severity: 'warning',
                    description: 'Print styles should be defined',
                    check: this.checkPrintStyles.bind(this),
                    message: () => 'No print media queries found'
                },
                {
                    id: 'color-contrast',
                    severity: 'warning',
                    description: 'Text should have sufficient color contrast',
                    check: this.checkColorContrast.bind(this),
                    message: (element) => `Low color contrast detected on ${element.tagName}`
                },
                {
                    id: 'font-size-too-small',
                    severity: 'warning',
                    description: 'Font size should be readable',
                    check: (element) => {
                        const style = getComputedStyle(element);
                        const fontSize = parseFloat(style.fontSize);
                        return fontSize < 10; // Less than 10px
                    },
                    message: (element) => `Font size too small: ${getComputedStyle(element).fontSize}`
                }
            ],
            accessibility: [
                {
                    id: 'heading-hierarchy',
                    severity: 'warning',
                    description: 'Heading levels should be sequential',
                    check: this.checkHeadingHierarchy.bind(this),
                    message: (issue) => `Heading hierarchy violation: ${issue.message}`
                },
                {
                    id: 'focus-indicators',
                    severity: 'warning',
                    description: 'Interactive elements should have focus indicators',
                    check: this.checkFocusIndicators.bind(this),
                    message: (element) => `Missing focus indicator on ${element.tagName}`
                },
                {
                    id: 'aria-labels',
                    severity: 'info',
                    description: 'Complex elements should have ARIA labels',
                    check: (element) => {
                        const complexElements = ['DIV', 'SPAN'];
                        return complexElements.includes(element.tagName) && 
                               element.onclick && 
                               !element.getAttribute('aria-label') && 
                               !element.getAttribute('aria-labelledby');
                    },
                    message: (element) => `Interactive element missing ARIA label`
                }
            ],
            performance: [
                {
                    id: 'large-images',
                    severity: 'warning',
                    description: 'Images should be optimized for web',
                    check: this.checkLargeImages.bind(this),
                    message: (element) => `Large image detected: ${element.src.split('/').pop()} (${Math.round(element.fileSize / 1024)}KB)`
                },
                {
                    id: 'unused-css',
                    severity: 'info',
                    description: 'CSS should be optimized',
                    check: this.checkUnusedCSS.bind(this),
                    message: (selector) => `Potentially unused CSS selector: ${selector}`
                },
                {
                    id: 'inline-styles',
                    severity: 'info',
                    description: 'Prefer external stylesheets over inline styles',
                    check: (element) => element.hasAttribute('style') && element.getAttribute('style').length > 50,
                    message: (element) => `Large inline style detected on ${element.tagName}`
                }
            ]
        };
    }
    
    init() {
        this.log('🔍 Initializing Automated Linting System');
        this.log(`   HTML Linting: ${this.options.enableHTMLLinting}`);
        this.log(`   CSS Linting: ${this.options.enableCSSLinting}`);
        this.log(`   JS Linting: ${this.options.enableJSLinting}`);
        this.log(`   Accessibility: ${this.options.enableAccessibilityLinting}`);
        this.log(`   Performance: ${this.options.enablePerformanceLinting}`);
        
        // Create interface
        this.createLinterInterface();
        
        // Start real-time checking if enabled
        if (this.options.realTimeChecking) {
            this.startRealTimeChecking();
        }
        
        // Run initial lint
        this.runFullLint();
    }
    
    createLinterInterface() {
        const existingInterface = document.getElementById('linter-interface');
        if (existingInterface) {
            existingInterface.remove();
        }
        
        const linterInterface = document.createElement('div');
        linterInterface.id = 'linter-interface';
        linterInterface.innerHTML = `
            <style>
                #linter-interface {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 400px;
                    max-height: 70vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    z-index: 999997;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
                    color: white;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .linter-header {
                    background: rgba(255,255,255,0.1);
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .linter-title {
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .linter-score {
                    background: rgba(255,255,255,0.2);
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: bold;
                }
                
                .linter-controls {
                    display: flex;
                    gap: 8px;
                }
                
                .linter-btn {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s;
                }
                
                .linter-btn:hover {
                    background: rgba(255,255,255,0.3);
                }
                
                .linter-body {
                    max-height: 50vh;
                    overflow-y: auto;
                    padding: 16px 20px;
                }
                
                .linter-stats {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                    margin-bottom: 16px;
                }
                
                .stat-item {
                    background: rgba(255,255,255,0.1);
                    padding: 8px;
                    border-radius: 6px;
                    text-align: center;
                }
                
                .stat-value {
                    font-size: 16px;
                    font-weight: bold;
                    display: block;
                }
                
                .stat-label {
                    font-size: 9px;
                    opacity: 0.8;
                    text-transform: uppercase;
                }
                
                .linter-issues {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                
                .lint-issue {
                    background: rgba(255,255,255,0.1);
                    border-radius: 6px;
                    padding: 10px;
                    border-left: 3px solid #e74c3c;
                    font-size: 11px;
                    line-height: 1.3;
                }
                
                .lint-issue.warning {
                    border-left-color: #f39c12;
                }
                
                .lint-issue.info {
                    border-left-color: #3498db;
                }
                
                .lint-issue.success {
                    border-left-color: #2ecc71;
                }
                
                .issue-header {
                    font-weight: 600;
                    margin-bottom: 3px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .issue-details {
                    opacity: 0.9;
                    font-size: 10px;
                }
                
                .fix-btn {
                    background: #2ecc71;
                    color: white;
                    border: none;
                    padding: 3px 6px;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 8px;
                }
                
                .minimized .linter-body {
                    display: none;
                }
                
                .hidden {
                    transform: translateY(120%);
                }
                
                .real-time-indicator {
                    width: 8px;
                    height: 8px;
                    background: #2ecc71;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            </style>
            
            <div class="linter-header">
                <div class="linter-title">
                    <span>🔍</span>
                    <span>Code Linter</span>
                    ${this.options.realTimeChecking ? '<div class="real-time-indicator"></div>' : ''}
                </div>
                <div class="linter-score" id="linter-score">Score: 100</div>
                <div class="linter-controls">
                    <button class="linter-btn" onclick="linter.runFullLint()">Scan</button>
                    <button class="linter-btn" onclick="linter.autoFixIssues()">Fix</button>
                    <button class="linter-btn" onclick="linter.toggleMinimize()">−</button>
                    <button class="linter-btn" onclick="linter.hide()">×</button>
                </div>
            </div>
            
            <div class="linter-body">
                <div class="linter-stats">
                    <div class="stat-item">
                        <span class="stat-value" id="total-issues">0</span>
                        <span class="stat-label">Issues</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="error-count">0</span>
                        <span class="stat-label">Errors</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="warning-count">0</span>
                        <span class="stat-label">Warnings</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value" id="info-count">0</span>
                        <span class="stat-label">Info</span>
                    </div>
                </div>
                
                <div class="linter-issues" id="linter-issues">
                    <div class="lint-issue success">
                        <div class="issue-header">Linter Ready</div>
                        <div class="issue-details">Click "Scan" to check code quality</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(linterInterface);
        this.interface = linterInterface;
    }
    
    runFullLint() {
        this.log('🔍 Running comprehensive code lint...');
        this.clearResults();
        
        if (this.options.enableHTMLLinting) {
            this.lintHTML();
        }
        
        if (this.options.enableCSSLinting) {
            this.lintCSS();
        }
        
        if (this.options.enableAccessibilityLinting) {
            this.lintAccessibility();
        }
        
        if (this.options.enablePerformanceLinting) {
            this.lintPerformance();
        }
        
        this.updateStats();
        this.displayResults();
        this.updateScore();
        
        this.log(`✅ Lint complete: ${this.results.stats.totalIssues} issues found`);
    }
    
    lintHTML() {
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            this.rules.html.forEach(rule => {
                if (rule.check(element)) {
                    this.addIssue('html', rule, element);
                }
            });
        });
        
        // Run document-level checks
        this.rules.html.forEach(rule => {
            if (rule.id === 'missing-page-lang' && rule.check()) {
                this.addIssue('html', rule, document.documentElement);
            }
        });
    }
    
    lintCSS() {
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            this.rules.css.forEach(rule => {
                if (rule.check(element)) {
                    this.addIssue('css', rule, element);
                }
            });
        });
        
        // Check for print styles
        if (this.rules.css.find(r => r.id === 'missing-print-styles').check()) {
            this.addIssue('css', this.rules.css.find(r => r.id === 'missing-print-styles'), null);
        }
    }
    
    lintAccessibility() {
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            this.rules.accessibility.forEach(rule => {
                if (rule.check(element)) {
                    this.addIssue('accessibility', rule, element);
                }
            });
        });
        
        // Check heading hierarchy
        const headingIssues = this.checkHeadingHierarchy();
        headingIssues.forEach(issue => {
            this.addIssue('accessibility', this.rules.accessibility.find(r => r.id === 'heading-hierarchy'), issue);
        });
    }
    
    lintPerformance() {
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            this.rules.performance.forEach(rule => {
                if (rule.check(element)) {
                    this.addIssue('performance', rule, element);
                }
            });
        });
    }
    
    addIssue(category, rule, element) {
        const issue = {
            category,
            ruleId: rule.id,
            severity: rule.severity,
            description: rule.description,
            message: rule.message(element),
            element,
            fix: rule.fix,
            timestamp: new Date()
        };
        
        this.results[category + 'Issues'].push(issue);
        this.results.stats.totalIssues++;
        this.results.stats[rule.severity + 's'] = (this.results.stats[rule.severity + 's'] || 0) + 1;
    }
    
    // Rule implementation methods
    checkDuplicateIds() {
        const ids = new Set();
        const duplicates = [];
        
        document.querySelectorAll('[id]').forEach(element => {
            if (ids.has(element.id)) {
                duplicates.push(element);
            } else {
                ids.add(element.id);
            }
        });
        
        return duplicates;
    }
    
    checkPrintStyles() {
        const stylesheets = Array.from(document.styleSheets);
        
        for (const sheet of stylesheets) {
            try {
                const rules = Array.from(sheet.cssRules || sheet.rules || []);
                for (const rule of rules) {
                    if (rule.type === CSSRule.MEDIA_RULE && rule.media.mediaText.includes('print')) {
                        return false; // Print styles found
                    }
                }
            } catch (e) {
                // Can't access stylesheet (CORS)
                continue;
            }
        }
        
        return true; // No print styles found
    }
    
    checkColorContrast(element) {
        const style = getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Simple contrast check (basic implementation)
        if (this.isColorTooLight(color) && this.isColorTooLight(backgroundColor)) {
            return true;
        }
        
        return false;
    }
    
    isColorTooLight(color) {
        if (color.includes('rgb(')) {
            const rgb = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgb) {
                const [, r, g, b] = rgb.map(Number);
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness > 200;
            }
        }
        return false;
    }
    
    checkHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const issues = [];
        let currentLevel = 0;
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            
            if (index === 0 && level !== 1) {
                issues.push({
                    element: heading,
                    message: 'Document should start with h1'
                });
            } else if (level > currentLevel + 1) {
                issues.push({
                    element: heading,
                    message: `Heading level skips from h${currentLevel} to h${level}`
                });
            }
            
            currentLevel = level;
        });
        
        return issues;
    }
    
    checkFocusIndicators(element) {
        const focusableElements = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
        if (!focusableElements.includes(element.tagName)) return false;
        
        const style = getComputedStyle(element, ':focus');
        const outline = style.outline;
        const outlineWidth = style.outlineWidth;
        
        return outline === 'none' || outlineWidth === '0px';
    }
    
    checkLargeImages(element) {
        if (element.tagName !== 'IMG') return false;
        
        // Estimate file size based on dimensions (rough approximation)
        const width = element.naturalWidth || element.width;
        const height = element.naturalHeight || element.height;
        const estimatedSize = width * height * 3; // RGB bytes
        
        element.fileSize = estimatedSize; // Store for reporting
        
        return estimatedSize > 500000; // > 500KB estimated
    }
    
    checkUnusedCSS() {
        // Basic implementation - check for selectors that don't match any elements
        const unusedSelectors = [];
        
        try {
            const stylesheets = Array.from(document.styleSheets);
            
            for (const sheet of stylesheets) {
                const rules = Array.from(sheet.cssRules || sheet.rules || []);
                
                for (const rule of rules) {
                    if (rule.type === CSSRule.STYLE_RULE) {
                        const selector = rule.selectorText;
                        
                        if (selector && !selector.includes(':') && !selector.includes('@')) {
                            try {
                                if (document.querySelectorAll(selector).length === 0) {
                                    unusedSelectors.push(selector);
                                }
                            } catch (e) {
                                // Invalid selector
                            }
                        }
                    }
                }
            }
        } catch (e) {
            // Can't access stylesheets
        }
        
        return unusedSelectors.slice(0, 10); // Limit to first 10
    }
    
    autoFixIssues() {
        this.log('🔧 Auto-fixing issues...');
        let fixedCount = 0;
        
        const allIssues = [
            ...this.results.htmlIssues,
            ...this.results.cssIssues,
            ...this.results.accessibilityIssues,
            ...this.results.performanceIssues
        ];
        
        allIssues.forEach(issue => {
            if (issue.fix) {
                try {
                    issue.fix(issue.element);
                    this.results.fixes.push(issue);
                    fixedCount++;
                } catch (error) {
                    this.log(`❌ Failed to fix ${issue.ruleId}: ${error.message}`);
                }
            }
        });
        
        this.log(`✅ Fixed ${fixedCount} issues`);
        
        // Re-run lint to update results
        setTimeout(() => this.runFullLint(), 500);
    }
    
    startRealTimeChecking() {
        // Set up mutation observer for real-time checking
        if (window.MutationObserver) {
            this.observer = new MutationObserver(() => {
                clearTimeout(this.realtimeTimer);
                this.realtimeTimer = setTimeout(() => {
                    this.runFullLint();
                }, 2000); // Debounce for 2 seconds
            });
            
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'id', 'style', 'src', 'href']
            });
        }
    }
    
    updateStats() {
        document.getElementById('total-issues').textContent = this.results.stats.totalIssues;
        document.getElementById('error-count').textContent = this.results.stats.errors || 0;
        document.getElementById('warning-count').textContent = this.results.stats.warnings || 0;
        document.getElementById('info-count').textContent = this.results.stats.infos || 0;
    }
    
    updateScore() {
        const totalPossibleScore = 100;
        const errorPenalty = 10;
        const warningPenalty = 5;
        const infoPenalty = 1;
        
        const deductions = 
            (this.results.stats.errors || 0) * errorPenalty +
            (this.results.stats.warnings || 0) * warningPenalty +
            (this.results.stats.infos || 0) * infoPenalty;
        
        const score = Math.max(0, totalPossibleScore - deductions);
        
        document.getElementById('linter-score').textContent = `Score: ${score}`;
        
        // Update score color
        const scoreElement = document.getElementById('linter-score');
        if (score >= 90) {
            scoreElement.style.background = 'rgba(46, 204, 113, 0.8)';
        } else if (score >= 70) {
            scoreElement.style.background = 'rgba(243, 156, 18, 0.8)';
        } else {
            scoreElement.style.background = 'rgba(231, 76, 60, 0.8)';
        }
    }
    
    displayResults() {
        const issuesContainer = document.getElementById('linter-issues');
        issuesContainer.innerHTML = '';
        
        const allIssues = [
            ...this.results.htmlIssues,
            ...this.results.cssIssues,
            ...this.results.accessibilityIssues,
            ...this.results.performanceIssues
        ].sort((a, b) => {
            const severityOrder = { error: 0, warning: 1, info: 2 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        });
        
        if (allIssues.length === 0) {
            issuesContainer.innerHTML = `
                <div class="lint-issue success">
                    <div class="issue-header">✅ No issues found</div>
                    <div class="issue-details">Code quality looks good!</div>
                </div>
            `;
            return;
        }
        
        // Show top 10 issues to avoid overwhelming UI
        allIssues.slice(0, 10).forEach((issue, index) => {
            const item = this.createIssueItem(issue, index);
            issuesContainer.appendChild(item);
        });
        
        if (allIssues.length > 10) {
            const moreItem = document.createElement('div');
            moreItem.className = 'lint-issue info';
            moreItem.innerHTML = `
                <div class="issue-header">+ ${allIssues.length - 10} more issues</div>
                <div class="issue-details">Use browser console for full details</div>
            `;
            issuesContainer.appendChild(moreItem);
        }
    }
    
    createIssueItem(issue, index) {
        const item = document.createElement('div');
        item.className = `lint-issue ${issue.severity}`;
        
        const severityIcon = {
            error: '🔴',
            warning: '🟡',
            info: '🔵'
        }[issue.severity] || '⚪';
        
        const fixButton = issue.fix ? 
            `<button class="fix-btn" onclick="linter.fixSingleIssue(${index})">Fix</button>` : '';
        
        item.innerHTML = `
            <div class="issue-header">
                <span>${severityIcon} ${issue.ruleId}</span>
                ${fixButton}
            </div>
            <div class="issue-details">
                ${issue.message}
            </div>
        `;
        
        return item;
    }
    
    fixSingleIssue(index) {
        const allIssues = [
            ...this.results.htmlIssues,
            ...this.results.cssIssues,
            ...this.results.accessibilityIssues,
            ...this.results.performanceIssues
        ];
        
        const issue = allIssues[index];
        if (issue && issue.fix) {
            try {
                issue.fix(issue.element);
                this.results.fixes.push(issue);
                
                // Re-run lint after short delay
                setTimeout(() => this.runFullLint(), 500);
            } catch (error) {
                this.log(`❌ Failed to fix issue: ${error.message}`);
            }
        }
    }
    
    clearResults() {
        this.results = {
            htmlIssues: [],
            cssIssues: [],
            jsIssues: [],
            accessibilityIssues: [],
            performanceIssues: [],
            fixes: [],
            stats: {
                totalIssues: 0,
                errors: 0,
                warnings: 0,
                infos: 0
            }
        };
    }
    
    toggleMinimize() {
        this.interface.classList.toggle('minimized');
        const btn = this.interface.querySelector('.linter-controls .linter-btn:nth-child(3)');
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
                totalIssues: this.results.stats.totalIssues,
                errors: this.results.stats.errors || 0,
                warnings: this.results.stats.warnings || 0,
                infos: this.results.stats.infos || 0,
                fixesApplied: this.results.fixes.length
            },
            details: {
                htmlIssues: this.results.htmlIssues.length,
                cssIssues: this.results.cssIssues.length,
                accessibilityIssues: this.results.accessibilityIssues.length,
                performanceIssues: this.results.performanceIssues.length,
                topIssues: [
                    ...this.results.htmlIssues,
                    ...this.results.cssIssues,
                    ...this.results.accessibilityIssues,
                    ...this.results.performanceIssues
                ].slice(0, 20).map(issue => ({
                    category: issue.category,
                    severity: issue.severity,
                    ruleId: issue.ruleId,
                    message: issue.message
                }))
            }
        };
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.linter = new AutomatedLinter({
            verboseLogging: true,
            realTimeChecking: true,
            autoFix: false
        });
    });
} else {
    window.linter = new AutomatedLinter({
        verboseLogging: true,
        realTimeChecking: true,
        autoFix: false
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutomatedLinter;
}