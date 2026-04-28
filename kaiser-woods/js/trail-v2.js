gsap.registerPlugin(ScrollTrigger);

// ---- Panel definitions ----
// hold: override HOLD_DUR for this panel only (omit to use default)
const PANEL_DEFS = [
  { id: 'p-hero',       label: '',                  hold: 1.5 },
  { id: 'p-bg-1',       label: 'Background',        hold: 1.8 },
  { id: 'p-park',       label: 'Marj Young Park',   hold: 1.5 },
  { id: 'p-simmons-1',  label: 'Paul Simmons'      },
  { id: 'p-simmons-2',  label: 'Paul Simmons'      },
  { id: 'p-simmons-3',  label: 'Paul Simmons'      },
  { id: 'p-swanson-1',  label: 'Swanson Law, 2017' },
  { id: 'p-swanson-2',  label: 'Swanson Law, 2017' },
  { id: 'p-swanson-3',  label: 'Swanson Law, 2017' },
  { id: 'p-missing',    label: 'The Record'        },
  { id: 'p-june2024',   label: 'June 2024'         },
  { id: 'p-sept2024',   label: 'September 2024'    },
  { id: 'p-oct2024-1',  label: 'October 2024'               },
  { id: 'p-oct2024-2',  label: 'October 2024', hold: 2.5  },
  { id: 'p-dec2024-1',  label: 'December 2024', hold: 2.5 },
  { id: 'p-covenant',   label: 'The Covenant', hold: 3.0 },
  { id: 'p-sowhat',     label: ''                        },
  { id: 'p-nov2025-1',  label: 'November 2025'           },
  { id: 'p-nov2025-2',  label: 'November 2025'           },
  { id: 'p-apr2026-1',  label: 'April 2026', hold: 2.5  },
  { id: 'p-apr2026-2',  label: 'April 2026'              },
  { id: 'p-apr2026-3',  label: 'April 2026'              },
  { id: 'p-apr2026-4',  label: 'April 2026'              },
  { id: 'p-apr2026-5',  label: 'April 2026', hold: 2.0  },
  { id: 'p-apr2026-6',  label: 'April 2026'              },
  { id: 'p-apr2026-7',  label: 'April 2026'              },
  { id: 'p-next',       label: ''                        },
  { id: 'p-next-1',     label: 'What Should Happen Next' },
  { id: 'p-next-2',     label: 'What Should Happen Next' },
  { id: 'p-cta',        label: ''                        },
];

// Diagonal: each panel is 100vw to the right and 15vh upward from the previous.
// Scrolling drives the wrapper from (0,0) → (-(N-1)*vw, +(N-1)*15vh),
// bringing panels from upper-right to lower-left across the screen.
const DIAG_Y_FACTOR = 0.15;

// Timeline pacing: each panel holds at center before the next one arrives.
const HOLD_DUR       = 1.0;   // timeline units each panel pauses at center
const TRANS_DUR      = 1.0;   // timeline units for the diagonal transition
const SCROLL_PER_UNIT = 900;  // scroll pixels per timeline unit

window.addEventListener('DOMContentLoaded', () => {
  const wrapper      = document.getElementById('panels-wrapper');
  const proxy        = document.getElementById('scroll-proxy');
  const sidebarLabel = document.getElementById('sidebar-label');
  const simmonsPin   = document.getElementById('simmons-pin');
  const swansonPin   = document.getElementById('swanson-pin');

  const panels = PANEL_DEFS.map(d => document.getElementById(d.id)).filter(Boolean);
  const N  = panels.length;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const dx = vw;
  const dy = -Math.round(vh * DIAG_Y_FACTOR); // negative: each next panel is higher up

  // Position all panels along the diagonal
  panels.forEach((panel, i) => {
    gsap.set(panel, { x: i * dx, y: i * dy });
  });

  // Build timeline: hold each panel at center, then transition to the next
  const tl = gsap.timeline({ paused: true });
  const holdStarts = []; // absolute timeline position when each panel's hold begins
  let timelineDuration = 0;

  for (let i = 0; i < N; i++) {
    const cx = -i * dx;
    const cy =  i * (-dy); // (-dy) > 0 since dy is negative
    const panelHold = PANEL_DEFS[i].hold ?? HOLD_DUR;

    holdStarts.push(timelineDuration);

    // Hold this panel centered
    tl.to(wrapper, { duration: panelHold, x: cx, y: cy, ease: 'none' });
    timelineDuration += panelHold;

    // Slide to next panel (skip after last)
    if (i < N - 1) {
      const nx = -(i + 1) * dx;
      const ny =  (i + 1) * (-dy);
      tl.to(wrapper, { duration: TRANS_DUR, x: nx, y: ny, ease: 'power2.inOut' });
      timelineDuration += TRANS_DUR;
    }
  }

  // bg-1: fade in subtitle text partway through its hold
  const bgReveal = document.getElementById('bg-reveal');
  if (bgReveal) {
    tl.to(bgReveal, { opacity: 1, duration: 0.4, ease: 'power2.out' }, holdStarts[1] + 0.5);
  }

  // oct2024-2: date rises, then three parts reveal in sequence
  const octIdx = PANEL_DEFS.findIndex(d => d.id === 'p-oct2024-2');
  if (octIdx >= 0) {
    const hs = holdStarts[octIdx];
    tl.to('#oct-date', { y: -52, duration: 0.5, ease: 'power2.out' }, hs);
    tl.to('#oct-p1',   { opacity: 1, duration: 0.35, ease: 'power2.out' }, hs + 0.15);
    tl.to('#oct-p2',   { opacity: 1, duration: 0.35, ease: 'power2.out' }, hs + 0.85);
    tl.to('#oct-p3',   { opacity: 1, duration: 0.35, ease: 'power2.out' }, hs + 1.55);
  }

  // dec2024-1: date rises, three parts reveal in sequence
  const decIdx = PANEL_DEFS.findIndex(d => d.id === 'p-dec2024-1');
  if (decIdx >= 0) {
    const hs = holdStarts[decIdx];
    tl.to('#dec-date', { y: -52, duration: 0.5,  ease: 'power2.out' }, hs);
    tl.to('#dec-p1',   { opacity: 1, duration: 0.35, ease: 'power2.out' }, hs + 0.15);
    tl.to('#dec-p2',   { opacity: 1, duration: 0.35, ease: 'power2.out' }, hs + 0.85);
    tl.to('#dec-p3',   { opacity: 1, duration: 0.35, ease: 'power2.out' }, hs + 1.55);
  }

  // p-apr2026-5: "liability." slides up off panel as pinned title fades in; pin fades out after p-apr2026-7
  const apr5Idx = PANEL_DEFS.findIndex(d => d.id === 'p-apr2026-5');
  const apr7Idx = PANEL_DEFS.findIndex(d => d.id === 'p-apr2026-7');
  if (apr5Idx >= 0) {
    const hs5      = holdStarts[apr5Idx];
    const apr5Hold = PANEL_DEFS[apr5Idx].hold ?? HOLD_DUR;
    // slide "liability." up and off, simultaneously fade in the pin
    tl.to('#apr5-liability', { y: -120, opacity: 0, duration: 0.55, ease: 'power2.inOut' }, hs5 + 1.2);
    tl.to('#liability-pin',  { opacity: 1, duration: 0.4,  ease: 'power2.out'            }, hs5 + 1.3);
    // fade pin out during the exit transition from p-apr2026-7
    if (apr7Idx >= 0) {
      const apr7Hold = PANEL_DEFS[apr7Idx].hold ?? HOLD_DUR;
      tl.to('#liability-pin', { opacity: 0, duration: 0.4, ease: 'power2.in' }, holdStarts[apr7Idx] + apr7Hold + 0.3);
    }
  }

  // p-apr2026-1: date rises, four dramatic phrases reveal in sequence
  const aprIdx = PANEL_DEFS.findIndex(d => d.id === 'p-apr2026-1');
  if (aprIdx >= 0) {
    const hs = holdStarts[aprIdx];
    tl.to('#apr-date', { y: -52, duration: 0.5, ease: 'power2.out' }, hs);
    tl.to('#apr-p1',   { opacity: 1, duration: 0.3, ease: 'power2.out' }, hs + 0.15);
    tl.to('#apr-p2',   { opacity: 1, duration: 0.3, ease: 'power2.out' }, hs + 0.65);
    tl.to('#apr-p3',   { opacity: 1, duration: 0.3, ease: 'power2.out' }, hs + 1.15);
    tl.to('#apr-p4',   { opacity: 1, duration: 0.4, ease: 'power2.out' }, hs + 1.7);
  }

  // p-covenant: three statements reveal one by one, then "It cost nothing." lands last
  const covIdx = PANEL_DEFS.findIndex(d => d.id === 'p-covenant');
  if (covIdx >= 0) {
    const hs = holdStarts[covIdx];
    tl.to('#cov-p1',     { opacity: 1, duration: 0.35, ease: 'power2.out' }, hs + 0.4);
    tl.to('#cov-p2',     { opacity: 1, duration: 0.35, ease: 'power2.out' }, hs + 0.9);
    tl.to('#cov-p3',     { opacity: 1, duration: 0.35, ease: 'power2.out' }, hs + 1.4);
    tl.to('#cov-finale', { opacity: 1, duration: 0.4,  ease: 'power2.out' }, hs + 2.1);
  }
  const totalScroll = Math.round(timelineDuration * SCROLL_PER_UNIT);
  proxy.style.height = (totalScroll + vh) + 'px';

  let lastIdx = -1;

  ScrollTrigger.create({
    animation: tl,
    trigger: document.body,
    start: 'top top',
    end: `+=${totalScroll}`,
    scrub: 2,
    onUpdate(self) {
      const raw = self.progress * (N - 1);
      // both label and pin switch at 70% through each transition — pins activate later and linger longer
      const labelIdx = Math.min(N - 1, Math.floor(raw + 0.3));
      const pinIdx   = labelIdx;

      if (labelIdx !== lastIdx) {
        lastIdx = labelIdx;
        const def = PANEL_DEFS[labelIdx];
        if (sidebarLabel) sidebarLabel.textContent = def ? def.label : '';
      }

      if (simmonsPin) simmonsPin.style.opacity = (pinIdx >= 3 && pinIdx <= 5) ? '1' : '0';
      if (swansonPin) swansonPin.style.opacity  = (pinIdx >= 6 && pinIdx <= 8) ? '1' : '0';
    },
  });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
});
