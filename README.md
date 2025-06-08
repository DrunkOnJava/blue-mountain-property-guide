# Blue Mountain Property Owners Association Guide

A comprehensive interactive guide for residents of Blue Mountain, Linden, Virginia. This document provides essential information about community governance, services, amenities, and living guidelines.

## 🏔️ Features

- **Professional Print Layout**: Optimized for printing with proper page breaks
- **Responsive Design**: Works on desktop, tablet, and mobile devices  
- **Interactive Navigation**: Table of contents with smooth scrolling
- **Image Gallery**: Professional integration of community photos
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Comprehensive Templates**: Standardized formatting system for consistency

## 🚀 Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/DrunkOnJava/blue-mountain-property-guide.git
   cd blue-mountain-property-guide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Opens automatically at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally  
- `npm run serve` - Serve production build on port 4173
- `npm run clean` - Clean build cache and dependencies

## 📁 Project Structure

```
blue-mountain-property-guide/
├── index.html              # Main guide document
├── TEMPLATE_EXAMPLES.html   # Live formatting examples
├── FORMATTING_RULEBOOK.md   # Complete formatting documentation
├── optimized/              # Optimized images and assets
├── vite.config.js          # Vite configuration
├── package.json            # Project dependencies and scripts
└── README.md              # This file
```

## 🎨 Formatting System

The project includes a comprehensive formatting system with:

### Template Categories
- **Section Dividers** (4 types: standard, subtle, bold, seasonal)
- **Table Templates** (3 types: standard, compact, borderless)  
- **Presentation Containers** (7 types: highlight, warning, info, success, quote, card, featured)
- **List Templates** (5 types: standard, compact, spaced, checklist, custom-numbered)
- **Dual Column Layouts** (5 responsive grid options)

### Usage
See `FORMATTING_RULEBOOK.md` for complete documentation and `TEMPLATE_EXAMPLES.html` for live examples.

```html
<!-- Example: Highlight Container -->
<div class="container-highlight">
    <h4>Important Information</h4>
    <p>Content that needs emphasis...</p>
</div>

<!-- Example: Two-Column Layout -->
<div class="layout-two-column">
    <div>Left column content</div>
    <div>Right column content</div>
</div>
```

## 🖨️ Print Optimization

The guide is optimized for printing:
- Letter size (8.5" x 11") page layout
- Print-friendly color schemes
- Automatic page breaks at logical points
- Image sizing optimized for print quality
- Multi-column layouts collapse for print

## 🌐 Deployment

### GitHub Pages
The site is automatically deployed to GitHub Pages at:
https://drunkonjava.github.io/blue-mountain-property-guide/

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting provider

## 📄 Content Sections

1. **Governance & Structure** - BMPOA overview, sanitary district, board structure
2. **A Mountain Home** - Community origins, residents, natural beauty
3. **Wood-Chipping Program** - Annual program, fire mitigation, guidelines
4. **Fire Safety & Emergency** - Risk understanding, evacuation, preparedness
5. **Community Services** - Roads, waste management, internet, amenities  
6. **Deer Lake Recreation** - Location, access, rules, passes
7. **The Lodge** - Facilities, rentals, events, activities
8. **Community Communication** - Contacts, meetings, updates
9. **Contacts & Resources** - Directory of important contacts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes following the formatting guidelines
4. Test your changes: `npm run dev`
5. Build to ensure no errors: `npm run build`
6. Commit your changes: `git commit -m "Description"`
7. Push to your fork: `git push origin feature-name`
8. Submit a pull request

### Guidelines
- Follow the established formatting system
- Use template classes for consistency
- Test print layouts before submitting
- Maintain responsive design principles
- Document any new templates or patterns

## 📞 Support

For questions about the guide content, contact the BMPOA Communications Committee.

For technical issues, please open an issue on GitHub.

## 📋 License

This project is licensed under the ISC License. See the repository for details.

---

**Blue Mountain Property Owners Association**  
*Your Complete Guide to Mountain Living in Linden, Virginia*