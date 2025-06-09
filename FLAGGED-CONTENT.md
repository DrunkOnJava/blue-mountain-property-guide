# FLAGGED CONTENT - BMPOA Booklet HTML Audit Report

Generated: 2025-06-08

This report identifies discrepancies between the HTML files in src/sections/ and the authoritative data in AllowedContent-Strict.

---

## CRITICAL ISSUES

### 1. Incorrect Image Paths in governance.html
- **File**: src/sections/governance.html
- **Lines**: 3, 32, 55
- **Issue**: Using incorrect path "./public/bmpoa-emblem.png" 
- **Should be**: "./optimized/bmpoa-emblem.png" (consistent with other sections)
- **Severity**: HIGH - Broken images

### 2. Board Member Title Discrepancy
- **File**: src/sections/governance.html
- **Line**: ~60-80 (Board Members section)
- **Issue**: No mention of "Beth Herz" as Membership Committee Chair
- **Should be**: According to contacts.csv, Beth Herz is Membership Committee Chair
- **Source**: AllowedContent-Strict/database/exports/contacts.csv line 14
- **Severity**: MEDIUM - Missing board member information

### 3. Committee Chair Name Mismatch
- **File**: src/sections/governance.html  
- **Line**: 75 (Standing Committees)
- **Issue**: Does not specify who chairs Nominating Committee
- **Should be**: Billy Orndorff chairs both CEC and Nominating Committee
- **Source**: AllowedContent-Strict/database/exports/contacts.csv line 11
- **Severity**: MEDIUM - Incomplete committee information

### 4. Incorrect BMPOA.org Domain References
- **File**: src/sections/contacts.html
- **Lines**: Multiple references to "BMPOA.org"
- **Issue**: Inconsistent domain reference style
- **Should be**: Verify if it should be "bmpoa.org" (lowercase) or "BMPOA.org"
- **Severity**: LOW - Potential broken links

## MISSING INFORMATION

### 1. Board Elections Notice Outdated
- **File**: src/sections/governance.html
- **Line**: 26-28
- **Issue**: States "Board nomination window is currently open and closes at midnight, June 30th"
- **Context**: This appears to be old information from a previous year
- **Should be**: Updated to current year's election information or made generic
- **Severity**: HIGH - Outdated time-sensitive information

### 2. Emergency Coordinator Contact Missing
- **File**: src/sections/contacts.html
- **Line**: Throughout emergency contacts section
- **Issue**: No specific BMPOA Emergency Coordinator contact information
- **Should be**: Include name/contact for BMPOA Emergency Coordinator
- **Source**: Referenced in BMPOA-Outline.md but no specific contact provided
- **Severity**: MEDIUM - Missing emergency contact

### 3. Lodge Committee Contact Missing
- **File**: src/sections/lodge.html
- **Line**: 191
- **Issue**: Generic text "contact the Lodge Committee through the main BMPOA contact information"
- **Should be**: Specific Lodge Committee chair contact (David Cook per contacts.csv)
- **Severity**: LOW - Generic contact reference

## FORMATTING INCONSISTENCIES

### 1. HTML Entity Usage
- **File**: src/sections/governance.html
- **Lines**: 243, 244, 251, 252, 312
- **Issue**: Using HTML entities (&ge;) for greater-than-or-equal
- **Note**: While technically correct, inconsistent with rest of document which uses ≥
- **Severity**: LOW - Visual inconsistency

### 2. Address Formatting
- **File**: src/sections/lodge.html
- **Line**: Not explicitly stated but lodge is located at 540 Cliff Rd
- **Issue**: Lodge address not prominently displayed in the Lodge section
- **Should be**: Include "540 Cliff Rd, Linden, VA 22642" per BMPOA-entities.txt
- **Severity**: LOW - Missing location detail

## DATA ACCURACY VERIFIED

The following critical information was verified as CORRECT:
- All committee email addresses match source data
- Board member names and primary titles match
- Emergency phone numbers are accurate
- Service provider contact information is correct
- Wood chipping coordinator email (jcook0313@gmail.com) is accurate
- Roads committee email (bmpoaroads@gmail.com) is accurate
- Deer Lake email (bmpoadeerlake@gmail.com) is accurate

## RECOMMENDATIONS

1. **URGENT**: Fix image paths in governance.html from "./public/" to "./optimized/"
2. **HIGH PRIORITY**: Update or remove outdated board election notice
3. **MEDIUM PRIORITY**: Add missing committee chair names and board member information
4. **LOW PRIORITY**: Standardize HTML entity usage and add missing address details

---

Note: Personal phone numbers have been excluded from this report per instructions.

---

## ADDITIONAL FINDINGS - Fire Safety Section

### 1. Critical Burning Law Discrepancy
- **File**: src/sections/fire-safety.html
- **Lines**: Not found
- **Issue**: NO mention of BMPOA's complete prohibition on open burning
- **Should be**: Per BMPOA-Outline.md line 402: "Open burning forbidden **at all times** within BMPOA boundaries (even if Warren County lifts a burn ban)"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md lines 401-410
- **Severity**: CRITICAL - Missing vital safety regulation

### 2. Missing Warren County Code Reference
- **File**: src/sections/fire-safety.html
- **Lines**: Not found
- **Issue**: No reference to Warren County Code § 974.3575
- **Should be**: Include specific code reference and link to https://ecode360.com/9743575#9743575
- **Source**: AllowedContent-Strict/BMPOA-Outline.md line 404
- **Severity**: HIGH - Missing legal citation

### 3. Missing Penalty Information
- **File**: src/sections/fire-safety.html
- **Lines**: Not found
- **Issue**: No mention of Class 3 misdemeanor penalties
- **Should be**: "Violations: Class 3 misdemeanor; fines up to $500 plus suppression costs"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md line 405
- **Severity**: HIGH - Missing enforcement information

### 4. Incomplete Burn Barrel Specifications
- **File**: src/sections/fire-safety.html
- **Lines**: Not found
- **Issue**: No specific burn barrel requirements mentioned
- **Should be**: Include per regulations_summary.md: "Metal barrels with vented lids 16″ above vents; stable base; drip/ash pan to catch embers"
- **Source**: AllowedContent-Strict/database/exports/regulations_summary.md lines 93-95
- **Severity**: MEDIUM - Missing technical requirements

### 5. Missing Charcoal Grilling Restrictions
- **File**: src/sections/fire-safety.html
- **Lines**: Not found
- **Issue**: No mention of charcoal grilling restrictions
- **Should be**: Per BMPOA-Outline.md line 420: "Charcoal/grilling for cooking is **not** exempt within BMPOA—no open burning in common areas, including grills"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md line 420
- **Severity**: HIGH - Missing important restriction

---

## ADDITIONAL FINDINGS - Deer Lake Section

### 1. Missing Email Address
- **File**: src/sections/deer-lake.html
- **Line**: 187
- **Issue**: No email address provided for Deer Lake access inquiries
- **Should be**: Include "bmpoadeerlake@gmail.com" per BMPOA-Outline.md
- **Source**: AllowedContent-Strict/BMPOA-Outline.md line 767, BMPOA-entities.txt line 455
- **Severity**: HIGH - Missing critical contact information

### 2. Incorrect Pass Information
- **File**: src/sections/deer-lake.html
- **Line**: 69-77
- **Issue**: Does not mention pass requirements or Blue Mountain Recreational Area Pass
- **Should be**: Per BMPOA-Outline.md line 765: "Blue Mountain Recreational Area Pass required for all users"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md lines 765-774
- **Severity**: HIGH - Missing access requirement information

### 3. Missing Pass Distribution Details
- **File**: src/sections/deer-lake.html
- **Lines**: Not found
- **Issue**: No mention of annual pass issuance process
- **Should be**: "Issued annually in May via email request to bmpoadeerlake@gmail.com (with proof of property ownership); two passes per property"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md line 766-767
- **Severity**: MEDIUM - Missing procedural information

### 4. Missing Dog Restrictions
- **File**: src/sections/deer-lake.html
- **Line**: 151
- **Issue**: Only mentions dogs on leash, doesn't mention weekend/holiday prohibition
- **Should be**: Per BMPOA-Outline.md lines 789-791: "No dogs on weekends/holidays (Memorial Day–Labor Day). Weekdays (Mon–Fri): dogs allowed near dam but not on the dock"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md lines 789-791
- **Severity**: HIGH - Incomplete pet policy

### 5. Missing Age Restrictions
- **File**: src/sections/deer-lake.html
- **Lines**: Not found
- **Issue**: No mention of age restrictions for minors
- **Should be**: Per BMPOA-Outline.md line 795: "persons ≤ 16 must be accompanied by an adult"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md line 795
- **Severity**: MEDIUM - Missing safety requirement

---

## ADDITIONAL FINDINGS - Wood Chipping Section

### 1. Coordinator Email Verified ✓
- **File**: src/sections/wood-chipping.html
- **Lines**: 26, 88
- **Status**: CORRECT - Email "jcook0313@gmail.com" matches source
- **Source**: AllowedContent-Strict/BMPOA-Outline.md line 840, BMPOA-entities.txt line 453
- **Severity**: N/A - Information is accurate

### 2. Missing Free Service Emphasis
- **File**: src/sections/wood-chipping.html
- **Line**: 9
- **Issue**: States "community-wide effort" but doesn't emphasize FREE service
- **Should be**: Per BMPOA-Outline.md line 835: "All property owners within BMPOA Sanitary District are eligible for free wood chipping annually"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md line 835
- **Severity**: LOW - Missing emphasis on free service

### 3. Missing "No Reservations" Information
- **File**: src/sections/wood-chipping.html
- **Lines**: Not found
- **Issue**: Doesn't mention that no advance registration is needed
- **Should be**: Per BMPOA-Outline.md line 17: "No Reservations: Simply place brush as directed—no advance registration needed"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md line 17
- **Severity**: MEDIUM - Missing convenience information

### 4. Accurate Partnership Information ✓
- **File**: src/sections/wood-chipping.html
- **Lines**: 117-127
- **Status**: CORRECT - Mentions VA Dept. of Forestry partnership
- **Source**: AllowedContent-Strict/BMPOA-Outline.md lines 117, 854
- **Severity**: N/A - Information is accurate

### 5. Missing Specific Committee References
- **File**: src/sections/wood-chipping.html
- **Lines**: 131-137
- **Issue**: Generic committee references without specific names
- **Should be**: Per BMPOA-Outline.md lines 879-881: "BMPOA Roads Committee coordinates road access" and "Public Safety Committee manages community evacuation zones"
- **Source**: AllowedContent-Strict/BMPOA-Outline.md lines 879-881
- **Severity**: LOW - Generic vs specific committee names