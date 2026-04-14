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
