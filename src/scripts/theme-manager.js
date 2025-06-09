/**
 * Theme Manager Module
 * Handles dark/light mode toggle functionality and theme state management
 */

export class ThemeManager {
    constructor() {
        this.themeToggle = null;
        this.isDarkMode = false;
        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        this.themeToggle = document.getElementById('theme-toggle');
        if (!this.themeToggle) {
            console.warn('Theme toggle button not found');
            return;
        }

        this.setupThemeToggle();
        this.setupKeyboardShortcut();
    }

    /**
     * Set up theme toggle button functionality
     */
    setupThemeToggle() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    /**
     * Set up keyboard shortcut for theme toggle (T key)
     */
    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 't' || e.key === 'T') {
                if (!e.target.matches('input, textarea, select')) {
                    this.toggleTheme();
                }
            }
        });
    }

    /**
     * Toggle between dark and light themes
     */
    toggleTheme() {
        document.body.classList.toggle('dark');
        this.isDarkMode = document.body.classList.contains('dark');
        this.updateThemeIcon();
    }

    /**
     * Force light theme (used for printing)
     */
    forceLightTheme() {
        const wasDarkMode = this.isDarkMode;
        document.body.classList.remove('dark');
        this.isDarkMode = false;
        this.updateThemeIcon();
        return wasDarkMode;
    }

    /**
     * Restore theme state
     * @param {boolean} wasDarkMode - Previous dark mode state
     */
    restoreTheme(wasDarkMode) {
        if (wasDarkMode) {
            document.body.classList.add('dark');
            this.isDarkMode = true;
            this.updateThemeIcon();
        }
    }

    /**
     * Update theme toggle button icon
     */
    updateThemeIcon() {
        if (!this.themeToggle) return;

        if (this.isDarkMode) {
            // Light mode icon (sun)
            this.themeToggle.innerHTML = `
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
            // Dark mode icon (moon)
            this.themeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            `;
        }
    }

    /**
     * Get current theme state
     * @returns {boolean} True if dark mode is active
     */
    getDarkMode() {
        return this.isDarkMode;
    }
}