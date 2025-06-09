#!/usr/bin/env node

/**
 * Puppeteer Page Screenshot Generator
 * 
 * Takes screenshots of every page in the Blue Mountain Property Guide
 * and saves them to the build folder for documentation/review purposes.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PageScreenshotter {
    constructor() {
        this.browser = null;
        this.page = null;
        this.buildDir = path.join(__dirname, 'build', 'screenshots');
        this.baseUrl = 'http://localhost:3000';
    }

    async initialize() {
        // Create build directory
        if (!fs.existsSync(this.buildDir)) {
            fs.mkdirSync(this.buildDir, { recursive: true });
            console.log(`📁 Created build directory: ${this.buildDir}`);
        }

        // Launch browser
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]
        });

        this.page = await this.browser.newPage();
        
        // Set US Letter page size (8.5" x 11" at 96 DPI)
        await this.page.setViewport({
            width: 816,  // 8.5 * 96
            height: 1056, // 11 * 96
            deviceScaleFactor: 1
        });

        console.log('🚀 Browser initialized with US Letter dimensions');
    }

    async navigateToDocument() {
        try {
            await this.page.goto(this.baseUrl, { 
                waitUntil: 'networkidle0',
                timeout: 30000 
            });
            console.log(`📄 Loaded document from ${this.baseUrl}`);
        } catch (error) {
            console.error('❌ Failed to load document. Make sure Vite dev server is running on port 3000');
            console.error('   Run: npm run dev');
            throw error;
        }
    }

    async detectPages() {
        // Get all elements with paper-page class
        const pages = await this.page.$$('.paper-page');
        console.log(`📋 Detected ${pages.length} pages in document`);
        return pages;
    }

    async screenshotPage(pageElement, pageNumber) {
        try {
            // Scroll page into view
            await pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Wait for scroll to complete
            await this.page.waitForTimeout(500);

            // Take screenshot of the specific page element
            const screenshot = await pageElement.screenshot({
                type: 'png',
                quality: 90,
                fullPage: false
            });

            // Save screenshot
            const filename = `page-${pageNumber.toString().padStart(2, '0')}.png`;
            const filepath = path.join(this.buildDir, filename);
            fs.writeFileSync(filepath, screenshot);

            console.log(`📸 Saved page ${pageNumber}: ${filename}`);
            return filepath;
        } catch (error) {
            console.error(`❌ Failed to screenshot page ${pageNumber}:`, error.message);
            return null;
        }
    }

    async screenshotAllPages() {
        console.log('🔍 Starting page detection and screenshot process...');
        
        const pages = await this.detectPages();
        const screenshots = [];

        for (let i = 0; i < pages.length; i++) {
            const pageNumber = i + 1;
            console.log(`📷 Processing page ${pageNumber}/${pages.length}...`);
            
            const filepath = await this.screenshotPage(pages[i], pageNumber);
            if (filepath) {
                screenshots.push({
                    page: pageNumber,
                    file: path.basename(filepath),
                    path: filepath
                });
            }

            // Small delay between screenshots
            await this.page.waitForTimeout(200);
        }

        return screenshots;
    }

    async generateIndex(screenshots) {
        const indexPath = path.join(this.buildDir, 'index.html');
        
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blue Mountain Property Guide - Page Screenshots</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background: #f5f5f5; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
        }
        .grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
        }
        .page-card { 
            background: white; 
            border-radius: 8px; 
            padding: 15px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        }
        .page-image { 
            width: 100%; 
            height: auto; 
            border: 1px solid #ddd; 
            border-radius: 4px; 
        }
        .page-title { 
            margin: 10px 0 5px 0; 
            font-weight: bold; 
        }
        .timestamp { 
            color: #666; 
            font-size: 0.9em; 
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📄 Blue Mountain Property Guide</h1>
        <h2>Page Screenshots</h2>
        <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
        <p>Total Pages: ${screenshots.length}</p>
    </div>
    
    <div class="grid">
        ${screenshots.map(shot => `
            <div class="page-card">
                <img src="${shot.file}" alt="Page ${shot.page}" class="page-image" />
                <div class="page-title">Page ${shot.page}</div>
                <div class="timestamp">${shot.file}</div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;

        fs.writeFileSync(indexPath, html);
        console.log(`📋 Generated index: ${indexPath}`);
        return indexPath;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔒 Browser closed');
        }
    }

    async run() {
        try {
            await this.initialize();
            await this.navigateToDocument();
            const screenshots = await this.screenshotAllPages();
            
            if (screenshots.length > 0) {
                await this.generateIndex(screenshots);
                console.log('');
                console.log('✅ Screenshot generation complete!');
                console.log(`📁 Location: ${this.buildDir}`);
                console.log(`🌐 View index: ${path.join(this.buildDir, 'index.html')}`);
                console.log(`📸 ${screenshots.length} pages captured`);
            } else {
                console.log('⚠️  No screenshots were generated');
            }
        } catch (error) {
            console.error('❌ Screenshot generation failed:', error.message);
            process.exit(1);
        } finally {
            await this.cleanup();
        }
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
📷 Blue Mountain Property Guide Screenshot Generator

Usage: node screenshot-pages.js [options]

Options:
  --help, -h     Show this help message

Requirements:
  - Vite dev server running on http://localhost:3000
  - Puppeteer installed (npm install puppeteer)

Example:
  npm run dev    # Start development server
  node screenshot-pages.js    # Generate screenshots
`);
        process.exit(0);
    }

    const screenshotter = new PageScreenshotter();
    await screenshotter.run();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { PageScreenshotter };