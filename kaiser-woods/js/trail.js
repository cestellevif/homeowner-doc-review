// kaiser-woods/js/trail.js
gsap.registerPlugin(ScrollTrigger);

function initChapter(el) {
  const pinDuration = parseInt(el.dataset.pin || '1500') || 1500;
  const revealEls = el.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const peek = el.querySelector('.chapter__peek');

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: 'top top',
      end: '+=' + pinDuration,
      pin: true,
      scrub: false,
      anticipatePin: 1,
      onEnter: () => {
        // First .reveal element slides in from slightly right as chapter enters
        const firstReveal = revealEls[0];
        if (firstReveal) {
          gsap.from(firstReveal, {
            x: 60,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      },
    },
  });

  tl.from(revealEls, {
    opacity: 0,
    y: 35,
    duration: 0.7,
    stagger: 0.25,
    ease: 'power2.out',
  });

  // Peek text: pulse when pinned, fade when leaving
  if (peek) {
    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=' + pinDuration,
      onEnter: () => gsap.to(peek, { opacity: 0.22, duration: 0.4 }),
      onLeave: () => gsap.to(peek, { opacity: 0, duration: 0.3 }),
      onEnterBack: () => gsap.to(peek, { opacity: 0.22, duration: 0.4 }),
      onLeaveBack: () => gsap.to(peek, { opacity: 0.18, duration: 0.3 }),
    });
  }
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
