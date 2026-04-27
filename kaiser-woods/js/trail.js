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

  // ---- Chapter pin + reveal system ----
  function initChapter(el) {
    const pinDuration = parseInt(el.dataset.pin || '600');
    const revealEls = el.querySelectorAll('.reveal');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=' + pinDuration,
        pin: true,
        scrub: false,
        anticipatePin: 1,
      },
    });

    tl.from(revealEls, {
      opacity: 0,
      y: 35,
      duration: 0.7,
      stagger: 0.25,
      ease: 'power2.out',
    });
  }

  gsap.utils.toArray('.chapter').forEach(initChapter);
});
