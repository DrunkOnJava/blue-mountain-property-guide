#!/usr/bin/env node

/**
 * Pagination Validation Script for Blue Mountain Property Guide
 * 
 * This script enforces mandatory US Letter pagination rules and prevents
 * commits/builds when pagination overrides are detected.
 */

const fs = require('fs');
const path = require('path');

// Configuration for US Letter size requirements
const US_LETTER_CONFIG = {
    width: '8.5in',
    height: '11in',
    margins: {
        top: '0.75in',
        right: '0.5in', 
        bottom: '0.75in',
        left: '0.5in'
    },
    printableArea: {
        width: '7.5in',  // 8.5 - 0.5 - 0.5
        height: '9.5in'  // 11 - 0.75 - 0.75
    }
};

// Forbidden pagination overrides that will cause build/commit failures
const FORBIDDEN_OVERRIDES = [
    /\.paper-page[^{]*{[^}]*page-break-before:\s*(?!always)/i,
    /\.section-divider[^{]*{[^}]*page-break-before:\s*(?!always)/i,
    /\.paper-page[^{]*{[^}]*height:\s*(?!9\.5in\s*!important)/i,
    /\.paper-page[^{]*{[^}]*overflow:\s*(?!hidden)/i,
    /\.section-divider[^{]*{[^}]*overflow:\s*(?!hidden)/i
];

// Required pagination rules that must be present
const REQUIRED_RULES = [
    '@page',
    'size: 8.5in 11in',
    'margin: 0.75in 0.5in 0.75in 0.5in',
    '.paper-page',
    'page-break-before: always',
    'break-before: page'
];

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
            
            this.validatePageSize();
            this.validateMargins();
            this.validateForbiddenOverrides();
            this.validateRequiredRules();
            this.validatePaperPageStructure();
            this.validateSectionBreaks();
            
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

    validatePageSize() {
        const hasCorrectSize = this.content.includes('size: 8.5in 11in');
        if (!hasCorrectSize) {
            this.errors.push('CRITICAL: Missing mandatory US Letter page size (8.5in 11in)');
        }

        // Check for other @page size declarations (not font-size)
        const pageBlocks = this.content.match(/@page[^{]*{[^}]*size:\s*(?!8\.5in\s+11in)[^;}]+/gi);
        if (pageBlocks) {
            pageBlocks.forEach(block => {
                const sizeMatch = block.match(/size:\s*([^;}]+)/i);
                if (sizeMatch) {
                    this.errors.push(`FORBIDDEN: Non-US Letter @page size detected: ${sizeMatch[0]}`);
                }
            });
        }
    }

    validateMargins() {
        const correctMargins = 'margin: 0.75in 0.5in 0.75in 0.5in';
        const hasCorrectMargins = this.content.includes(correctMargins);
        
        if (!hasCorrectMargins) {
            this.errors.push(`CRITICAL: Missing mandatory US Letter margins (${correctMargins})`);
        }
    }

    validateForbiddenOverrides() {
        FORBIDDEN_OVERRIDES.forEach(pattern => {
            const matches = this.content.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    this.errors.push(`FORBIDDEN OVERRIDE: ${match} - This breaks US Letter compliance`);
                });
            }
        });
    }

    validateRequiredRules() {
        REQUIRED_RULES.forEach(rule => {
            if (!this.content.includes(rule)) {
                this.errors.push(`MISSING REQUIRED RULE: ${rule}`);
            }
        });
    }

    validatePaperPageStructure() {
        // Check that all .paper-page elements have proper height constraints
        const paperPageRegex = /\.paper-page\s*{[^}]*}/g;
        const paperPageBlocks = this.content.match(paperPageRegex);
        
        if (paperPageBlocks) {
            paperPageBlocks.forEach(block => {
                if (!block.includes('height: 9.5in') && !block.includes('min-height: 9.5in')) {
                    this.warnings.push(`Paper page block may be missing height constraint: ${block.substring(0, 50)}...`);
                }
            });
        }
    }

    validateSectionBreaks() {
        // Ensure section dividers have mandatory page breaks
        const sectionDividerRegex = /\.section-divider[^{]*{[^}]*}/g;
        const sectionBlocks = this.content.match(sectionDividerRegex);
        
        if (sectionBlocks) {
            sectionBlocks.forEach(block => {
                if (!block.includes('page-break-before: always') && !block.includes('break-before: page')) {
                    this.errors.push(`MISSING MANDATORY PAGE BREAK: Section divider must have page-break-before: always`);
                }
            });
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        console.error('Usage: node validate-pagination.js <file-path>');
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
        console.log('\n🚫 BUILD/COMMIT BLOCKED - Fix pagination violations above');
        process.exit(1);
    }

    console.log('\n✅ Pagination validation passed');
    console.log('📄 Document conforms to US Letter requirements');
    process.exit(0);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { PaginationValidator, US_LETTER_CONFIG };