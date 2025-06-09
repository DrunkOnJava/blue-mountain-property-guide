# 📸 Page Screenshot Generation

This project includes an automated screenshot system that captures every page of the Blue Mountain Property Guide document.

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

## Integration

Add to build process:
```json
{
  "scripts": {
    "build:full": "npm run build && npm run screenshot"
  }
}
```

The screenshot system is perfect for:
- 📋 Document review and approval
- 🖨️ Print layout verification
- 📊 Progress tracking
- 🔍 Quality assurance
- 📤 Sharing preview versions