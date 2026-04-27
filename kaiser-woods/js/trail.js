// kaiser-woods/js/trail.js
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
  const path = document.getElementById('trail-line');
  const pageEl = document.getElementById('kaiser-page');

  // Measure path length and set up for drawing
  const pathLength = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
  });

  // Draw path as user scrolls from page top to bottom
  gsap.to(path, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: pageEl,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
    },
  });
});
