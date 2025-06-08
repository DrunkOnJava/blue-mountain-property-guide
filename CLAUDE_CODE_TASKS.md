# Claude Code CLI - Specific Tasks and Guidance

## 🎯 Primary Objectives for Claude Code Assistance

This document outlines specific areas where Claude Code CLI can provide valuable assistance for the Blue Mountain Property Owners Association guide project.

## 🚨 CRITICAL REQUIREMENTS (NON-NEGOTIABLE)

### 1. US Letter Paper Compliance
- **Requirement**: Strict adherence to 8.5" × 11" paper dimensions
- **Printable Area**: 7.5" × 9.5" (accounting for margins)
- **Margins**: 0.75" top/bottom, 0.5" left/right
- **Status**: Currently implemented but needs verification and enhancement

### 2. Emergency Contact Prominence
- **Requirement**: Emergency contacts must be clearly visible and print-friendly
- **Standards**: High contrast, minimum 2pt borders, no page breaks within emergency sections
- **Current Status**: Basic implementation exists, needs enhancement

## 🔧 Specific Tasks for Claude Code CLI

### Task 1: Print CSS Enhancement
**Objective**: Improve print CSS for better US Letter compliance

**Current Issues**:
- Some content may overflow printable area
- Page breaks could be better optimized
- Emergency contact formatting needs enhancement

**Requested Actions**:
- Review current `@media print` rules in index.html
- Enhance page break management
- Optimize typography for print readability
- Ensure all images scale appropriately

**Success Criteria**:
- All content fits within 7.5" × 9.5" printable area
- Emergency contacts never split across pages
- Professional typography in print output

### Task 2: Emergency Contact Enhancement
**Objective**: Make emergency information more prominent and print-friendly

**Current State**: Basic emergency contact section exists
**Needed Improvements**:
- Stronger visual hierarchy
- Enhanced borders and backgrounds for print
- Better contact card formatting
- Improved phone number readability

**Implementation Areas**:
- Enhance `.emergency-contacts` CSS class
- Improve `.contact-card` styling
- Add print-specific emergency formatting
- Ensure high contrast for all emergency text

### Task 3: Cross-Browser Print Testing
**Objective**: Ensure consistent print behavior across browsers

**Testing Requirements**:
- Chrome (primary)
- Firefox
- Safari
- Edge

**Specific Checks**:
- Color printing support (`color-adjust: exact`)
- Page dimension consistency
- Font rendering across browsers
- Image scaling behavior

### Task 4: Performance Optimization
**Objective**: Maintain fast load times while enhancing print functionality

**Current Performance**: Good, but can be optimized
**Focus Areas**:
- CSS efficiency improvements
- Image loading optimization
- Print CSS organization
- JavaScript print functionality enhancement

### Task 5: Code Organization and Documentation
**Objective**: Improve maintainability and developer experience

**Areas for Improvement**:
- CSS organization and commenting
- Print-specific documentation
- Template class documentation
- Implementation guides

## 📋 Development Guidelines

### CSS Modifications
- **Preserve**: Existing CSS variable system
- **Maintain**: Current template class structure
- **Enhance**: Print-specific rules only
- **Test**: All changes in print preview

### JavaScript Enhancements
- **Focus**: Print functionality improvements
- **Maintain**: Dark mode functionality
- **Enhance**: Print preparation and user experience
- **Test**: Cross-browser compatibility

### HTML Structure
- **Preserve**: Current semantic structure
- **Enhance**: Print-specific attributes and classes
- **Maintain**: Accessibility standards
- **Improve**: Emergency contact organization

## 🛠️ Available Tools and Resources

### Development Environment
- **Build Tool**: Vite 6.3.5
- **Package Manager**: npm
- **Browser Testing**: Local development server
- **Print Testing**: Browser print preview

### Existing Assets
- **Fonts**: Montserrat, Roboto (loaded via Google Fonts)
- **Images**: Located in `/optimized` directory (referenced in vite.config.js)
- **Icons**: SVG icons embedded in HTML
- **Styles**: Comprehensive CSS variable system

### Documentation
- **FORMATTING_RULEBOOK.md**: Design system documentation
- **README.md**: Project overview and guidelines
- **Existing Comments**: Inline CSS documentation

## 🎯 Specific Code Areas to Focus On

### High Priority
1. **Print CSS Section** (lines ~500-600 in index.html)
2. **Emergency Contacts HTML** (emergency contacts section)
3. **Page Break Management** (CSS `page-break-*` properties)
4. **Typography Optimization** (font sizes and line heights for print)

### Medium Priority
1. **Image Sizing for Print** (responsive image classes)
2. **Contact Card Formatting** (`.contact-card` class enhancement)
3. **JavaScript Print Functionality** (print button and preparation)
4. **Color Management** (ensuring proper print colors)

### Low Priority
1. **Performance Optimizations** (CSS efficiency)
2. **Documentation Updates** (inline comments)
3. **Template Class Extensions** (new utility classes)
4. **Browser-Specific Fixes** (vendor prefixes)

## 🧪 Testing Protocols

### Print Testing Steps
1. Open index.html in browser
2. Press Ctrl+P (Cmd+P) for print preview
3. Verify US Letter paper size selection
4. Check content fits within printable area
5. Verify emergency contacts are prominent
6. Test in multiple browsers

### Quality Checks
- [ ] No horizontal scrollbars in print preview
- [ ] Emergency section clearly bordered
- [ ] Contact information readable at 11pt minimum
- [ ] Images don't exceed page boundaries
- [ ] Page breaks occur at logical points

## 🚀 Success Metrics

### Technical Requirements
- Print preview shows US Letter format (8.5" × 11")
- All content fits within 7.5" × 9.5" printable area
- Emergency contacts have 2pt+ borders
- No content overflow or clipping

### User Experience
- Professional appearance in print
- Easy-to-read emergency information
- Logical page breaks and content flow
- Consistent behavior across browsers

### Performance
- Page load time remains under 3 seconds
- Print preparation completes in under 1 second
- No degradation of screen experience
- Smooth dark mode toggle functionality

## 📞 Emergency Contact Requirements (CRITICAL)

### Visual Requirements
- **Border**: Minimum 2pt solid border around entire emergency section
- **Background**: High contrast background (white recommended)
- **Text Color**: Black text for maximum readability
- **Font Size**: Minimum 12pt for emergency numbers, 11pt for details

### Content Organization
- **Emergency: 911** must be most prominent
- Contact cards should be clearly separated
- Phone numbers must be easily scannable
- No line breaks within individual contact entries

### Print Behavior
- Emergency section must never split across pages
- Maintain formatting consistency in all browsers
- Ensure borders and backgrounds print correctly
- Preserve hierarchy and readability

## 🔄 Iterative Development Approach

### Phase 1: Print CSS Enhancement
- Focus on US Letter compliance
- Enhance emergency contact styling
- Implement better page break management

### Phase 2: Cross-Browser Testing
- Test print behavior in all target browsers
- Fix browser-specific print issues
- Optimize color printing support

### Phase 3: Performance and Polish
- Optimize CSS for efficiency
- Enhance JavaScript print functionality
- Add documentation and comments

### Phase 4: Quality Assurance
- Comprehensive print testing
- User experience validation
- Final performance checks

---

## 📝 Notes for Claude Code CLI

### Communication Preferences
- Focus on specific, actionable code improvements
- Provide before/after comparisons when making changes
- Explain the reasoning behind print-specific decisions
- Prioritize US Letter compliance and emergency contact visibility

### Code Style
- Maintain existing CSS variable usage
- Follow established naming conventions
- Add clear comments for print-specific rules
- Preserve responsive design principles

### Testing Guidance
- Always test changes in print preview
- Verify emergency contact prominence
- Check cross-browser compatibility
- Ensure no degradation of screen experience

---

*This document serves as a comprehensive guide for Claude Code CLI assistance. All changes should prioritize print quality and emergency information accessibility while maintaining the existing high-quality screen experience.*