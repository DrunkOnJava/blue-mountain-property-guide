# Blue Mountain Property Owners Association
## Standardized Formatting Rulebook v1.0

### Table of Contents
1. [System Overview](#system-overview)
2. [Authority Hierarchy](#authority-hierarchy)
3. [Section Dividers](#section-dividers)
4. [Table Templates](#table-templates)
5. [Presentation Containers](#presentation-containers)
6. [List Templates](#list-templates)
7. [Table of Contents](#table-of-contents-templates)
8. [Text and Paragraphs](#text-and-paragraph-templates)
9. [Dual Column Layouts](#dual-column-layout-system)
10. [Page-Specific Overrides](#page-specific-overrides)
11. [Utility Classes](#utility-classes)
12. [Best Practices](#best-practices)

---

## System Overview

The BMPOA Formatting System provides standardized, pre-coded templates for consistent document presentation. All templates are designed with print-first philosophy and maintain professional appearance across digital and printed formats.

### Key Principles
- **Consistency**: Use template classes for uniform appearance
- **Hierarchy**: Follow CSS authority levels for proper overrides
- **Print-First**: All designs optimized for printing
- **Accessibility**: Clear contrast and readable typography
- **Maintainability**: Centralized styling for easy updates

---

## Authority Hierarchy

The system follows a strict hierarchy to ensure consistent styling:

1. **Document-wide CSS Variables** (highest authority)
   - `--primary`, `--secondary`, `--neutral-*` colors
   - Global spacing and typography settings

2. **Base Element Styles**
   - Default `h1`, `h2`, `p`, `ul`, `table` styling

3. **Layout Containers**
   - `.paper-page`, `.document-container`

4. **Template Classes** (this system)
   - All `.section-*`, `.table-*`, `.container-*` classes

5. **Page-Specific Overrides**
   - `.page-[name] .element` pattern

6. **Utility Classes** (use sparingly)
   - `.u-*` classes with `!important`

---

## Critical Print Requirements

### US Letter Paper Compliance
- **Paper Size**: Exactly 8.5" × 11" (216mm × 279mm)
- **Margins**: 0.75" top/bottom, 0.5" left/right
- **Printable Area**: 7.5" × 9.5"
- **No Content Overflow**: All content must fit within printable area

### Emergency Contact Requirements
- **High Contrast**: Black text on white background
- **Clear Borders**: Minimum 2pt solid borders
- **Large Text**: Minimum 11pt for contact information
- **Page Break Control**: Emergency contacts must not break across pages

### Typography Standards
- **Headings**: Montserrat font family
- **Body Text**: Times New Roman for print, Roboto for screen
- **Minimum Size**: 11pt for body text, 9pt for captions
- **Line Height**: 1.4 for optimal readability

---

## Best Practices for Print Optimization

### 1. Page Break Management
```css
.keep-together {
    page-break-inside: avoid;
    break-inside: avoid;
}

.new-page {
    page-break-before: always;
    break-before: page;
}
```

### 2. Color and Background Handling
```css
@media print {
    * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
    }
}
```

### 3. Image Sizing for Print
```css
@media print {
    img {
        max-width: 6in !important;
        max-height: 4in !important;
        page-break-inside: avoid;
    }
}
```

---

## Template Quick Reference

### Emergency Information Template
```html
<div class="emergency-contacts">
    <h3>EMERGENCY CONTACT INFORMATION</h3>
    <div class="emergency-number">911</div>
    <div class="contact-card">
        <div class="contact-name">Service Name</div>
        <div class="contact-info">Contact details</div>
    </div>
</div>
```

### Information Box Template
```html
<div class="container-highlight">
    <h4>Important Information</h4>
    <p>Content that needs emphasis</p>
</div>
```

### Warning/Alert Template
```html
<div class="container-warning">
    <h4>Warning Title</h4>
    <p>Critical information that users must notice</p>
</div>
```

---

## Version History

### v1.0 - Initial Release
- Complete template system
- Print optimization for US Letter paper
- Emergency contact special formatting
- Comprehensive documentation

---

*This formatting system is designed specifically for the Blue Mountain Property Owners Association documentation. For questions or suggestions, contact the BMPOA Communications Committee.*