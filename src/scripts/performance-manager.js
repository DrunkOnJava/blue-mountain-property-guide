/**
 * Performance Manager Module
 * Handles image loading, lazy loading, error handling, and performance monitoring
 */

export class PerformanceManager {
    constructor() {
        this.imagesLoaded = 0;
        this.totalImages = 0;
        this.init();
    }

    /**
     * Initialize performance manager
     */
    init() {
        this.setupImageLoading();
        this.setupPerformanceMonitoring();
    }

    /**
     * Set up enhanced image loading with lazy loading and error handling
     */
    setupImageLoading() {
        const images = document.querySelectorAll('img');
        this.totalImages = images.length;
        
        images.forEach(img => {
            this.setupSingleImage(img);
        });

        console.log(`📸 Image loading setup complete. Total images: ${this.totalImages}`);
    }

    /**
     * Set up individual image with loading states and error handling
     * @param {HTMLImageElement} img - Image element to set up
     */
    setupSingleImage(img) {
        // Add loading class initially
        img.classList.add('image-loading');
        
        // Add lazy loading attribute if not already present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Remove loading class when image loads successfully
        img.addEventListener('load', () => {
            img.classList.remove('image-loading');
            this.onImageLoaded();
        });
        
        // Handle image loading errors
        img.addEventListener('error', () => {
            this.handleImageError(img);
            this.onImageLoaded();
        });
    }

    /**
     * Handle image loading errors with fallback styling
     * @param {HTMLImageElement} img - Failed image element
     */
    handleImageError(img) {
        img.classList.remove('image-loading');
        img.classList.add('image-error');
        
        // Update alt text to indicate error
        img.alt = `Image unavailable: ${img.alt}`;
        
        // Apply error styling
        Object.assign(img.style, {
            background: 'var(--neutral-300)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            color: 'var(--text-muted)',
            fontSize: '14px',
            textAlign: 'center',
            padding: '20px',
            boxSizing: 'border-box'
        });

        console.warn(`⚠️ Image failed to load: ${img.src}`);
    }

    /**
     * Track individual image loading completion
     */
    onImageLoaded() {
        this.imagesLoaded++;
        
        // Log progress
        const progress = (this.imagesLoaded / this.totalImages * 100).toFixed(1);
        console.log(`📸 Image loading progress: ${this.imagesLoaded}/${this.totalImages} (${progress}%)`);
        
        // Check if all images are loaded
        if (this.imagesLoaded === this.totalImages) {
            console.log('✅ All images loaded successfully');
            this.onAllImagesLoaded();
        }
    }

    /**
     * Called when all images have finished loading (success or error)
     */
    onAllImagesLoaded() {
        // Dispatch custom event for other modules to listen to
        const event = new CustomEvent('allImagesLoaded', {
            detail: {
                total: this.totalImages,
                loaded: this.imagesLoaded
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Set up performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            this.logPageLoadPerformance();
        });

        // Monitor Core Web Vitals if supported
        if ('web-vital' in window || 'PerformanceObserver' in window) {
            this.setupWebVitalsMonitoring();
        }
    }

    /**
     * Log detailed page load performance metrics
     */
    logPageLoadPerformance() {
        try {
            const perfData = performance.getEntriesByType('navigation')[0];
            
            const metrics = {
                domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
                domInteractive: Math.round(perfData.domInteractive - perfData.fetchStart),
                firstPaint: this.getFirstPaint(),
                resources: this.getResourceMetrics()
            };
            
            console.log('📊 Page Load Performance:', metrics);
            
            // Log performance warnings if needed
            this.checkPerformanceThresholds(metrics);
            
        } catch (error) {
            console.warn('Performance monitoring error:', error);
        }
    }

    /**
     * Get First Paint timing if available
     * @returns {number|null} First Paint time in milliseconds
     */
    getFirstPaint() {
        try {
            const paintEntries = performance.getEntriesByType('paint');
            const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
            return firstPaint ? Math.round(firstPaint.startTime) : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Get resource loading metrics
     * @returns {Object} Resource metrics summary
     */
    getResourceMetrics() {
        try {
            const resources = performance.getEntriesByType('resource');
            const imageResources = resources.filter(resource => 
                resource.initiatorType === 'img' || 
                resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
            );
            
            return {
                totalResources: resources.length,
                imageResources: imageResources.length,
                avgImageLoadTime: imageResources.length > 0 
                    ? Math.round(imageResources.reduce((sum, img) => sum + img.duration, 0) / imageResources.length)
                    : 0
            };
        } catch (error) {
            return { totalResources: 0, imageResources: 0, avgImageLoadTime: 0 };
        }
    }

    /**
     * Check performance against recommended thresholds
     * @param {Object} metrics - Performance metrics
     */
    checkPerformanceThresholds(metrics) {
        const thresholds = {
            domContentLoaded: 1500,
            totalTime: 3000,
            firstPaint: 1000
        };

        Object.entries(thresholds).forEach(([metric, threshold]) => {
            if (metrics[metric] && metrics[metric] > threshold) {
                console.warn(`⚠️ Performance warning: ${metric} (${metrics[metric]}ms) exceeds recommended threshold (${threshold}ms)`);
            }
        });
    }

    /**
     * Set up Web Vitals monitoring if supported
     */
    setupWebVitalsMonitoring() {
        // Monitor Largest Contentful Paint (LCP)
        this.observeWebVital('largest-contentful-paint', (entries) => {
            const lcp = entries[entries.length - 1];
            console.log(`📊 Largest Contentful Paint: ${Math.round(lcp.startTime)}ms`);
        });

        // Monitor First Input Delay (FID)
        this.observeWebVital('first-input', (entries) => {
            const fid = entries[0];
            console.log(`📊 First Input Delay: ${Math.round(fid.processingStart - fid.startTime)}ms`);
        });

        // Monitor Cumulative Layout Shift (CLS)
        this.observeWebVital('layout-shift', (entries) => {
            let clsValue = 0;
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            if (clsValue > 0) {
                console.log(`📊 Cumulative Layout Shift: ${clsValue.toFixed(4)}`);
            }
        });
    }

    /**
     * Observe specific web vital metrics
     * @param {string} type - Metric type to observe
     * @param {Function} callback - Callback function for metric data
     */
    observeWebVital(type, callback) {
        try {
            const observer = new PerformanceObserver((list) => {
                callback(list.getEntries());
            });
            observer.observe({ type, buffered: true });
        } catch (error) {
            console.warn(`Web Vitals monitoring not supported for ${type}:`, error);
        }
    }

    /**
     * Get current performance summary
     * @returns {Object} Current performance status
     */
    getPerformanceSummary() {
        return {
            imagesLoaded: this.imagesLoaded,
            totalImages: this.totalImages,
            loadingProgress: this.totalImages > 0 ? (this.imagesLoaded / this.totalImages * 100).toFixed(1) : 100,
            allImagesLoaded: this.imagesLoaded === this.totalImages
        };
    }
}