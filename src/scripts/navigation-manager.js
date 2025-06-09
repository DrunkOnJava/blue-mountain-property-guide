/**
 * Navigation Manager Module
 * Handles smooth scrolling, search functionality, TOC sidebar, and keyboard navigation
 */

export class NavigationManager {
    constructor() {
        this.tocSidebar = null;
        this.tocToggle = null;
        this.searchContainer = null;
        this.sections = [];
        this.init();
    }

    /**
     * Initialize navigation manager
     */
    init() {
        this.sections = Array.from(document.querySelectorAll('h2[id]'));
        this.setupSmoothScrolling();
        this.setupKeyboardNavigation();
        this.setupSearch();
        this.setupTOCSidebar();
        this.setupProgressIndicator();
    }

    /**
     * Set up smooth scrolling for table of contents links
     */
    setupSmoothScrolling() {
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

    /**
     * Set up keyboard navigation shortcuts
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Arrow keys for section navigation (with Ctrl)
            if (e.key === 'ArrowDown' && e.ctrlKey) {
                e.preventDefault();
                this.navigateToNextSection(1);
            } else if (e.key === 'ArrowUp' && e.ctrlKey) {
                e.preventDefault();
                this.navigateToNextSection(-1);
            }
        });
    }

    /**
     * Navigate to next/previous section
     * @param {number} direction - 1 for next, -1 for previous
     */
    navigateToNextSection(direction) {
        const currentScrollY = window.scrollY;
        let currentSectionIndex = -1;
        
        // Find current section
        for (let i = 0; i < this.sections.length; i++) {
            if (this.sections[i].offsetTop <= currentScrollY + 100) {
                currentSectionIndex = i;
            }
        }
        
        // Navigate to next/previous section
        const nextIndex = currentSectionIndex + direction;
        if (nextIndex >= 0 && nextIndex < this.sections.length) {
            this.sections[nextIndex].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    /**
     * Set up search functionality
     */
    setupSearch() {
        // Create search container
        this.searchContainer = document.createElement('div');
        this.searchContainer.style.cssText = `
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
        
        this.searchContainer.appendChild(searchInput);
        this.searchContainer.appendChild(searchResults);
        document.body.appendChild(this.searchContainer);
        
        // Search toggle with Ctrl/Cmd + F
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                this.toggleSearch();
                if (this.searchContainer.style.display === 'block') {
                    searchInput.focus();
                }
            }
            
            if (e.key === 'Escape') {
                this.hideSearch();
            }
        });
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.performSearch(e.target.value, searchResults);
        });
    }

    /**
     * Toggle search visibility
     */
    toggleSearch() {
        this.searchContainer.style.display = 
            this.searchContainer.style.display === 'none' ? 'block' : 'none';
    }

    /**
     * Hide search container
     */
    hideSearch() {
        this.searchContainer.style.display = 'none';
    }

    /**
     * Perform search and display results
     * @param {string} query - Search query
     * @param {HTMLElement} resultsContainer - Results container element
     */
    performSearch(query, resultsContainer) {
        resultsContainer.innerHTML = '';
        
        if (query.length < 2) return;
        
        const allText = document.querySelectorAll('h2, h3, h4, p, li');
        const matches = [];
        
        allText.forEach(element => {
            if (element.textContent.toLowerCase().includes(query.toLowerCase())) {
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
                match.element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                this.hideSearch();
            });
            
            resultsContainer.appendChild(resultItem);
        });
    }

    /**
     * Set up table of contents sidebar
     */
    setupTOCSidebar() {
        // Create TOC toggle button
        this.tocToggle = document.createElement('button');
        this.tocToggle.className = 'toc-toggle';
        this.tocToggle.textContent = 'Contents';
        this.tocToggle.setAttribute('aria-label', 'Toggle table of contents');
        document.body.appendChild(this.tocToggle);
        
        // Create TOC sidebar
        this.tocSidebar = document.createElement('div');
        this.tocSidebar.className = 'toc-sidebar';
        this.tocSidebar.innerHTML = `
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
        document.body.appendChild(this.tocSidebar);
        
        // Set up event listeners
        this.setupTOCEventListeners();
        this.setupActiveTOCTracking();
    }

    /**
     * Set up TOC event listeners
     */
    setupTOCEventListeners() {
        // Toggle sidebar visibility
        this.tocToggle.addEventListener('click', () => {
            this.tocSidebar.classList.toggle('visible');
            this.tocToggle.textContent = this.tocSidebar.classList.contains('visible') ? 'Hide' : 'Contents';
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.tocSidebar.contains(e.target) && !this.tocToggle.contains(e.target)) {
                this.tocSidebar.classList.remove('visible');
                this.tocToggle.textContent = 'Contents';
            }
        });
    }

    /**
     * Set up active TOC section tracking
     */
    setupActiveTOCTracking() {
        const tocLinks = this.tocSidebar.querySelectorAll('a');
        
        const updateActiveTOC = () => {
            const scrollY = window.scrollY + 100;
            let currentSection = null;
            
            this.sections.forEach(section => {
                if (section.offsetTop <= scrollY) {
                    currentSection = section;
                }
            });
            
            tocLinks.forEach(link => link.classList.remove('active'));
            
            if (currentSection) {
                const activeLink = this.tocSidebar.querySelector(`a[href="#${currentSection.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        };
        
        window.addEventListener('scroll', updateActiveTOC);
        updateActiveTOC(); // Initial call
    }

    /**
     * Set up reading progress indicator
     */
    setupProgressIndicator() {
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
}