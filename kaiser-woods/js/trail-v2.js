gsap.registerPlugin(ScrollTrigger);

// ---- Panel definitions ----
const PANEL_DEFS = [
  { id: 'p-hero',       label: '',                  dark: true  },
  { id: 'p-bg-1',       label: 'Background',        dark: false },
  { id: 'p-bg-2',       label: 'Background',        dark: false },
  { id: 'p-park',       label: 'Marj Young Park',   dark: false },
  { id: 'p-simmons-0',  label: 'Paul Simmons',      dark: true  },
  { id: 'p-simmons-1',  label: 'Paul Simmons',      dark: false },
  { id: 'p-simmons-2',  label: 'Paul Simmons',      dark: false },
  { id: 'p-simmons-3',  label: 'Paul Simmons',      dark: false },
  { id: 'p-swanson-1',  label: 'Swanson Law, 2017', dark: false },
  { id: 'p-swanson-2',  label: 'Swanson Law, 2017', dark: false },
  { id: 'p-swanson-3',  label: 'Swanson Law, 2017', dark: false },
  { id: 'p-missing',    label: 'The Record',        dark: true  },
  { id: 'p-june2024',   label: 'June 2024',         dark: false },
  { id: 'p-sept2024',   label: 'September 2024',    dark: false },
  { id: 'p-oct2024-1',  label: 'October 2024',      dark: false },
  { id: 'p-oct2024-2',  label: 'October 2024',      dark: true  },
  { id: 'p-oct2024-3',  label: 'October 2024',      dark: true  },
  { id: 'p-oct2024-4',  label: 'October 2024',      dark: true  },
  { id: 'p-dec2024-1',  label: 'December 2024',     dark: true  },
  { id: 'p-dec2024-2',  label: 'December 2024',     dark: true  },
  { id: 'p-dec2024-3',  label: 'December 2024',     dark: true  },
  { id: 'p-covenant',   label: 'The Covenant',      dark: true  },
  { id: 'p-nov2025-1',  label: 'November 2025',     dark: true  },
  { id: 'p-nov2025-2',  label: 'November 2025',     dark: true  },
  { id: 'p-sowhat',     label: '',                  dark: true  },
  { id: 'p-next',       label: '',                  dark: true  },
  { id: 'p-cta',        label: '',                  dark: true  },
];

// Each successive panel is offset 15vh upward and 100vw to the right,
// creating an upper-right → lower-left diagonal travel on scroll.
const DIAG_Y_FACTOR = 0.15;

window.addEventListener('DOMContentLoaded', () => {
  const wrapper      = document.getElementById('panels-wrapper');
  const proxy        = document.getElementById('scroll-proxy');
  const sidebar      = document.getElementById('sidebar');
  const sidebarLabel = document.getElementById('sidebar-label');

  const panels = PANEL_DEFS
    .map(d => document.getElementById(d.id))
    .filter(Boolean);

  const N  = panels.length;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const dx = vw;
  const dy = -Math.round(vh * DIAG_Y_FACTOR); // negative = each next panel is higher up

  // Position every panel along the diagonal
  panels.forEach((panel, i) => {
    gsap.set(panel, { x: i * dx, y: i * dy });
  });

  // Proxy height drives the scroll distance
  const totalScroll = (N - 1) * vw;
  proxy.style.height = (totalScroll + vh) + 'px';

  // Update sidebar label and light/dark state
  function updateSidebar(idx) {
    const def = PANEL_DEFS[idx];
    if (!def) return;
    if (sidebarLabel) sidebarLabel.textContent = def.label;
    if (sidebar) sidebar.classList.toggle('sidebar--light', def.dark);
  }

  updateSidebar(0);

  // Single scrubbed tween moves wrapper along the diagonal
  gsap.to(wrapper, {
    x: -(N - 1) * dx,
    y: -(N - 1) * dy,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: `+=${totalScroll}`,
      scrub: 1.2,
      onUpdate(self) {
        const idx = Math.round(self.progress * (N - 1));
        updateSidebar(idx);
      },
    },
  });

  document.fonts.ready.then(() => ScrollTrigger.refresh());
});
