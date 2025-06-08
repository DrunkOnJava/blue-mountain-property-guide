# Claude Code CLI - File Summary and Instructions

## 📁 Project Files Overview

The following files have been prepared for Claude Code CLI to assist with PDF-printer optimization for the Blue Mountain Property Owners Association guide:

### Core Project Files

#### 1. `index.html` 
**Purpose**: Main application file with simplified content for testing
**Key Features**:
- Complete CSS variable system
- Basic print CSS implementation
- Emergency contacts section
- Dark mode toggle functionality
- Print button with basic functionality

**Claude Code Focus Areas**:
- Enhance the `@media print` section (currently basic)
- Improve emergency contact formatting
- Optimize typography for print
- Add better page break management

#### 2. `package.json`
**Purpose**: Node.js project configuration
**Contains**:
- Project metadata and dependencies
- npm scripts for development workflow
- Vite 6.3.5 as the build tool

**Claude Code Usage**: Reference for understanding project structure and available commands

#### 3. `vite.config.js`
**Purpose**: Vite build tool configuration
**Features**:
- Development server setup (port 3000)
- Asset handling configuration
- Build optimization settings

**Claude Code Usage**: Understanding of build process and asset management

### Documentation Files

#### 4. `FORMATTING_RULEBOOK.md`
**Purpose**: Design system documentation
**Critical Information**:
- CSS authority hierarchy
- Template class usage guidelines
- Print optimization standards
- Emergency contact requirements

**Claude Code Usage**: **ESSENTIAL** - Follow these guidelines for all modifications

#### 5. `README.md`
**Purpose**: Comprehensive project overview
**Contains**:
- Project goals and requirements
- Technology stack details
- Critical print requirements
- Quality assurance standards

**Claude Code Usage**: Understanding project context and constraints

#### 6. `CLAUDE_CODE_TASKS.md`
**Purpose**: Specific task guidance for Claude Code CLI
**Contains**:
- Detailed task descriptions
- Priority levels
- Success criteria
- Testing protocols

**Claude Code Usage**: **PRIMARY REFERENCE** - Start here for task understanding

#### 7. `ENHANCED_PRINT_CSS.css`
**Purpose**: Complete enhanced print CSS for integration
**Features**:
- Strict US Letter compliance (8.5" × 11")
- Enhanced emergency contact formatting
- Cross-browser compatibility fixes
- Professional typography optimization

**Claude Code Usage**: **INTEGRATION READY** - This CSS can be added directly to index.html

## 🎯 Primary Objectives for Claude Code CLI

### Critical Requirements (NON-NEGOTIABLE)
1. **US Letter Paper Compliance**: Strict 8.5" × 11" dimensions
2. **Emergency Contact Prominence**: Clear, bordered, high-contrast formatting
3. **Print Quality**: Professional appearance in all browsers
4. **No Breaking Changes**: Preserve existing screen functionality

### Recommended Workflow

#### Phase 1: Assessment
1. **Read** `CLAUDE_CODE_TASKS.md` for specific task details
2. **Review** `FORMATTING_RULEBOOK.md` for design constraints
3. **Examine** current `index.html` print CSS implementation
4. **Identify** specific areas needing enhancement

#### Phase 2: Implementation
1. **Integrate** enhanced print CSS from `ENHANCED_PRINT_CSS.css`
2. **Test** print preview functionality
3. **Enhance** emergency contact formatting
4. **Optimize** typography and page breaks

#### Phase 3: Validation
1. **Test** in multiple browsers (Chrome, Firefox, Safari, Edge)
2. **Verify** US Letter compliance in print preview
3. **Check** emergency contact prominence
4. **Ensure** no content overflow

## 🔧 Technical Implementation Guide

### CSS Integration Steps
1. Open `index.html`
2. Locate the existing `<style>` section
3. Add the contents of `ENHANCED_PRINT_CSS.css` at the END of the style section
4. Test in print preview (Ctrl+P / Cmd+P)

### HTML Enhancements Needed
```html
<!-- Emergency contacts section needs enhancement -->
<div class="emergency-contacts">
    <h3>EMERGENCY CONTACT INFORMATION</h3>
    <div class="alert-box-title">EMERGENCY: 911</div>
    <!-- Enhanced contact cards -->
</div>
```

### JavaScript Improvements
```javascript
// Enhanced print functionality
function addPrintDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('printDate').textContent = dateString;
}
```

## 🧪 Testing Requirements

### Print Preview Checklist
- [ ] Paper size shows as "Letter" (8.5" × 11")
- [ ] Emergency contacts have prominent red borders
- [ ] All content fits within printable margins
- [ ] Typography is readable at 11pt minimum
- [ ] Page breaks occur at logical points
- [ ] Images scale appropriately

### Browser Testing
- [ ] Chrome: Print preview and actual printing
- [ ] Firefox: Color printing and page dimensions
- [ ] Safari: WebKit-specific rendering
- [ ] Edge: Microsoft print compatibility

## 🚨 Critical Success Criteria

### Must-Have Features
1. **US Letter Compliance**: No content extends beyond 7.5" × 9.5" printable area
2. **Emergency Prominence**: Red borders, high contrast, no page breaks within emergency section
3. **Professional Quality**: Clear typography, logical page breaks, consistent formatting
4. **Cross-Browser**: Works identically in Chrome, Firefox, Safari, and Edge

### Quality Standards
- Typography: Minimum 11pt body text, 9pt for captions
- Emergency contacts: Minimum 12pt for phone numbers
- Borders: Minimum 2pt for emergency section borders
- Performance: Page load under 3 seconds, print prep under 1 second

## 📞 Emergency Contact Standards (CRITICAL)

### Visual Requirements
- **Border**: 4pt solid red border around entire emergency section
- **Background**: White background for maximum contrast
- **Typography**: Black text, minimum 12pt for emergency numbers
- **Layout**: No page breaks within emergency contact section

### Content Hierarchy
1. **"EMERGENCY: 911"** - Most prominent, center-aligned, 18pt, red text
2. **Contact Categories** - Clear headers (Fire, Police, Medical, etc.)
3. **Individual Contacts** - Bordered cards with name and contact info
4. **Emergency Tip** - Warning box with preparation advice

## 🔄 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean build cache
npm run clean
```

## 📝 Notes for Claude Code CLI

### Code Style Preferences
- Maintain existing CSS variable usage (`--primary`, `--secondary`, etc.)
- Follow established naming conventions
- Add clear comments for print-specific rules
- Use `!important` sparingly and only for print overrides

### Testing Approach
- Always test changes in print preview first
- Verify emergency contact visibility after each change
- Check multiple browsers for consistency
- Ensure screen experience remains unaffected

### Communication Style
- Provide specific, actionable code improvements
- Explain reasoning behind print-specific decisions
- Offer before/after comparisons when making changes
- Focus on US Letter compliance and emergency safety

---

## 🎯 Quick Start for Claude Code CLI

1. **Start Here**: Read `CLAUDE_CODE_TASKS.md` for specific objectives
2. **Understand Context**: Review `README.md` and `FORMATTING_RULEBOOK.md`
3. **Examine Current Code**: Open `index.html` and locate print CSS section
4. **Apply Enhancements**: Integrate CSS from `ENHANCED_PRINT_CSS.css`
5. **Test Thoroughly**: Use print preview to verify US Letter compliance
6. **Validate Emergency**: Ensure emergency contacts are prominently displayed

**Primary Success Metric**: Print preview shows professional-quality document that fits perfectly on US Letter paper with clearly visible emergency contact information.

---

*These files provide complete context for enhancing the Blue Mountain Property Owners Association guide. Focus on print quality and emergency information prominence while preserving the excellent existing screen experience.*