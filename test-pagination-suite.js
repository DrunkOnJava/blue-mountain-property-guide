/**
 * Comprehensive Pagination Test Suite
 * Tests for pagination, printing, content overflow, missing assets, and quality assurance
 */

class PaginationTestSuite {
    constructor(options = {}) {
        this.options = {
            testTimeout: 30000,
            screenshotDelay: 1000,
            contentSamples: 50,
            performanceThreshold: 2000,
            ...options
        };
        
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            details: []
        };
        
        this.init();
    }
    
    init() {
        console.log('🧪 Initializing Comprehensive Pagination Test Suite');
        console.log(`⏱️ Test timeout: ${this.options.testTimeout}ms`);
        console.log(`📊 Content samples: ${this.options.contentSamples}`);
        
        // Add test styling
        this.injectTestStyles();
        
        // Create test interface
        this.createTestInterface();
        
        // Set up test data
        this.setupTestData();
    }
    
    injectTestStyles() {
        const style = document.createElement('style');
        style.id = 'pagination-test-styles';
        style.textContent = `
            .test-runner {
                position: fixed;
                top: 10px;
                left: 10px;
                background: white;
                border: 2px solid #007bff;
                border-radius: 8px;
                padding: 1rem;
                z-index: 10000;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: monospace;
                font-size: 12px;
            }
            
            .test-status {
                margin: 0.5rem 0;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                font-weight: bold;
            }
            
            .test-status.passed { background: #d4edda; color: #155724; }
            .test-status.failed { background: #f8d7da; color: #721c24; }
            .test-status.warning { background: #fff3cd; color: #856404; }
            .test-status.running { background: #cce5ff; color: #004085; }
            
            .test-progress {
                width: 100%;
                height: 20px;
                background: #f0f0f0;
                border-radius: 10px;
                overflow: hidden;
                margin: 0.5rem 0;
            }
            
            .test-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #007bff, #28a745);
                transition: width 0.3s ease;
                border-radius: 10px;
            }
            
            .test-content {
                background: #ffeb3b;
                border: 2px dashed #f57f17;
                padding: 1rem;
                margin: 0.5rem 0;
                border-radius: 4px;
                position: relative;
            }
            
            .test-content::after {
                content: "TEST CONTENT";
                position: absolute;
                top: -10px;
                right: 5px;
                background: #f57f17;
                color: white;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
            }
            
            .test-image-placeholder {
                background: repeating-linear-gradient(
                    45deg,
                    #ff9800,
                    #ff9800 10px,
                    #ffc107 10px,
                    #ffc107 20px
                );
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            
            .performance-warning {
                border: 2px solid #ff5722 !important;
                animation: performanceWarning 2s infinite;
            }
            
            @keyframes performanceWarning {
                0%, 100% { border-color: #ff5722; }
                50% { border-color: #ffeb3b; }
            }
        `;
        document.head.appendChild(style);
    }
    
    createTestInterface() {
        const testRunner = document.createElement('div');
        testRunner.className = 'test-runner';
        testRunner.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <strong>🧪 Pagination Test Suite</strong>
            </div>
            <div class="test-progress">
                <div class="test-progress-bar" style="width: 0%"></div>
            </div>
            <div id="test-status">Ready to run tests</div>
            <div style="margin-top: 1rem; text-align: center;">
                <button id="run-all-tests" style="background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">
                    Run All Tests
                </button>
                <button id="run-quick-tests" style="background: #28a745; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; margin-left: 0.5rem;">
                    Quick Test
                </button>
            </div>
            <div id="test-results" style="margin-top: 1rem; max-height: 200px; overflow-y: auto;"></div>
        `;
        
        document.body.appendChild(testRunner);
        
        // Add event listeners
        document.getElementById('run-all-tests').addEventListener('click', () => {
            this.runAllTests();
        });
        
        document.getElementById('run-quick-tests').addEventListener('click', () => {
            this.runQuickTests();
        });
        
        // Add console commands
        window.paginationTests = {
            runAll: () => this.runAllTests(),
            runQuick: () => this.runQuickTests(),
            testPagination: () => this.testPaginationSystem(),
            testPrint: () => this.testPrintQuality(),
            testOverflow: () => this.testContentOverflow(),
            testImages: () => this.testImageValidation(),
            testPerformance: () => this.testPerformance(),
            generateReport: () => this.generateDetailedReport(),
            cleanup: () => this.cleanupTestContent()
        };
        
        console.log('🎮 Test commands available:');
        console.log('   paginationTests.runAll() - Run complete test suite');
        console.log('   paginationTests.runQuick() - Run quick validation');
        console.log('   paginationTests.testPagination() - Test pagination only');
        console.log('   paginationTests.testPrint() - Test print quality');
        console.log('   paginationTests.testOverflow() - Test content overflow');
        console.log('   paginationTests.testImages() - Test image validation');
        console.log('   paginationTests.testPerformance() - Test performance');
        console.log('   paginationTests.generateReport() - Generate full report');
        console.log('   paginationTests.cleanup() - Remove test content');
    }
    
    setupTestData() {
        this.testContent = {
            short: "Short test content for pagination testing.",
            medium: "This is medium-length test content that should fit within normal pagination boundaries but provides enough text to test line wrapping, spacing, and basic layout formatting within the page structure.",
            long: `This is very long test content designed to test pagination overflow scenarios. ${'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20)} This content is specifically designed to exceed normal page boundaries and trigger overflow detection systems.`,
            html: `
                <div class="test-content">
                    <h3>Test Section</h3>
                    <p>Test paragraph with <strong>bold</strong> and <em>italic</em> formatting.</p>
                    <ul>
                        <li>Test list item 1</li>
                        <li>Test list item 2</li>
                        <li>Test list item 3</li>
                    </ul>
                </div>
            `
        };
        
        this.imageTests = [
            { width: '6in', height: '3in', description: 'Normal image size' },
            { width: '8in', height: '4in', description: 'Oversized width' },
            { width: '5in', height: '6in', description: 'Oversized height' },
            { width: '9in', height: '7in', description: 'Completely oversized' }
        ];
        
        this.performanceThresholds = {
            pageRenderTime: 100,
            validationTime: 500,
            screenshotTime: 3000,
            totalTestTime: 30000
        };
    }
    
    async runAllTests() {
        console.log('🚀 Starting comprehensive pagination test suite...');
        this.updateStatus('Running comprehensive test suite...', 'running');
        this.resetResults();
        
        const tests = [
            { name: 'Pagination System', fn: () => this.testPaginationSystem() },
            { name: 'Print Quality', fn: () => this.testPrintQuality() },
            { name: 'Content Overflow', fn: () => this.testContentOverflow() },
            { name: 'Image Validation', fn: () => this.testImageValidation() },
            { name: 'Cross-browser Support', fn: () => this.testCrossBrowserSupport() },
            { name: 'Performance', fn: () => this.testPerformance() },
            { name: 'Accessibility', fn: () => this.testAccessibility() },
            { name: 'Asset Validation', fn: () => this.testAssetValidation() },
            { name: 'Print Preview', fn: () => this.testPrintPreview() },
            { name: 'Mobile Responsiveness', fn: () => this.testMobileResponsiveness() }
        ];
        
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const progress = ((i + 1) / tests.length) * 100;
            this.updateProgress(progress);
            
            try {
                console.log(`🧪 Running test: ${test.name}`);
                await test.fn();
                this.recordResult(test.name, 'passed', `${test.name} completed successfully`);
            } catch (error) {
                console.error(`❌ Test failed: ${test.name}`, error);
                this.recordResult(test.name, 'failed', `${test.name} failed: ${error.message}`);
            }
            
            // Small delay between tests
            await this.delay(200);
        }
        
        this.displayFinalResults();
        await this.generateDetailedReport();
    }
    
    async runQuickTests() {
        console.log('⚡ Running quick validation tests...');
        this.updateStatus('Running quick tests...', 'running');
        this.resetResults();
        
        const quickTests = [
            { name: 'Basic Pagination', fn: () => this.testBasicPagination() },
            { name: 'Image Check', fn: () => this.testBasicImages() },
            { name: 'Overflow Check', fn: () => this.testBasicOverflow() },
            { name: 'Performance Check', fn: () => this.testBasicPerformance() }
        ];
        
        for (let i = 0; i < quickTests.length; i++) {
            const test = quickTests[i];
            const progress = ((i + 1) / quickTests.length) * 100;
            this.updateProgress(progress);
            
            try {
                await test.fn();
                this.recordResult(test.name, 'passed', `${test.name} passed`);
            } catch (error) {
                this.recordResult(test.name, 'failed', `${test.name} failed: ${error.message}`);
            }
        }
        
        this.displayFinalResults();
    }
    
    // ========================================================================
    // PAGINATION SYSTEM TESTS
    // ========================================================================
    
    async testPaginationSystem() {
        const results = [];
        
        // Test page structure
        const pages = document.querySelectorAll('.paper-page');
        if (pages.length === 0) {
            throw new Error('No .paper-page elements found');
        }
        results.push(`Found ${pages.length} pages`);
        
        // Test page dimensions
        pages.forEach((page, index) => {
            const rect = page.getBoundingClientRect();
            const expectedHeight = 9.5 * 96; // 9.5 inches at 96 DPI
            const tolerance = 50; // 50px tolerance
            
            if (Math.abs(rect.height - expectedHeight) > tolerance) {
                results.push(`⚠️ Page ${index + 1} height: ${Math.round(rect.height)}px (expected ~${expectedHeight}px)`);
            }
        });
        
        // Test CSS rules
        const stylesheets = Array.from(document.styleSheets);
        let hasPageRules = false;
        let hasProperMargins = false;
        
        try {
            stylesheets.forEach(sheet => {
                if (sheet.cssRules) {
                    Array.from(sheet.cssRules).forEach(rule => {
                        if (rule.type === CSSRule.PAGE_RULE) {
                            hasPageRules = true;
                            if (rule.style.margin && rule.style.margin.includes('0.75in')) {
                                hasProperMargins = true;
                            }
                        }
                    });
                }
            });
        } catch (e) {
            results.push('⚠️ Could not access all stylesheets (CORS)');
        }
        
        if (!hasPageRules) {
            throw new Error('No @page rules found in stylesheets');
        }
        
        if (!hasProperMargins) {
            results.push('⚠️ Proper margins not detected in @page rules');
        }
        
        console.log('✅ Pagination system tests passed:', results);
        return results;
    }
    
    async testBasicPagination() {
        const pages = document.querySelectorAll('.paper-page');
        if (pages.length === 0) {
            throw new Error('No pages found');
        }
        
        // Quick dimension check
        const firstPage = pages[0];
        const rect = firstPage.getBoundingClientRect();
        if (rect.height < 800 || rect.height > 1100) {
            throw new Error(`Invalid page height: ${rect.height}px`);
        }
        
        return `${pages.length} pages with valid dimensions`;
    }
    
    // ========================================================================
    // PRINT QUALITY TESTS
    // ========================================================================
    
    async testPrintQuality() {
        const results = [];
        
        // Test print CSS
        const printMediaTest = this.testPrintMedia();
        results.push(...printMediaTest);
        
        // Test color accuracy
        const colorTest = this.testColorAccuracy();
        results.push(...colorTest);
        
        // Test font rendering
        const fontTest = this.testFontRendering();
        results.push(...fontTest);
        
        // Test image quality
        const imageQualityTest = this.testImageQuality();
        results.push(...imageQualityTest);
        
        console.log('✅ Print quality tests completed:', results);
        return results;
    }
    
    testPrintMedia() {
        const results = [];
        
        // Create a temporary print media query test
        const testElement = document.createElement('div');
        testElement.style.cssText = `
            position: absolute;
            left: -9999px;
            width: 8.5in;
            height: 11in;
        `;
        document.body.appendChild(testElement);
        
        // Test computed styles
        const computedStyle = getComputedStyle(testElement);
        const width = parseFloat(computedStyle.width);
        const height = parseFloat(computedStyle.height);
        
        if (width < 700 || width > 900) {
            results.push(`⚠️ Print width may be incorrect: ${width}px`);
        } else {
            results.push(`✅ Print width correct: ${width}px`);
        }
        
        if (height < 950 || height > 1100) {
            results.push(`⚠️ Print height may be incorrect: ${height}px`);
        } else {
            results.push(`✅ Print height correct: ${height}px`);
        }
        
        document.body.removeChild(testElement);
        return results;
    }
    
    testColorAccuracy() {
        const results = [];
        const elements = document.querySelectorAll('h1, h2, .emergency-info, .alert-box');
        
        elements.forEach((element, index) => {
            const style = getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            // Check for transparent or very light colors that might not print well
            if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') {
                // This is acceptable for most elements
            } else if (this.isColorTooLight(backgroundColor)) {
                results.push(`⚠️ Element ${index + 1} has very light background: ${backgroundColor}`);
            }
            
            if (this.isColorTooLight(color)) {
                results.push(`⚠️ Element ${index + 1} has very light text: ${color}`);
            }
        });
        
        if (results.length === 0) {
            results.push('✅ Color accuracy acceptable for print');
        }
        
        return results;
    }
    
    testFontRendering() {
        const results = [];
        const textElements = document.querySelectorAll('h1, h2, h3, p, li');
        
        let fontIssues = 0;
        textElements.forEach((element, index) => {
            const style = getComputedStyle(element);
            const fontSize = parseFloat(style.fontSize);
            const lineHeight = parseFloat(style.lineHeight);
            
            // Check minimum font size for print
            if (fontSize < 8) {
                results.push(`⚠️ Font too small for print: ${fontSize}px`);
                fontIssues++;
            }
            
            // Check line height
            if (lineHeight && lineHeight < fontSize * 1.2) {
                results.push(`⚠️ Line height too tight: ${lineHeight}px for ${fontSize}px font`);
                fontIssues++;
            }
        });
        
        if (fontIssues === 0) {
            results.push('✅ Font rendering optimized for print');
        }
        
        return results;
    }
    
    testImageQuality() {
        const results = [];
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Check if image is loaded
            if (!img.complete || img.naturalHeight === 0) {
                results.push(`⚠️ Image ${index + 1} not loaded or broken: ${img.src}`);
                return;
            }
            
            // Check image dimensions for print
            const rect = img.getBoundingClientRect();
            const maxPrintWidth = 6.5 * 96; // 6.5 inches at 96 DPI
            const maxPrintHeight = 4 * 96; // 4 inches at 96 DPI
            
            if (rect.width > maxPrintWidth) {
                results.push(`⚠️ Image ${index + 1} too wide for print: ${Math.round(rect.width)}px`);
            }
            
            if (rect.height > maxPrintHeight) {
                results.push(`⚠️ Image ${index + 1} too tall for print: ${Math.round(rect.height)}px`);
            }
            
            // Check image resolution
            const displayRatio = rect.width / img.naturalWidth;
            if (displayRatio > 1.5) {
                results.push(`⚠️ Image ${index + 1} may be pixelated when printed`);
            }
        });
        
        if (results.length === 0) {
            results.push('✅ All images optimized for print quality');
        }
        
        return results;
    }
    
    // ========================================================================
    // CONTENT OVERFLOW TESTS
    // ========================================================================
    
    async testContentOverflow() {
        const results = [];
        
        // Test current pages for overflow
        const overflowTest = this.testCurrentPageOverflow();
        results.push(...overflowTest);
        
        // Test with additional content
        const stressTest = await this.testOverflowStress();
        results.push(...stressTest);
        
        // Test edge cases
        const edgeCaseTest = this.testOverflowEdgeCases();
        results.push(...edgeCaseTest);
        
        console.log('✅ Content overflow tests completed:', results);
        return results;
    }
    
    testCurrentPageOverflow() {
        const results = [];
        const pages = document.querySelectorAll('.paper-page');
        const maxHeight = 9.5 * 96; // 9.5 inches at 96 DPI
        
        pages.forEach((page, index) => {
            const rect = page.getBoundingClientRect();
            const utilizationPercent = Math.round((rect.height / maxHeight) * 100);
            
            if (rect.height > maxHeight) {
                results.push(`❌ Page ${index + 1} overflows: ${utilizationPercent}% (${Math.round(rect.height)}px)`);
            } else if (utilizationPercent > 90) {
                results.push(`⚠️ Page ${index + 1} near limit: ${utilizationPercent}% full`);
            } else {
                results.push(`✅ Page ${index + 1} within limits: ${utilizationPercent}% full`);
            }
        });
        
        return results;
    }
    
    async testOverflowStress() {
        const results = [];
        const testPages = document.querySelectorAll('.paper-page');
        
        if (testPages.length === 0) {
            return ['❌ No pages found for overflow testing'];
        }
        
        // Test with increasingly large content
        const contentSizes = ['short', 'medium', 'long'];
        const testPage = testPages[Math.floor(testPages.length / 2)]; // Use middle page
        
        for (const size of contentSizes) {
            const testElement = document.createElement('div');
            testElement.className = 'test-content';
            testElement.innerHTML = `
                <h4>Overflow Test - ${size.toUpperCase()}</h4>
                <p>${this.testContent[size]}</p>
            `;
            
            testPage.appendChild(testElement);
            
            // Wait for layout
            await this.delay(100);
            
            const rect = testPage.getBoundingClientRect();
            const maxHeight = 9.5 * 96;
            const utilizationPercent = Math.round((rect.height / maxHeight) * 100);
            
            results.push(`📊 ${size} content: ${utilizationPercent}% utilization`);
            
            if (rect.height > maxHeight) {
                results.push(`❌ ${size} content causes overflow`);
                // Remove the overflowing content
                testPage.removeChild(testElement);
                break;
            }
        }
        
        // Clean up any remaining test content
        testPage.querySelectorAll('.test-content').forEach(el => el.remove());
        
        return results;
    }
    
    testOverflowEdgeCases() {
        const results = [];
        
        // Test large single elements
        const largeElements = document.querySelectorAll('table, .large-image, .section-divider');
        largeElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const maxElementHeight = 8 * 96; // 8 inches (leaving room for padding)
            
            if (rect.height > maxElementHeight) {
                results.push(`⚠️ Large element ${index + 1} may cause page breaks: ${Math.round(rect.height)}px`);
            }
        });
        
        // Test orphaned headings
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
            const parentPage = heading.closest('.paper-page');
            if (parentPage) {
                const headingRect = heading.getBoundingClientRect();
                const pageRect = parentPage.getBoundingClientRect();
                const distanceFromBottom = pageRect.bottom - headingRect.bottom;
                
                if (distanceFromBottom < 100) { // Less than ~1 inch from bottom
                    results.push(`⚠️ Heading ${index + 1} may be orphaned: "${heading.textContent.slice(0, 30)}..."`);
                }
            }
        });
        
        if (results.length === 0) {
            results.push('✅ No overflow edge cases detected');
        }
        
        return results;
    }
    
    async testBasicOverflow() {
        const pages = document.querySelectorAll('.paper-page');
        const maxHeight = 9.5 * 96;
        
        for (const page of pages) {
            const rect = page.getBoundingClientRect();
            if (rect.height > maxHeight) {
                throw new Error(`Page overflow detected: ${Math.round(rect.height)}px`);
            }
        }
        
        return 'All pages within height limits';
    }
    
    // ========================================================================
    // IMAGE AND ASSET VALIDATION TESTS
    // ========================================================================
    
    async testImageValidation() {
        const results = [];
        
        // Test image loading
        const loadingTest = await this.testImageLoading();
        results.push(...loadingTest);
        
        // Test image sizes
        const sizeTest = this.testImageSizes();
        results.push(...sizeTest);
        
        // Test missing images
        const missingTest = this.testMissingImages();
        results.push(...missingTest);
        
        // Test image formats
        const formatTest = this.testImageFormats();
        results.push(...formatTest);
        
        console.log('✅ Image validation tests completed:', results);
        return results;
    }
    
    async testImageLoading() {
        const results = [];
        const images = document.querySelectorAll('img');
        
        const imagePromises = Array.from(images).map((img, index) => {
            return new Promise((resolve) => {
                if (img.complete) {
                    if (img.naturalHeight === 0) {
                        resolve({ index, status: 'failed', src: img.src });
                    } else {
                        resolve({ index, status: 'loaded', src: img.src });
                    }
                } else {
                    const timeout = setTimeout(() => {
                        resolve({ index, status: 'timeout', src: img.src });
                    }, 5000);
                    
                    img.onload = () => {
                        clearTimeout(timeout);
                        resolve({ index, status: 'loaded', src: img.src });
                    };
                    
                    img.onerror = () => {
                        clearTimeout(timeout);
                        resolve({ index, status: 'failed', src: img.src });
                    };
                }
            });
        });
        
        const imageResults = await Promise.all(imagePromises);
        
        imageResults.forEach(result => {
            const filename = result.src.split('/').pop();
            switch (result.status) {
                case 'loaded':
                    results.push(`✅ Image loaded: ${filename}`);
                    break;
                case 'failed':
                    results.push(`❌ Image failed: ${filename}`);
                    break;
                case 'timeout':
                    results.push(`⏱️ Image timeout: ${filename}`);
                    break;
            }
        });
        
        return results;
    }
    
    testImageSizes() {
        const results = [];
        const images = document.querySelectorAll('img');
        const maxWidth = 6.5 * 96; // 6.5 inches at 96 DPI
        const maxHeight = 4 * 96; // 4 inches at 96 DPI
        
        images.forEach((img, index) => {
            if (img.complete && img.naturalHeight > 0) {
                const rect = img.getBoundingClientRect();
                const filename = img.src.split('/').pop();
                
                let issues = [];
                if (rect.width > maxWidth) {
                    issues.push(`width: ${Math.round(rect.width)}px (max: ${maxWidth}px)`);
                }
                if (rect.height > maxHeight) {
                    issues.push(`height: ${Math.round(rect.height)}px (max: ${maxHeight}px)`);
                }
                
                if (issues.length > 0) {
                    results.push(`⚠️ ${filename} size issues: ${issues.join(', ')}`);
                } else {
                    results.push(`✅ ${filename} size OK: ${Math.round(rect.width)}×${Math.round(rect.height)}px`);
                }
            }
        });
        
        return results;
    }
    
    testMissingImages() {
        const results = [];
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            const filename = img.src.split('/').pop() || 'unnamed';
            
            if (!img.src || img.src === window.location.href) {
                results.push(`❌ Missing src attribute: Image ${index + 1}`);
            } else if (img.complete && img.naturalHeight === 0) {
                results.push(`❌ Broken image: ${filename}`);
            } else if (!img.complete) {
                results.push(`⏳ Still loading: ${filename}`);
            }
        });
        
        // Check for images referenced in CSS
        this.checkCSSImages(results);
        
        if (results.length === 0) {
            results.push('✅ All images are valid and accessible');
        }
        
        return results;
    }
    
    checkCSSImages(results) {
        const elements = document.querySelectorAll('*');
        elements.forEach((element, index) => {
            const style = getComputedStyle(element);
            const bgImage = style.backgroundImage;
            
            if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
                const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (urlMatch) {
                    const imageUrl = urlMatch[1];
                    const filename = imageUrl.split('/').pop();
                    
                    // Test if the background image can be loaded
                    const testImg = new Image();
                    testImg.onload = () => {
                        results.push(`✅ CSS background image OK: ${filename}`);
                    };
                    testImg.onerror = () => {
                        results.push(`❌ CSS background image broken: ${filename}`);
                    };
                    testImg.src = imageUrl;
                }
            }
        });
    }
    
    testImageFormats() {
        const results = [];
        const images = document.querySelectorAll('img');
        const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
        
        images.forEach((img, index) => {
            const filename = img.src.split('/').pop().toLowerCase();
            const extension = '.' + filename.split('.').pop();
            
            if (supportedFormats.includes(extension)) {
                results.push(`✅ Supported format: ${filename} (${extension})`);
            } else {
                results.push(`⚠️ Unsupported format: ${filename} (${extension})`);
            }
        });
        
        return results;
    }
    
    async testBasicImages() {
        const images = document.querySelectorAll('img');
        let brokenCount = 0;
        
        images.forEach(img => {
            if (img.complete && img.naturalHeight === 0) {
                brokenCount++;
            }
        });
        
        if (brokenCount > 0) {
            throw new Error(`${brokenCount} broken images found`);
        }
        
        return `${images.length} images validated`;
    }
    
    // ========================================================================
    // CROSS-BROWSER SUPPORT TESTS
    // ========================================================================
    
    async testCrossBrowserSupport() {
        const results = [];
        
        // Test CSS features
        const cssFeatureTest = this.testCSSFeatures();
        results.push(...cssFeatureTest);
        
        // Test browser-specific properties
        const browserPropertyTest = this.testBrowserProperties();
        results.push(...browserPropertyTest);
        
        // Test print support
        const printSupportTest = this.testPrintSupport();
        results.push(...printSupportTest);
        
        console.log('✅ Cross-browser support tests completed:', results);
        return results;
    }
    
    testCSSFeatures() {
        const results = [];
        
        // Test CSS Grid support
        if (CSS.supports('display', 'grid')) {
            results.push('✅ CSS Grid supported');
        } else {
            results.push('⚠️ CSS Grid not supported');
        }
        
        // Test Flexbox support
        if (CSS.supports('display', 'flex')) {
            results.push('✅ Flexbox supported');
        } else {
            results.push('❌ Flexbox not supported');
        }
        
        // Test CSS Custom Properties
        if (CSS.supports('color', 'var(--test)')) {
            results.push('✅ CSS Custom Properties supported');
        } else {
            results.push('⚠️ CSS Custom Properties not supported');
        }
        
        // Test @page rules
        if (CSS.supports('@page')) {
            results.push('✅ @page rules supported');
        } else {
            results.push('⚠️ @page rules support unknown');
        }
        
        return results;
    }
    
    testBrowserProperties() {
        const results = [];
        const testElement = document.createElement('div');
        document.body.appendChild(testElement);
        
        // Test vendor prefixes
        const properties = [
            'pageBreakInside',
            'webkitPageBreakInside',
            'mozPageBreakInside',
            'msPageBreakInside',
            'breakInside'
        ];
        
        const supportedProperties = properties.filter(prop => 
            prop in testElement.style
        );
        
        results.push(`✅ Page break properties: ${supportedProperties.length}/${properties.length} supported`);
        
        // Test print color adjust
        const colorAdjustProperties = [
            'printColorAdjust',
            'webkitPrintColorAdjust',
            'colorAdjust'
        ];
        
        const supportedColorAdjust = colorAdjustProperties.filter(prop => 
            prop in testElement.style
        );
        
        results.push(`✅ Color adjust properties: ${supportedColorAdjust.length}/${colorAdjustProperties.length} supported`);
        
        document.body.removeChild(testElement);
        return results;
    }
    
    testPrintSupport() {
        const results = [];
        
        // Test if window.print is available
        if (typeof window.print === 'function') {
            results.push('✅ window.print() available');
        } else {
            results.push('❌ window.print() not available');
        }
        
        // Test media query support
        if (window.matchMedia) {
            const printMedia = window.matchMedia('print');
            results.push('✅ Media queries supported');
            
            if (printMedia.addEventListener) {
                results.push('✅ Print media event listeners supported');
            } else {
                results.push('⚠️ Print media event listeners not supported');
            }
        } else {
            results.push('⚠️ Media queries not supported');
        }
        
        return results;
    }
    
    // ========================================================================
    // PERFORMANCE TESTS
    // ========================================================================
    
    async testPerformance() {
        const results = [];
        
        // Test page render performance
        const renderTest = await this.testRenderPerformance();
        results.push(...renderTest);
        
        // Test memory usage
        const memoryTest = this.testMemoryUsage();
        results.push(...memoryTest);
        
        // Test scroll performance
        const scrollTest = await this.testScrollPerformance();
        results.push(...scrollTest);
        
        console.log('✅ Performance tests completed:', results);
        return results;
    }
    
    async testRenderPerformance() {
        const results = [];
        const pages = document.querySelectorAll('.paper-page');
        
        // Test initial render time
        const startTime = performance.now();
        
        // Force a reflow
        pages.forEach(page => {
            page.getBoundingClientRect();
        });
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > this.performanceThresholds.pageRenderTime) {
            results.push(`⚠️ Slow page rendering: ${Math.round(renderTime)}ms (threshold: ${this.performanceThresholds.pageRenderTime}ms)`);
        } else {
            results.push(`✅ Good page rendering: ${Math.round(renderTime)}ms`);
        }
        
        // Test layout thrashing
        const layoutStartTime = performance.now();
        
        for (let i = 0; i < 10; i++) {
            pages.forEach(page => {
                page.style.width = '100%';
                page.getBoundingClientRect();
            });
        }
        
        const layoutEndTime = performance.now();
        const layoutTime = layoutEndTime - layoutStartTime;
        
        if (layoutTime > 100) {
            results.push(`⚠️ Layout thrashing detected: ${Math.round(layoutTime)}ms for 10 iterations`);
        } else {
            results.push(`✅ Good layout performance: ${Math.round(layoutTime)}ms for 10 iterations`);
        }
        
        return results;
    }
    
    testMemoryUsage() {
        const results = [];
        
        if (performance.memory) {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
            const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
            const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
            
            results.push(`📊 Memory usage: ${usedMB}MB / ${totalMB}MB (limit: ${limitMB}MB)`);
            
            const utilizationPercent = Math.round((usedMB / limitMB) * 100);
            if (utilizationPercent > 70) {
                results.push(`⚠️ High memory usage: ${utilizationPercent}%`);
            } else {
                results.push(`✅ Good memory usage: ${utilizationPercent}%`);
            }
        } else {
            results.push('ℹ️ Memory usage information not available');
        }
        
        return results;
    }
    
    async testScrollPerformance() {
        const results = [];
        
        if (document.querySelectorAll('.paper-page').length < 5) {
            results.push('ℹ️ Skipping scroll test - not enough pages');
            return results;
        }
        
        const startTime = performance.now();
        let frameCount = 0;
        
        return new Promise((resolve) => {
            const measureFPS = () => {
                frameCount++;
                if (frameCount < 60) {
                    requestAnimationFrame(measureFPS);
                } else {
                    const endTime = performance.now();
                    const duration = endTime - startTime;
                    const fps = Math.round((frameCount / duration) * 1000);
                    
                    if (fps < 30) {
                        results.push(`⚠️ Low scroll performance: ${fps} FPS`);
                    } else {
                        results.push(`✅ Good scroll performance: ${fps} FPS`);
                    }
                    
                    resolve(results);
                }
            };
            
            // Start scrolling
            let scrollTop = 0;
            const scrollInterval = setInterval(() => {
                scrollTop += 50;
                window.scrollTo(0, scrollTop);
                
                if (scrollTop >= document.body.scrollHeight) {
                    clearInterval(scrollInterval);
                }
            }, 16); // ~60 FPS
            
            requestAnimationFrame(measureFPS);
        });
    }
    
    async testBasicPerformance() {
        const startTime = performance.now();
        
        // Simple render test
        const pages = document.querySelectorAll('.paper-page');
        pages.forEach(page => page.getBoundingClientRect());
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        if (renderTime > 500) {
            throw new Error(`Poor performance: ${Math.round(renderTime)}ms`);
        }
        
        return `Good performance: ${Math.round(renderTime)}ms`;
    }
    
    // ========================================================================
    // ACCESSIBILITY TESTS
    // ========================================================================
    
    async testAccessibility() {
        const results = [];
        
        // Test heading hierarchy
        const headingTest = this.testHeadingHierarchy();
        results.push(...headingTest);
        
        // Test image alt text
        const altTextTest = this.testImageAltText();
        results.push(...altTextTest);
        
        // Test color contrast
        const contrastTest = this.testColorContrast();
        results.push(...contrastTest);
        
        // Test keyboard navigation
        const keyboardTest = this.testKeyboardNavigation();
        results.push(...keyboardTest);
        
        console.log('✅ Accessibility tests completed:', results);
        return results;
    }
    
    testHeadingHierarchy() {
        const results = [];
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        if (headings.length === 0) {
            results.push('⚠️ No headings found');
            return results;
        }
        
        let currentLevel = 0;
        let hierarchyIssues = 0;
        
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            
            if (index === 0 && level !== 1) {
                results.push('⚠️ Document should start with h1');
                hierarchyIssues++;
            } else if (level > currentLevel + 1) {
                results.push(`⚠️ Heading level skip: h${currentLevel} to h${level}`);
                hierarchyIssues++;
            }
            
            currentLevel = level;
        });
        
        if (hierarchyIssues === 0) {
            results.push(`✅ Good heading hierarchy: ${headings.length} headings`);
        } else {
            results.push(`⚠️ Heading hierarchy issues: ${hierarchyIssues} problems`);
        }
        
        return results;
    }
    
    testImageAltText() {
        const results = [];
        const images = document.querySelectorAll('img');
        let missingAlt = 0;
        let emptyAlt = 0;
        
        images.forEach((img, index) => {
            if (!img.hasAttribute('alt')) {
                missingAlt++;
            } else if (img.alt.trim() === '') {
                emptyAlt++;
            }
        });
        
        if (missingAlt > 0) {
            results.push(`⚠️ Missing alt attributes: ${missingAlt} images`);
        }
        
        if (emptyAlt > 0) {
            results.push(`ℹ️ Empty alt attributes: ${emptyAlt} images (decorative)`);
        }
        
        const goodAlt = images.length - missingAlt - emptyAlt;
        if (goodAlt === images.length) {
            results.push(`✅ All ${images.length} images have alt text`);
        } else {
            results.push(`✅ ${goodAlt}/${images.length} images have descriptive alt text`);
        }
        
        return results;
    }
    
    testColorContrast() {
        const results = [];
        const textElements = document.querySelectorAll('h1, h2, h3, p, li, span');
        let lowContrastCount = 0;
        
        textElements.forEach((element, index) => {
            const style = getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            // Simple contrast check (this is a simplified version)
            if (this.isLowContrast(color, backgroundColor)) {
                lowContrastCount++;
            }
        });
        
        if (lowContrastCount > 0) {
            results.push(`⚠️ Potential low contrast: ${lowContrastCount} elements`);
        } else {
            results.push('✅ Good color contrast detected');
        }
        
        return results;
    }
    
    testKeyboardNavigation() {
        const results = [];
        const focusableElements = document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        results.push(`ℹ️ Focusable elements: ${focusableElements.length}`);
        
        let tabIndexIssues = 0;
        focusableElements.forEach((element, index) => {
            const tabIndex = element.getAttribute('tabindex');
            if (tabIndex && parseInt(tabIndex) > 0) {
                tabIndexIssues++;
            }
        });
        
        if (tabIndexIssues > 0) {
            results.push(`⚠️ Positive tabindex values: ${tabIndexIssues} elements`);
        } else {
            results.push('✅ Natural tab order maintained');
        }
        
        return results;
    }
    
    // ========================================================================
    // ASSET VALIDATION TESTS
    // ========================================================================
    
    async testAssetValidation() {
        const results = [];
        
        // Test CSS files
        const cssTest = this.testCSSAssets();
        results.push(...cssTest);
        
        // Test JavaScript files
        const jsTest = this.testJavaScriptAssets();
        results.push(...jsTest);
        
        // Test external resources
        const externalTest = await this.testExternalResources();
        results.push(...externalTest);
        
        console.log('✅ Asset validation tests completed:', results);
        return results;
    }
    
    testCSSAssets() {
        const results = [];
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"], style');
        
        results.push(`📊 Found ${stylesheets.length} CSS assets`);
        
        stylesheets.forEach((sheet, index) => {
            if (sheet.tagName === 'LINK') {
                const href = sheet.href;
                if (href) {
                    const filename = href.split('/').pop();
                    results.push(`✅ External CSS: ${filename}`);
                } else {
                    results.push(`⚠️ CSS link missing href: ${index + 1}`);
                }
            } else {
                results.push(`ℹ️ Inline CSS: ${index + 1}`);
            }
        });
        
        return results;
    }
    
    testJavaScriptAssets() {
        const results = [];
        const scripts = document.querySelectorAll('script');
        
        results.push(`📊 Found ${scripts.length} JavaScript assets`);
        
        scripts.forEach((script, index) => {
            if (script.src) {
                const filename = script.src.split('/').pop();
                results.push(`✅ External JS: ${filename}`);
            } else if (script.textContent.trim()) {
                results.push(`ℹ️ Inline JS: ${script.textContent.length} characters`);
            }
        });
        
        return results;
    }
    
    async testExternalResources() {
        const results = [];
        const externalLinks = document.querySelectorAll('link[href^="http"], script[src^="http"]');
        
        if (externalLinks.length === 0) {
            results.push('ℹ️ No external resources found');
            return results;
        }
        
        results.push(`📊 Testing ${externalLinks.length} external resources`);
        
        const testPromises = Array.from(externalLinks).map(async (element, index) => {
            const url = element.href || element.src;
            const filename = url.split('/').pop();
            
            try {
                const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
                return `✅ External resource OK: ${filename}`;
            } catch (error) {
                return `⚠️ External resource issue: ${filename} (${error.message})`;
            }
        });
        
        const externalResults = await Promise.all(testPromises);
        results.push(...externalResults);
        
        return results;
    }
    
    // ========================================================================
    // PRINT PREVIEW TESTS
    // ========================================================================
    
    async testPrintPreview() {
        const results = [];
        
        // Enable print preview mode
        document.body.classList.add('print-preview');
        
        // Test print styles application
        const printStyleTest = this.testPrintStyles();
        results.push(...printStyleTest);
        
        // Test print layout
        const layoutTest = this.testPrintLayout();
        results.push(...layoutTest);
        
        // Test page numbering
        const numberingTest = this.testPageNumbering();
        results.push(...numberingTest);
        
        // Disable print preview mode
        document.body.classList.remove('print-preview');
        
        console.log('✅ Print preview tests completed:', results);
        return results;
    }
    
    testPrintStyles() {
        const results = [];
        
        // Test if print styles are being applied
        const testElement = document.createElement('div');
        testElement.style.cssText = 'width: 8.5in; height: 11in;';
        document.body.appendChild(testElement);
        
        const computedStyle = getComputedStyle(testElement);
        const width = parseFloat(computedStyle.width);
        const height = parseFloat(computedStyle.height);
        
        if (width > 700 && width < 900 && height > 950 && height < 1100) {
            results.push('✅ Print dimensions applied correctly');
        } else {
            results.push(`⚠️ Print dimensions may be incorrect: ${width}×${height}px`);
        }
        
        document.body.removeChild(testElement);
        
        return results;
    }
    
    testPrintLayout() {
        const results = [];
        const pages = document.querySelectorAll('.paper-page');
        
        let layoutIssues = 0;
        pages.forEach((page, index) => {
            const rect = page.getBoundingClientRect();
            
            // Check if page is visible
            if (rect.width === 0 || rect.height === 0) {
                results.push(`⚠️ Page ${index + 1} not visible in print preview`);
                layoutIssues++;
            }
            
            // Check if page has proper spacing
            const style = getComputedStyle(page);
            const marginBottom = parseFloat(style.marginBottom);
            
            if (marginBottom < 10) {
                results.push(`⚠️ Page ${index + 1} insufficient margin: ${marginBottom}px`);
                layoutIssues++;
            }
        });
        
        if (layoutIssues === 0) {
            results.push(`✅ Print layout OK: ${pages.length} pages`);
        }
        
        return results;
    }
    
    testPageNumbering() {
        const results = [];
        const pages = document.querySelectorAll('.paper-page');
        
        pages.forEach((page, index) => {
            const pageNumber = page.getAttribute('data-page-number');
            const expectedNumber = (index + 1).toString();
            
            if (pageNumber === expectedNumber) {
                results.push(`✅ Page ${index + 1} numbered correctly`);
            } else if (pageNumber) {
                results.push(`⚠️ Page ${index + 1} number mismatch: expected ${expectedNumber}, got ${pageNumber}`);
            } else {
                results.push(`ℹ️ Page ${index + 1} missing page number attribute`);
            }
        });
        
        return results;
    }
    
    // ========================================================================
    // MOBILE RESPONSIVENESS TESTS
    // ========================================================================
    
    async testMobileResponsiveness() {
        const results = [];
        
        // Test viewport meta tag
        const viewportTest = this.testViewportMeta();
        results.push(...viewportTest);
        
        // Test responsive breakpoints
        const breakpointTest = await this.testResponsiveBreakpoints();
        results.push(...breakpointTest);
        
        // Test touch interactions
        const touchTest = this.testTouchInteractions();
        results.push(...touchTest);
        
        console.log('✅ Mobile responsiveness tests completed:', results);
        return results;
    }
    
    testViewportMeta() {
        const results = [];
        const viewport = document.querySelector('meta[name="viewport"]');
        
        if (viewport) {
            const content = viewport.getAttribute('content');
            results.push(`✅ Viewport meta tag found: ${content}`);
            
            if (content.includes('width=device-width')) {
                results.push('✅ Responsive width configured');
            } else {
                results.push('⚠️ Responsive width not configured');
            }
        } else {
            results.push('⚠️ Viewport meta tag missing');
        }
        
        return results;
    }
    
    async testResponsiveBreakpoints() {
        const results = [];
        const originalWidth = window.innerWidth;
        
        // Test different viewport sizes
        const breakpoints = [
            { name: 'Mobile', width: 375 },
            { name: 'Tablet', width: 768 },
            { name: 'Desktop', width: 1024 }
        ];
        
        for (const breakpoint of breakpoints) {
            // Simulate viewport change (this is limited in real browsers)
            const mediaQuery = window.matchMedia(`(max-width: ${breakpoint.width}px)`);
            
            if (mediaQuery.matches || breakpoint.width >= originalWidth) {
                results.push(`✅ ${breakpoint.name} breakpoint detected`);
                
                // Test page layout at this breakpoint
                const pages = document.querySelectorAll('.paper-page');
                const firstPage = pages[0];
                
                if (firstPage) {
                    const rect = firstPage.getBoundingClientRect();
                    const pageWidth = rect.width;
                    
                    if (pageWidth <= breakpoint.width) {
                        results.push(`✅ ${breakpoint.name} page width responsive: ${Math.round(pageWidth)}px`);
                    } else {
                        results.push(`⚠️ ${breakpoint.name} page width may overflow: ${Math.round(pageWidth)}px`);
                    }
                }
            }
        }
        
        return results;
    }
    
    testTouchInteractions() {
        const results = [];
        const interactiveElements = document.querySelectorAll('button, a, [onclick]');
        
        results.push(`📊 Found ${interactiveElements.length} interactive elements`);
        
        interactiveElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const minTouchSize = 44; // Minimum touch target size in pixels
            
            if (rect.width < minTouchSize || rect.height < minTouchSize) {
                const elementType = element.tagName.toLowerCase();
                results.push(`⚠️ Small touch target: ${elementType} (${Math.round(rect.width)}×${Math.round(rect.height)}px)`);
            }
        });
        
        if (interactiveElements.length > 0) {
            results.push('✅ Touch interactions available');
        }
        
        return results;
    }
    
    // ========================================================================
    // UTILITY METHODS
    // ========================================================================
    
    isColorTooLight(color) {
        // Simple check for very light colors that might not print well
        if (color.includes('rgba(')) {
            const rgba = color.match(/rgba?\(([^)]+)\)/);
            if (rgba) {
                const values = rgba[1].split(',').map(v => parseFloat(v.trim()));
                const [r, g, b, a = 1] = values;
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness > 240 || a < 0.5;
            }
        }
        
        if (color.includes('rgb(')) {
            const rgb = color.match(/rgb?\(([^)]+)\)/);
            if (rgb) {
                const values = rgb[1].split(',').map(v => parseFloat(v.trim()));
                const [r, g, b] = values;
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                return brightness > 240;
            }
        }
        
        return false;
    }
    
    isLowContrast(textColor, backgroundColor) {
        // Simplified contrast check
        // In a real implementation, you would calculate the actual contrast ratio
        const isTextLight = this.isColorTooLight(textColor);
        const isBackgroundLight = this.isColorTooLight(backgroundColor);
        
        // Low contrast if both are light or both are dark
        return isTextLight === isBackgroundLight;
    }
    
    updateStatus(message, type = 'info') {
        const statusElement = document.getElementById('test-status');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `test-status ${type}`;
        }
    }
    
    updateProgress(percent) {
        const progressBar = document.querySelector('.test-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
    }
    
    recordResult(testName, status, message) {
        this.testResults.details.push({
            test: testName,
            status: status,
            message: message,
            timestamp: new Date().toISOString()
        });
        
        if (status === 'passed') {
            this.testResults.passed++;
        } else if (status === 'failed') {
            this.testResults.failed++;
        } else if (status === 'warning') {
            this.testResults.warnings++;
        }
        
        // Update UI
        const resultsElement = document.getElementById('test-results');
        if (resultsElement) {
            const resultDiv = document.createElement('div');
            resultDiv.className = `test-status ${status}`;
            resultDiv.textContent = `${testName}: ${message}`;
            resultsElement.appendChild(resultDiv);
            
            // Scroll to bottom
            resultsElement.scrollTop = resultsElement.scrollHeight;
        }
    }
    
    resetResults() {
        this.testResults = {
            passed: 0,
            failed: 0,
            warnings: 0,
            details: []
        };
        
        const resultsElement = document.getElementById('test-results');
        if (resultsElement) {
            resultsElement.innerHTML = '';
        }
    }
    
    displayFinalResults() {
        const total = this.testResults.passed + this.testResults.failed + this.testResults.warnings;
        const successRate = total > 0 ? Math.round((this.testResults.passed / total) * 100) : 0;
        
        let statusType = 'passed';
        if (this.testResults.failed > 0) {
            statusType = 'failed';
        } else if (this.testResults.warnings > 0) {
            statusType = 'warning';
        }
        
        const summary = `✅ ${this.testResults.passed} | ⚠️ ${this.testResults.warnings} | ❌ ${this.testResults.failed} | 📊 ${successRate}% success`;
        this.updateStatus(summary, statusType);
        
        console.log('🏁 Test Suite Complete:');
        console.log(`   Passed: ${this.testResults.passed}`);
        console.log(`   Warnings: ${this.testResults.warnings}`);
        console.log(`   Failed: ${this.testResults.failed}`);
        console.log(`   Success Rate: ${successRate}%`);
    }
    
    async generateDetailedReport() {
        const timestamp = new Date().toLocaleString();
        const total = this.testResults.passed + this.testResults.failed + this.testResults.warnings;
        const successRate = total > 0 ? Math.round((this.testResults.passed / total) * 100) : 0;
        
        const reportHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Comprehensive Pagination Test Report</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                    background: linear-gradient(135deg, #007bff, #0056b3); 
                    color: white; 
                    padding: 2rem; 
                    text-align: center;
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 2.5rem; 
                    font-weight: 300;
                }
                .header p { 
                    margin: 0.5rem 0 0 0; 
                    opacity: 0.9;
                    font-size: 1.1rem;
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
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .metric .value { 
                    font-size: 2.5rem; 
                    font-weight: bold; 
                    margin: 0.5rem 0;
                }
                .metric.passed .value { color: #28a745; }
                .metric.warning .value { color: #ffc107; }
                .metric.failed .value { color: #dc3545; }
                .metric.success .value { color: #17a2b8; }
                .content { 
                    padding: 2rem;
                }
                .test-category { 
                    margin: 2rem 0; 
                    border: 1px solid #e9ecef; 
                    border-radius: 8px;
                    overflow: hidden;
                }
                .test-category h2 { 
                    margin: 0; 
                    padding: 1rem 1.5rem; 
                    background: #e9ecef; 
                    border-bottom: 1px solid #dee2e6;
                    font-size: 1.3rem;
                    color: #495057;
                }
                .test-result { 
                    padding: 1rem 1.5rem; 
                    border-bottom: 1px solid #f1f3f5;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .test-result:last-child { border-bottom: none; }
                .test-result.passed { border-left: 4px solid #28a745; }
                .test-result.warning { border-left: 4px solid #ffc107; }
                .test-result.failed { border-left: 4px solid #dc3545; }
                .test-name { 
                    font-weight: 600; 
                    color: #495057;
                    min-width: 200px;
                }
                .test-message { 
                    color: #6c757d; 
                    flex: 1;
                }
                .test-time { 
                    font-size: 0.85rem; 
                    color: #adb5bd;
                    min-width: 100px;
                    text-align: right;
                }
                .footer {
                    background: #f8f9fa;
                    padding: 2rem;
                    text-align: center;
                    color: #6c757d;
                    border-top: 1px solid #e9ecef;
                }
                @media print {
                    body { background: white; }
                    .container { box-shadow: none; }
                    .test-category { break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧪 Comprehensive Pagination Test Report</h1>
                    <p>Generated: ${timestamp}</p>
                </div>
                
                <div class="summary">
                    <div class="metric passed">
                        <h3>Tests Passed</h3>
                        <div class="value">${this.testResults.passed}</div>
                    </div>
                    <div class="metric warning">
                        <h3>Warnings</h3>
                        <div class="value">${this.testResults.warnings}</div>
                    </div>
                    <div class="metric failed">
                        <h3>Failed</h3>
                        <div class="value">${this.testResults.failed}</div>
                    </div>
                    <div class="metric success">
                        <h3>Success Rate</h3>
                        <div class="value">${successRate}%</div>
                    </div>
                </div>
                
                <div class="content">
                    <div class="test-category">
                        <h2>📋 Test Results</h2>
                        ${this.testResults.details.map(result => `
                            <div class="test-result ${result.status}">
                                <div class="test-name">${result.test}</div>
                                <div class="test-message">${result.message}</div>
                                <div class="test-time">${new Date(result.timestamp).toLocaleTimeString()}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="footer">
                    <p>Report generated by Comprehensive Pagination Test Suite</p>
                    <p>Blue Mountain Property Owners Association Guide</p>
                </div>
            </div>
            
            <script>
                // Add interactive features
                document.querySelectorAll('.test-result').forEach(result => {
                    result.addEventListener('click', function() {
                        this.style.backgroundColor = this.style.backgroundColor ? '' : '#f8f9fa';
                    });
                });
                
                // Print functionality
                document.addEventListener('keydown', function(e) {
                    if (e.ctrlKey && e.key === 'p') {
                        window.print();
                    }
                });
            </script>
        </body>
        </html>
        `;
        
        const reportWindow = window.open('', '_blank', 'width=1200,height=800');
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
        
        console.log('📊 Detailed report generated and opened in new window');
    }
    
    cleanupTestContent() {
        // Remove all test content
        document.querySelectorAll('.test-content, .test-image-placeholder').forEach(el => {
            el.remove();
        });
        
        // Remove test classes
        document.querySelectorAll('.performance-warning').forEach(el => {
            el.classList.remove('performance-warning');
        });
        
        console.log('🧹 Test content cleaned up');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.paginationTestSuite = new PaginationTestSuite();
    });
} else {
    window.paginationTestSuite = new PaginationTestSuite();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaginationTestSuite;
}