#!/usr/bin/env node

/**
 * Simplified Pagination Validation Script for Blue Mountain Property Guide
 * 
 * Focuses on critical US Letter compliance without over-validation
 */

const fs = require('fs');

class PaginationValidator {
    constructor(filePath) {
        this.filePath = filePath;
        this.errors = [];
        this.warnings = [];
        this.content = '';
    }

    async validate() {
        try {
            this.content = fs.readFileSync(this.filePath, 'utf8');
            
            this.validateCriticalPageSetup();
            this.validateForbiddenOverrides();
            
            return {
                isValid: this.errors.length === 0,
                errors: this.errors,
                warnings: this.warnings
            };
        } catch (error) {
            this.errors.push(`Failed to read file: ${error.message}`);
            return {
                isValid: false,
                errors: this.errors,
                warnings: this.warnings
            };
        }
    }

    validateCriticalPageSetup() {
        // Check for US Letter page size in @page rules
        const hasUSLetter = this.content.includes('size: 8.5in 11in');
        if (!hasUSLetter) {
            this.errors.push('CRITICAL: Missing US Letter page size (8.5in 11in) in @page rules');
        }

        // Check for proper margins
        const hasProperMargins = this.content.includes('margin: 0.75in 0.5in 0.75in 0.5in');
        if (!hasProperMargins) {
            this.errors.push('CRITICAL: Missing proper US Letter margins');
        }
    }

    validateForbiddenOverrides() {
        // Check for non-US Letter page sizes (but exclude the correct 8.5in 11in)
        const pageBlocks = this.content.match(/@page[^{]*{[^}]*}/g);
        if (pageBlocks) {
            pageBlocks.forEach(block => {
                const sizeMatch = block.match(/size:\s*([^;}]+)/);
                if (sizeMatch && !sizeMatch[1].includes('8.5in 11in')) {
                    // Only flag if it's clearly a different page size format
                    if (sizeMatch[1].match(/\d+(\.\d+)?\s*(in|mm|cm|pt)\s+\d+(\.\d+)?\s*(in|mm|cm|pt)/)) {
                        this.errors.push(`FORBIDDEN: Non-US Letter page size: ${sizeMatch[0]}`);
                    }
                }
            });
        }
        
        // Check for any explicit overrides that would disable pagination
        const dangerousOverrides = [
            'page-break: none',
            'break-before: avoid', 
            'break-after: avoid',
            'overflow: visible'
        ];
        
        dangerousOverrides.forEach(override => {
            if (this.content.includes(override)) {
                this.warnings.push(`POTENTIAL ISSUE: Found "${override}" which may affect pagination`);
            }
        });
        
        // Enhanced validation for content overflow
        this.validateContentOverflow();
        
        // Check for missing pagination enhancements
        this.validatePaginationEnhancements();
    }
    
    validateContentOverflow() {
        // Check for elements that might cause overflow
        const problematicPatterns = [
            { pattern: /height:\s*auto(?!\s*!important)/, message: 'Height auto without !important may cause issues' },
            { pattern: /min-height:\s*auto/, message: 'Min-height auto may cause pagination issues' },
            { pattern: /max-height:\s*none/, message: 'Max-height none may allow overflow' },
            { pattern: /overflow:\s*visible/, message: 'Overflow visible may break page boundaries' }
        ];
        
        problematicPatterns.forEach(({ pattern, message }) => {
            if (pattern.test(this.content)) {
                this.warnings.push(`OVERFLOW RISK: ${message}`);
            }
        });
    }
    
    validatePaginationEnhancements() {
        // Check if enhanced pagination CSS is included
        const hasEnhancements = this.content.includes('pagination-enhancements.css') || 
                               this.content.includes('Enhanced Pagination CSS');
        
        if (!hasEnhancements) {
            this.warnings.push('ENHANCEMENT: Consider including pagination-enhancements.css for better control');
        }
        
        // Check for pagination validator script
        const hasValidator = this.content.includes('pagination-validator.js') ||
                           this.content.includes('PaginationValidator');
        
        if (!hasValidator) {
            this.warnings.push('ENHANCEMENT: Consider including pagination-validator.js for real-time monitoring');
        }
        
        // Check for proper page break classes
        const essentialClasses = [
            '.paper-page',
            '.content-block',
            '.emergency-info',
            '.contact-card'
        ];
        
        essentialClasses.forEach(className => {
            if (!this.content.includes(className)) {
                this.warnings.push(`MISSING CLASS: ${className} not found - ensure proper pagination structure`);
            }
        });
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: node validate-pagination.cjs <file-path>');
        process.exit(1);
    }

    const filePath = args[0];
    const validator = new PaginationValidator(filePath);
    const result = await validator.validate();

    console.log('🔍 US Letter Pagination Validation Report');
    console.log('=' .repeat(50));

    if (result.warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:');
        result.warnings.forEach(warning => console.log(`   ${warning}`));
    }

    if (result.errors.length > 0) {
        console.log('\n❌ CRITICAL ERRORS:');
        result.errors.forEach(error => console.log(`   ${error}`));
        console.log('\n🚫 BUILD/COMMIT BLOCKED - Fix critical violations above');
        process.exit(1);
    }

    console.log('\n✅ Pagination validation passed');
    console.log('📄 Document conforms to US Letter requirements');
    process.exit(0);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { PaginationValidator };