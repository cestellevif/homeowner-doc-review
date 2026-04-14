# HDR — Homeowner Document Review Website

## Project Overview

Public-facing static website for a homeowner document review committee. Homeowners read community governing documents (bylaws, covenants, founding articles) alongside committee commentary, and submit clause-level feedback via embedded Google Forms.

## Tech Stack

- **HTML5 + Tailwind CSS (CDN)** — no build step
- **Vanilla JS** — modal open/close only (`js/modal.js`)
- **Google Forms + Google Sheets** — feedback collection
- **Netlify** — static hosting

## Directory Structure

```
/
  index.html                  ← Landing/About page
  CLAUDE.md                   ← This file
  netlify.toml                ← Netlify config
  css/
    styles.css                ← Speech bubble + modal styles
  js/
    modal.js                  ← Modal open/close logic
  documents/
    index.html                ← Document index (3 cards)
    bylaws/
      index.html              ← Bylaws section 1
      2.html                  ← Bylaws section 2
      ...
    covenants/
      index.html
      ...
    articles/
      index.html
      ...
  _partials/                  ← Reference snippets (not served)
    head.html
    modal.html
  docs/
    plans/                    ← Design and implementation plans
```

## Key Conventions

### Adding a New Document Section

1. Copy an existing section page (e.g., `documents/bylaws/index.html`)
2. Update: `<title>`, breadcrumb text, header title
3. Replace clause blocks with real content (see Clause Block structure below)
4. Update nav footer links (prev/next, or remove if first/last section)
5. Commit: `git commit -m "content: add [doc] section N"`

### Clause Block Structure

Each clause is a two-column grid card:

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
  <!-- Left: original clause text + speech bubble button -->
  <div class="bg-white p-6 relative border-r border-gray-200">
    <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Clause X.X</p>
    <p class="text-gray-800 leading-relaxed">Original text here.</p>
    <button class="feedback-btn absolute top-4 right-4 text-teal-500"
            onclick="openModal('PREFILL_URL')" aria-label="Leave feedback on Clause X.X">
      <!-- SVG speech bubble icon -->
    </button>
  </div>
  <!-- Right: committee commentary -->
  <div class="bg-slate-50 p-6">
    <p class="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Committee Notes</p>
    <p class="text-gray-700 leading-relaxed">Commentary here.</p>
  </div>
</div>
```

### Google Form Pre-fill URLs

One Google Form handles all documents. Each clause button passes pre-filled values via URL params:

```
https://docs.google.com/forms/d/e/FORM_ID/viewform?usp=pp_url&entry.DOC_ID=Bylaws&entry.CLAUSE_ID=1.1
```

To get your `entry.XXXXXX` IDs: open the form → three-dot menu → "Get pre-filled link".

### Speech Bubble Button

- Default: 25% opacity (faded)
- Hover: 100% opacity (fills in)
- Controlled by `.feedback-btn` in `css/styles.css`

### Modal

- Triggered by `openModal(url)` in `js/modal.js`
- Closed by `closeModal()` or clicking the backdrop
- Google Form loads in an iframe inside the modal

## Deployment

Hosted on Netlify. To deploy:
- **Manual:** Drag project folder to netlify.com → "Deploy manually"
- **Auto:** Connect GitHub repo, publish directory = `.`, no build command

## Implementation Status

- [x] CLAUDE.md created
- [x] Task 1: Project scaffold
- [x] Task 2: Shared partials
- [x] Task 3: Landing/About page
- [x] Task 4: Document index page
- [x] Task 5: Document section page template
- [ ] Task 6: Google Form setup (manual)
- [ ] Task 7: Populate bylaws pages (requires document content)
- [ ] Task 8: Populate covenants pages (requires document content)
- [ ] Task 9: Populate founding articles pages (requires PDF extraction)
- [ ] Task 10: Deploy to Netlify
