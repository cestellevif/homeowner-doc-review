gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
  const proxy = document.getElementById('scroll-proxy');
  const groundSvg = document.querySelector('#trail-ground svg');

  // Ground moves upward as user scrolls — ground rushing under feet
  // Uses body as trigger; height will be set later by the master timeline
  ScrollTrigger.create({
    trigger: document.body,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      gsap.set(groundSvg, { y: `-${self.progress * 38}%` });
    },
  });

  // Master timeline built in Task 4
  document.fonts.ready.then(() => ScrollTrigger.refresh());
});
