/**
 * checklist.js — Floating reference checklist for revised bylaws article pages.
 * A personal reading aid: tick questions off as you review each article.
 * Nothing is saved — resets on page navigation.
 *
 * Questions can be a plain string or an object with subItems. When subItems
 * are present, the parent checkbox starts disabled — you must check at least
 * one sub-item before you can mark the parent question as done.
 */

const QUESTIONS = [
  'Is the verbiage clear?',
  'What RCWs are relevant, and is this article in line?',
  { text: 'Does this protect:', subItems: ['Members', 'Organization', 'Assets'] },
  'Are the processes repeatable, and do they support board transition over time?',
  'Is this something that should be easy to change, or difficult to change?',
  'Does this incur responsibility on an officer or agent? Does there need to be a backstop?',
  'Are the processes outlined predictable?',
  'Is this fair in application?',
  'Does this enable participation or oversight?'
];

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #checklist-toggle {
      position: fixed !important;
      bottom: 5rem !important;
      left: 1.5rem !important;
      z-index: 9000 !important;
      background: #1e293b !important;
      color: white !important;
      border: none !important;
      border-radius: 9999px !important;
      width: 2.75rem !important;
      height: 2.75rem !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25) !important;
      padding: 0 !important;
    }
    #checklist-toggle:hover { background: #0f172a !important; }
    #checklist-toggle svg { width: 1.2rem; height: 1.2rem; flex-shrink: 0; }

    #checklist-panel {
      position: fixed !important;
      top: auto !important;
      bottom: 0 !important;
      left: 0 !important;
      height: auto !important;
      max-height: calc(100vh - 2rem) !important;
      width: 320px !important;
      max-width: 100vw !important;
      background: white !important;
      z-index: 9001 !important;
      box-shadow: 4px 0 24px rgba(0,0,0,0.18) !important;
      transform: translateX(-100%) !important;
      transition: transform 0.25s ease !important;
      display: flex !important;
      flex-direction: column !important;
    }
    #checklist-panel.cl-open { transform: translateX(0) !important; }

    .cl-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: #1e293b;
      color: white;
      font-size: 0.875rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    .cl-close {
      background: none !important;
      border: none !important;
      color: white !important;
      font-size: 1.5rem !important;
      line-height: 1 !important;
      cursor: pointer !important;
      padding: 0 !important;
    }
    .cl-subhead {
      padding: 0.75rem 1.25rem 0.25rem;
      font-size: 0.75rem;
      color: #6b7280;
      border-bottom: 1px solid #f1f5f9;
      flex-shrink: 0;
    }
    .cl-list {
      list-style: none !important;
      margin: 0 !important;
      padding: 0.5rem 1.25rem !important;
      overflow-y: auto !important;
      flex: 1 !important;
    }
    .cl-item {
      display: flex !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
      padding: 0.65rem 0 !important;
      border-bottom: 1px solid #f8fafc !important;
    }
    .cl-item:last-child { border-bottom: none !important; }
    .cl-item input[type="checkbox"] {
      margin-top: 0.2rem !important;
      flex-shrink: 0 !important;
      width: 1rem !important;
      height: 1rem !important;
      accent-color: #0d9488 !important;
      cursor: pointer !important;
    }
    .cl-item input[type="checkbox"]:disabled {
      opacity: 0.35 !important;
      cursor: not-allowed !important;
    }
    .cl-item-body {
      flex: 1 !important;
    }
    .cl-item-body > label {
      font-size: 0.8125rem !important;
      color: #374151 !important;
      line-height: 1.5 !important;
      cursor: pointer !important;
      display: block !important;
    }
    .cl-item.cl-checked > .cl-item-body > label {
      color: #9ca3af !important;
      text-decoration: line-through !important;
    }

    /* Sub-items — real checkboxes indented below the parent label */
    .cl-sub-list {
      list-style: none !important;
      margin: 0.4rem 0 0 0 !important;
      padding: 0 !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 0.3rem !important;
    }
    .cl-sub-item {
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
    }
    .cl-sub-item input[type="checkbox"] {
      margin-top: 0 !important;
      width: 0.875rem !important;
      height: 0.875rem !important;
      accent-color: #0d9488 !important;
      cursor: pointer !important;
    }
    .cl-sub-item label {
      font-size: 0.8125rem !important;
      color: #374151 !important;
      cursor: pointer !important;
    }
    .cl-sub-item.cl-sub-checked label {
      color: #9ca3af !important;
      text-decoration: line-through !important;
    }

    .cl-footer {
      padding: 0.75rem 1.25rem;
      border-top: 1px solid #f1f5f9;
      flex-shrink: 0;
    }
    #cl-reset {
      width: 100%;
      padding: 0.5rem;
      background: none !important;
      border: 1px solid #e5e7eb !important;
      border-radius: 0.375rem !important;
      font-size: 0.75rem !important;
      color: #6b7280 !important;
      cursor: pointer !important;
    }
    #cl-reset:hover {
      border-color: #9ca3af !important;
      color: #374151 !important;
    }
  `;
  document.head.appendChild(style);
}

// Render a single list item. Questions with subItems get a disabled parent
// checkbox and a nested sub-list of individually checkable options.
function renderItem(q, i) {
  if (typeof q === 'string') {
    return `
      <li class="cl-item" id="cl-item-${i}">
        <input type="checkbox" id="cl-cb-${i}" onchange="toggleItem(${i})">
        <div class="cl-item-body">
          <label for="cl-cb-${i}">${i + 1}. ${q}</label>
        </div>
      </li>`;
  }

  // Object with subItems — parent starts disabled
  const subHtml = q.subItems.map((label, j) => `
    <li class="cl-sub-item" id="cl-sub-item-${i}-${j}">
      <input type="checkbox" id="cl-sub-${i}-${j}" onchange="toggleSubItem(${i}, ${j})">
      <label for="cl-sub-${i}-${j}">${label}</label>
    </li>`).join('');

  return `
    <li class="cl-item" id="cl-item-${i}">
      <input type="checkbox" id="cl-cb-${i}" onchange="toggleItem(${i})" disabled>
      <div class="cl-item-body">
        <label for="cl-cb-${i}">${i + 1}. ${q.text}</label>
        <ul class="cl-sub-list">${subHtml}</ul>
      </div>
    </li>`;
}

function buildPanel() {
  injectStyles();

  // Floating toggle button
  const btn = document.createElement('button');
  btn.id = 'checklist-toggle';
  btn.setAttribute('aria-label', 'Open review checklist');
  btn.setAttribute('title', 'Review checklist');
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>`;
  btn.onclick = toggleChecklist;
  document.body.appendChild(btn);

  // Slide-in panel
  const panel = document.createElement('div');
  panel.id = 'checklist-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Review checklist');

  const items = QUESTIONS.map(renderItem).join('');

  panel.innerHTML = `
    <div class="cl-header">
      <span>Review Checklist</span>
      <button class="cl-close" onclick="toggleChecklist()" aria-label="Close">&times;</button>
    </div>
    <p class="cl-subhead">Check off each question as you review this article.</p>
    <ol class="cl-list">${items}</ol>
    <div class="cl-footer">
      <button id="cl-reset" onclick="resetChecklist()">Reset all</button>
    </div>
  `;
  document.body.appendChild(panel);
}

function toggleChecklist() {
  document.getElementById('checklist-panel').classList.toggle('cl-open');
}

function toggleItem(i) {
  const item = document.getElementById('cl-item-' + i);
  const cb = document.getElementById('cl-cb-' + i);
  item.classList.toggle('cl-checked', cb.checked);
}

// Called when a sub-item checkbox changes. Enables the parent checkbox once
// at least one sub-item is checked; disables it again if all are unchecked.
function toggleSubItem(i, j) {
  const subItem = document.getElementById('cl-sub-item-' + i + '-' + j);
  const subCb = document.getElementById('cl-sub-' + i + '-' + j);
  subItem.classList.toggle('cl-sub-checked', subCb.checked);

  // Count how many sub-items are checked
  const q = QUESTIONS[i];
  const anyChecked = q.subItems.some((_, k) =>
    document.getElementById('cl-sub-' + i + '-' + k).checked
  );

  const parentCb = document.getElementById('cl-cb-' + i);
  parentCb.disabled = !anyChecked;

  // If all sub-items are unchecked, also uncheck and un-strike the parent
  if (!anyChecked) {
    parentCb.checked = false;
    document.getElementById('cl-item-' + i).classList.remove('cl-checked');
  }
}

function resetChecklist() {
  QUESTIONS.forEach((q, i) => {
    const cb = document.getElementById('cl-cb-' + i);
    cb.checked = false;
    document.getElementById('cl-item-' + i).classList.remove('cl-checked');

    // Reset sub-items if present
    if (q && typeof q === 'object' && q.subItems) {
      cb.disabled = true;
      q.subItems.forEach((_, j) => {
        document.getElementById('cl-sub-' + i + '-' + j).checked = false;
        document.getElementById('cl-sub-item-' + i + '-' + j).classList.remove('cl-sub-checked');
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildPanel);
} else {
  buildPanel();
}
