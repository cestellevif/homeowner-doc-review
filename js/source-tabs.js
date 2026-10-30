/**
 * source-tabs.js — toggles the Sound Legal original language panel per clause.
 * Called by the .orig-tab-strip button inside each .clause-block.
 */
function toggleOrig(block) {
  const isOpen = block.classList.toggle('orig-open');
  block.querySelector('.orig-tab-strip').setAttribute('aria-expanded', String(isOpen));
}
