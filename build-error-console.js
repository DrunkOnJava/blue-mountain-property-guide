/**
 * Build Error Console - Tracks errors from each build/push
 * Integrates with GitHub Actions and local builds to maintain error history
 */

class BuildErrorConsole {
    constructor(options = {}) {
        this.options = {
            storageKey: 'pagination-build-errors',
            maxBuilds: 20,
            apiEndpoint: null,
            enablePersistence: true,
            enableGitHubIntegration: true,
            checkInterval: 30000, // 30 seconds
            publicMode: true, // Always visible to all users
            startMinimized: true, // Start minimized for cleaner UX
            ...options
        };
        
        this.builds = [];
        this.currentBuild = null;
        this.isVisible = false;
        
        this.init();
    }
    
    init() {
        this.loadStoredBuilds();
        this.detectCurrentBuild();
        this.createBuildConsole();
        this.startPeriodicCheck();
        this.setupEventListeners();
        
        console.log('🏗️ Build Error Console initialized');
        console.log('   Press Ctrl+B to toggle build console');
    }
    
    loadStoredBuilds() {
        if (!this.options.enablePersistence) return;
        
        try {
            const stored = localStorage.getItem(this.options.storageKey);
            if (stored) {
                this.builds = JSON.parse(stored);
                console.log(`📚 Loaded ${this.builds.length} previous builds`);
            }
        } catch (error) {
            console.warn('Failed to load stored builds:', error);
        }
    }
    
    saveBuilds() {
        if (!this.options.enablePersistence) return;
        
        try {
            // Keep only recent builds
            const recentBuilds = this.builds.slice(-this.options.maxBuilds);
            localStorage.setItem(this.options.storageKey, JSON.stringify(recentBuilds));
            this.builds = recentBuilds;
        } catch (error) {
            console.warn('Failed to save builds:', error);
        }
    }
    
    detectCurrentBuild() {
        this.currentBuild = {
            id: this.generateBuildId(),
            timestamp: new Date().toISOString(),
            source: 'local',
            branch: 'unknown',
            commit: 'unknown',
            status: 'running',
            errors: [],
            warnings: [],
            metrics: {
                startTime: Date.now(),
                endTime: null,
                duration: null,
                pageCount: 0,
                imageCount: 0,
                errorCount: 0,
                warningCount: 0
            }
        };
        
        // Try to detect build environment
        this.detectBuildEnvironment();
        
        // Try to get Git information
        this.detectGitInfo();
        
        console.log(`🚀 Current build: ${this.currentBuild.id}`);
    }
    
    detectBuildEnvironment() {
        // Check for GitHub Actions
        if (window.GITHUB_ACTIONS || window.CI || document.querySelector('meta[name="github-actions"]')) {
            this.currentBuild.source = 'github-actions';
            
            // Try to get workflow info
            const workflowMeta = document.querySelector('meta[name="workflow"]');
            if (workflowMeta) {
                this.currentBuild.workflow = workflowMeta.getAttribute('content');
            }
        }
        
        // Check for other CI systems
        if (window.CI) {
            this.currentBuild.source = 'ci';
        }
        
        // Check for development mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.currentBuild.source = 'development';
        }
        
        // Check for GitHub Pages
        if (window.location.hostname.includes('github.io')) {
            this.currentBuild.source = 'github-pages';
        }
    }
    
    detectGitInfo() {
        // Try to get commit hash from meta tags
        const commitMeta = document.querySelector('meta[name="commit"], meta[name="git-commit"], meta[name="build-hash"]');
        if (commitMeta) {
            this.currentBuild.commit = commitMeta.getAttribute('content');
        }
        
        // Try to get branch from meta tags
        const branchMeta = document.querySelector('meta[name="branch"], meta[name="git-branch"]');
        if (branchMeta) {
            this.currentBuild.branch = branchMeta.getAttribute('content');
        }
        
        // Try to get info from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('build')) {
            this.currentBuild.id = urlParams.get('build');
        }
        if (urlParams.has('commit')) {
            this.currentBuild.commit = urlParams.get('commit');
        }
        
        // Try to get info from scripts
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const content = script.textContent;
            
            // Look for build info
            const buildMatch = content.match(/BUILD_(?:HASH|ID|NUMBER)['"]?\s*[:=]\s*['"]?([a-f0-9\w-]+)['"]?/i);
            if (buildMatch) {
                this.currentBuild.id = buildMatch[1];
            }
            
            // Look for commit hash
            const commitMatch = content.match(/(?:GIT_|COMMIT_)HASH['"]?\s*[:=]\s*['"]?([a-f0-9]+)['"]?/i);
            if (commitMatch) {
                this.currentBuild.commit = commitMatch[1];
            }
            
            // Look for branch
            const branchMatch = content.match(/(?:GIT_|COMMIT_)BRANCH['"]?\s*[:=]\s*['"]?([a-f0-9\w-/]+)['"]?/i);
            if (branchMatch) {
                this.currentBuild.branch = branchMatch[1];
            }
        });
    }
    
    generateBuildId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `build-${timestamp}-${random}`;
    }
    
    createBuildConsole() {
        const console = document.createElement('div');
        console.id = 'build-error-console';
        console.className = 'build-error-console hidden';
        
        console.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 500px;
            max-height: 80vh;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #007bff;
            border-radius: 12px;
            color: white;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 12px;
            z-index: 999998;
            box-shadow: 0 10px 40px rgba(0, 123, 255, 0.3);
            backdrop-filter: blur(10px);
            transform: translateY(100%);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
        `;
        
        console.innerHTML = `
            <div class="build-console-header">
                <div class="build-console-title">
                    <span class="build-icon">🏗️</span>
                    <span class="build-title-text">Build Console</span>
                    <span class="build-status-badge running">Running</span>
                </div>
                <div class="build-console-controls">
                    <button class="build-btn build-btn-github" title="View on GitHub">🔗</button>
                    <button class="build-btn build-btn-export" title="Export build data">📤</button>
                    <button class="build-btn build-btn-clear" title="Clear history">🗑️</button>
                    <button class="build-btn build-btn-minimize" title="Minimize">➖</button>
                    <button class="build-btn build-btn-close" title="Close">✖️</button>
                </div>
            </div>
            
            <div class="build-console-tabs">
                <button class="build-tab active" data-tab="current">Current Build</button>
                <button class="build-tab" data-tab="history">History</button>
                <button class="build-tab" data-tab="metrics">Metrics</button>
            </div>
            
            <div class="build-console-content">
                <div class="build-tab-content active" id="current-build">
                    <div class="build-info">
                        <div class="build-info-row">
                            <span class="build-info-label">Build ID:</span>
                            <span class="build-info-value" id="current-build-id">${this.currentBuild.id}</span>
                        </div>
                        <div class="build-info-row">
                            <span class="build-info-label">Source:</span>
                            <span class="build-info-value" id="current-build-source">${this.currentBuild.source}</span>
                        </div>
                        <div class="build-info-row">
                            <span class="build-info-label">Branch:</span>
                            <span class="build-info-value" id="current-build-branch">${this.currentBuild.branch}</span>
                        </div>
                        <div class="build-info-row">
                            <span class="build-info-label">Commit:</span>
                            <span class="build-info-value" id="current-build-commit">${this.currentBuild.commit.slice(0, 8)}</span>
                        </div>
                        <div class="build-info-row">
                            <span class="build-info-label">Started:</span>
                            <span class="build-info-value" id="current-build-time">${new Date(this.currentBuild.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                    
                    <div class="build-errors">
                        <div class="build-errors-header">
                            <span>Build Errors</span>
                            <span class="build-error-count">0</span>
                        </div>
                        <div class="build-errors-list"></div>
                    </div>
                </div>
                
                <div class="build-tab-content" id="build-history">
                    <div class="build-history-list"></div>
                </div>
                
                <div class="build-tab-content" id="build-metrics">
                    <div class="build-metrics-grid">
                        <div class="build-metric">
                            <div class="build-metric-value" id="metric-duration">0s</div>
                            <div class="build-metric-label">Duration</div>
                        </div>
                        <div class="build-metric">
                            <div class="build-metric-value" id="metric-pages">0</div>
                            <div class="build-metric-label">Pages</div>
                        </div>
                        <div class="build-metric">
                            <div class="build-metric-value" id="metric-images">0</div>
                            <div class="build-metric-label">Images</div>
                        </div>
                        <div class="build-metric">
                            <div class="build-metric-value" id="metric-errors">0</div>
                            <div class="build-metric-label">Total Errors</div>
                        </div>
                    </div>
                    
                    <div class="build-metrics-chart">
                        <canvas id="build-chart" width="400" height="200"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="build-console-footer">
                <div class="build-console-status">
                    <span class="build-status-text">Monitoring for errors...</span>
                </div>
            </div>
        `;
        
        this.addBuildConsoleStyles();
        document.body.appendChild(console);
        
        this.setupBuildConsoleEvents(console);
        this.buildConsole = console;
    }
    
    addBuildConsoleStyles() {
        if (document.getElementById('build-console-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'build-console-styles';
        style.textContent = `
            .build-error-console.visible {
                transform: translateY(0) !important;
            }
            
            .build-console-header {
                background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
                padding: 12px 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .build-console-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                font-size: 14px;
            }
            
            .build-icon {
                font-size: 16px;
                animation: buildRotate 3s linear infinite;
            }
            
            .build-status-badge {
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .build-status-badge.running {
                background: #28a745;
                color: white;
                animation: buildPulse 2s infinite;
            }
            
            .build-status-badge.success {
                background: #28a745;
                color: white;
            }
            
            .build-status-badge.failed {
                background: #dc3545;
                color: white;
            }
            
            .build-console-controls {
                display: flex;
                gap: 4px;
            }
            
            .build-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 10px;
                transition: all 0.2s;
                min-width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .build-btn:hover {
                background: rgba(255,255,255,0.2);
                transform: scale(1.05);
            }
            
            .build-console-tabs {
                background: #2d2d2d;
                display: flex;
                border-bottom: 1px solid #444;
            }
            
            .build-tab {
                background: transparent;
                border: none;
                color: #aaa;
                padding: 12px 16px;
                cursor: pointer;
                font-size: 12px;
                border-bottom: 2px solid transparent;
                transition: all 0.2s;
                flex: 1;
            }
            
            .build-tab:hover {
                color: white;
                background: rgba(255,255,255,0.05);
            }
            
            .build-tab.active {
                color: #007bff;
                border-bottom-color: #007bff;
                background: rgba(0,123,255,0.1);
            }
            
            .build-console-content {
                max-height: 400px;
                overflow-y: auto;
                padding: 16px;
            }
            
            .build-tab-content {
                display: none;
            }
            
            .build-tab-content.active {
                display: block;
            }
            
            .build-info {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 16px;
            }
            
            .build-info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 8px;
                font-size: 11px;
            }
            
            .build-info-row:last-child {
                margin-bottom: 0;
            }
            
            .build-info-label {
                color: #aaa;
                font-weight: 500;
            }
            
            .build-info-value {
                color: white;
                font-family: monospace;
            }
            
            .build-errors {
                background: rgba(220,53,69,0.1);
                border: 1px solid rgba(220,53,69,0.3);
                border-radius: 8px;
                overflow: hidden;
            }
            
            .build-errors-header {
                background: rgba(220,53,69,0.2);
                padding: 8px 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                font-weight: 600;
            }
            
            .build-error-count {
                background: #dc3545;
                color: white;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 10px;
                min-width: 16px;
                text-align: center;
            }
            
            .build-errors-list {
                max-height: 200px;
                overflow-y: auto;
                padding: 8px 12px;
            }
            
            .build-error-item {
                background: rgba(255,255,255,0.05);
                border-left: 3px solid #dc3545;
                padding: 8px 12px;
                margin-bottom: 8px;
                border-radius: 4px;
                font-size: 11px;
                line-height: 1.4;
            }
            
            .build-error-item:last-child {
                margin-bottom: 0;
            }
            
            .build-error-item.warning {
                border-left-color: #ffc107;
            }
            
            .build-error-type {
                color: #dc3545;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 9px;
                margin-bottom: 4px;
            }
            
            .build-error-type.warning {
                color: #ffc107;
            }
            
            .build-error-message {
                color: white;
                margin-bottom: 4px;
            }
            
            .build-error-details {
                color: #aaa;
                font-size: 10px;
                font-family: monospace;
            }
            
            .build-history-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .build-history-item {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 12px;
                border-left: 4px solid #007bff;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .build-history-item:hover {
                background: rgba(255,255,255,0.1);
                transform: translateX(4px);
            }
            
            .build-history-item.failed {
                border-left-color: #dc3545;
            }
            
            .build-history-item.success {
                border-left-color: #28a745;
            }
            
            .build-history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .build-history-id {
                font-family: monospace;
                font-size: 11px;
                color: #007bff;
            }
            
            .build-history-time {
                font-size: 10px;
                color: #aaa;
            }
            
            .build-history-stats {
                display: flex;
                gap: 16px;
                font-size: 10px;
            }
            
            .build-history-stat {
                display: flex;
                align-items: center;
                gap: 4px;
            }
            
            .build-history-stat.errors {
                color: #dc3545;
            }
            
            .build-history-stat.warnings {
                color: #ffc107;
            }
            
            .build-metrics-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
                margin-bottom: 16px;
            }
            
            .build-metric {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 12px;
                text-align: center;
            }
            
            .build-metric-value {
                font-size: 20px;
                font-weight: bold;
                color: #007bff;
                margin-bottom: 4px;
            }
            
            .build-metric-label {
                font-size: 10px;
                color: #aaa;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .build-metrics-chart {
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                padding: 16px;
                text-align: center;
            }
            
            .build-console-footer {
                background: #1a1a1a;
                padding: 8px 16px;
                border-top: 1px solid #444;
                font-size: 11px;
            }
            
            .build-status-text {
                color: #aaa;
            }
            
            .build-error-console.minimized .build-console-content,
            .build-error-console.minimized .build-console-tabs,
            .build-error-console.minimized .build-console-footer {
                display: none;
            }
            
            @keyframes buildRotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes buildPulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .build-error-console {
                    width: calc(100vw - 40px) !important;
                    left: 20px !important;
                    bottom: 20px !important;
                }
                
                .build-metrics-grid {
                    grid-template-columns: 1fr !important;
                }
            }
            
            /* Scrollbar styling */
            .build-console-content::-webkit-scrollbar,
            .build-errors-list::-webkit-scrollbar {
                width: 6px;
            }
            
            .build-console-content::-webkit-scrollbar-track,
            .build-errors-list::-webkit-scrollbar-track {
                background: #2d2d2d;
                border-radius: 3px;
            }
            
            .build-console-content::-webkit-scrollbar-thumb,
            .build-errors-list::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 3px;
            }
            
            .build-console-content::-webkit-scrollbar-thumb:hover,
            .build-errors-list::-webkit-scrollbar-thumb:hover {
                background: #777;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    setupBuildConsoleEvents(console) {
        // Tab switching
        console.querySelectorAll('.build-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        // Control buttons
        console.querySelector('.build-btn-github').addEventListener('click', () => {
            this.openGitHub();
        });
        
        console.querySelector('.build-btn-export').addEventListener('click', () => {
            this.exportBuildData();
        });
        
        console.querySelector('.build-btn-clear').addEventListener('click', () => {
            this.clearHistory();
        });
        
        console.querySelector('.build-btn-minimize').addEventListener('click', () => {
            this.toggleMinimize();
        });
        
        console.querySelector('.build-btn-close').addEventListener('click', () => {
            this.hideBuildConsole();
        });
        
        // Make draggable
        this.makeDraggable(console);
    }
    
    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startBottom;
        
        const header = element.querySelector('.build-console-header');
        header.style.cursor = 'move';
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.build-btn')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = element.offsetLeft;
            startBottom = window.innerHeight - element.offsetTop - element.offsetHeight;
            
            element.style.transition = 'none';
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            element.style.left = (startLeft + deltaX) + 'px';
            element.style.bottom = (startBottom - deltaY) + 'px';
        };
        
        const handleMouseUp = () => {
            isDragging = false;
            element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }
    
    setupEventListeners() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+B to toggle build console
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                this.toggleBuildConsole();
            }
            
            // Ctrl+Shift+B to clear build history
            if (e.ctrlKey && e.shiftKey && e.key === 'B') {
                e.preventDefault();
                this.clearHistory();
            }
        });
        
        // Listen for error display system events
        if (window.errorDisplay) {
            // Hook into error display system to capture errors
            const originalScanForErrors = window.errorDisplay.scanForErrors;
            window.errorDisplay.scanForErrors = (...args) => {
                const result = originalScanForErrors.apply(window.errorDisplay, args);
                this.captureCurrentErrors();
                return result;
            };
        }
    }
    
    startPeriodicCheck() {
        // Update build metrics periodically
        this.updateInterval = setInterval(() => {
            this.updateCurrentBuildMetrics();
            this.updateDisplay();
        }, this.options.checkInterval);
        
        // Check for GitHub Actions status if applicable
        if (this.options.enableGitHubIntegration && this.currentBuild.source === 'github-actions') {
            this.checkGitHubActionsStatus();
        }
    }
    
    updateCurrentBuildMetrics() {
        if (!this.currentBuild) return;
        
        const metrics = this.currentBuild.metrics;
        metrics.endTime = Date.now();
        metrics.duration = metrics.endTime - metrics.startTime;
        metrics.pageCount = document.querySelectorAll('.paper-page').length;
        metrics.imageCount = document.querySelectorAll('img').length;
        metrics.errorCount = this.currentBuild.errors.length;
        metrics.warningCount = this.currentBuild.warnings.length;
    }
    
    captureCurrentErrors() {
        if (!window.errorDisplay || !this.currentBuild) return;
        
        // Get current errors and warnings
        const errors = window.errorDisplay.errors || [];
        const warnings = window.errorDisplay.warnings || [];
        
        // Add to current build
        errors.forEach(error => {
            const buildError = {
                type: 'error',
                category: error.category || 'unknown',
                title: error.title,
                message: error.message,
                details: error.details,
                timestamp: new Date().toISOString(),
                page: this.findErrorPage(error.element)
            };
            
            // Avoid duplicates
            const exists = this.currentBuild.errors.some(e => 
                e.title === buildError.title && e.message === buildError.message
            );
            
            if (!exists) {
                this.currentBuild.errors.push(buildError);
            }
        });
        
        warnings.forEach(warning => {
            const buildWarning = {
                type: 'warning',
                category: warning.category || 'unknown',
                title: warning.title,
                message: warning.message,
                details: warning.details,
                timestamp: new Date().toISOString(),
                page: this.findErrorPage(warning.element)
            };
            
            // Avoid duplicates
            const exists = this.currentBuild.warnings.some(w => 
                w.title === buildWarning.title && w.message === buildWarning.message
            );
            
            if (!exists) {
                this.currentBuild.warnings.push(buildWarning);
            }
        });
    }
    
    findErrorPage(element) {
        if (!element) return 'unknown';
        
        const page = element.closest('.paper-page');
        if (page) {
            const pageNumber = page.getAttribute('data-page-number');
            if (pageNumber) return `page-${pageNumber}`;
            
            const pages = document.querySelectorAll('.paper-page');
            const index = Array.from(pages).indexOf(page);
            return index >= 0 ? `page-${index + 1}` : 'unknown';
        }
        
        return 'global';
    }
    
    switchTab(tabName) {
        // Update tab buttons
        this.buildConsole.querySelectorAll('.build-tab').forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
        });
        
        // Update content
        this.buildConsole.querySelectorAll('.build-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName === 'current' ? 'current-build' : tabName === 'history' ? 'build-history' : 'build-metrics'}`);
        });
        
        // Update content based on tab
        if (tabName === 'history') {
            this.updateHistoryTab();
        } else if (tabName === 'metrics') {
            this.updateMetricsTab();
        }
    }
    
    updateDisplay() {
        if (!this.buildConsole || !this.currentBuild) return;
        
        // Update current build info
        this.buildConsole.querySelector('#current-build-id').textContent = this.currentBuild.id;
        this.buildConsole.querySelector('#current-build-source').textContent = this.currentBuild.source;
        this.buildConsole.querySelector('#current-build-branch').textContent = this.currentBuild.branch;
        this.buildConsole.querySelector('#current-build-commit').textContent = this.currentBuild.commit.slice(0, 8);
        
        // Update error list
        this.updateCurrentErrorsList();
        
        // Update metrics
        this.updateCurrentMetrics();
        
        // Update status
        this.updateBuildStatus();
    }
    
    updateCurrentErrorsList() {
        const errorsList = this.buildConsole.querySelector('.build-errors-list');
        const errorCount = this.buildConsole.querySelector('.build-error-count');
        
        const totalErrors = this.currentBuild.errors.length + this.currentBuild.warnings.length;
        errorCount.textContent = totalErrors;
        
        errorsList.innerHTML = '';
        
        // Show recent errors first
        const allIssues = [...this.currentBuild.errors, ...this.currentBuild.warnings]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10); // Show latest 10
        
        allIssues.forEach(issue => {
            const item = document.createElement('div');
            item.className = `build-error-item ${issue.type}`;
            
            item.innerHTML = `
                <div class="build-error-type ${issue.type}">${issue.type}</div>
                <div class="build-error-message">${issue.title}: ${issue.message}</div>
                <div class="build-error-details">${issue.page} • ${issue.category}</div>
            `;
            
            errorsList.appendChild(item);
        });
        
        if (allIssues.length === 0) {
            errorsList.innerHTML = '<div style="color: #28a745; text-align: center; padding: 20px;">No errors detected</div>';
        }
    }
    
    updateCurrentMetrics() {
        if (!this.currentBuild.metrics) return;
        
        const metrics = this.currentBuild.metrics;
        const duration = metrics.duration ? Math.round(metrics.duration / 1000) : 0;
        
        this.buildConsole.querySelector('#metric-duration').textContent = `${duration}s`;
        this.buildConsole.querySelector('#metric-pages').textContent = metrics.pageCount;
        this.buildConsole.querySelector('#metric-images').textContent = metrics.imageCount;
        this.buildConsole.querySelector('#metric-errors').textContent = metrics.errorCount + metrics.warningCount;
    }
    
    updateBuildStatus() {
        const statusBadge = this.buildConsole.querySelector('.build-status-badge');
        const hasErrors = this.currentBuild.errors.length > 0;
        const hasWarnings = this.currentBuild.warnings.length > 0;
        
        if (hasErrors) {
            statusBadge.className = 'build-status-badge failed';
            statusBadge.textContent = 'Failed';
            this.currentBuild.status = 'failed';
        } else if (hasWarnings) {
            statusBadge.className = 'build-status-badge running';
            statusBadge.textContent = 'Warning';
            this.currentBuild.status = 'warning';
        } else {
            statusBadge.className = 'build-status-badge success';
            statusBadge.textContent = 'Success';
            this.currentBuild.status = 'success';
        }
    }
    
    updateHistoryTab() {
        const historyList = this.buildConsole.querySelector('.build-history-list');
        historyList.innerHTML = '';
        
        // Show recent builds
        const recentBuilds = this.builds.slice(-10).reverse();
        
        recentBuilds.forEach(build => {
            const item = document.createElement('div');
            item.className = `build-history-item ${build.status}`;
            
            const buildTime = new Date(build.timestamp).toLocaleString();
            
            item.innerHTML = `
                <div class="build-history-header">
                    <div class="build-history-id">${build.id}</div>
                    <div class="build-history-time">${buildTime}</div>
                </div>
                <div class="build-history-stats">
                    <div class="build-history-stat errors">
                        <span>🔴</span>
                        <span>${build.errors?.length || 0} errors</span>
                    </div>
                    <div class="build-history-stat warnings">
                        <span>🟡</span>
                        <span>${build.warnings?.length || 0} warnings</span>
                    </div>
                    <div class="build-history-stat">
                        <span>📄</span>
                        <span>${build.metrics?.pageCount || 0} pages</span>
                    </div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.showBuildDetails(build);
            });
            
            historyList.appendChild(item);
        });
        
        if (recentBuilds.length === 0) {
            historyList.innerHTML = '<div style="color: #aaa; text-align: center; padding: 40px;">No build history available</div>';
        }
    }
    
    updateMetricsTab() {
        // Update metrics display
        this.updateCurrentMetrics();
        
        // Draw simple chart if canvas is available
        const canvas = this.buildConsole.querySelector('#build-chart');
        if (canvas && this.builds.length > 1) {
            this.drawMetricsChart(canvas);
        }
    }
    
    drawMetricsChart(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#2d2d2d';
        ctx.fillRect(0, 0, width, height);
        
        // Get recent builds
        const recentBuilds = this.builds.slice(-10);
        if (recentBuilds.length < 2) return;
        
        // Draw error count trend
        const maxErrors = Math.max(...recentBuilds.map(b => (b.errors?.length || 0) + (b.warnings?.length || 0)));
        if (maxErrors === 0) maxErrors = 1;
        
        const stepX = width / (recentBuilds.length - 1);
        
        ctx.strokeStyle = '#dc3545';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        recentBuilds.forEach((build, index) => {
            const errorCount = (build.errors?.length || 0) + (build.warnings?.length || 0);
            const x = index * stepX;
            const y = height - (errorCount / maxErrors) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#dc3545';
        recentBuilds.forEach((build, index) => {
            const errorCount = (build.errors?.length || 0) + (build.warnings?.length || 0);
            const x = index * stepX;
            const y = height - (errorCount / maxErrors) * height;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#aaa';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Error Trend (Last 10 Builds)', width / 2, 20);
    }
    
    showBuildDetails(build) {
        const detailWindow = window.open('', '_blank', 'width=800,height=600');
        
        const detailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Build Details - ${build.id}</title>
            <style>
                body { font-family: monospace; margin: 2rem; background: #1a1a1a; color: white; }
                .header { background: #007bff; padding: 2rem; border-radius: 8px; margin-bottom: 2rem; }
                .section { background: #2d2d2d; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
                .error { border-left: 4px solid #dc3545; }
                .warning { border-left: 4px solid #ffc107; }
                .metric { display: inline-block; margin: 0.5rem; padding: 0.5rem 1rem; background: #007bff; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Build Details</h1>
                <p><strong>ID:</strong> ${build.id}</p>
                <p><strong>Timestamp:</strong> ${new Date(build.timestamp).toLocaleString()}</p>
                <p><strong>Source:</strong> ${build.source}</p>
                <p><strong>Branch:</strong> ${build.branch}</p>
                <p><strong>Commit:</strong> ${build.commit}</p>
                <p><strong>Status:</strong> ${build.status}</p>
            </div>
            
            <div class="section">
                <h2>Metrics</h2>
                <div class="metric">Duration: ${Math.round((build.metrics?.duration || 0) / 1000)}s</div>
                <div class="metric">Pages: ${build.metrics?.pageCount || 0}</div>
                <div class="metric">Images: ${build.metrics?.imageCount || 0}</div>
                <div class="metric">Errors: ${build.errors?.length || 0}</div>
                <div class="metric">Warnings: ${build.warnings?.length || 0}</div>
            </div>
            
            <div class="section">
                <h2>Errors (${build.errors?.length || 0})</h2>
                ${(build.errors || []).map(error => `
                    <div class="section error">
                        <strong>${error.title}</strong><br>
                        ${error.message}<br>
                        <small>${error.details} • ${error.page}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="section">
                <h2>Warnings (${build.warnings?.length || 0})</h2>
                ${(build.warnings || []).map(warning => `
                    <div class="section warning">
                        <strong>${warning.title}</strong><br>
                        ${warning.message}<br>
                        <small>${warning.details} • ${warning.page}</small>
                    </div>
                `).join('')}
            </div>
        </body>
        </html>
        `;
        
        detailWindow.document.write(detailHTML);
        detailWindow.document.close();
    }
    
    finalizeBuild() {
        if (!this.currentBuild) return;
        
        // Update final metrics
        this.updateCurrentBuildMetrics();
        this.captureCurrentErrors();
        
        // Set final status
        this.updateBuildStatus();
        
        // Add to history
        this.builds.push({ ...this.currentBuild });
        this.saveBuilds();
        
        console.log(`🏁 Build ${this.currentBuild.id} finalized with ${this.currentBuild.errors.length} errors and ${this.currentBuild.warnings.length} warnings`);
    }
    
    // Public methods
    toggleBuildConsole() {
        if (this.isVisible) {
            this.hideBuildConsole();
        } else {
            this.showBuildConsole();
        }
    }
    
    showBuildConsole() {
        if (this.buildConsole) {
            this.buildConsole.classList.remove('hidden');
            this.buildConsole.classList.add('visible');
            this.isVisible = true;
            this.updateDisplay();
        }
    }
    
    hideBuildConsole() {
        if (this.buildConsole) {
            this.buildConsole.classList.add('hidden');
            this.buildConsole.classList.remove('visible');
            this.isVisible = false;
        }
    }
    
    toggleMinimize() {
        if (this.buildConsole) {
            this.buildConsole.classList.toggle('minimized');
            const btn = this.buildConsole.querySelector('.build-btn-minimize');
            btn.textContent = this.buildConsole.classList.contains('minimized') ? '➕' : '➖';
        }
    }
    
    clearHistory() {
        this.builds = [];
        this.saveBuilds();
        this.updateHistoryTab();
        console.log('🗑️ Build history cleared');
    }
    
    exportBuildData() {
        const exportData = {
            currentBuild: this.currentBuild,
            builds: this.builds,
            exportTimestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `build-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📤 Build data exported');
    }
    
    openGitHub() {
        // Try to construct GitHub URL
        let githubUrl = null;
        
        if (this.currentBuild.commit !== 'unknown') {
            // Try to detect repository from various sources
            const repoMeta = document.querySelector('meta[name="repository"], meta[name="github-repo"]');
            if (repoMeta) {
                const repo = repoMeta.getAttribute('content');
                githubUrl = `https://github.com/${repo}/commit/${this.currentBuild.commit}`;
            }
        }
        
        if (!githubUrl) {
            // Fallback to current page's potential GitHub Pages URL
            if (window.location.hostname.includes('github.io')) {
                const pathParts = window.location.pathname.split('/').filter(p => p);
                if (pathParts.length > 0) {
                    const owner = window.location.hostname.split('.')[0];
                    const repo = pathParts[0];
                    githubUrl = `https://github.com/${owner}/${repo}`;
                }
            }
        }
        
        if (githubUrl) {
            window.open(githubUrl, '_blank');
        } else {
            alert('GitHub repository URL not detected');
        }
    }
    
    async checkGitHubActionsStatus() {
        // This would require GitHub API access
        // For now, just log that we would check
        console.log('🔄 Checking GitHub Actions status...');
        
        // In a real implementation, you would:
        // 1. Get repository info
        // 2. Call GitHub API to get workflow runs
        // 3. Update build status based on CI results
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        if (this.buildConsole) {
            this.buildConsole.remove();
        }
        
        const styles = document.getElementById('build-console-styles');
        if (styles) styles.remove();
        
        // Finalize current build before destroying
        this.finalizeBuild();
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.buildErrorConsole = new BuildErrorConsole();
    });
} else {
    window.buildErrorConsole = new BuildErrorConsole();
}

// Finalize build when page unloads
window.addEventListener('beforeunload', () => {
    if (window.buildErrorConsole) {
        window.buildErrorConsole.finalizeBuild();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BuildErrorConsole;
}