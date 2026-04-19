// ── Form configuration ──────────────────────────────────────────────────────
// Fill these in after setting up the Google Form.
// Get the entry IDs from: Form → ⋮ menu → "Get pre-filled link"
const FORM_URL         = 'https://docs.google.com/forms/d/e/1FAIpQLSfM5-R7VxyVuvqggELxG1BOe-6FUtYA9utm0tGu1vNm3h9Yog/viewform?usp=header';   // base form URL
const ENTRY_DOCUMENT   = 'entry.2116670787';         // field: document name
const ENTRY_CLAUSE     = 'entry.898368384';         // field: clause number

const EMAIL_FORM_URL   = 'https://docs.google.com/forms/d/e/1FAIpQLSfzbUlwuicQQX0jv8vhYXvVfOsYcoSkjSETai1sUsKPWzyHSA/viewform?embedded=true';
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

function openEmailModal() {
  const modal = document.getElementById('email-modal');
  if (!modal) return;

  _lastFocusedElement = document.activeElement;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  const closeBtn = document.getElementById('email-modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeEmailModal() {
  const modal = document.getElementById('email-modal');
  if (!modal) return;

  modal.classList.remove('open');
  document.body.style.overflow = '';

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

  // ── Email signup button injected into every header ────────────────────────
  const header = document.querySelector('header');
  if (header) {
    // Wrap existing header children so the button can sit flush right
    const inner = document.createElement('div');
    while (header.firstChild) inner.appendChild(header.firstChild);
    header.appendChild(inner);

    const btn = document.createElement('button');
    btn.id = 'email-signup-btn';
    btn.setAttribute('aria-label', 'Sign up for email updates');
    btn.textContent = 'Stay Updated';
    btn.addEventListener('click', openEmailModal);
    header.appendChild(btn);

    // Make the header a flex row so the button stays right-aligned
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
  }

  // ── Inject email signup modal markup ─────────────────────────────────────
  const emailModal = document.createElement('div');
  emailModal.id = 'email-modal';
  emailModal.className = 'email-modal-backdrop';
  emailModal.setAttribute('role', 'dialog');
  emailModal.setAttribute('aria-modal', 'true');
  emailModal.setAttribute('aria-label', 'Sign up for updates');
  emailModal.innerHTML = `
    <div class="email-modal-panel">
      <button
        id="email-modal-close"
        onclick="closeEmailModal()"
        class="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none z-10"
        aria-label="Close"
      >&times;</button>
      <iframe
        src="${EMAIL_FORM_URL}"
        width="100%"
        height="832"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
        title="Email signup form"
      >Loading…</iframe>
    </div>
  `;
  document.body.appendChild(emailModal);

  // Close email modal on backdrop click
  emailModal.addEventListener('click', (e) => {
    if (e.target === emailModal) closeEmailModal();
  });

  // ── Feedback modal wiring ─────────────────────────────────────────────────
  const feedbackModal = document.getElementById('feedback-modal');

  if (feedbackModal) {
    // Close on backdrop click
    feedbackModal.addEventListener('click', (e) => {
      if (e.target === feedbackModal) closeModal();
    });
  }

  // Close whichever modal is open on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (feedbackModal && feedbackModal.classList.contains('open')) closeModal();
    if (emailModal.classList.contains('open')) closeEmailModal();
  });
});
