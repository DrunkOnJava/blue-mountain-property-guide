/**
 * Integrated Testing Controller
 * Coordinates all testing systems and integrates with existing error console
 */

class IntegratedTestingController {
    constructor(options = {}) {
        this.options = {
            enableErrorConsoleIntegration: true,
            enableRealTimeMonitoring: true,
            enableAutomatedReporting: true,
            verboseLogging: true,
            testInterval: 30000, // 30 seconds
            ...options
        };
        
        this.testingSystems = {};
        this.consolidatedResults = {
            imageIssues: [],
            overflowIssues: [],
            lintIssues: [],
            paginationIssues: [],
            performanceIssues: [],
            totalIssues: 0,
            lastScan: null
        };
        
        this.init();
    }
    
    init() {
        this.log('🚀 Initializing Integrated Testing Controller');
        this.log(`   Error console integration: ${this.options.enableErrorConsoleIntegration}`);
        this.log(`   Real-time monitoring: ${this.options.enableRealTimeMonitoring}`);
        this.log(`   Automated reporting: ${this.options.enableAutomatedReporting}`);
        
        // Wait for DOM to be ready, then initialize systems
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeTestingSystems();
            });
        } else {
            this.initializeTestingSystems();
        }
    }
    
    initializeTestingSystems() {
        this.log('📋 Initializing all testing systems...');
        
        // Initialize enhanced systems with integration callbacks
        this.initImageValidator();
        this.initOverflowValidator();
        this.initAutomatedLinter();
        this.initErrorConsoleIntegration();
        
        // Create master control interface
        this.createMasterInterface();
        
        // Start real-time monitoring if enabled
        if (this.options.enableRealTimeMonitoring) {
            this.startRealTimeMonitoring();
        }
        
        // Run initial comprehensive scan
        setTimeout(() => {
            this.runComprehensiveScan();
        }, 1000);
    }
    
    initImageValidator() {
        this.testingSystems.imageValidator = new EnhancedImageValidator({
            autoFix: false,
            verboseLogging: this.options.verboseLogging,
            onResults: (results) => this.handleImageResults(results)
        });
        
        // Hide individual interface in favor of integrated view
        if (this.testingSystems.imageValidator.interface) {
            this.testingSystems.imageValidator.interface.style.display = 'none';
        }
    }
    
    initOverflowValidator() {
        this.testingSystems.overflowValidator = new EnhancedOverflowValidator({
            verboseLogging: this.options.verboseLogging,
            onResults: (results) => this.handleOverflowResults(results)
        });
        
        // Hide individual interface
        if (this.testingSystems.overflowValidator.interface) {
            this.testingSystems.overflowValidator.interface.style.display = 'none';
        }
    }
    
    initAutomatedLinter() {
        this.testingSystems.linter = new AutomatedLinter({
            verboseLogging: this.options.verboseLogging,
            realTimeChecking: false, // We'll control timing
            onResults: (results) => this.handleLintResults(results)
        });
        
        // Hide individual interface
        if (this.testingSystems.linter.interface) {
            this.testingSystems.linter.interface.style.display = 'none';
        }
    }
    
    initErrorConsoleIntegration() {
        if (!this.options.enableErrorConsoleIntegration) return;
        
        // Check if error display system exists
        if (window.errorDisplay) {
            this.log('✅ Found existing error display system - integrating...');
            this.errorDisplay = window.errorDisplay;
            
            // Override the scan method to include our enhanced results
            this.originalScanForErrors = this.errorDisplay.scanForErrors.bind(this.errorDisplay);
            this.errorDisplay.scanForErrors = () => {
                this.originalScanForErrors();
                this.integrateWithErrorConsole();
            };
        } else {
            this.log('⚠️ Error display system not found - will integrate when available');
            
            // Set up listener for when error display becomes available
            this.waitForErrorDisplay();
        }
    }
    
    waitForErrorDisplay() {
        const checkInterval = setInterval(() => {
            if (window.errorDisplay) {
                this.log('✅ Error display system now available - integrating...');
                this.errorDisplay = window.errorDisplay;
                this.integrateWithErrorConsole();
                clearInterval(checkInterval);
            }
        }, 1000);
        
        // Stop checking after 30 seconds
        setTimeout(() => clearInterval(checkInterval), 30000);
    }
    
    integrateWithErrorConsole() {
        if (!this.errorDisplay) return;
        
        // Add our consolidated issues to the error display
        const enhancedErrors = this.createErrorDisplayItems();
        
        enhancedErrors.forEach(error => {
            // Check if this error already exists to avoid duplicates
            const existingError = this.errorDisplay.errors.find(e => 
                e.title === error.title && e.message === error.message
            );
            
            if (!existingError) {
                this.errorDisplay.errors.push(error);
            }
        });
        
        // Update the error display
        this.errorDisplay.updateDisplay();
    }
    
    createErrorDisplayItems() {
        const errors = [];
        const timestamp = new Date();
        
        // Convert image issues
        this.consolidatedResults.imageIssues.forEach(issue => {
            errors.push({
                type: 'error',
                category: 'enhanced-image',
                title: 'Enhanced Image Validation',
                message: issue.message,
                details: `Source: ${issue.originalSrc}, Status: ${issue.status}`,
                element: issue.element,
                fix: issue.suggestion ? `Update path to: ${issue.suggestion}` : 'Check image path and availability',
                timestamp
            });
        });
        
        // Convert overflow issues
        this.consolidatedResults.overflowIssues.forEach(issue => {
            errors.push({
                type: issue.status === 'overflow' ? 'error' : 'warning',
                category: 'enhanced-overflow',
                title: 'Enhanced Overflow Detection',
                message: `Page ${issue.pageNumber}: ${Math.round(issue.utilizationPercent * 100)}% utilization`,
                details: `Height: ${Math.round(issue.height)}px, Max: ${Math.round(issue.maxHeight)}px`,
                element: issue.element,
                fix: issue.recommendations.length > 0 ? issue.recommendations[0] : 'Reduce content or split page',
                timestamp
            });
        });
        
        // Convert lint issues
        this.consolidatedResults.lintIssues.forEach(issue => {
            errors.push({
                type: issue.severity === 'error' ? 'error' : 'warning',
                category: 'enhanced-lint',
                title: 'Enhanced Code Quality',
                message: `${issue.ruleId}: ${issue.message}`,
                details: `Category: ${issue.category}, Description: ${issue.description}`,
                element: issue.element,
                fix: issue.fix ? 'Auto-fix available' : 'Manual fix required',
                timestamp
            });
        });
        
        return errors;
    }
    
    createMasterInterface() {
        const existingInterface = document.getElementById('master-testing-interface');
        if (existingInterface) {
            existingInterface.remove();
        }
        
        const masterInterface = document.createElement('div');
        masterInterface.id = 'master-testing-interface';
        masterInterface.innerHTML = `
            <style>
                #master-testing-interface {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 600px;
                    max-height: 80vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    z-index: 1000000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: white;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    display: none;
                }
                
                .master-header {
                    background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
                    padding: 20px 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .master-title {
                    font-size: 18px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .master-status {
                    background: rgba(255,255,255,0.2);
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #2ecc71;
                    animation: pulse 2s infinite;
                }
                
                .master-controls {
                    display: flex;
                    gap: 8px;
                }
                
                .master-btn {
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                
                .master-btn:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-1px);
                }
                
                .master-btn.primary {
                    background: rgba(46, 204, 113, 0.8);
                    border-color: rgba(46, 204, 113, 0.9);
                }
                
                .master-body {
                    max-height: 60vh;
                    overflow-y: auto;
                    padding: 24px;
                }
                
                .testing-summary {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }
                
                .summary-card {
                    background: rgba(255,255,255,0.1);
                    padding: 16px;
                    border-radius: 12px;
                    text-align: center;
                    border: 1px solid rgba(255,255,255,0.2);
                }
                
                .summary-value {
                    font-size: 28px;
                    font-weight: bold;
                    display: block;
                    margin-bottom: 4px;
                }
                
                .summary-label {
                    font-size: 12px;
                    opacity: 0.9;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .testing-systems {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                    margin-bottom: 24px;
                }
                
                .system-card {
                    background: rgba(255,255,255,0.1);
                    padding: 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.2);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .system-card:hover {
                    background: rgba(255,255,255,0.2);
                    transform: translateY(-2px);
                }
                
                .system-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .system-name {
                    font-weight: 600;
                    font-size: 14px;
                }
                
                .system-status {
                    font-size: 11px;
                    padding: 2px 6px;
                    border-radius: 6px;
                    background: rgba(46, 204, 113, 0.3);
                }
                
                .system-stats {
                    font-size: 12px;
                    opacity: 0.9;
                    line-height: 1.4;
                }
                
                .quick-actions {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                }
                
                .quick-btn {
                    flex: 1;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 12px;
                    text-align: center;
                    transition: all 0.2s;
                }
                
                .quick-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                
                .hidden {
                    display: none !important;
                }
                
                .fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                
                .backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 999999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .backdrop.show {
                    opacity: 1;
                }
            </style>
            
            <div class="backdrop" onclick="testingController.hideMasterInterface()"></div>
            
            <div class="master-header">
                <div class="master-title">
                    <span>🧪</span>
                    <span>Integrated Testing Suite</span>
                </div>
                <div class="master-status">
                    <div class="status-indicator"></div>
                    <span id="master-status-text">Ready</span>
                </div>
                <div class="master-controls">
                    <button class="master-btn primary" onclick="testingController.runComprehensiveScan()">Run All Tests</button>
                    <button class="master-btn" onclick="testingController.generateMasterReport()">Report</button>
                    <button class="master-btn" onclick="testingController.hideMasterInterface()">×</button>
                </div>
            </div>
            
            <div class="master-body">
                <div class="testing-summary">
                    <div class="summary-card">
                        <span class="summary-value" id="total-issues-count">0</span>
                        <span class="summary-label">Total Issues</span>
                    </div>
                    <div class="summary-card">
                        <span class="summary-value" id="systems-active-count">0</span>
                        <span class="summary-label">Systems Active</span>
                    </div>
                    <div class="summary-card">
                        <span class="summary-value" id="last-scan-time">Never</span>
                        <span class="summary-label">Last Scan</span>
                    </div>
                </div>
                
                <div class="testing-systems">
                    <div class="system-card" onclick="testingController.toggleSystem('imageValidator')">
                        <div class="system-header">
                            <span class="system-name">🖼️ Image Validator</span>
                            <span class="system-status" id="image-validator-status">Ready</span>
                        </div>
                        <div class="system-stats" id="image-validator-stats">
                            Enhanced image path validation and auto-fixing
                        </div>
                    </div>
                    
                    <div class="system-card" onclick="testingController.toggleSystem('overflowValidator')">
                        <div class="system-header">
                            <span class="system-name">📏 Overflow Validator</span>
                            <span class="system-status" id="overflow-validator-status">Ready</span>
                        </div>
                        <div class="system-stats" id="overflow-validator-stats">
                            Page content overflow detection and analysis
                        </div>
                    </div>
                    
                    <div class="system-card" onclick="testingController.toggleSystem('linter')">
                        <div class="system-header">
                            <span class="system-name">🔍 Code Linter</span>
                            <span class="system-status" id="linter-status">Ready</span>
                        </div>
                        <div class="system-stats" id="linter-stats">
                            Automated code quality and accessibility checking
                        </div>
                    </div>
                    
                    <div class="system-card" onclick="testingController.toggleSystem('errorConsole')">
                        <div class="system-header">
                            <span class="system-name">🚨 Error Console</span>
                            <span class="system-status" id="error-console-status">Integrated</span>
                        </div>
                        <div class="system-stats" id="error-console-stats">
                            Real-time error monitoring and reporting
                        </div>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <button class="quick-btn" onclick="testingController.fixAllIssues()">
                        🔧 Auto-Fix All
                    </button>
                    <button class="quick-btn" onclick="testingController.exportResults()">
                        📤 Export Results
                    </button>
                    <button class="quick-btn" onclick="testingController.scheduleTests()">
                        ⏰ Schedule Tests
                    </button>
                    <button class="quick-btn" onclick="testingController.showIndividualInterfaces()">
                        🔧 Individual Tools
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(masterInterface);
        this.masterInterface = masterInterface;
        
        // Add global keyboard shortcut to show interface
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.showMasterInterface();
            }
        });
        
        this.log('🎮 Master interface created. Press Ctrl+Shift+T to open.');
    }
    
    async runComprehensiveScan() {
        this.log('🚀 Running comprehensive testing scan...');
        this.updateMasterStatus('Scanning...');
        
        const startTime = performance.now();
        
        try {
            // Run all testing systems in parallel for speed
            const promises = [];
            
            if (this.testingSystems.imageValidator) {
                promises.push(this.testingSystems.imageValidator.validateAllImages());
            }
            
            if (this.testingSystems.overflowValidator) {
                promises.push(this.testingSystems.overflowValidator.validateAllPages());
            }
            
            if (this.testingSystems.linter) {
                promises.push(this.testingSystems.linter.runFullLint());
            }
            
            // Wait for all systems to complete
            await Promise.all(promises);
            
            // Consolidate results
            this.consolidateResults();
            
            // Update error console integration
            this.integrateWithErrorConsole();
            
            // Update master interface
            this.updateMasterInterface();
            
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);
            
            this.consolidatedResults.lastScan = new Date();
            this.updateMasterStatus(`Complete (${duration}ms)`);
            
            this.log(`✅ Comprehensive scan complete in ${duration}ms`);
            this.log(`   📊 Total issues found: ${this.consolidatedResults.totalIssues}`);
            
        } catch (error) {
            this.log(`❌ Scan failed: ${error.message}`);
            this.updateMasterStatus('Error');
        }
    }
    
    consolidateResults() {
        this.consolidatedResults = {
            imageIssues: [],
            overflowIssues: [],
            lintIssues: [],
            paginationIssues: [],
            performanceIssues: [],
            totalIssues: 0,
            lastScan: new Date()
        };
        
        // Consolidate image validator results
        if (this.testingSystems.imageValidator) {
            this.consolidatedResults.imageIssues = [
                ...this.testingSystems.imageValidator.results.brokenImages
            ];
        }
        
        // Consolidate overflow validator results
        if (this.testingSystems.overflowValidator) {
            this.consolidatedResults.overflowIssues = [
                ...this.testingSystems.overflowValidator.results.overflowPages,
                ...this.testingSystems.overflowValidator.results.warningPages
            ];
        }
        
        // Consolidate linter results
        if (this.testingSystems.linter) {
            this.consolidatedResults.lintIssues = [
                ...this.testingSystems.linter.results.htmlIssues,
                ...this.testingSystems.linter.results.cssIssues,
                ...this.testingSystems.linter.results.accessibilityIssues,
                ...this.testingSystems.linter.results.performanceIssues
            ];
        }
        
        // Calculate total issues
        this.consolidatedResults.totalIssues = 
            this.consolidatedResults.imageIssues.length +
            this.consolidatedResults.overflowIssues.length +
            this.consolidatedResults.lintIssues.length;
    }
    
    handleImageResults(results) {
        this.log(`📸 Image validation complete: ${results.brokenImages.length} issues`);
        // Results will be consolidated in next scan cycle
    }
    
    handleOverflowResults(results) {
        this.log(`📏 Overflow validation complete: ${results.overflowPages.length + results.warningPages.length} issues`);
        // Results will be consolidated in next scan cycle
    }
    
    handleLintResults(results) {
        const totalLintIssues = results.stats.totalIssues || 0;
        this.log(`🔍 Lint validation complete: ${totalLintIssues} issues`);
        // Results will be consolidated in next scan cycle
    }
    
    updateMasterInterface() {
        if (!this.masterInterface) return;
        
        // Update summary
        document.getElementById('total-issues-count').textContent = this.consolidatedResults.totalIssues;
        document.getElementById('systems-active-count').textContent = Object.keys(this.testingSystems).length;
        document.getElementById('last-scan-time').textContent = 
            this.consolidatedResults.lastScan ? this.consolidatedResults.lastScan.toLocaleTimeString() : 'Never';
        
        // Update system stats
        if (this.testingSystems.imageValidator) {
            const stats = this.testingSystems.imageValidator.results;
            document.getElementById('image-validator-stats').textContent = 
                `${stats.brokenImages.length} broken, ${stats.validImages.length} valid`;
        }
        
        if (this.testingSystems.overflowValidator) {
            const stats = this.testingSystems.overflowValidator.results;
            document.getElementById('overflow-validator-stats').textContent = 
                `${stats.overflowPages.length} overflow, ${stats.warningPages.length} warnings`;
        }
        
        if (this.testingSystems.linter) {
            const stats = this.testingSystems.linter.results.stats;
            document.getElementById('linter-stats').textContent = 
                `${stats.errors || 0} errors, ${stats.warnings || 0} warnings`;
        }
    }
    
    updateMasterStatus(status) {
        const statusElement = document.getElementById('master-status-text');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }
    
    showMasterInterface() {
        if (this.masterInterface) {
            this.masterInterface.style.display = 'block';
            this.masterInterface.classList.add('fadeIn');
            this.masterInterface.querySelector('.backdrop').classList.add('show');
            
            // Update interface with latest data
            this.updateMasterInterface();
        }
    }
    
    hideMasterInterface() {
        if (this.masterInterface) {
            this.masterInterface.style.display = 'none';
            this.masterInterface.classList.remove('fadeIn');
            this.masterInterface.querySelector('.backdrop').classList.remove('show');
        }
    }
    
    toggleSystem(systemName) {
        const system = this.testingSystems[systemName];
        if (!system) return;
        
        // Show/hide individual system interface
        if (system.interface) {
            const isHidden = system.interface.style.display === 'none';
            system.interface.style.display = isHidden ? 'block' : 'none';
            
            if (isHidden && system.show) {
                system.show();
            } else if (!isHidden && system.hide) {
                system.hide();
            }
        }
    }
    
    showIndividualInterfaces() {
        // Show all individual testing interfaces
        Object.values(this.testingSystems).forEach(system => {
            if (system.interface) {
                system.interface.style.display = 'block';
                if (system.show) {
                    system.show();
                }
            }
        });
        
        this.hideMasterInterface();
    }
    
    async fixAllIssues() {
        this.log('🔧 Starting automated fix for all issues...');
        this.updateMasterStatus('Fixing...');
        
        const promises = [];
        
        // Fix image issues
        if (this.testingSystems.imageValidator && this.testingSystems.imageValidator.fixAllImages) {
            promises.push(this.testingSystems.imageValidator.fixAllImages());
        }
        
        // Fix lint issues
        if (this.testingSystems.linter && this.testingSystems.linter.autoFixIssues) {
            promises.push(this.testingSystems.linter.autoFixIssues());
        }
        
        try {
            await Promise.all(promises);
            
            // Re-run scan to update results
            setTimeout(() => {
                this.runComprehensiveScan();
            }, 1000);
            
            this.log('✅ Auto-fix complete');
        } catch (error) {
            this.log(`❌ Auto-fix failed: ${error.message}`);
            this.updateMasterStatus('Fix Error');
        }
    }
    
    generateMasterReport() {
        this.log('📊 Generating comprehensive test report...');
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalIssues: this.consolidatedResults.totalIssues,
                systemsActive: Object.keys(this.testingSystems).length,
                lastScan: this.consolidatedResults.lastScan,
                testingDuration: 'N/A'
            },
            systems: {},
            consolidatedIssues: this.consolidatedResults
        };
        
        // Collect reports from individual systems
        Object.entries(this.testingSystems).forEach(([name, system]) => {
            if (system.generateReport) {
                report.systems[name] = system.generateReport();
            }
        });
        
        // Create and open report window
        this.displayMasterReport(report);
        
        return report;
    }
    
    displayMasterReport(report) {
        const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comprehensive Testing Report</title>
            <meta charset="UTF-8">
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                    margin: 0; 
                    padding: 2rem; 
                    background: #f8f9fa;
                    line-height: 1.6;
                }
                .container { 
                    max-width: 1200px; 
                    margin: 0 auto; 
                    background: white; 
                    border-radius: 12px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    overflow: hidden;
                }
                .header { 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; 
                    padding: 2rem; 
                    text-align: center;
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 2.5rem; 
                    font-weight: 300;
                }
                .summary { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                    gap: 2rem; 
                    padding: 2rem;
                    background: #f8f9fa;
                }
                .metric { 
                    background: white; 
                    padding: 1.5rem; 
                    border-radius: 8px; 
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .metric h3 { 
                    margin: 0 0 0.5rem 0; 
                    color: #495057;
                }
                .metric .value { 
                    font-size: 2.5rem; 
                    font-weight: bold; 
                    color: #667eea;
                }
                .content { 
                    padding: 2rem;
                }
                .system-report { 
                    margin: 2rem 0; 
                    border: 1px solid #e9ecef; 
                    border-radius: 8px;
                    overflow: hidden;
                }
                .system-header { 
                    background: #e9ecef; 
                    padding: 1rem 1.5rem; 
                    font-weight: 600;
                    color: #495057;
                }
                .system-content { 
                    padding: 1.5rem;
                }
                .issue-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .issue-item {
                    padding: 12px;
                    border-left: 4px solid #e74c3c;
                    background: #fff5f5;
                    border-radius: 4px;
                }
                .issue-item.warning {
                    border-left-color: #f39c12;
                    background: #fffbf0;
                }
                .issue-item.info {
                    border-left-color: #3498db;
                    background: #f0f8ff;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧪 Comprehensive Testing Report</h1>
                    <p>Generated: ${new Date(report.timestamp).toLocaleString()}</p>
                </div>
                
                <div class="summary">
                    <div class="metric">
                        <h3>Total Issues</h3>
                        <div class="value">${report.summary.totalIssues}</div>
                    </div>
                    <div class="metric">
                        <h3>Systems Active</h3>
                        <div class="value">${report.summary.systemsActive}</div>
                    </div>
                    <div class="metric">
                        <h3>Last Scan</h3>
                        <div class="value">${report.summary.lastScan ? new Date(report.summary.lastScan).toLocaleTimeString() : 'Never'}</div>
                    </div>
                </div>
                
                <div class="content">
                    <h2>System Reports</h2>
                    
                    ${Object.entries(report.systems).map(([name, systemReport]) => `
                        <div class="system-report">
                            <div class="system-header">${name.charAt(0).toUpperCase() + name.slice(1)} Report</div>
                            <div class="system-content">
                                <pre>${JSON.stringify(systemReport, null, 2)}</pre>
                            </div>
                        </div>
                    `).join('')}
                    
                    <h2>Consolidated Issues</h2>
                    
                    <div class="system-report">
                        <div class="system-header">Image Issues (${report.consolidatedIssues.imageIssues.length})</div>
                        <div class="system-content">
                            <div class="issue-list">
                                ${report.consolidatedIssues.imageIssues.slice(0, 10).map(issue => `
                                    <div class="issue-item">
                                        <strong>${issue.filename}</strong><br>
                                        Status: ${issue.status}<br>
                                        ${issue.suggestion ? `Suggested fix: ${issue.suggestion}` : 'No auto-fix available'}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="system-report">
                        <div class="system-header">Overflow Issues (${report.consolidatedIssues.overflowIssues.length})</div>
                        <div class="system-content">
                            <div class="issue-list">
                                ${report.consolidatedIssues.overflowIssues.slice(0, 10).map(issue => `
                                    <div class="issue-item ${issue.status === 'overflow' ? 'error' : 'warning'}">
                                        <strong>Page ${issue.pageNumber}</strong><br>
                                        Utilization: ${Math.round(issue.utilizationPercent * 100)}%<br>
                                        Height: ${Math.round(issue.height)}px
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="system-report">
                        <div class="system-header">Code Quality Issues (${report.consolidatedIssues.lintIssues.length})</div>
                        <div class="system-content">
                            <div class="issue-list">
                                ${report.consolidatedIssues.lintIssues.slice(0, 10).map(issue => `
                                    <div class="issue-item ${issue.severity}">
                                        <strong>${issue.ruleId}</strong><br>
                                        ${issue.message}<br>
                                        Category: ${issue.category}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
        
        const reportWindow = window.open('', '_blank', 'width=1200,height=800');
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
    }
    
    exportResults() {
        const report = this.generateMasterReport();
        const dataStr = JSON.stringify(report, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `testing-report-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.log(`📤 Results exported as ${exportFileDefaultName}`);
    }
    
    scheduleTests() {
        if (this.scheduledInterval) {
            clearInterval(this.scheduledInterval);
            this.scheduledInterval = null;
            this.log('⏰ Scheduled testing disabled');
            return;
        }
        
        this.scheduledInterval = setInterval(() => {
            this.log('⏰ Running scheduled comprehensive scan...');
            this.runComprehensiveScan();
        }, this.options.testInterval);
        
        this.log(`⏰ Scheduled testing enabled (every ${this.options.testInterval / 1000}s)`);
    }
    
    startRealTimeMonitoring() {
        if (window.MutationObserver) {
            this.observer = new MutationObserver(() => {
                clearTimeout(this.realtimeTimer);
                this.realtimeTimer = setTimeout(() => {
                    this.runComprehensiveScan();
                }, 5000); // Debounce for 5 seconds
            });
            
            this.observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'class', 'style', 'id']
            });
            
            this.log('👁️ Real-time monitoring started');
        }
    }
    
    log(message) {
        if (this.options.verboseLogging) {
            console.log(`[IntegratedTesting] ${message}`);
        }
    }
}

// Auto-initialize the integrated testing controller
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.testingController = new IntegratedTestingController({
            verboseLogging: true,
            enableRealTimeMonitoring: true,
            enableErrorConsoleIntegration: true
        });
    });
} else {
    window.testingController = new IntegratedTestingController({
        verboseLogging: true,
        enableRealTimeMonitoring: true,
        enableErrorConsoleIntegration: true
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegratedTestingController;
}