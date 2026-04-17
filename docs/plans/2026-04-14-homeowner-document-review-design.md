# Homeowner Document Review Website — Design

**Date:** 2026-04-14
**Status:** Approved

## Purpose

A public-facing website for a homeowner document review committee. Homeowners can read the community's bylaws, covenants, and founding articles alongside committee commentary explaining what is not working and why, then submit section-by-section feedback via a simple form.

## Site Structure

```
/                          Landing / About page
/documents                 Index of all 3 documents
/documents/bylaws          Bylaws — section 1 (default)
/documents/bylaws/2        Bylaws — section 2
/documents/bylaws/N        ...
/documents/covenants       Same pattern
/documents/articles        Same pattern
```

## Pages

### Landing / About
- Explains the committee, the purpose of the review, and what homeowners are being asked to do
- Call-to-action button linking to `/documents`

### Document Index (`/documents`)
- Three cards, one per document
- Each card: title, short description, "Review Document" button

### Document Section Pages
- One page per section of each document
- Side-by-side two-column layout:
  - **Left column**: original clause text (verbatim)
  - **Right column**: committee commentary (what's not working and why)
- Navigation: Previous Section / Next Section links, breadcrumb back to document index

## Feedback Interaction

### Speech Bubble Button
- Positioned in the right margin of the left (clause) column, beside each clause
- Default state: faded/ghosted icon
- Hover state: fills to accent color
- Appears for every clause on the page

### Feedback Modal
- Triggered by clicking the speech bubble
- Centered modal with semi-transparent dark backdrop
- Close via × button or clicking outside the modal
- Contains an embedded Google Form iframe

### Google Form
- Single form used across all 3 documents
- Fields:
  1. **Document** — pre-filled via URL parameter, hidden from user
  2. **Clause** — pre-filled via URL parameter, hidden from user
  3. **Your comments** — open text, the only visible field
- All responses collected in a single Google Sheet, organized by document and clause

## Documents

| Document | Source | Method |
|---|---|---|
| Bylaws | Word doc | Convert to HTML, break into sections |
| Covenants | Word doc | Convert to HTML, break into sections |
| Founding Articles | PDF | Extract text manually, treat same as above |

## Tech Stack

- **HTML + Tailwind CSS** — layout and styling
- **Vanilla JS** — modal open/close behavior only
- **Google Forms + Google Sheets** — feedback collection
- **Netlify** — free static hosting

## Visual Design

- Color scheme TBD — placeholder: white background, dark gray text, slate/navy headers, teal accent for interactive elements
- Clean, neutral, readable — designed for document review, not marketing
