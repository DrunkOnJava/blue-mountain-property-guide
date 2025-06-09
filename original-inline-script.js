    <script>
        // Dark Mode Toggle
        const themeToggle = document.getElementById('theme-toggle');
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            
            if (document.body.classList.contains('dark')) {
                themeToggle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                `;
            } else {
                themeToggle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                `;
            }
        });
        
        // Dark mode is off by default - users can toggle manually
        // Removed automatic dark mode detection to ensure light mode default
        /*
        // Check system preference for dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark');
            themeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            `;
        }
        
        // Listen for changes in system preference
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.body.classList.add('dark');
                themeToggle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                `;
            } else {
                document.body.classList.remove('dark');
                themeToggle.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                `;
            }
        });
        */
        
        // Enhanced Print Function with Testing Framework
        document.getElementById('print-button').addEventListener('click', () => {
            // Pre-print validation and testing
            console.log('🖨️ Print Testing Framework - Starting validation...');
            
            // 1. Validate US Letter compliance
            const printTests = {
                paperSize: validatePaperSize(),
                emergencyContacts: validateEmergencyContacts(),
                imageConstraints: validateImageSizes(),
                pageBreaks: validatePageBreaks(),
                browserCompatibility: detectBrowser()
            };
            
            // Log test results
            console.log('📋 Print Validation Results:', printTests);
            
            // Switch to light mode for printing
            const isDarkMode = document.body.classList.contains('dark');
            if (isDarkMode) {
                document.body.classList.remove('dark');
            }
            
            // Set background to white for printing
            document.body.style.backgroundColor = 'white';
            
            // Add print preparation class
            document.body.classList.add('print-preparing');
            
            // Brief delay to ensure styles are applied
            setTimeout(() => {
                console.log('🖨️ Initiating print dialog...');
                window.print();
                
                // Cleanup after print dialog
                setTimeout(() => {
                    document.body.classList.remove('print-preparing');
                    
                    // Restore dark mode if it was active
                    if (isDarkMode) {
                        document.body.classList.add('dark');
                    }
                    
                    // Restore background color
                    document.body.style.backgroundColor = '';
                    
                    console.log('✅ Print process completed');
                }, 100);
            }, 50);
        });
        
        // Print Testing Framework Functions
        function validatePaperSize() {
            const paperPages = document.querySelectorAll('.paper-page');
            const isValid = paperPages.length > 0;
            console.log(`📄 Paper pages found: ${paperPages.length}`);
            return {
                valid: isValid,
                count: paperPages.length,
                message: isValid ? 'Paper pages properly structured' : 'No paper pages found'
            };
        }
        
        function validateEmergencyContacts() {
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
        
        function validateImageSizes() {
            const images = document.querySelectorAll('img');
            let oversizedImages = 0;
            
            images.forEach(img => {
                if (img.naturalWidth > 432 || img.naturalHeight > 288) { // 6in x 4in at 72dpi
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
        
        function validatePageBreaks() {
            const pageBreakElements = document.querySelectorAll('.paper-page, .emergency-contact-section, .contact-card');
            const hasPageBreakCSS = pageBreakElements.length > 0;
            
            return {
                valid: hasPageBreakCSS,
                elementsWithPageBreaks: pageBreakElements.length,
                message: hasPageBreakCSS ? 'Page break elements properly configured' : 'Page break configuration may be missing'
            };
        }
        
        function detectBrowser() {
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
        
        // Enhanced Image Loading with Lazy Loading and Error Handling
        function setupImageLoading() {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                // Add loading class initially
                img.classList.add('image-loading');
                
                // Add lazy loading attribute if not already present
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
                
                // Remove loading class when image loads
                img.addEventListener('load', () => {
                    img.classList.remove('image-loading');
                });
                
                // Handle image errors
                img.addEventListener('error', () => {
                    img.classList.remove('image-loading');
                    img.alt = `Image unavailable: ${img.alt}`;
                    img.style.background = 'var(--neutral-300)';
                    img.style.display = 'flex';
                    img.style.alignItems = 'center';
                    img.style.justifyContent = 'center';
                    img.style.minHeight = '200px';
                    img.style.color = 'var(--text-muted)';
                });
            });
        }
        
        // Smooth Scrolling Enhancement for Table of Contents
        function setupSmoothScrolling() {
            const tocLinks = document.querySelectorAll('a[href^="#"]');
            
            tocLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update URL without triggering scroll
                        history.pushState(null, null, targetId);
                    }
                });
            });
        }
        
        // Progress Indicator
        function setupProgressIndicator() {
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: var(--primary);
                z-index: 1000;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
            
            window.addEventListener('scroll', () => {
                const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = Math.min(scrolled, 100) + '%';
            });
        }
        
        // Keyboard Navigation Enhancement
        function setupKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + P for print
                if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                    e.preventDefault();
                    document.getElementById('print-button').click();
                }
                
                // T for theme toggle
                if (e.key === 't' || e.key === 'T') {
                    if (!e.target.matches('input, textarea, select')) {
                        document.getElementById('theme-toggle').click();
                    }
                }
                
                // Arrow keys for section navigation
                if (e.key === 'ArrowDown' && e.ctrlKey) {
                    e.preventDefault();
                    navigateToNextSection(1);
                } else if (e.key === 'ArrowUp' && e.ctrlKey) {
                    e.preventDefault();
                    navigateToNextSection(-1);
                }
            });
        }
        
        function navigateToNextSection(direction) {
            const sections = Array.from(document.querySelectorAll('h2[id]'));
            const currentScrollY = window.scrollY;
            let currentSectionIndex = -1;
            
            // Find current section
            for (let i = 0; i < sections.length; i++) {
                if (sections[i].offsetTop <= currentScrollY + 100) {
                    currentSectionIndex = i;
                }
            }
            
            // Navigate to next/previous section
            const nextIndex = currentSectionIndex + direction;
            if (nextIndex >= 0 && nextIndex < sections.length) {
                sections[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        
        // Search Functionality
        function setupSearch() {
            const searchContainer = document.createElement('div');
            searchContainer.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--neutral-100);
                padding: 10px;
                border-radius: 8px;
                box-shadow: var(--shadow-lg);
                z-index: 999;
                display: none;
                min-width: 300px;
            `;
            
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = 'Search guide content...';
            searchInput.style.cssText = `
                width: 100%;
                padding: 8px;
                border: 1px solid var(--neutral-400);
                border-radius: 4px;
                margin-bottom: 10px;
            `;
            
            const searchResults = document.createElement('div');
            searchResults.style.cssText = `
                max-height: 200px;
                overflow-y: auto;
                font-size: 0.9rem;
            `;
            
            searchContainer.appendChild(searchInput);
            searchContainer.appendChild(searchResults);
            document.body.appendChild(searchContainer);
            
            // Toggle search with Ctrl/Cmd + F
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                    e.preventDefault();
                    searchContainer.style.display = searchContainer.style.display === 'none' ? 'block' : 'none';
                    if (searchContainer.style.display === 'block') {
                        searchInput.focus();
                    }
                }
                
                if (e.key === 'Escape') {
                    searchContainer.style.display = 'none';
                }
            });
            
            // Search functionality
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                searchResults.innerHTML = '';
                
                if (query.length < 2) return;
                
                const allText = document.querySelectorAll('h2, h3, h4, p, li');
                const matches = [];
                
                allText.forEach(element => {
                    if (element.textContent.toLowerCase().includes(query)) {
                        matches.push({
                            element,
                            text: element.textContent.slice(0, 100),
                            type: element.tagName
                        });
                    }
                });
                
                matches.slice(0, 10).forEach(match => {
                    const resultItem = document.createElement('div');
                    resultItem.style.cssText = `
                        padding: 5px;
                        cursor: pointer;
                        border-bottom: 1px solid var(--neutral-300);
                    `;
                    resultItem.innerHTML = `<strong>${match.type}:</strong> ${match.text}...`;
                    
                    resultItem.addEventListener('click', () => {
                        match.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        searchContainer.style.display = 'none';
                    });
                    
                    searchResults.appendChild(resultItem);
                });
            });
        }
        
        // Table of Contents Sidebar
        function setupTOCSidebar() {
            // Create TOC toggle button
            const tocToggle = document.createElement('button');
            tocToggle.className = 'toc-toggle';
            tocToggle.textContent = 'Contents';
            tocToggle.setAttribute('aria-label', 'Toggle table of contents');
            document.body.appendChild(tocToggle);
            
            // Create TOC sidebar
            const tocSidebar = document.createElement('div');
            tocSidebar.className = 'toc-sidebar';
            tocSidebar.innerHTML = `
                <h3>Table of Contents</h3>
                <ul>
                    <li><a href="#governance">I. Governance & Structure</a></li>
                    <li><a href="#mountain-home">II. A Mountain Home</a></li>
                    <li><a href="#wood-chipping">III. Wood-Chipping Program</a></li>
                    <li><a href="#fire-safety">IV. Fire Safety & Emergency</a></li>
                    <li><a href="#community-services">V. Community Services</a></li>
                    <li><a href="#deer-lake">VI. Deer Lake Recreation</a></li>
                    <li><a href="#lodge">VII. The Lodge</a></li>
                    <li><a href="#community-communication">VIII. Communication</a></li>
                    <li><a href="#contacts">IX. Contacts & Resources</a></li>
                </ul>
            `;
            document.body.appendChild(tocSidebar);
            
            // Toggle sidebar visibility
            tocToggle.addEventListener('click', () => {
                tocSidebar.classList.toggle('visible');
                tocToggle.textContent = tocSidebar.classList.contains('visible') ? 'Hide' : 'Contents';
            });
            
            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (!tocSidebar.contains(e.target) && !tocToggle.contains(e.target)) {
                    tocSidebar.classList.remove('visible');
                    tocToggle.textContent = 'Contents';
                }
            });
            
            // Highlight active section
            const tocLinks = tocSidebar.querySelectorAll('a');
            const sections = Array.from(document.querySelectorAll('h2[id]'));
            
            function updateActiveTOC() {
                const scrollY = window.scrollY + 100;
                let currentSection = null;
                
                sections.forEach(section => {
                    if (section.offsetTop <= scrollY) {
                        currentSection = section;
                    }
                });
                
                tocLinks.forEach(link => link.classList.remove('active'));
                
                if (currentSection) {
                    const activeLink = tocSidebar.querySelector(`a[href="#${currentSection.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            }
            
            window.addEventListener('scroll', updateActiveTOC);
            updateActiveTOC(); // Initial call
        }
        
        // Performance Monitoring
        function setupPerformanceMonitoring() {
            // Log page load performance
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            });
            
            // Monitor image loading
            const images = document.querySelectorAll('img');
            let imagesLoaded = 0;
            
            images.forEach(img => {
                img.addEventListener('load', () => {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        console.log('All images loaded successfully');
                    }
                });
            });
        }
        
        // Initialize all enhancements
        document.addEventListener('DOMContentLoaded', () => {
            setupImageLoading();
            setupSmoothScrolling();
            setupProgressIndicator();
            setupKeyboardNavigation();
            setupSearch();
            setupTOCSidebar();
            setupPerformanceMonitoring();
        });
    </script>
