/**
 * Public Error Display Configuration
 * Optimized for showing error console to all website visitors
 */

// Auto-initialize error display for all users when DOM loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePublicErrorDisplay);
} else {
    initializePublicErrorDisplay();
}

function initializePublicErrorDisplay() {
    // Configure error display for public visibility
    const publicErrorDisplay = new ErrorDisplaySystem({
        position: 'top-right',
        maxErrors: 20, // Limit for better performance
        autoHide: false,
        enableNotifications: false, // Disable browser notifications for public users
        updateInterval: 3000, // Slightly slower refresh for public
        publicMode: true,
        startVisible: true
    });
    
    // Configure build console for public visibility (minimized)
    const publicBuildConsole = new BuildErrorConsole({
        maxBuilds: 10, // Fewer builds for public users
        enablePersistence: false, // Don't persist for public users
        enableGitHubIntegration: true,
        checkInterval: 60000, // Less frequent checks for public
        publicMode: true,
        startMinimized: true
    });
    
    // Show helpful welcome message for visitors
    setTimeout(() => {
        console.log(`
🌐 BLUE MOUNTAIN PROPERTY GUIDE - QUALITY MONITORING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👁️  REAL-TIME QUALITY MONITORING ACTIVE
This document is monitored for quality issues in real-time.

🎛️  WHAT YOU'RE SEEING:
• Error Console (top-right): Shows document issues like broken images, layout problems
• Build Console (bottom-left): Shows build information and error history

⌨️  KEYBOARD SHORTCUTS:
• Ctrl + E: Toggle error console visibility
• Ctrl + B: Toggle build console visibility
• Ctrl + Shift + E: Clear all current errors

📊 FOR DEVELOPERS:
• Open browser console for advanced testing commands
• Type 'paginationTests.runAll()' to run comprehensive tests
• Type 'errorDisplay.generateDetailedReport()' for detailed analysis

🔄 AUTOMATIC FEATURES:
• Real-time error detection every 3 seconds
• Broken image monitoring
• Page overflow detection  
• Print quality validation
• Accessibility checking

This ensures the highest quality for the Blue Mountain Property Guide.
        `);
    }, 2000);
    
    // Add a small info badge to let users know about the monitoring
    addQualityBadge();
    
    // Make error display and build console globally accessible
    window.publicErrorDisplay = publicErrorDisplay;
    window.publicBuildConsole = publicBuildConsole;
    
    // Set up public-friendly error handling
    setupPublicErrorHandling();
}

function addQualityBadge() {
    // Create a small quality monitoring badge
    const badge = document.createElement('div');
    badge.id = 'quality-monitor-badge';
    badge.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
        z-index: 999997;
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
        display: flex;
        align-items: center;
        gap: 6px;
    `;
    
    badge.innerHTML = `
        <span style="font-size: 12px;">✅</span>
        <span>Quality Monitored</span>
    `;
    
    // Add hover effect
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.05)';
        badge.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
    });
    
    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1)';
        badge.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
    });
    
    // Click to show error console
    badge.addEventListener('click', () => {
        if (window.publicErrorDisplay) {
            window.publicErrorDisplay.showConsole();
        }
    });
    
    document.body.appendChild(badge);
    
    // Update badge based on error status
    updateQualityBadge();
    
    // Update badge every 5 seconds
    setInterval(updateQualityBadge, 5000);
}

function updateQualityBadge() {
    const badge = document.getElementById('quality-monitor-badge');
    if (!badge || !window.publicErrorDisplay) return;
    
    const errorCount = window.publicErrorDisplay.errors.length;
    const warningCount = window.publicErrorDisplay.warnings.length;
    
    if (errorCount > 0) {
        badge.style.background = 'linear-gradient(135deg, #dc3545 0%, #e55353 100%)';
        badge.innerHTML = `
            <span style="font-size: 12px;">🚨</span>
            <span>${errorCount} Error${errorCount > 1 ? 's' : ''}</span>
        `;
        badge.title = `${errorCount} errors, ${warningCount} warnings detected. Click to view details.`;
    } else if (warningCount > 0) {
        badge.style.background = 'linear-gradient(135deg, #ffc107 0%, #ffcd39 100%)';
        badge.innerHTML = `
            <span style="font-size: 12px;">⚠️</span>
            <span>${warningCount} Warning${warningCount > 1 ? 's' : ''}</span>
        `;
        badge.title = `${warningCount} warnings detected. Click to view details.`;
    } else {
        badge.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        badge.innerHTML = `
            <span style="font-size: 12px;">✅</span>
            <span>Quality Monitored</span>
        `;
        badge.title = 'Document quality monitoring active. No issues detected.';
    }
}

function setupPublicErrorHandling() {
    // Add helpful tooltips for common error types
    const errorTooltips = {
        'Broken Image': 'Some images failed to load. This might be temporary or indicate missing files.',
        'Page Content Overflow': 'Content exceeds the recommended page size for printing.',
        'Page Nearly Full': 'Page is approaching the recommended content limit.',
        'Missing Alt Text': 'Images are missing accessibility descriptions for screen readers.',
        'Image Too Large for Print': 'Image size exceeds optimal dimensions for printing.',
        'Heading Hierarchy Issue': 'Document structure could be improved for better accessibility.'
    };
    
    // Override the error item creation to add public-friendly messaging
    if (window.ErrorDisplaySystem) {
        const originalCreateErrorItem = ErrorDisplaySystem.prototype.createErrorItem;
        ErrorDisplaySystem.prototype.createErrorItem = function(issue, index) {
            const item = originalCreateErrorItem.call(this, issue, index);
            
            // Add friendly explanation for public users
            const tooltip = errorTooltips[issue.title];
            if (tooltip) {
                const explanation = document.createElement('div');
                explanation.style.cssText = `
                    font-size: 10px;
                    color: #6c757d;
                    margin-top: 4px;
                    padding: 4px 8px;
                    background: rgba(108, 117, 125, 0.1);
                    border-radius: 4px;
                    font-style: italic;
                `;
                explanation.textContent = tooltip;
                item.appendChild(explanation);
            }
            
            return item;
        };
    }
    
    // Add periodic quality announcements (less frequent for public users)
    setInterval(() => {
        if (window.publicErrorDisplay) {
            const errorCount = window.publicErrorDisplay.errors.length;
            const warningCount = window.publicErrorDisplay.warnings.length;
            
            if (errorCount === 0 && warningCount === 0) {
                console.log('✅ Document quality check: All systems green');
            } else {
                console.log(`📊 Document quality check: ${errorCount} errors, ${warningCount} warnings`);
            }
        }
    }, 300000); // Every 5 minutes
}

// Add global helper functions for public users
window.documentQuality = {
    showErrors: () => {
        if (window.publicErrorDisplay) {
            window.publicErrorDisplay.showConsole();
        }
    },
    
    hideErrors: () => {
        if (window.publicErrorDisplay) {
            window.publicErrorDisplay.hideConsole();
        }
    },
    
    refreshCheck: () => {
        if (window.publicErrorDisplay) {
            window.publicErrorDisplay.refreshScan();
            console.log('🔄 Document quality check refreshed');
        }
    },
    
    getStatus: () => {
        if (window.publicErrorDisplay) {
            const errors = window.publicErrorDisplay.errors.length;
            const warnings = window.publicErrorDisplay.warnings.length;
            return { errors, warnings, status: errors > 0 ? 'error' : warnings > 0 ? 'warning' : 'good' };
        }
        return { errors: 0, warnings: 0, status: 'unknown' };
    },
    
    generateReport: () => {
        if (window.publicErrorDisplay) {
            window.publicErrorDisplay.generateDetailedReport();
        }
    }
};

// Let users know about the helper functions
setTimeout(() => {
    console.log(`
📚 PUBLIC HELPER FUNCTIONS AVAILABLE:

documentQuality.showErrors()     - Show error console
documentQuality.hideErrors()     - Hide error console  
documentQuality.refreshCheck()   - Refresh quality check
documentQuality.getStatus()      - Get current status
documentQuality.generateReport() - Generate detailed report

Example: documentQuality.getStatus()
    `);
}, 5000);

console.log('🌐 Public error display system initialized');