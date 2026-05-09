/**
 * checklist.js — Floating review checklist panel for revised bylaws article pages.
 * Injects its own <style> block so styles survive Tailwind CDN's dynamic injection.
 * null = not yet assessed (gray), true = met (green), false = not met (red)
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

// Per-article checklist status. Index matches question order above.
// null = not yet assessed, true = yes (green), false = no (red)
const STATUS = {
  //        Q1     Q2     Q3     Q4     Q5     Q6     Q7     Q8     Q9
  '1':  [false,  true,  true,  true,  true, false,  true,  true,  true],
  '2':  [ true,  true,  true, false,  true,  true,  true,  true,  true],
  '3':  [ null,  null,  null,  null,  null,  null,  null,  null,  null],
  '4':  [ null,  null,  null,  null,  null,  null,  null,  null,  null],
  '5':  [ null,  null,  null,  null,  null,  null,  null,  null,  null],
  '6':  [ null,  null,  null,  null,  null,  null,  null,  null,  null],
  '7':  [ null,  null,  null,  null,  null,  null,  null,  null,  null],
  '8':  [ null,  null,  null,  null,  null,  null,  null,  null,  null],
  '9':  [ null,  null,  null,  null,  null,  null,  null,  null,  null],
  '10': [ null,  null,  null,  null,  null,  null,  null,  null,  null]
};

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #checklist-toggle {
      position: fixed !important;
      bottom: 5rem !important;
      right: 1.5rem !important;
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
      right: 0 !important;
      height: 100% !important;
      width: 320px !important;
      max-width: 100vw !important;
      background: white !important;
      z-index: 9001 !important;
      box-shadow: -4px 0 24px rgba(0,0,0,0.18) !important;
      transform: translateX(100%) !important;
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
    .cl-list {
      list-style: none !important;
      margin: 0 !important;
      padding: 0.75rem 1.25rem !important;
      overflow-y: auto !important;
      flex: 1 !important;
    }
    .cl-item {
      display: flex !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
      padding: 0.7rem 0 !important;
      border-bottom: 1px solid #f1f5f9 !important;
    }
    .cl-item:last-child { border-bottom: none !important; }
    .cl-dot {
      width: 0.6rem !important;
      height: 0.6rem !important;
      border-radius: 9999px !important;
      flex-shrink: 0 !important;
      margin-top: 0.3rem !important;
    }
    .cl-dot-green { background: #10b981 !important; }
    .cl-dot-red   { background: #ef4444 !important; }
    .cl-dot-gray  { background: #d1d5db !important; }
    .cl-q {
      font-size: 0.8125rem !important;
      color: #374151 !important;
      line-height: 1.5 !important;
    }
  `;
  document.head.appendChild(style);
}

function getArticleNumber() {
  return window.location.pathname.split('/').pop().replace('.html', '');
}

function buildPanel() {
  injectStyles();

  const article = getArticleNumber();
  const statuses = STATUS[article] || Array(9).fill(null);

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

  const items = QUESTIONS.map((q, i) => {
    const s = statuses[i];
    const dotCls = s === true ? 'cl-dot-green' : s === false ? 'cl-dot-red' : 'cl-dot-gray';
    const label = s === true ? 'Met' : s === false ? 'Not met' : 'Not yet assessed';
    return `<li class="cl-item">
      <span class="cl-dot ${dotCls}" aria-label="${label}"></span>
      <span class="cl-q">${i + 1}. ${q}</span>
    </li>`;
  }).join('');

  panel.innerHTML = `
    <div class="cl-header">
      <span>Review Checklist</span>
      <button class="cl-close" onclick="toggleChecklist()" aria-label="Close checklist">&times;</button>
    </div>
    <ol class="cl-list">${items}</ol>
  `;
  document.body.appendChild(panel);
}

function toggleChecklist() {
  document.getElementById('checklist-panel').classList.toggle('cl-open');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildPanel);
} else {
  buildPanel();
}
