# 📸 Page Screenshot Generation

This project includes an automated screenshot system that captures every page of the Blue Mountain Property Guide document.

## 🤖 Automated Generation

Screenshots are **automatically generated** on every commit to GitHub through GitHub Actions:

- ✅ **On Push**: Screenshots generated when `main` or `develop` branches are updated
- ✅ **On PR**: Screenshots generated for pull requests with visual changes
- ✅ **Manual Trigger**: Can be run manually from GitHub Actions tab
- ✅ **Artifact Storage**: Screenshots saved as downloadable artifacts (30-day retention)

## Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# In another terminal, generate screenshots
npm run screenshot
```

## What It Does

The screenshot generator:
- 🎯 Detects all `.paper-page` elements in the document
- 📏 Uses proper US Letter dimensions (8.5" x 11")
- 📸 Captures each page as a high-quality PNG
- 📁 Saves screenshots to `build/screenshots/`
- 🌐 Creates an HTML index for easy browsing

## Output Structure

```
build/
└── screenshots/
    ├── index.html          # Visual index of all pages
    ├── page-01.png         # Cover page
    ├── page-02.png         # Table of contents
    ├── page-03.png         # Emergency contacts
    └── ...                 # All document pages
```

## Requirements

- ✅ Vite development server running (`npm run dev`)
- ✅ Puppeteer installed (included in devDependencies)
- ✅ Modern Node.js (v16+)

## Usage Options

```bash
# Generate screenshots
npm run screenshot

# Show help
npm run screenshot:help

# Direct script execution
node screenshot-pages.js
```

## Features

- **Page Detection**: Automatically finds all document pages
- **US Letter Compliance**: Screenshots match print dimensions
- **Quality**: High-resolution PNG output (90% quality)
- **Visual Index**: Generated HTML gallery for review
- **Error Handling**: Graceful failure with detailed logging
- **Build Integration**: Can be included in build pipeline

## Troubleshooting

**Server not running:**
```bash
npm run dev
# Wait for "Local: http://localhost:3000"
# Then run screenshots in new terminal
```

**Permission errors:**
```bash
chmod +x screenshot-pages.js
```

**Missing dependencies:**
```bash
npm install
```

## GitHub Actions Integration

Two automated workflows handle screenshot generation:

### 1. Full Deployment (`deploy-pages.yml`)
- Runs on commits to `main`
- Validates pagination → Generates screenshots → Deploys to GitHub Pages
- Screenshots included in live site at `/build/screenshots/`

### 2. Screenshot-Only (`screenshots.yml`)
- Runs on any visual changes (`index.html`, CSS, images)
- Fast screenshot generation without full deployment
- Perfect for PR review and validation
- Manual trigger available

### Accessing Screenshots

**From GitHub:**
1. Go to Actions tab → Latest workflow run
2. Download "page-screenshots" artifact
3. Extract and open `index.html`

**From Deployed Site:**
- Visit: `https://your-username.github.io/your-repo/build/screenshots/`

## Integration

The screenshot system is perfect for:
- 📋 **Automated Review**: Every commit gets visual validation
- 🖨️ **Print Verification**: US Letter compliance checking  
- 📊 **Progress Tracking**: Visual changelog of document evolution
- 🔍 **Quality Assurance**: Catch layout issues before deployment
- 📤 **Stakeholder Sharing**: Easy access to current document state