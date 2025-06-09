#!/usr/bin/env node

/**
 * Blue Mountain Property Guide - Modular Build System
 * Combines modular sections into final index.html document
 */

const fs = require('fs');
const path = require('path');

class DocumentBuilder {
    constructor() {
        this.srcDir = path.join(__dirname, 'src');
        this.sectionsDir = path.join(this.srcDir, 'sections');
        this.templatesDir = path.join(this.srcDir, 'templates');
        this.outputDir = __dirname;
        
        this.buildInfo = this.generateBuildInfo();
        this.sections = [];
    }
    
    generateBuildInfo() {
        const timestamp = new Date().toISOString();
        const buildId = `build-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
        
        return {
            id: buildId,
            timestamp: timestamp,
            branch: this.getGitBranch(),
            commit: this.getGitCommit(),
            version: '2025.1.0'
        };
    }
    
    getGitBranch() {
        try {
            const { execSync } = require('child_process');
            return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        } catch (error) {
            return 'unknown';
        }
    }
    
    getGitCommit() {
        try {
            const { execSync } = require('child_process');
            return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
        } catch (error) {
            return 'unknown';
        }
    }
    
    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = {
            info: '📄',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            build: '🔨'
        }[type] || 'ℹ️';
        
        console.log(`${prefix} [${timestamp}] ${message}`);
    }
    
    async loadTemplate(templateName) {
        const templatePath = path.join(this.templatesDir, templateName);
        
        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }
        
        return fs.readFileSync(templatePath, 'utf8');
    }
    
    async loadSection(sectionName) {
        const sectionPath = path.join(this.sectionsDir, sectionName);
        
        if (!fs.existsSync(sectionPath)) {
            throw new Error(`Section not found: ${sectionPath}`);
        }
        
        return fs.readFileSync(sectionPath, 'utf8');
    }
    
    async buildDocument() {
        this.log(`Starting build process for Blue Mountain Property Guide`, 'build');
        this.log(`Build ID: ${this.buildInfo.id}`);
        this.log(`Branch: ${this.buildInfo.branch}, Commit: ${this.buildInfo.commit.slice(0, 8)}`);
        
        try {
            // Load document template
            this.log('Loading document template...');
            const documentTemplate = await this.loadTemplate('document-template.html');
            
            // Build content sections
            const content = await this.buildContent();
            
            // Replace template variables
            let finalDocument = documentTemplate
                .replace('{{BUILD_ID}}', this.buildInfo.id)
                .replace('{{COMMIT_HASH}}', this.buildInfo.commit)
                .replace('{{BRANCH_NAME}}', this.buildInfo.branch)
                .replace('{{BUILD_TIMESTAMP}}', this.buildInfo.timestamp)
                .replace('{{DOCUMENT_CONTENT}}', content);
            
            // Write final document
            const outputPath = path.join(this.outputDir, 'index.html');
            fs.writeFileSync(outputPath, finalDocument, 'utf8');
            
            this.log(`Document built successfully: ${outputPath}`, 'success');
            this.log(`Document size: ${Math.round(finalDocument.length / 1024)} KB`);
            
            // Generate build report
            await this.generateBuildReport();
            
            return outputPath;
            
        } catch (error) {
            this.log(`Build failed: ${error.message}`, 'error');
            throw error;
        }
    }
    
    async buildContent() {
        this.log('Building document content...');
        
        const sections = [
            { file: 'cover.html', title: 'Cover Page' },
            { file: 'toc.html', title: 'Table of Contents' },
            { section: 'governance', title: 'Governance & Structure', number: 'I' },
            { section: 'community', title: 'A Mountain Home', number: 'II' },
            { section: 'wood-chipping', title: 'Wood-Chipping Program', number: 'III' },
            { section: 'fire-safety', title: 'Fire Safety & Emergency Preparedness', number: 'IV' },
            { section: 'services', title: 'Community Services & Amenities', number: 'V' },
            { section: 'deer-lake', title: 'Deer Lake Recreation Area', number: 'VI' },
            { section: 'lodge', title: 'The Lodge', number: 'VII' },
            { section: 'communication', title: 'Community Communication', number: 'VIII' },
            { section: 'contacts', title: 'Contacts & Resources', number: 'IX' }
        ];
        
        let contentParts = [];
        
        for (const section of sections) {
            try {
                if (section.file) {
                    // Direct file inclusion (cover, toc)
                    this.log(`Loading ${section.title}...`);
                    const content = await this.loadSection(section.file);
                    contentParts.push(content);
                } else {
                    // Section with potential divider
                    this.log(`Building ${section.title} (Section ${section.number})...`);
                    const sectionContent = await this.buildSection(section);
                    contentParts.push(sectionContent);
                }
            } catch (error) {
                this.log(`Warning: Could not load ${section.title}: ${error.message}`, 'warning');
                // Continue building without this section
            }
        }
        
        return contentParts.join('\n\n');
    }
    
    async buildSection(sectionConfig) {
        const { section, title, number } = sectionConfig;
        
        // Check for direct section file first
        const directSectionFile = path.join(this.sectionsDir, `${section}.html`);
        if (fs.existsSync(directSectionFile)) {
            this.log(`Found direct section file: ${section}.html`);
            const sectionContent = fs.readFileSync(directSectionFile, 'utf8');
            
            // Generate section divider + content
            const sectionDivider = this.createSectionDivider(sectionConfig);
            return sectionDivider + '\n\n' + sectionContent;
        }
        
        // Check if section directory exists
        const sectionDir = path.join(this.sectionsDir, section);
        if (!fs.existsSync(sectionDir)) {
            this.log(`No section file or directory found: ${section}, creating placeholder`, 'warning');
            return this.createSectionPlaceholder(sectionConfig);
        }
        
        // Look for section content files
        const files = fs.readdirSync(sectionDir);
        const contentFiles = files.filter(file => file.endsWith('.html')).sort();
        
        if (contentFiles.length === 0) {
            this.log(`No content files found in ${section}, creating placeholder`, 'warning');
            return this.createSectionPlaceholder(sectionConfig);
        }
        
        // Build section content
        let sectionContent = '';
        for (const file of contentFiles) {
            const filePath = path.join(sectionDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            sectionContent += content + '\n';
        }
        
        // Generate section divider + content
        const sectionDivider = this.createSectionDivider(sectionConfig);
        return sectionDivider + '\n\n' + sectionContent;
    }
    
    createSectionDivider(sectionConfig) {
        const { section, title, number } = sectionConfig;
        
        return `
<!-- Section ${number}: ${title} - Section Divider -->
<div class="paper-page section-divider" data-page-number="divider">
    <div class="section-divider-content">
        <div class="section-number">${number}</div>
        <div class="section-title">${title.toUpperCase()}</div>
        <div class="section-decoration">
            <div class="section-line"></div>
            <div class="section-emblem">
                <img src="./optimized/bmpoa-emblem.png" alt="BMPOA Emblem" class="emblem-image">
            </div>
            <div class="section-line"></div>
        </div>
        <div class="section-subtitle">${this.generateSectionSubtitle(section)}</div>
    </div>
</div>`;
    }

    createSectionPlaceholder(sectionConfig) {
        const { section, title, number } = sectionConfig;
        
        return `
<!-- Section ${number}: ${title} - Placeholder -->
<div class="paper-page section-divider" data-page-number="placeholder">
    <div class="section-divider-content">
        <div class="section-number">${number}</div>
        <div class="section-title">${title.toUpperCase()}</div>
        <div class="section-decoration">
            <div class="section-line"></div>
            <div class="section-emblem">
                <img src="./optimized/bmpoa-emblem.png" alt="BMPOA Emblem" class="emblem-image">
            </div>
            <div class="section-line"></div>
        </div>
        <div class="section-subtitle">${this.generateSectionSubtitle(section)}</div>
    </div>
</div>

<div class="paper-page" data-page-number="${section}-1">
    <div class="page-content">
        <h2>Section ${number}: ${title}</h2>
        <div class="alert-box">
            <h3>Content Coming Soon</h3>
            <p>This section is currently being modularized. Content will be available in the next build.</p>
            <p><strong>Section:</strong> ${section}</p>
            <p><strong>Build:</strong> ${this.buildInfo.id}</p>
        </div>
    </div>
</div>
        `;
    }
    
    generateSectionSubtitle(sectionKey) {
        const subtitles = {
            'governance': 'Board Structure, Meetings & Construction Requirements',
            'community': 'History, Residents & Natural Beauty',
            'wood-chipping': 'Annual Chipping & Fire Mitigation Program',
            'fire-safety': 'Wildfire Preparedness & Emergency Planning',
            'services': 'Roads, Refuse Collection & Local Amenities',
            'deer-lake': 'Recreation Area Access & Guidelines',
            'lodge': 'Lodge Rental Information & Usage Guidelines',
            'communication': 'Social Events & Community Resources',
            'contacts': 'Emergency Numbers & Contact Directory'
        };
        
        return subtitles[sectionKey] || 'Blue Mountain Property Owners Association';
    }
    
    async generateBuildReport() {
        const reportPath = path.join(this.outputDir, 'build-report.json');
        
        const report = {
            build: this.buildInfo,
            timestamp: new Date().toISOString(),
            status: 'success',
            sections: this.sections,
            files: {
                output: 'index.html',
                size: fs.statSync(path.join(this.outputDir, 'index.html')).size,
                template: 'src/templates/document-template.html'
            },
            environment: {
                node: process.version,
                platform: process.platform,
                cwd: process.cwd()
            }
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
        this.log(`Build report generated: ${reportPath}`, 'info');
    }
    
    async clean() {
        this.log('Cleaning build artifacts...');
        
        const artifactsToClean = [
            'build-report.json'
        ];
        
        for (const artifact of artifactsToClean) {
            const artifactPath = path.join(this.outputDir, artifact);
            if (fs.existsSync(artifactPath)) {
                fs.unlinkSync(artifactPath);
                this.log(`Removed: ${artifact}`);
            }
        }
    }
    
    async watch() {
        this.log('Starting watch mode...', 'info');
        
        const chokidar = require('chokidar');
        const watcher = chokidar.watch([
            this.sectionsDir,
            this.templatesDir,
            path.join(this.srcDir, 'styles'),
            path.join(this.srcDir, 'scripts')
        ], {
            ignored: /(^|[\/\\])\../,
            persistent: true
        });
        
        let buildTimeout;
        
        watcher.on('change', (filePath) => {
            this.log(`File changed: ${path.relative(__dirname, filePath)}`, 'info');
            
            // Debounce builds
            clearTimeout(buildTimeout);
            buildTimeout = setTimeout(async () => {
                try {
                    await this.buildDocument();
                    this.log('Auto-rebuild completed', 'success');
                } catch (error) {
                    this.log(`Auto-rebuild failed: ${error.message}`, 'error');
                }
            }, 1000);
        });
        
        this.log('Watching for changes... Press Ctrl+C to stop', 'info');
        
        // Initial build
        await this.buildDocument();
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const builder = new DocumentBuilder();
    
    try {
        if (args.includes('--help') || args.includes('-h')) {
            console.log(`
Blue Mountain Property Guide - Build System

Usage: node build.js [options]

Options:
  --watch, -w     Watch for changes and auto-rebuild
  --clean, -c     Clean build artifacts
  --help, -h      Show this help message

Examples:
  node build.js                    # Build document once
  node build.js --watch            # Build and watch for changes
  node build.js --clean            # Clean build artifacts
            `);
            process.exit(0);
        }
        
        if (args.includes('--clean') || args.includes('-c')) {
            await builder.clean();
            return;
        }
        
        if (args.includes('--watch') || args.includes('-w')) {
            await builder.watch();
        } else {
            await builder.buildDocument();
        }
        
    } catch (error) {
        console.error(`❌ Build failed: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { DocumentBuilder };