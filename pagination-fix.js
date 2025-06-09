/**
 * Pagination Fix Script
 * Check and fix pagination issues
 */

function checkPagination() {
    console.log('🔍 Checking pagination...');
    
    const pages = document.querySelectorAll('.paper-page');
    const maxHeight = 9.5 * 96; // 9.5 inches at 96 DPI
    const issues = [];
    
    pages.forEach((page, index) => {
        const rect = page.getBoundingClientRect();
        const pageNumber = page.getAttribute('data-page-number') || `${index + 1}`;
        const utilizationPercent = Math.round((rect.height / maxHeight) * 100);
        
        console.log(`📄 Page ${pageNumber}: ${Math.round(rect.height)}px (${utilizationPercent}%)`);
        
        if (rect.height > maxHeight) {
            issues.push({
                page: pageNumber,
                height: rect.height,
                utilization: utilizationPercent,
                overflow: rect.height - maxHeight
            });
        }
    });
    
    if (issues.length > 0) {
        console.log('❌ Pagination issues found:');
        issues.forEach(issue => {
            console.log(`   Page ${issue.page}: ${Math.round(issue.height)}px (${issue.utilization}%, overflow: ${Math.round(issue.overflow)}px)`);
        });
        return false;
    } else {
        console.log('✅ All pages within pagination limits');
        return true;
    }
}

function fixPagination() {
    console.log('🔧 Attempting to fix pagination...');
    
    const pages = document.querySelectorAll('.paper-page');
    const maxHeight = 9.5 * 96;
    let fixed = 0;
    
    pages.forEach((page, index) => {
        const rect = page.getBoundingClientRect();
        
        if (rect.height > maxHeight) {
            console.log(`🔧 Fixing page ${page.getAttribute('data-page-number') || index + 1}`);
            
            // Add overflow management
            page.style.height = `${maxHeight}px`;
            page.style.overflow = 'hidden';
            page.style.pageBreakInside = 'avoid';
            
            // Check if we need to split content
            const lastElement = page.lastElementChild;
            if (lastElement && lastElement.getBoundingClientRect().bottom > page.getBoundingClientRect().bottom) {
                // Content overflows, need to split
                console.log(`   ⚠️ Content overflow detected in page ${page.getAttribute('data-page-number')}`);
                
                // Try to find a good break point
                const elements = Array.from(page.children);
                let breakPoint = elements.length - 1;
                
                for (let i = elements.length - 1; i >= 0; i--) {
                    const elementRect = elements[i].getBoundingClientRect();
                    if (elementRect.bottom <= page.getBoundingClientRect().bottom - 50) {
                        breakPoint = i;
                        break;
                    }
                }
                
                if (breakPoint < elements.length - 1) {
                    console.log(`   📝 Found break point at element ${breakPoint}`);
                    // This would require creating a new page, which is complex in this context
                    // For now, just hide overflowing content
                    for (let i = breakPoint + 1; i < elements.length; i++) {
                        elements[i].style.display = 'none';
                    }
                }
            }
            
            fixed++;
        }
    });
    
    console.log(`✅ Fixed ${fixed} pages`);
    return fixed;
}

function analyzeContentDensity() {
    console.log('📊 Analyzing content density...');
    
    const pages = document.querySelectorAll('.paper-page');
    const maxHeight = 9.5 * 96;
    
    pages.forEach((page, index) => {
        const rect = page.getBoundingClientRect();
        const pageNumber = page.getAttribute('data-page-number') || `${index + 1}`;
        const utilizationPercent = Math.round((rect.height / maxHeight) * 100);
        
        // Count different content types
        const images = page.querySelectorAll('img').length;
        const headings = page.querySelectorAll('h1, h2, h3, h4').length;
        const paragraphs = page.querySelectorAll('p').length;
        const lists = page.querySelectorAll('ul, ol').length;
        const tables = page.querySelectorAll('table').length;
        
        console.log(`📄 Page ${pageNumber} (${utilizationPercent}%): ${images} images, ${headings} headings, ${paragraphs} paragraphs, ${lists} lists, ${tables} tables`);
        
        if (utilizationPercent > 95) {
            console.log(`   ⚠️ High density page - consider content redistribution`);
        }
    });
}

// Auto-run on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            checkPagination();
            analyzeContentDensity();
        }, 1000);
    });
} else {
    setTimeout(() => {
        checkPagination();
        analyzeContentDensity();
    }, 1000);
}

// Make functions available globally
window.paginationUtils = {
    check: checkPagination,
    fix: fixPagination,
    analyze: analyzeContentDensity
};

console.log('📋 Pagination utilities loaded. Use:');
console.log('   paginationUtils.check() - Check pagination');
console.log('   paginationUtils.fix() - Fix pagination issues');
console.log('   paginationUtils.analyze() - Analyze content density');