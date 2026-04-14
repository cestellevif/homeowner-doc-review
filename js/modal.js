// Track the element that opened the modal so focus can be restored on close
let _lastFocusedElement = null;

function openModal(formUrl) {
  const modal = document.getElementById('feedback-modal');
  const iframe = document.getElementById('feedback-iframe');
  const closeBtn = document.getElementById('feedback-modal-close');

  // Null-guard: do nothing if the modal markup isn't present on this page
  if (!modal || !iframe) return;

  _lastFocusedElement = document.activeElement;

  iframe.src = formUrl;
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
