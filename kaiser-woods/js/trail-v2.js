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

// ---- Approach animation: item enters from off-screen upper-right → reading position ----
function animateApproach(tl, el, position) {
  tl.fromTo(el,
    { x: '105vw', y: '-14vh', scale: 0.28, opacity: 0, transformOrigin: 'center center' },
    { x: '0',    y: '0',     scale: 1,    opacity: 1, transformOrigin: 'center center',
      duration: 1.3, ease: 'power2.out' },
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
      { x: '85vw', y: '-4vh', scale: 0.45, opacity: 0 },
      { x: '0',   y: '0',    scale: 1,    opacity: 1,
        duration: 0.95, ease: 'power3.out' },
      '<'
    );
  }

  if (def.type === 'hero') {
    // Entry animation plays on load (outside timeline) — see DOMContentLoaded
    // At timeline t=0, hero is pre-set to visible state
    tl.set(el, { opacity: 1 });
    tl.set(items, { opacity: 1, x: 0, scale: 1 });
    tl.to({}, { duration: def.holdDuration });

  } else if (def.type === 'build') {
    // Process all scene__item children in DOM order (annotations interleaved with items)
    const allItems = Array.from(el.querySelectorAll('.scene__items .scene__item'));
    // Deduplicate (in case of nested selectors)
    const seen = new Set();
    const ordered = allItems.filter(item => {
      if (seen.has(item)) return false;
      seen.add(item);
      return true;
    });

    ordered.forEach(item => {
      if (item.classList.contains('scene__item--annotation')) {
        // Annotation: write in via clip-path after previous item
        tl.fromTo(item,
          { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
          { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power1.inOut' },
          '>'
        );
      } else {
        animateApproach(tl, item, '>');
      }
      tl.to({}, { duration: 0.12 }); // breath between items
    });

    tl.to({}, { duration: def.holdDuration });

  } else if (def.type === 'sequential') {
    // Each item enters; previous item recedes to left when next arrives.
    // Note: annotations are not animated in sequential scenes (s-simmons has none).
    // If annotations are ever added to a sequential scene, they will remain hidden.
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

  // During hold: show ghost of next scene in distance
  const currentIdx = SCENE_DEFS.findIndex(d => d.id === def.id);
  const nextDef = SCENE_DEFS[currentIdx + 1];
  if (nextDef) {
    const nextEl = document.getElementById(nextDef.id);
    const nextLabel = nextEl && nextEl.querySelector('.scene__label');
    const nextFirstItem = nextEl && nextEl.querySelector('.scene__item');
    const ghostEl = nextLabel || nextFirstItem;
    if (ghostEl) {
      tl.fromTo(ghostEl,
        { x: '38vw', scale: 0.12, opacity: 0 },
        { x: '35vw', scale: 0.12, opacity: 0.2, duration: 0.4 },
        '<' // starts when hold starts
      );
      tl.set(ghostEl, { opacity: 0, x: '38vw', scale: 1 }, '>-0.1');
    }
  }

  // Door fold exit — left hinge, panel swings right away from viewer
  tl.to(el,
    { rotateY: 88, x: '-3vw', opacity: 0,
      transformOrigin: 'left center',
      duration: 0.9, ease: 'power2.in' },
    '>'
  );

  // Reset (works for any type)
  const allSceneItems = Array.from(el.querySelectorAll('.scene__item'));
  tl.set(el, { opacity: 0, rotateY: 0, x: '0', clearProps: 'transform' });
  if (label) tl.set(label, { opacity: 0, x: '0' });
  allSceneItems.forEach(item => {
    if (item.classList.contains('scene__item--annotation')) {
      tl.set(item, { clipPath: 'inset(0 100% 0 0)' });
    } else {
      tl.set(item, { opacity: 0, x: '0', scale: 1, clearProps: 'transform' });
    }
  });
}

// ---- Build master timeline + initialize ScrollTrigger ----
window.addEventListener('DOMContentLoaded', () => {
  const proxy = document.getElementById('scroll-proxy');
  // (groundSvg removed — replaced by trail-path stroke animation)

  // Hero entry animation plays on load (not scroll-driven)
  const heroEl = document.getElementById('s-hero');
  gsap.set(heroEl, { opacity: 1 });
  gsap.fromTo(
    Array.from(heroEl.querySelectorAll('.scene__item')),
    { x: '105vw', y: '-14vh', scale: 0.28, opacity: 0, transformOrigin: 'center center' },
    { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.8, ease: 'expo.out', stagger: 0.3 }
  );

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

  // Trail path draws from lower-left to upper-right as user scrolls
  const trailPath = document.getElementById('trail-path');
  const trailPathBg = document.getElementById('trail-path-bg');
  if (trailPath) {
    const pathLen = trailPath.getTotalLength();
    const pathLenBg = trailPathBg ? trailPathBg.getTotalLength() : pathLen;
    gsap.set(trailPath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
    if (trailPathBg) gsap.set(trailPathBg, { strokeDasharray: pathLenBg, strokeDashoffset: pathLenBg });
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        gsap.set(trailPath, { strokeDashoffset: pathLen * (1 - self.progress) });
        if (trailPathBg) gsap.set(trailPathBg, { strokeDashoffset: pathLenBg * (1 - self.progress) });
      },
    });
  }

  // Refresh after fonts load
  document.fonts.ready.then(() => ScrollTrigger.refresh());
});
