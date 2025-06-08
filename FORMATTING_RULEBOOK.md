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

## Section Dividers

### Available Templates

#### `.section-divider-standard`
```html
<div class="section-divider-standard">
    <h3>Standard Section</h3>
</div>
```
- **Use**: Default section breaks
- **Appearance**: 2px primary color top border
- **Spacing**: 2rem top margin, 1.5rem bottom

#### `.section-divider-subtle`
```html
<div class="section-divider-subtle">
    <h4>Subtle Subsection</h4>
</div>
```
- **Use**: Subsection breaks, minor divisions
- **Appearance**: 1px neutral border
- **Spacing**: Reduced margins for subtle separation

#### `.section-divider-bold`
```html
<div class="section-divider-bold">
    <h2>Major Section</h2>
</div>
```
- **Use**: Major section breaks, chapter divisions
- **Appearance**: 4px border with gradient background
- **Spacing**: Enhanced margins for prominence

#### `.section-divider-seasonal`
```html
<div class="section-divider-seasonal">
    <h3>Seasonal Information</h3>
</div>
```
- **Use**: Time-sensitive content, seasonal updates
- **Appearance**: Spring color scheme with gradient
- **Spacing**: Standard spacing with seasonal styling

---

## Table Templates

### Standard Table
```html
<table class="table-standard">
    <thead>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data 1</td>
            <td>Data 2</td>
        </tr>
    </tbody>
</table>
```
- **Use**: Primary data tables, formal information
- **Features**: Primary color headers, alternating row colors
- **Print**: Optimized for page breaks

### Compact Table
```html
<table class="table-compact">
    <!-- Same structure as standard -->
</table>
```
- **Use**: Space-constrained areas, summary data
- **Features**: Reduced padding, smaller font size
- **Best For**: Quick reference information

### Borderless Table
```html
<table class="table-borderless">
    <!-- Same structure as standard -->
</table>
```
- **Use**: Clean layouts, minimal visual weight
- **Features**: No cell borders, subtle bottom lines
- **Best For**: Lists that need tabular structure

---

## Presentation Containers

### Information Containers

#### Highlight Container
```html
<div class="container-highlight">
    <h4>Important Information</h4>
    <p>Content that needs emphasis...</p>
</div>
```
- **Use**: Key points, important notices
- **Styling**: Left border accent, neutral background

#### Warning Container
```html
<div class="container-warning">
    <h4>Warning</h4>
    <p>Critical information...</p>
</div>
```
- **Use**: Warnings, alerts, critical information
- **Styling**: Red/accent color scheme with gradient

#### Info Container
```html
<div class="container-info">
    <h4>Information</h4>
    <p>Helpful details...</p>
</div>
```
- **Use**: Helpful tips, additional information
- **Styling**: Blue/secondary color scheme

#### Success Container
```html
<div class="container-success">
    <h4>Success</h4>
    <p>Positive information...</p>
</div>
```
- **Use**: Confirmations, positive outcomes
- **Styling**: Green/spring color scheme

### Special Containers

#### Quote Container
```html
<div class="container-quote">
    <p>This is a quotation or testimonial...</p>
    <cite>- Source Name</cite>
</div>
```
- **Use**: Quotations, testimonials, excerpts
- **Features**: Large opening quote mark, italic text

#### Card Container
```html
<div class="container-card">
    <h4>Card Title</h4>
    <p>Card content...</p>
</div>
```
- **Use**: Modular content, standalone sections
- **Features**: Subtle shadow, rounded corners

#### Featured Container
```html
<div class="container-featured">
    <h3>Featured Content</h3>
    <p>Highlighted important content...</p>
</div>
```
- **Use**: Hero content, featured announcements
- **Features**: Bold styling, enhanced shadows

---

## List Templates

### Standard Lists
```html
<ul class="list-standard">
    <li>Item one</li>
    <li>Item two</li>
</ul>
```
- **Use**: General content lists
- **Spacing**: Balanced for readability

### Compact Lists
```html
<ul class="list-compact">
    <li>Brief item</li>
    <li>Another item</li>
</ul>
```
- **Use**: Space-constrained areas
- **Spacing**: Minimal for density

### Spaced Lists
```html
<ul class="list-spaced">
    <li>Item requiring more space for detailed explanation</li>
    <li>Another detailed item</li>
</ul>
```
- **Use**: Detailed items needing breathing room
- **Spacing**: Enhanced for complex content

### Checklist
```html
<ul class="list-checklist">
    <li>Task to complete</li>
    <li>Another task</li>
</ul>
```
- **Use**: Action items, tasks, procedures
- **Features**: Checkbox symbols, no bullets

### Custom Numbered Lists
```html
<ol class="list-numbered-custom">
    <li>First step</li>
    <li>Second step</li>
</ol>
```
- **Use**: Procedures, ranked items
- **Features**: Circular numbered badges

---

## Table of Contents Templates

### Modern TOC
```html
<div class="toc-modern">
    <h2 class="toc-title">Table of Contents</h2>
    <div class="toc">
        <a href="#section1" class="toc-item-linked">Section 1</a>
        <a href="#section2" class="toc-item-linked">Section 2</a>
    </div>
</div>
```
- **Use**: Primary table of contents
- **Features**: Enhanced styling, interactive links

### Simple TOC
```html
<div class="toc-simple">
    <h3 class="toc-title">Contents</h3>
    <div class="toc">
        <div class="toc-item">Section 1</div>
        <div class="toc-item">Section 2</div>
    </div>
</div>
```
- **Use**: Section-level contents, simple navigation
- **Features**: Clean, minimal styling

---

## Text and Paragraph Templates

### Text Styles
```html
<p class="text-lead">Lead paragraph with enhanced prominence</p>
<p class="text-large">Larger text for emphasis</p>
<p class="text-small">Smaller text for details</p>
<span class="text-emphasis">Highlighted text</span>
<span class="text-muted">De-emphasized text</span>
```

### Alignment
```html
<p class="text-center">Centered text</p>
<p class="text-right">Right-aligned text</p>
<p class="text-justify">Justified text for formal documents</p>
```

### Paragraph Styles
```html
<p class="paragraph-indent">Indented first line</p>
<p class="paragraph-hanging">Hanging indent for references</p>
```

---

## Dual Column Layout System

### Equal Columns
```html
<div class="layout-two-column">
    <div>Left column content</div>
    <div>Right column content</div>
</div>
```

### Weighted Columns
```html
<div class="layout-two-column-60-40">
    <div>Main content (60%)</div>
    <div>Sidebar content (40%)</div>
</div>

<div class="layout-two-column-70-30">
    <div>Primary content (70%)</div>
    <div>Secondary content (30%)</div>
</div>
```

### Sidebar Layouts
```html
<div class="layout-sidebar-left">
    <div>Fixed width sidebar</div>
    <div>Flexible main content</div>
</div>

<div class="layout-sidebar-right">
    <div>Flexible main content</div>
    <div>Fixed width sidebar</div>
</div>
```

### Print Behavior
- All multi-column layouts collapse to single column when printed
- Content maintains logical reading order
- Spacing adjusts automatically for print optimization

---

## Page-Specific Overrides

### Using Page Classes
Add a page class to any `.paper-page` container:

```html
<div class="paper-page page-governance">
    <!-- Governance-specific styling applies -->
    <div class="container-highlight">
        <!-- Will use governance color scheme -->
    </div>
</div>
```

### Available Page Classes
- `.page-governance` - Secondary color scheme
- `.page-fire-safety` - Accent/warning color scheme  
- `.page-community` - Spring/green color scheme

### Creating New Page Styles
```css
.page-[name] .container-highlight {
    border-left-color: var(--custom-color);
    background: var(--custom-background);
}
```

---

## Utility Classes

Use sparingly for quick adjustments:

### Margin/Padding
```html
<div class="u-margin-none">No margin</div>
<div class="u-padding-large">Large padding</div>
```

### Visibility
```html
<div class="u-hidden">Hidden element</div>
<div class="u-visible">Forced visible</div>
```

### Text Weight
```html
<span class="u-text-bold">Bold text</span>
<span class="u-text-normal">Normal weight</span>
```

---

## Best Practices

### 1. Consistency First
- Always use template classes instead of custom styling
- Follow the authority hierarchy
- Use the same template for similar content types

### 2. Print Optimization
- Test all layouts in print preview
- Use `column-break` class to avoid awkward page breaks
- Keep related content together

### 3. Accessibility
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Use semantic HTML elements
- Ensure sufficient color contrast

### 4. Maintenance
- Document any custom page styles
- Use CSS variables for color consistency
- Group related styles logically

### 5. Performance
- Avoid redundant utility classes
- Use template classes for repeated patterns
- Keep custom CSS minimal

---

## Template Quick Reference

### Common Patterns

#### Section with Image and Info Box
```html
<div class="section-divider-standard">
    <h3>Section Title</h3>
    <div class="image-container">
        <img src="image.jpg" alt="Description" class="section-image">
        <div class="image-caption">Image caption</div>
    </div>
    <div class="container-info">
        <h4>Important Note</h4>
        <p>Information content...</p>
    </div>
</div>
```

#### Two-Column Layout with Table
```html
<div class="layout-two-column-60-40">
    <div>
        <h4>Main Content</h4>
        <p>Description and details...</p>
    </div>
    <div>
        <table class="table-compact">
            <tr><td>Key</td><td>Value</td></tr>
            <tr><td>Item</td><td>Data</td></tr>
        </table>
    </div>
</div>
```

#### Procedure with Checklist
```html
<div class="container-highlight">
    <h4>Procedure Name</h4>
    <p class="text-lead">Overview of the procedure...</p>
    <ol class="list-numbered-custom">
        <li>First step</li>
        <li>Second step</li>
        <li>Final step</li>
    </ol>
    <ul class="list-checklist">
        <li>Verification item</li>
        <li>Final check</li>
    </ul>
</div>
```

---

## Version History

### v1.0 - Initial Release
- Complete template system
- Print optimization
- Dual-column layouts
- Page-specific overrides
- Comprehensive documentation

---

*This formatting system is designed specifically for the Blue Mountain Property Owners Association documentation. For questions or suggestions, contact the BMPOA Communications Committee.*