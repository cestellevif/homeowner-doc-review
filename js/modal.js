// ── Form configuration ──────────────────────────────────────────────────────
// Fill these in after setting up the Google Form.
// Get the entry IDs from: Form → ⋮ menu → "Get pre-filled link"
const FORM_URL         = 'https://docs.google.com/forms/d/e/1FAIpQLSfM5-R7VxyVuvqggELxG1BOe-6FUtYA9utm0tGu1vNm3h9Yog/viewform?usp=header';   // base form URL
const ENTRY_DOCUMENT   = 'entry.2116670787';         // field: document name
const ENTRY_CLAUSE     = 'entry.898368384';         // field: clause number
// ────────────────────────────────────────────────────────────────────────────

// Track the element that opened the modal so focus can be restored on close
let _lastFocusedElement = null;

function openModal(doc, clause) {
  const modal = document.getElementById('feedback-modal');
  const iframe = document.getElementById('feedback-iframe');
  const closeBtn = document.getElementById('feedback-modal-close');

  // Null-guard: do nothing if the modal markup isn't present on this page
  if (!modal || !iframe) return;

  _lastFocusedElement = document.activeElement;

  const base = FORM_URL.split('?')[0];
  const url = `${base}?usp=pp_url&${ENTRY_DOCUMENT}=${encodeURIComponent(doc)}&${ENTRY_CLAUSE}=${encodeURIComponent(clause)}`;
  iframe.src = url;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Move focus into the modal; fall back to the modal container itself
  if (closeBtn) {
    closeBtn.focus();
  } else {
    modal.focus();
  }
}

function closeModal() {
  const modal = document.getElementById('feedback-modal');
  const iframe = document.getElementById('feedback-iframe');

  // Null-guard: do nothing if the modal markup isn't present on this page
  if (!modal || !iframe) return;

  modal.classList.remove('open');
  iframe.src = '';
  document.body.style.overflow = '';

  // Return focus to the element that triggered the modal
  if (_lastFocusedElement) {
    _lastFocusedElement.focus();
    _lastFocusedElement = null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Inject consistent site credit footer on every page
  const credit = document.createElement('footer');
  credit.className = 'text-center text-sm text-gray-400 py-6 border-t border-gray-100';
  credit.textContent = 'Homeowner Document Review · Lakemoor Community Club';
  document.body.appendChild(credit);

  const modal = document.getElementById('feedback-modal');

  // Null-guard: nothing to wire up if the modal markup isn't on this page
  if (!modal) return;

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
});
