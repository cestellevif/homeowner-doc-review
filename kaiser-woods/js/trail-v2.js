gsap.registerPlugin(ScrollTrigger);

// ---- Constants ----
const PIXELS_PER_UNIT = 480; // scroll pixels per timeline second

// ---- Scene definitions ----
// type: 'hero' | 'build' | 'sequential'
const SCENE_DEFS = [
  { id: 's-hero',       type: 'hero',       holdDuration: 0.4 },
  { id: 's-background', type: 'build',       holdDuration: 0.3 },
  { id: 's-park',       type: 'build',       holdDuration: 0.3 },
  { id: 's-simmons',    type: 'sequential',  holdDuration: 0.3 },
  { id: 's-swanson',    type: 'build',       holdDuration: 0.3 },
  { id: 's-missing',    type: 'build',       holdDuration: 0.4 },
  { id: 's-june2024',   type: 'build',       holdDuration: 0.4 },
  { id: 's-sept2024',   type: 'build',       holdDuration: 0.3 },
  { id: 's-oct2024',    type: 'build',       holdDuration: 0.3 },
  { id: 's-dec2024',    type: 'build',       holdDuration: 0.4 },
  { id: 's-nov2025',    type: 'build',       holdDuration: 0.4 },
  { id: 's-temporary',  type: 'build',       holdDuration: 0.4 },
  { id: 's-next',       type: 'hero',        holdDuration: 0.5 },
  { id: 's-cta',        type: 'build',       holdDuration: 0.6 },
];

// ---- Approach animation: item enters from right-small → reading position ----
function animateApproach(tl, el, position) {
  tl.fromTo(el,
    { x: '38vw', scale: 0.18, opacity: 0.6, transformOrigin: 'center center' },
    { x: '0',    scale: 1,    opacity: 1,   transformOrigin: 'center center',
      duration: 0.9, ease: 'power2.inOut' },
    position
  );
}

// ---- Build a single scene into the master timeline ----
function buildScene(tl, def) {
  const el = document.getElementById(def.id);
  if (!el) return;

  const label = el.querySelector('.scene__label');
  const items = Array.from(el.querySelectorAll('.scene__item:not(.scene__item--annotation)'));
  const annotations = Array.from(el.querySelectorAll('.scene__item--annotation'));

  // Fade scene in
  tl.to(el, { opacity: 1, duration: 0.2, ease: 'none' }, '>');

  // Animate label in (if present)
  if (label) {
    tl.fromTo(label,
      { x: '15vw', opacity: 0 },
      { x: '0', opacity: 1, duration: 0.5, ease: 'power2.out' },
      '<'
    );
  }

  if (def.type === 'hero') {
    // All hero items approach together
    items.forEach((item, i) => {
      animateApproach(tl, item, i === 0 ? '>' : '<0.15');
    });
    tl.to({}, { duration: def.holdDuration }); // hold

  } else if (def.type === 'build') {
    // Items enter one by one, all stay visible
    items.forEach((item, i) => {
      animateApproach(tl, item, '>');
      tl.to({}, { duration: 0.15 }); // brief breath between items
    });

    // Weave annotations in after their preceding item
    annotations.forEach(ann => {
      tl.fromTo(ann,
        { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
        { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power1.inOut' },
        '>'
      );
      tl.to({}, { duration: 0.1 });
    });

    tl.to({}, { duration: def.holdDuration }); // hold all visible

  } else if (def.type === 'sequential') {
    // Each item enters; previous item recedes to left when next arrives
    items.forEach((item, i) => {
      animateApproach(tl, item, '>');
      tl.to({}, { duration: def.holdDuration }); // hold this item

      if (i < items.length - 1) {
        // Recede current item to left as next one comes in
        tl.to(item,
          { x: '-12vw', scale: 0.75, opacity: 0.25, duration: 0.6, ease: 'power2.in' },
          '>'
        );
      }
    });
  }

  // Door fold exit — left hinge, panel swings right away from viewer
  tl.to(el,
    { rotateY: 88, x: '-3vw', opacity: 0,
      transformOrigin: 'left center',
      duration: 0.9, ease: 'power2.in' },
    '>'
  );

  // Reset scene (so it doesn't interfere if timeline scrubs back)
  tl.set(el, { opacity: 0, rotateY: 0, x: '0', clearProps: 'transform' });
  if (label) tl.set(label, { opacity: 0, x: '0' });
  items.forEach(item => tl.set(item, { opacity: 0, x: '0', scale: 1 }));
  annotations.forEach(ann => tl.set(ann, { clipPath: 'inset(0 100% 0 0)' }));
}

// ---- Build master timeline + initialize ScrollTrigger ----
window.addEventListener('DOMContentLoaded', () => {
  const proxy = document.getElementById('scroll-proxy');
  const groundSvg = document.querySelector('#trail-ground svg');

  // Build master timeline
  const masterTl = gsap.timeline({ paused: true });
  SCENE_DEFS.forEach(def => buildScene(masterTl, def));

  // Set proxy height based on timeline duration
  const proxyHeight = masterTl.duration() * PIXELS_PER_UNIT + window.innerHeight;
  proxy.style.height = proxyHeight + 'px';

  // Scrub master timeline to scroll
  ScrollTrigger.create({
    animation: masterTl,
    trigger: document.body,
    start: 'top top',
    end: `+=${proxyHeight - window.innerHeight}`,
    scrub: 1.2,
  });

  // Trail ground moves upward as user scrolls
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      gsap.set(groundSvg, { y: `-${self.progress * 38}%` });
    },
  });

  // Refresh after fonts load
  document.fonts.ready.then(() => ScrollTrigger.refresh());
});
