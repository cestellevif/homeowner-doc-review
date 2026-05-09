/**
 * checklist.js — Floating reference checklist for revised bylaws article pages.
 * A personal reading aid: tick questions off as you review each article.
 * Nothing is saved — resets on page navigation.
 */

const QUESTIONS = [
  'Is the verbiage clear?',
  'What RCWs are relevant, and is this article in line?',
  'Does this protect the membership, the board as an institution, or the assets of the corporation?',
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
      top: 0 !important;
      left: 0 !important;
      height: 100% !important;
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
      cursor: pointer !important;
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
    .cl-item label {
      font-size: 0.8125rem !important;
      color: #374151 !important;
      line-height: 1.5 !important;
      cursor: pointer !important;
    }
    .cl-item.cl-checked label {
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

  const items = QUESTIONS.map((q, i) => `
    <li class="cl-item" id="cl-item-${i}">
      <input type="checkbox" id="cl-cb-${i}" onchange="toggleItem(${i})">
      <label for="cl-cb-${i}">${i + 1}. ${q}</label>
    </li>
  `).join('');

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

function resetChecklist() {
  QUESTIONS.forEach((_, i) => {
    document.getElementById('cl-cb-' + i).checked = false;
    document.getElementById('cl-item-' + i).classList.remove('cl-checked');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildPanel);
} else {
  buildPanel();
}
