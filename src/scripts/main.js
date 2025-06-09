/**
 * Main Application Module
 * Coordinates and initializes all application modules
 */

import { ThemeManager } from './theme-manager.js';
import { PrintManager } from './print-manager.js';
import { NavigationManager } from './navigation-manager.js';
import { PerformanceManager } from './performance-manager.js';

/**
 * Main Application Class
 * Manages the initialization and coordination of all modules
 */
class App {
    constructor() {
        this.themeManager = null;
        this.printManager = null;
        this.navigationManager = null;
        this.performanceManager = null;
        this.isInitialized = false;
    }

    /**
     * Initialize the application and all modules
     */
    init() {
        console.log('🚀 Initializing Blue Mountain POA Guide Application...');
        
        try {
            // Initialize modules in dependency order
            this.initializeThemeManager();
            this.initializePrintManager();
            this.initializeNavigationManager();
            this.initializePerformanceManager();
            
            // Set up global event listeners
            this.setupGlobalEventListeners();
            
            // Set initialization flag
            this.isInitialized = true;
            
            console.log('✅ Application initialization complete');
            this.logInitializationSummary();
            
        } catch (error) {
            console.error('❌ Application initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Initialize theme manager
     */
    initializeThemeManager() {
        console.log('🎨 Initializing Theme Manager...');
        this.themeManager = new ThemeManager();
    }

    /**
     * Initialize print manager (depends on theme manager)
     */
    initializePrintManager() {
        console.log('🖨️ Initializing Print Manager...');
        this.printManager = new PrintManager(this.themeManager);
    }

    /**
     * Initialize navigation manager
     */
    initializeNavigationManager() {
        console.log('🧭 Initializing Navigation Manager...');
        this.navigationManager = new NavigationManager();
    }

    /**
     * Initialize performance manager
     */
    initializePerformanceManager() {
        console.log('📊 Initializing Performance Manager...');
        this.performanceManager = new PerformanceManager();
    }

    /**
     * Set up global event listeners
     */
    setupGlobalEventListeners() {
        // Listen for performance events
        document.addEventListener('allImagesLoaded', (event) => {
            console.log('📸 All images loaded event received:', event.detail);
        });

        // Listen for visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('👁️ Page became hidden');
            } else {
                console.log('👁️ Page became visible');
            }
        });

        // Listen for online/offline events
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored');
        });

        window.addEventListener('offline', () => {
            console.log('📴 Connection lost');
        });

        // Handle unhandled errors
        window.addEventListener('error', (event) => {
            console.error('❌ Unhandled error:', event.error);
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ Unhandled promise rejection:', event.reason);
        });
    }

    /**
     * Handle initialization errors gracefully
     * @param {Error} error - The initialization error
     */
    handleInitializationError(error) {
        // Create error display
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 15px;
            border-radius: 8px;
            max-width: 300px;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        errorDiv.innerHTML = `
            <strong>Application Error</strong><br>
            The guide failed to initialize properly. Some features may not work.<br>
            <small>Error: ${error.message}</small>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove error after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 10000);
    }

    /**
     * Log initialization summary
     */
    logInitializationSummary() {
        const summary = {
            themeManager: !!this.themeManager,
            printManager: !!this.printManager,
            navigationManager: !!this.navigationManager,
            performanceManager: !!this.performanceManager,
            initialized: this.isInitialized
        };
        
        console.log('📋 Initialization Summary:', summary);
        
        // Log browser information
        console.log('🌐 Browser Info:', {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine
        });
        
        // Log page information
        console.log('📄 Page Info:', {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            readyState: document.readyState
        });
    }

    /**
     * Get application status
     * @returns {Object} Current application status
     */
    getStatus() {
        const performanceSummary = this.performanceManager ? 
            this.performanceManager.getPerformanceSummary() : {};
        
        return {
            initialized: this.isInitialized,
            modules: {
                theme: !!this.themeManager,
                print: !!this.printManager,
                navigation: !!this.navigationManager,
                performance: !!this.performanceManager
            },
            performance: performanceSummary,
            darkMode: this.themeManager ? this.themeManager.getDarkMode() : false
        };
    }

    /**
     * Destroy the application and clean up resources
     */
    destroy() {
        console.log('🧹 Cleaning up application...');
        
        // Clean up modules
        this.themeManager = null;
        this.printManager = null;
        this.navigationManager = null;
        this.performanceManager = null;
        
        this.isInitialized = false;
        console.log('✅ Application cleanup complete');
    }
}

// Create global app instance
const app = new App();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app.init();
    });
} else {
    // DOM is already ready
    app.init();
}

// Make app available globally for debugging
window.app = app;

// Export for potential module usage
export default app;