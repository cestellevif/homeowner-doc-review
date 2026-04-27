// kaiser-woods/js/trail.js
gsap.registerPlugin(ScrollTrigger);

function initChapter(el) {
  const pinDuration = parseInt(el.dataset.pin || '1500') || 1500;
  const revealEls = el.querySelectorAll('.reveal');
  if (!revealEls.length) return;

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

window.addEventListener('DOMContentLoaded', () => {
  // Trail draw animation
  const path = document.getElementById('trail-line');
  const pageEl = document.getElementById('kaiser-page');

  const pathLength = path.getTotalLength();
  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
  });

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

  // Initialize chapters
  gsap.utils.toArray('.chapter').forEach(initChapter);
});
