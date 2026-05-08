/**
 * checklist.js — Floating review checklist panel for revised bylaws article pages.
 * Injects a button and slide-in panel. Status per article is seeded below.
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

function getArticleNumber() {
  return window.location.pathname.split('/').pop().replace('.html', '');
}

function buildPanel() {
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
    const cls = s === true ? 'dot-green' : s === false ? 'dot-red' : 'dot-gray';
    const label = s === true ? 'Met' : s === false ? 'Not met' : 'Not yet assessed';
    return `<li class="checklist-item">
      <span class="cl-dot ${cls}" aria-label="${label}"></span>
      <span class="cl-q">${i + 1}. ${q}</span>
    </li>`;
  }).join('');

  panel.innerHTML = `
    <div class="cl-header">
      <span>Review Checklist</span>
      <button onclick="toggleChecklist()" aria-label="Close checklist">&times;</button>
    </div>
    <ol class="cl-list">${items}</ol>
  `;
  document.body.appendChild(panel);
}

function toggleChecklist() {
  document.getElementById('checklist-panel').classList.toggle('open');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildPanel);
} else {
  buildPanel();
}
