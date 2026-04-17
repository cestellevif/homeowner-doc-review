# Homeowner Document Review Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a public-facing static website where homeowners read community documents alongside committee commentary and submit clause-level feedback via an embedded Google Form.

**Architecture:** Static HTML pages per document section, side-by-side two-column layout, vanilla JS modal for feedback, Google Forms for data collection. No build step — Tailwind via CDN. Hosted on Netlify.

**Tech Stack:** HTML5, Tailwind CSS (CDN), Vanilla JS, Google Forms + Google Sheets, Netlify

**Agents to check in with:** `frontend-developer` for layout/component tasks, `javascript-pro` for modal logic

---

### Task 1: Project Scaffold

**Files:**
- Create: `index.html`
- Create: `documents/index.html`
- Create: `js/modal.js`
- Create: `css/styles.css`
- Create: `netlify.toml`

**Step 1: Create directory structure**

```bash
mkdir -p documents/bylaws documents/covenants documents/articles js css
```

**Step 2: Create `netlify.toml`**

```toml
[build]
  publish = "."

[[redirects]]
  from = "/documents/bylaws"
  to = "/documents/bylaws/index.html"
  status = 200
```

**Step 3: Create base `css/styles.css`**

```css
/* Speech bubble button */
.feedback-btn {
  opacity: 0.25;
  transition: opacity 0.2s ease;
  cursor: pointer;
}
.feedback-btn:hover {
  opacity: 1;
}

/* Modal backdrop */
.modal-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
  align-items: center;
  justify-content: center;
}
.modal-backdrop.open {
  display: flex;
}
```

**Step 4: Create `js/modal.js`**

```js
function openModal(formUrl) {
  const iframe = document.getElementById('feedback-iframe');
  iframe.src = formUrl;
  document.getElementById('feedback-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('feedback-modal').classList.remove('open');
  document.getElementById('feedback-iframe').src = '';
}

// Close on backdrop click
document.addEventListener('DOMContentLoaded', () => {
  const backdrop = document.getElementById('feedback-modal');
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
});
```

**Step 5: Commit**

```bash
git init
git add .
git commit -m "feat: project scaffold — HTML/Tailwind/JS structure"
```

---

### Task 2: Shared HTML Components (copy-paste snippets)

These are reusable HTML fragments. Copy them into each page as needed — no build system, just consistent copy-paste.

**Files:**
- Create: `_partials/head.html` (reference only — not served, just for copying)
- Create: `_partials/modal.html`
- Create: `_partials/nav.html`

**Step 1: Create `_partials/head.html`**

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="/css/styles.css" />
```

**Step 2: Create `_partials/modal.html`**

```html
<!-- Feedback Modal — paste before </body> on every document page -->
<div id="feedback-modal" class="modal-backdrop">
  <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative">
    <button
      onclick="closeModal()"
      class="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none"
    >&times;</button>
    <iframe
      id="feedback-iframe"
      src=""
      width="100%"
      height="520"
      frameborder="0"
      class="rounded-lg"
    ></iframe>
  </div>
</div>
<script src="/js/modal.js"></script>
```

**Step 3: Commit**

```bash
git add _partials/
git commit -m "feat: shared partial snippets for head, modal, nav"
```

---

### Task 3: Landing / About Page

**Files:**
- Modify: `index.html`

**Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Document Review Committee</title>
  <!-- paste _partials/head.html here -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/css/styles.css" />
</head>
<body class="bg-white text-gray-800 font-sans">

  <!-- Header -->
  <header class="bg-slate-800 text-white px-8 py-6">
    <h1 class="text-2xl font-bold">Homeowner Document Review Committee</h1>
  </header>

  <!-- Hero -->
  <main class="max-w-3xl mx-auto px-6 py-16">
    <h2 class="text-3xl font-bold text-slate-800 mb-4">Your Voice Matters</h2>
    <p class="text-lg text-gray-600 mb-6">
      Our community's governing documents — bylaws, covenants, and founding articles —
      shape how we live together. This committee was formed to review these documents,
      identify what isn't working, and gather homeowner input before proposing changes.
    </p>
    <p class="text-gray-600 mb-10">
      Each document is presented clause by clause alongside our commentary.
      Use the feedback buttons to share your thoughts on any clause.
      All responses are reviewed by the committee.
    </p>
    <a
      href="/documents/"
      class="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg transition"
    >
      Review the Documents →
    </a>
  </main>

  <footer class="text-center text-sm text-gray-400 py-8">
    Document Review Committee · [Community Name]
  </footer>

</body>
</html>
```

**Step 2: Open in browser and verify it renders — header, intro text, and CTA button visible**

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: landing/about page"
```

---

### Task 4: Document Index Page

**Files:**
- Modify: `documents/index.html`

**Step 1: Write `documents/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Documents — Review Committee</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/css/styles.css" />
</head>
<body class="bg-white text-gray-800 font-sans">

  <header class="bg-slate-800 text-white px-8 py-6">
    <a href="/" class="text-slate-300 text-sm hover:text-white">← Home</a>
    <h1 class="text-2xl font-bold mt-1">Documents Under Review</h1>
  </header>

  <main class="max-w-3xl mx-auto px-6 py-12">
    <p class="text-gray-600 mb-8">
      Select a document to begin reviewing. Each document is broken into sections.
      Click the comment icon next to any clause to leave feedback.
    </p>

    <div class="space-y-4">

      <!-- Bylaws Card -->
      <div class="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">Bylaws</h2>
          <p class="text-gray-500 text-sm mt-1">Governing rules for the association</p>
        </div>
        <a href="/documents/bylaws/" class="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
          Review →
        </a>
      </div>

      <!-- Covenants Card -->
      <div class="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">Covenants</h2>
          <p class="text-gray-500 text-sm mt-1">Conditions, covenants & restrictions</p>
        </div>
        <a href="/documents/covenants/" class="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
          Review →
        </a>
      </div>

      <!-- Founding Articles Card -->
      <div class="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">Founding Articles</h2>
          <p class="text-gray-500 text-sm mt-1">Articles of incorporation</p>
        </div>
        <a href="/documents/articles/" class="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition">
          Review →
        </a>
      </div>

    </div>
  </main>

</body>
</html>
```

**Step 2: Open in browser — verify 3 cards render with working links (pages don't exist yet, 404 is fine)**

**Step 3: Commit**

```bash
git add documents/index.html
git commit -m "feat: document index page with 3 document cards"
```

---

### Task 5: Document Section Page Template

This is the core page. Build one complete template, then copy it for every section of every document.

**Files:**
- Create: `documents/bylaws/index.html` (Section 1 — placeholder content)

**Step 1: Write the template**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bylaws — Section 1 · Review Committee</title>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="/css/styles.css" />
</head>
<body class="bg-gray-50 text-gray-800 font-sans">

  <!-- Header / Breadcrumb -->
  <header class="bg-slate-800 text-white px-8 py-4">
    <nav class="text-sm text-slate-300 space-x-2">
      <a href="/" class="hover:text-white">Home</a>
      <span>/</span>
      <a href="/documents/" class="hover:text-white">Documents</a>
      <span>/</span>
      <span class="text-white">Bylaws</span>
    </nav>
    <h1 class="text-xl font-bold mt-1">Bylaws — Section 1: [Section Title]</h1>
  </header>

  <!-- Document Sections -->
  <main class="max-w-6xl mx-auto px-6 py-10 space-y-10">

    <!-- CLAUSE BLOCK — repeat this block for each clause on the page -->
    <div class="grid grid-cols-2 gap-0 border border-gray-200 rounded-lg overflow-hidden shadow-sm">

      <!-- Left: Original Clause Text -->
      <div class="bg-white p-6 relative border-r border-gray-200">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Clause 1.1</p>
        <p class="text-gray-800 leading-relaxed">
          [Original clause text goes here. Paste verbatim from the document.]
        </p>

        <!-- Speech Bubble Feedback Button -->
        <button
          class="feedback-btn absolute top-4 right-4 text-teal-500"
          title="Leave feedback on this clause"
          onclick="openModal('GOOGLE_FORM_URL_FOR_CLAUSE_1_1')"
          aria-label="Leave feedback on Clause 1.1"
        >
          <!-- Speech bubble SVG icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4a2 2 0 00-2 2v12a2 2 0 002 2h14l4 4V4a2 2 0 00-2-2z"/>
          </svg>
        </button>
      </div>

      <!-- Right: Committee Commentary -->
      <div class="bg-slate-50 p-6">
        <p class="text-xs font-semibold text-teal-600 uppercase tracking-wide mb-2">Committee Notes</p>
        <p class="text-gray-700 leading-relaxed">
          [Committee commentary here — explain what's not working and why.]
        </p>
      </div>

    </div>
    <!-- END CLAUSE BLOCK -->

  </main>

  <!-- Section Navigation -->
  <footer class="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-t border-gray-200 mt-4">
    <span class="text-gray-400 text-sm">← Previous Section</span>
    <!-- Replace above with: <a href="/documents/bylaws/prev" class="text-teal-600 hover:underline text-sm">← Previous Section</a> -->
    <a href="/documents/" class="text-gray-500 hover:text-gray-700 text-sm">All Documents</a>
    <a href="/documents/bylaws/2" class="text-teal-600 hover:underline text-sm">Next Section →</a>
  </footer>

  <!-- Feedback Modal (paste from _partials/modal.html) -->
  <div id="feedback-modal" class="modal-backdrop">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 relative">
      <button
        onclick="closeModal()"
        class="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none"
      >&times;</button>
      <iframe
        id="feedback-iframe"
        src=""
        width="100%"
        height="520"
        frameborder="0"
        class="rounded-lg"
      ></iframe>
    </div>
  </div>
  <script src="/js/modal.js"></script>

</body>
</html>
```

**Step 2: Open in browser. Verify:**
- Two-column layout renders
- Speech bubble icon visible in top-right of left column
- Hovering over bubble goes from faded to full opacity
- Clicking bubble opens modal (iframe will be empty until Google Form is set up)
- × button and backdrop click close the modal

**Step 3: Commit**

```bash
git add documents/bylaws/index.html
git commit -m "feat: document section page template with clause/commentary layout and feedback modal"
```

---

### Task 6: Set Up Google Form

> This task is manual — no code. Do this in Google Forms before populating clause pages.

**Step 1: Go to forms.google.com and create a new form**

Title: "Document Review — Homeowner Feedback"

**Step 2: Add these fields:**

1. Short answer — Label: `Document` — Mark as required
2. Short answer — Label: `Clause` — Mark as required
3. Paragraph — Label: `Your comments` — Mark as required

**Step 3: Get the pre-fill URL for each clause**

1. In the form editor, click the three-dot menu → "Get pre-filled link"
2. Fill in sample values (e.g., Document = "Bylaws", Clause = "1.1")
3. Click "Get Link" — copy the URL
4. The URL will look like:
   `https://docs.google.com/forms/d/e/XXXXXXX/viewform?usp=pp_url&entry.111111=Bylaws&entry.222222=1.1`
5. Note the `entry.XXXXXX` parameter IDs — they are the same for every clause, only the values change

**Step 4: For each clause, construct its pre-fill URL:**

```
BASE_URL?entry.DOC_FIELD_ID=Bylaws&entry.CLAUSE_FIELD_ID=1.1
BASE_URL?entry.DOC_FIELD_ID=Bylaws&entry.CLAUSE_FIELD_ID=1.2
BASE_URL?entry.DOC_FIELD_ID=Covenants&entry.CLAUSE_FIELD_ID=3.4
```

**Step 5: Replace every `GOOGLE_FORM_URL_FOR_CLAUSE_X_X` placeholder in the HTML pages with the appropriate pre-fill URL**

**Step 6: In Google Forms → Responses tab → click the Sheets icon to link to a Google Sheet**

All feedback will auto-populate into the sheet, organized by timestamp, document, clause, and comment.

---

### Task 7: Populate Bylaws Pages

> For each section of the Bylaws, copy `documents/bylaws/index.html`, update the title, breadcrumb, clause content, commentary, and nav links. Repeat per section.

**Files:**
- Modify: `documents/bylaws/index.html` — Section 1 content
- Create: `documents/bylaws/2.html` — Section 2
- Create: `documents/bylaws/N.html` — one file per section

**Step 1: In `documents/bylaws/index.html`, replace all placeholder text:**
- Page `<title>`
- Header section title
- Each clause block: clause number, original text, commentary, pre-fill Google Form URL

**Step 2: Update nav links:**
- First page: no "← Previous" link
- Middle pages: both prev and next links
- Last page: no "Next →" link

**Step 3: For each additional section, copy `index.html` → `2.html`, `3.html`, etc., and update content**

**Step 4: Commit when all bylaws sections are complete**

```bash
git add documents/bylaws/
git commit -m "content: add bylaws sections 1–N"
```

---

### Task 8: Populate Covenants Pages

Same process as Task 7.

**Files:**
- Create: `documents/covenants/index.html`, `documents/covenants/2.html`, etc.

**Step 1: Copy `documents/bylaws/index.html` as the starting template**
**Step 2: Update all content — title, breadcrumb, clauses, commentary, form URLs, nav links**
**Step 3: Commit**

```bash
git add documents/covenants/
git commit -m "content: add covenants sections 1–N"
```

---

### Task 9: Populate Founding Articles Pages

Same process. Note: source is a PDF — extract text by opening the PDF and copy-pasting each clause into the HTML.

**Files:**
- Create: `documents/articles/index.html`, `documents/articles/2.html`, etc.

**Step 1: Copy template, extract text from PDF, populate clauses**
**Step 2: Update commentary, form URLs, nav links**
**Step 3: Commit**

```bash
git add documents/articles/
git commit -m "content: add founding articles sections 1–N"
```

---

### Task 10: Deploy to Netlify

**Step 1: Push to GitHub (if using Git)**

```bash
git remote add origin https://github.com/YOUR_USERNAME/hdr-site.git
git push -u origin main
```

**Step 2: Deploy on Netlify**

Option A — Drag and drop:
1. Go to netlify.com → "Add new site" → "Deploy manually"
2. Drag your project folder into the upload zone
3. Netlify assigns a URL (e.g., `random-name.netlify.app`)

Option B — Connect GitHub:
1. Go to netlify.com → "Add new site" → "Import from Git"
2. Connect your GitHub repo
3. Build command: leave blank. Publish directory: `.`
4. Every push to `main` auto-deploys

**Step 3: Set a custom subdomain (optional)**

In Netlify site settings → Domain management → Options → Edit site name
e.g., `hdr-committee.netlify.app`

**Step 4: Verify live site**
- Open the Netlify URL
- Navigate: Home → Documents → each document → check clause layout and modal
- Submit a test feedback entry and confirm it appears in Google Sheets

**Step 5: Final commit**

```bash
git add .
git commit -m "chore: add netlify.toml, ready for deployment"
```

---

## Content Checklist (fill in as you go)

- [ ] Bylaws: how many sections? ___
- [ ] Covenants: how many sections? ___
- [ ] Founding Articles: how many sections? ___
- [ ] Google Form created and pre-fill URLs generated
- [ ] All clause blocks populated with real text
- [ ] All commentary blocks written
- [ ] Nav links correct on all pages (first/last sections handled)
- [ ] Test feedback submission end-to-end
- [ ] Site deployed and accessible
