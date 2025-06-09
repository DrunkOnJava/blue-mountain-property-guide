/**
 * Print Manager Module
 * Handles print functionality with validation, testing framework, and theme management
 */

export class PrintManager {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.printButton = null;
        this.init();
    }

    /**
     * Initialize print manager
     */
    init() {
        this.printButton = document.getElementById('print-button');
        if (!this.printButton) {
            console.warn('Print button not found');
            return;
        }

        this.setupPrintButton();
        this.setupKeyboardShortcut();
    }

    /**
     * Set up print button functionality
     */
    setupPrintButton() {
        this.printButton.addEventListener('click', () => {
            this.executePrint();
        });
    }

    /**
     * Set up keyboard shortcut for print (Ctrl/Cmd + P)
     */
    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                this.executePrint();
            }
        });
    }

    /**
     * Execute print with validation and testing framework
     */
    executePrint() {
        console.log('🖨️ Print Testing Framework - Starting validation...');
        
        // Run pre-print validation
        const printTests = this.runPrintValidation();
        console.log('📋 Print Validation Results:', printTests);
        
        // Prepare for printing
        const wasDarkMode = this.themeManager.forceLightTheme();
        
        // Set background to white for printing
        document.body.style.backgroundColor = 'white';
        document.body.classList.add('print-preparing');
        
        // Brief delay to ensure styles are applied
        setTimeout(() => {
            console.log('🖨️ Initiating print dialog...');
            window.print();
            
            // Cleanup after print dialog
            setTimeout(() => {
                this.cleanupAfterPrint(wasDarkMode);
            }, 100);
        }, 50);
    }

    /**
     * Run comprehensive print validation tests
     * @returns {Object} Validation results
     */
    runPrintValidation() {
        return {
            paperSize: this.validatePaperSize(),
            emergencyContacts: this.validateEmergencyContacts(),
            imageConstraints: this.validateImageSizes(),
            pageBreaks: this.validatePageBreaks(),
            browserCompatibility: this.detectBrowser()
        };
    }

    /**
     * Validate paper size and structure
     * @returns {Object} Paper size validation results
     */
    validatePaperSize() {
        const paperPages = document.querySelectorAll('.paper-page');
        const isValid = paperPages.length > 0;
        console.log(`📄 Paper pages found: ${paperPages.length}`);
        
        return {
            valid: isValid,
            count: paperPages.length,
            message: isValid ? 'Paper pages properly structured' : 'No paper pages found'
        };
    }

    /**
     * Validate emergency contact formatting
     * @returns {Object} Emergency contacts validation results
     */
    validateEmergencyContacts() {
        const emergencyBoxes = document.querySelectorAll('.alert-box');
        const contactCards = document.querySelectorAll('.contact-card');
        const emergencyNumbers = document.querySelectorAll('.emergency-number');
        
        const isValid = emergencyBoxes.length > 0 && contactCards.length > 0;
        console.log(`🚨 Emergency elements - Boxes: ${emergencyBoxes.length}, Cards: ${contactCards.length}, Numbers: ${emergencyNumbers.length}`);
        
        return {
            valid: isValid,
            alertBoxes: emergencyBoxes.length,
            contactCards: contactCards.length,
            emergencyNumbers: emergencyNumbers.length,
            message: isValid ? 'Emergency contacts properly formatted' : 'Emergency contact formatting issues detected'
        };
    }

    /**
     * Validate image sizes for print constraints
     * @returns {Object} Image validation results
     */
    validateImageSizes() {
        const images = document.querySelectorAll('img');
        let oversizedImages = 0;
        
        images.forEach(img => {
            // 6in x 4in at 72dpi = 432x288 pixels
            if (img.naturalWidth > 432 || img.naturalHeight > 288) {
                oversizedImages++;
                console.warn(`⚠️ Large image detected: ${img.src} (${img.naturalWidth}x${img.naturalHeight})`);
            }
        });
        
        return {
            valid: oversizedImages === 0,
            totalImages: images.length,
            oversizedImages: oversizedImages,
            message: oversizedImages === 0 ? 'All images within print constraints' : `${oversizedImages} images may be too large for print`
        };
    }

    /**
     * Validate page break configuration
     * @returns {Object} Page break validation results
     */
    validatePageBreaks() {
        const pageBreakElements = document.querySelectorAll('.paper-page, .emergency-contact-section, .contact-card');
        const hasPageBreakCSS = pageBreakElements.length > 0;
        
        return {
            valid: hasPageBreakCSS,
            elementsWithPageBreaks: pageBreakElements.length,
            message: hasPageBreakCSS ? 'Page break elements properly configured' : 'Page break configuration may be missing'
        };
    }

    /**
     * Detect browser and print compatibility
     * @returns {Object} Browser detection results
     */
    detectBrowser() {
        const userAgent = navigator.userAgent;
        let browser = 'Unknown';
        
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
            browser = 'Chrome';
        } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
            browser = 'Safari';
        } else if (userAgent.includes('Edg')) {
            browser = 'Edge';
        }
        
        console.log(`🌐 Browser detected: ${browser}`);
        
        return {
            browser: browser,
            userAgent: userAgent,
            printSupport: browser !== 'Unknown',
            message: `Printing from ${browser}`
        };
    }

    /**
     * Cleanup after print operation
     * @param {boolean} wasDarkMode - Whether to restore dark mode
     */
    cleanupAfterPrint(wasDarkMode) {
        document.body.classList.remove('print-preparing');
        document.body.style.backgroundColor = '';
        
        // Restore theme if it was dark mode
        this.themeManager.restoreTheme(wasDarkMode);
        
        console.log('✅ Print process completed');
    }
}