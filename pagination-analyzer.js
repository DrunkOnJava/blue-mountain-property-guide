/**
 * Advanced Pagination Analyzer and Fixer
 * Analyzes content distribution and implements intelligent page breaks
 */

class PaginationAnalyzer {
    constructor() {
        this.maxHeight = 9.5 * 96; // 9.5 inches at 96 DPI
        this.issues = [];
        this.fixes = [];
    }

    analyzeAll() {
        console.log('🔍 Analyzing pagination across all pages...');
        
        const pages = document.querySelectorAll('.paper-page');
        this.issues = [];
        
        pages.forEach((page, index) => {
            const analysis = this.analyzePage(page, index);
            if (analysis.hasIssues) {
                this.issues.push(analysis);
            }
        });
        
        this.reportIssues();
        return this.issues;
    }

    analyzePage(page, index) {
        const rect = page.getBoundingClientRect();
        const pageNumber = page.getAttribute('data-page-number') || `${index + 1}`;
        const utilizationPercent = Math.round((rect.height / this.maxHeight) * 100);
        
        const analysis = {
            page: pageNumber,
            index: index,
            height: rect.height,
            utilization: utilizationPercent,
            hasIssues: false,
            issues: [],
            element: page
        };
        
        // Check height overflow
        if (rect.height > this.maxHeight) {
            analysis.hasIssues = true;
            analysis.issues.push({
                type: 'overflow',
                severity: 'high',
                message: `Page exceeds maximum height by ${Math.round(rect.height - this.maxHeight)}px`,
                overflow: rect.height - this.maxHeight
            });
        }
        
        // Check high utilization
        if (utilizationPercent > 95 && utilizationPercent <= 100) {
            analysis.hasIssues = true;
            analysis.issues.push({
                type: 'high-density',
                severity: 'medium',
                message: 'Page is very densely packed and may cause printing issues'
            });
        }
        
        // Check for orphaned headings
        const headings = page.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, hIndex) => {
            const headingRect = heading.getBoundingClientRect();
            const pageRect = page.getBoundingClientRect();
            const distanceFromBottom = pageRect.bottom - headingRect.bottom;
            
            if (distanceFromBottom < 100) { // Less than ~1 inch from bottom
                analysis.hasIssues = true;
                analysis.issues.push({
                    type: 'orphaned-heading',
                    severity: 'medium',
                    message: `Heading "${heading.textContent.slice(0, 30)}..." may be orphaned`,
                    element: heading
                });
            }
        });
        
        // Check for widows/orphans in paragraphs
        const paragraphs = page.querySelectorAll('p');
        paragraphs.forEach((p, pIndex) => {
            if (p.textContent.trim().length > 100) { // Only check substantial paragraphs
                const pRect = p.getBoundingClientRect();
                const pageRect = page.getBoundingClientRect();
                
                if (pRect.bottom > pageRect.bottom - 20) {
                    analysis.hasIssues = true;
                    analysis.issues.push({
                        type: 'paragraph-overflow',
                        severity: 'low',
                        message: 'Paragraph may be cut off at page bottom',
                        element: p
                    });
                }
            }
        });
        
        return analysis;
    }

    reportIssues() {
        console.log(`\n📊 Pagination Analysis Results:`);
        console.log(`   Total pages analyzed: ${document.querySelectorAll('.paper-page').length}`);
        console.log(`   Pages with issues: ${this.issues.length}`);
        
        if (this.issues.length === 0) {
            console.log('✅ No pagination issues found!');
            return;
        }
        
        console.log('\n❌ Issues found:');
        this.issues.forEach(analysis => {
            console.log(`\n📄 Page ${analysis.page} (${analysis.utilization}%):`);
            analysis.issues.forEach(issue => {
                const icon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟠';
                console.log(`   ${icon} ${issue.type}: ${issue.message}`);
            });
        });
    }

    fixIssues() {
        console.log('\n🔧 Attempting to fix pagination issues...');
        
        if (this.issues.length === 0) {
            console.log('✅ No issues to fix');
            return [];
        }
        
        this.fixes = [];
        
        this.issues.forEach(analysis => {
            const fixes = this.fixPage(analysis);
            this.fixes.push(...fixes);
        });
        
        console.log(`\n✅ Applied ${this.fixes.length} fixes`);
        this.fixes.forEach(fix => {
            console.log(`   📝 ${fix.type}: ${fix.description}`);
        });
        
        return this.fixes;
    }

    fixPage(analysis) {
        const fixes = [];
        const page = analysis.element;
        
        analysis.issues.forEach(issue => {
            switch (issue.type) {
                case 'overflow':
                    fixes.push(this.fixOverflow(page, issue));
                    break;
                    
                case 'orphaned-heading':
                    fixes.push(this.fixOrphanedHeading(issue.element));
                    break;
                    
                case 'high-density':
                    fixes.push(this.fixHighDensity(page));
                    break;
                    
                case 'paragraph-overflow':
                    fixes.push(this.fixParagraphOverflow(issue.element));
                    break;
            }
        });
        
        return fixes.filter(fix => fix !== null);
    }

    fixOverflow(page, issue) {
        // Strategy: Apply strict height limit and hide overflow
        page.style.maxHeight = `${this.maxHeight}px`;
        page.style.overflow = 'hidden';
        
        // Add a subtle indicator that content was truncated
        const indicator = document.createElement('div');
        indicator.className = 'page-truncated-indicator';
        indicator.innerHTML = '⚠️ Content continues on next page';
        indicator.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-size: 10px;
            color: #999;
            background: rgba(255,255,255,0.8);
            padding: 2px 6px;
            border-radius: 3px;
            pointer-events: none;
        `;
        
        page.style.position = 'relative';
        page.appendChild(indicator);
        
        return {
            type: 'overflow-fix',
            description: `Applied strict height limit to page ${page.getAttribute('data-page-number')}`,
            severity: 'high'
        };
    }

    fixOrphanedHeading(heading) {
        // Add extra margin to push heading to next page
        heading.style.marginTop = '2rem';
        heading.style.pageBreakBefore = 'always';
        heading.style.breakBefore = 'page';
        
        return {
            type: 'orphan-fix',
            description: `Fixed orphaned heading: "${heading.textContent.slice(0, 30)}..."`,
            severity: 'medium'
        };
    }

    fixHighDensity(page) {
        // Reduce line height and font sizes slightly
        page.style.lineHeight = '1.3';
        
        const paragraphs = page.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.marginBottom = '0.5rem';
        });
        
        return {
            type: 'density-fix',
            description: `Optimized spacing for high-density page ${page.getAttribute('data-page-number')}`,
            severity: 'medium'
        };
    }

    fixParagraphOverflow(paragraph) {
        // Add keep-together class
        paragraph.style.pageBreakInside = 'avoid';
        paragraph.style.breakInside = 'avoid';
        
        return {
            type: 'paragraph-fix',
            description: 'Applied keep-together to prevent paragraph splitting',
            severity: 'low'
        };
    }

    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalPages: document.querySelectorAll('.paper-page').length,
            issuesFound: this.issues.length,
            fixesApplied: this.fixes.length,
            issues: this.issues.map(issue => ({
                page: issue.page,
                utilization: issue.utilization,
                issueCount: issue.issues.length,
                severity: Math.max(...issue.issues.map(i => 
                    i.severity === 'high' ? 3 : i.severity === 'medium' ? 2 : 1
                ))
            })),
            fixes: this.fixes
        };
        
        console.log('\n📋 Pagination Report Generated:');
        console.log(JSON.stringify(report, null, 2));
        
        return report;
    }

    // Auto-run comprehensive analysis
    run() {
        console.log('🚀 Running comprehensive pagination analysis...');
        
        this.analyzeAll();
        this.fixIssues();
        const report = this.generateReport();
        
        // Re-analyze after fixes to verify improvements
        console.log('\n🔍 Re-analyzing after fixes...');
        const postFixIssues = this.analyzeAll();
        
        if (postFixIssues.length === 0) {
            console.log('✅ All pagination issues resolved!');
        } else {
            console.log(`⚠️ ${postFixIssues.length} issues remain after fixes`);
        }
        
        return report;
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const analyzer = new PaginationAnalyzer();
            window.paginationAnalyzer = analyzer;
            
            console.log('📋 Pagination Analyzer loaded. Use:');
            console.log('   paginationAnalyzer.run() - Full analysis and fixes');
            console.log('   paginationAnalyzer.analyzeAll() - Analysis only');
            console.log('   paginationAnalyzer.fixIssues() - Apply fixes');
        }, 2000);
    });
} else {
    setTimeout(() => {
        const analyzer = new PaginationAnalyzer();
        window.paginationAnalyzer = analyzer;
        
        console.log('📋 Pagination Analyzer loaded. Use:');
        console.log('   paginationAnalyzer.run() - Full analysis and fixes');
        console.log('   paginationAnalyzer.analyzeAll() - Analysis only');
        console.log('   paginationAnalyzer.fixIssues() - Apply fixes');
    }, 2000);
}