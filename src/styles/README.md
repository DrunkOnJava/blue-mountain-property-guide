# CSS Styles Organization

This directory contains the organized CSS styles for the Blue Mountain Property Owners Association guide, extracted and modularized from the original inline styles in `index.html`.

## File Structure

### Core Styles
- **`main.css`** - Main stylesheet that imports all other files
- **`variables.css`** - CSS custom properties and design tokens
- **`reset.css`** - CSS reset and base accessibility styles

### Typography & Layout
- **`typography.css`** - All text-related styles (headings, paragraphs, text utilities)
- **`layout.css`** - Document layout, grid systems, and responsive design

### Components
- **`components.css`** - Reusable UI components (cards, boxes, buttons, etc.)
- **`section-dividers.css`** - Section divider pages and templates
- **`table-of-contents.css`** - Table of contents and navigation styles
- **`images.css`** - Image galleries, media styles, and optimization
- **`tables.css`** - Table styles and evacuation table specific styling
- **`lists.css`** - List styles including checklists and numbered lists

### System Files
- **`templates.css`** - Standardized formatting system and utility classes
- **`print.css`** - Comprehensive print styles for US Letter compliance

## Usage

### In HTML
Replace the existing `<style>` tag in `index.html` with:

```html
<link rel="stylesheet" href="./src/styles/main.css">
```

### With Build Systems
Import the main stylesheet in your build process:

```css
@import './src/styles/main.css';
```

Or import individual files as needed:

```css
@import './src/styles/variables.css';
@import './src/styles/components.css';
```

## Design System

### CSS Custom Properties
All colors, spacing, typography, and other design tokens are defined in `variables.css` using CSS custom properties:

```css
--primary: #5D5CDE;
--font-heading: 'Montserrat', sans-serif;
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
```

### Template Classes
The design system includes standardized template classes:

- **Containers**: `.container-highlight`, `.container-warning`, `.container-info`
- **Typography**: `.text-lead`, `.text-emphasis`, `.text-muted`
- **Lists**: `.list-standard`, `.list-compact`, `.checklist`
- **Tables**: `.table-standard`, `.table-compact`, `.evacuation-table`

### Print Optimization
The print styles ensure:
- US Letter (8.5" × 11") compliance
- Proper page breaks and pagination
- Emergency contact highlighting
- Cross-browser compatibility

## Maintenance

### Adding New Styles
1. Add new variables to `variables.css`
2. Create component styles in appropriate files
3. Update templates in `templates.css` if creating reusable patterns
4. Test print output for US Letter compliance

### Modifying Existing Styles
1. Find the appropriate file using the structure above
2. Make changes while preserving design system consistency
3. Test both screen and print output
4. Update this README if adding new files or patterns

## Key Features

### Accessibility
- High contrast mode support
- Reduced motion preferences
- Focus indicators
- Skip links

### Performance
- Organized imports for better caching
- Lazy loading support for images
- Optimized print styles

### Maintainability
- Logical file organization
- Consistent naming conventions
- Clear documentation
- Template-based approach

## Print Compliance

The print styles ensure strict US Letter paper compliance with:
- Fixed 8.5" × 11" page dimensions
- Proper margins (0.75" top/bottom, 0.5" left/right)
- Page break control
- Running headers and footers
- Emergency contact highlighting
- Cross-browser compatibility

All print styles are contained in `print.css` and follow the mandatory pagination rules defined in the BMPOA style guide.