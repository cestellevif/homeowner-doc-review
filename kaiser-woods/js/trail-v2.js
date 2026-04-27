gsap.registerPlugin(ScrollTrigger);

// ---- Panel definitions ----
const PANEL_DEFS = [
  { id: 'p-hero',       label: ''                  },
  { id: 'p-bg-1',       label: 'Background'        },
  { id: 'p-bg-2',       label: 'Background'        },
  { id: 'p-park',       label: 'Marj Young Park'   },
  { id: 'p-simmons-0',  label: 'Paul Simmons'      },
  { id: 'p-simmons-1',  label: 'Paul Simmons'      },
  { id: 'p-simmons-2',  label: 'Paul Simmons'      },
  { id: 'p-simmons-3',  label: 'Paul Simmons'      },
  { id: 'p-swanson-1',  label: 'Swanson Law, 2017' },
  { id: 'p-swanson-2',  label: 'Swanson Law, 2017' },
  { id: 'p-swanson-3',  label: 'Swanson Law, 2017' },
  { id: 'p-missing',    label: 'The Record'        },
  { id: 'p-june2024',   label: 'June 2024'         },
  { id: 'p-sept2024',   label: 'September 2024'    },
  { id: 'p-oct2024-1',  label: 'October 2024'      },
  { id: 'p-oct2024-2',  label: 'October 2024'      },
  { id: 'p-oct2024-3',  label: 'October 2024'      },
  { id: 'p-oct2024-4',  label: 'October 2024'      },
  { id: 'p-dec2024-1',  label: 'December 2024'     },
  { id: 'p-dec2024-2',  label: 'December 2024'     },
  { id: 'p-dec2024-3',  label: 'December 2024'     },
  { id: 'p-covenant',   label: 'The Covenant'      },
  { id: 'p-nov2025-1',  label: 'November 2025'     },
  { id: 'p-nov2025-2',  label: 'November 2025'     },
  { id: 'p-sowhat',     label: ''                  },
  { id: 'p-next',       label: ''                  },
  { id: 'p-cta',        label: ''                  },
];

// Diagonal: each panel is 100vw to the right and 15vh upward from the previous.
// Scrolling drives the wrapper from (0,0) → (-(N-1)*vw, +(N-1)*15vh),
// bringing panels from upper-right to lower-left across the screen.
const DIAG_Y_FACTOR = 0.15;

// Timeline pacing: each panel holds at center before the next one arrives.
const HOLD_DUR       = 0.6;   // timeline units each panel pauses at center
const TRANS_DUR      = 1.0;   // timeline units for the diagonal transition
const SCROLL_PER_UNIT = 420;  // scroll pixels per timeline unit

window.addEventListener('DOMContentLoaded', () => {
  const wrapper      = document.getElementById('panels-wrapper');
  const proxy        = document.getElementById('scroll-proxy');
  const sidebarLabel = document.getElementById('sidebar-label');
  const simmonsPin   = document.getElementById('simmons-pin');

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

  for (let i = 0; i < N; i++) {
    const cx = -i * dx;
    const cy =  i * (-dy); // (-dy) > 0 since dy is negative

    // Hold this panel centered
    tl.to(wrapper, { duration: HOLD_DUR, x: cx, y: cy, ease: 'none' });

    // Slide to next panel (skip after last)
    if (i < N - 1) {
      const nx = -(i + 1) * dx;
      const ny =  (i + 1) * (-dy);
      tl.to(wrapper, { duration: TRANS_DUR, x: nx, y: ny, ease: 'power2.inOut' });
    }
  }

  const timelineDuration = N * HOLD_DUR + (N - 1) * TRANS_DUR;
  const totalScroll = Math.round(timelineDuration * SCROLL_PER_UNIT);
  proxy.style.height = (totalScroll + vh) + 'px';

  let lastIdx = -1;

  ScrollTrigger.create({
    animation: tl,
    trigger: document.body,
    start: 'top top',
    end: `+=${totalScroll}`,
    scrub: 1.2,
    onUpdate(self) {
      const idx = Math.round(self.progress * (N - 1));
      if (idx !== lastIdx) {
        lastIdx = idx;
        const def = PANEL_DEFS[idx];
        if (sidebarLabel) sidebarLabel.textContent = def ? def.label : '';
      }

      // Show pinned Simmons name only during his three quote panels
      const inSimmonsQuotes = idx >= 5 && idx <= 7;
      if (simmonsPin) {
        simmonsPin.style.opacity = inSimmonsQuotes ? '1' : '0';
      }
    },
  });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
});
