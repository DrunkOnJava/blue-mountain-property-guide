# Blue Mountain Property Owners Association Guide

## 🏔️ Overview

This is a comprehensive web-based property owners guide for the Blue Mountain Property Owners Association (BMPOA) in Linden, Virginia. The guide is specifically optimized for printing on US Letter sized paper (8.5" × 11") while maintaining an excellent digital reading experience.

## 🎯 Project Goals

### Primary Objectives
1. **PDF-Printer Ready**: Strict compliance with US Letter paper dimensions
2. **Emergency Information**: Clear, prominent display of critical safety contacts
3. **Professional Appearance**: High-quality typography and layout
4. **Accessibility**: Readable across all devices and print formats
5. **Maintainability**: Standardized formatting system for easy updates

### Critical Requirements
- ✅ **NO EXCEPTIONS** on US Letter paper compliance
- ✅ Emergency contacts must be prominently displayed
- ✅ Print quality must be professional-grade
- ✅ All content must fit within printable margins
- ✅ Cross-browser print compatibility required

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Build Tool**: Vite 6.3.5
- **Fonts**: Montserrat (headings), Roboto (screen), Times New Roman (print)
- **Styling**: CSS Custom Properties (Variables)
- **Print Optimization**: Advanced CSS `@media print` rules

## 📋 Key Features

### ✨ Current Strengths
- **Advanced CSS Variable System**: Comprehensive color and spacing consistency
- **Template-Based Design**: Standardized formatting classes
- **Dark/Light Mode**: User preference support
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Print Optimization**: Enhanced for US Letter paper printing

### 🎨 Design System
- **Color Palette**: Primary (#5D5CDE), Secondary (#3498DB), Accent (#E74C3C)
- **Typography**: Montserrat for headings, Roboto for body text
- **Spacing**: Consistent rem-based spacing system
- **Shadows**: Three-tier shadow system (sm, md, lg)

## 📁 Project Structure

```
6pm/
├── index.html              # Main application file
├── package.json            # Node.js dependencies and scripts
├── vite.config.js          # Vite build configuration
├── FORMATTING_RULEBOOK.md  # Design system documentation
├── README.md               # This file
├── CLAUDE_CODE_TASKS.md    # Specific tasks for Claude Code CLI
└── optimized/              # Image assets directory (referenced in vite.config.js)
```

## 🚀 Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens http://localhost:3000

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing Print Functionality
1. Open the application in a browser
2. Press Ctrl+P (Cmd+P on Mac) to open print preview
3. Verify:
   - Paper size is set to "Letter"
   - Content fits within margins
   - Emergency contacts are clearly visible
   - Page breaks occur at logical points

## 🎯 Critical Print Requirements

### US Letter Paper Specifications
- **Dimensions**: 8.5" × 11" (216mm × 279mm)
- **Margins**: 0.75" top/bottom, 0.5" left/right
- **Printable Area**: 7.5" width × 9.5" height
- **Font Sizes**: Minimum 11pt body text, 9pt for captions

### Emergency Contact Standards
- **High Contrast**: Black text on white background
- **Border Requirements**: Minimum 2pt solid borders around emergency sections
- **Text Size**: Minimum 12pt for emergency numbers
- **Page Breaks**: Emergency contacts must not split across pages

### Browser Compatibility
- ✅ Chrome (primary testing browser)
- ✅ Firefox (secondary)
- ✅ Safari (macOS users)
- ✅ Edge (Windows users)

## 🔧 CSS Architecture

### CSS Custom Properties (Variables)
Located in `:root` selector, includes:
- Color system (primary, secondary, neutral, text colors)
- Typography scales
- Spacing system
- Shadow definitions
- Paper dimensions for print

### Print-Specific CSS
Critical `@media print` rules ensure:
- Exact US Letter page dimensions
- Proper margin calculations
- Color printing support
- Page break management
- Image size constraints
- Typography optimization

### Template Classes
Standardized classes for consistent formatting:
- `.container-highlight` - Important information boxes
- `.container-warning` - Alert and warning content
- `.emergency-contacts` - Special formatting for emergency information
- `.contact-card` - Individual contact information blocks

## 🧪 Quality Assurance

### Testing Checklist
- [ ] Print preview shows US Letter format
- [ ] Emergency contacts are prominently displayed
- [ ] No content extends beyond printable margins
- [ ] Images scale appropriately for print
- [ ] Typography is clear and readable
- [ ] Page breaks occur at logical points
- [ ] Colors print correctly (if color printer available)

### Performance Standards
- [ ] Page load time < 3 seconds
- [ ] Print preparation time < 1 second
- [ ] Responsive layout works on mobile devices
- [ ] Dark mode toggle functions correctly

## 🎨 Design Principles

### Print-First Approach
- All design decisions prioritize print quality
- Screen experience enhanced but not at print's expense
- Typography optimized for readability on paper
- Color choices consider both screen and print media

### Professional Appearance
- Clean, organized layout
- Consistent spacing and alignment
- Professional typography hierarchy
- Clear information hierarchy

### Safety Focus
- Emergency information receives special visual treatment
- Critical safety data never hidden or hard to find
- Contact information formatted for quick reference
- Print-friendly emergency contact layout

## 📞 Key Content Sections

1. **Cover Page**: Title, subtitle, and organizational branding
2. **Table of Contents**: Navigation for printed document
3. **Governance & Structure**: BMPOA organizational information
4. **Fire Safety & Emergency Preparedness**: Critical safety information
5. **Community Services**: Practical information for residents
6. **Recreation Areas**: Deer Lake and Lodge information
7. **Emergency Contacts**: **CRITICAL SECTION** - must be prominently displayed

## 🔄 Maintenance Guidelines

### Content Updates
- Use existing template classes for new content
- Test print layout after significant changes
- Ensure emergency information remains prominent
- Verify US Letter compliance after updates

### Code Modifications
- Follow the authority hierarchy in FORMATTING_RULEBOOK.md
- Test print functionality in multiple browsers
- Maintain CSS variable consistency
- Document any new template classes

## 📈 Future Enhancements

### Planned Improvements
- Enhanced mobile print support
- Additional emergency contact formatting options
- Automated print testing
- Content management system integration

### Monitoring
- Regular print quality checks
- Browser compatibility updates
- Performance optimization
- User feedback incorporation

## 🚨 Critical Notes for Claude Code CLI

### Primary Focus Areas
1. **Print Optimization**: Ensuring strict US Letter compliance
2. **Emergency Contact Enhancement**: Making critical information more prominent
3. **Cross-Browser Testing**: Ensuring consistent print behavior
4. **Performance Optimization**: Maintaining fast load times
5. **Code Organization**: Following the established design system

### Constraints
- **NO BREAKING CHANGES** to existing screen functionality
- Must maintain CSS variable system integrity
- Print requirements are non-negotiable
- Emergency contact visibility is critical for resident safety

---

*This guide serves as a critical resource for Blue Mountain residents and must maintain the highest standards of quality and accessibility.*