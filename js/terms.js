/**
 * terms.js — Inline tooltip definitions for defined terms in the revised bylaws.
 * Terms with `href` become <a> links (new tab) with a tooltip.
 * Terms without `href` become <span class="term"> with a tooltip only.
 * Safe: skips text already inside .term elements, skips HTML attributes.
 */

const TERMS = [
  // RCW links — open Washington State Legislature in new tab
  {
    pattern: /\bRCW 64\.90\b/g,
    tooltip: 'Washington Uniform Common Interest Ownership Act (WUCIOA) — the state law the association will be fully bound by in 2028.',
    href: 'https://app.leg.wa.gov/rcw/default.aspx?cite=64.90'
  },
  {
    pattern: /\bRCW 64\.38\b/g,
    tooltip: 'Washington Homeowner Association Act — the current governing state law until 2028.',
    href: 'https://app.leg.wa.gov/rcw/default.aspx?cite=64.38'
  },
  {
    pattern: /\bRCW 24\.03A\b/g,
    tooltip: 'Washington Nonprofit Corporation Act — governs how the association operates as a nonprofit corporation.',
    href: 'https://app.leg.wa.gov/rcw/default.aspx?cite=24.03A'
  },
  // Tooltip-only defined terms
  {
    pattern: /\bDeclaration\b/g,
    tooltip: 'The Protective Covenants for Lakemoor, recorded with Thurston County (No. 746258). Sets property use rules and sits above the bylaws in the governance hierarchy.'
  },
  {
    pattern: /\bthe Act\b/g,
    tooltip: 'Washington state HOA law. Currently RCW 64.38; transitions to RCW 64.90 (WUCIOA) no later than January 1, 2028.'
  },
  {
    pattern: /\bArticles of Incorporation\b/g,
    tooltip: "Lakemoor Community Club's corporate charter, filed with Washington State."
  },
  {
    pattern: /\bManaging Agent\b/g,
    tooltip: 'The property management company hired by the Board to handle day-to-day operations.'
  },
  {
    pattern: /\bElectronic Meeting\b/g,
    tooltip: 'A meeting conducted by phone, video call, or other remote conferencing technology.'
  },
  {
    pattern: /\bboard agent\b/gi,
    tooltip: 'The management company (or Secretary if none) designated to administer ballots and determine quorum.'
  },
  {
    pattern: /\bUnit\b/g,
    tooltip: 'A lot in the Lakemoor community. "Unit" and "Lot" are used interchangeably in the governing documents.'
  },
  {
    pattern: /\bAssociation\b/g,
    tooltip: 'Lakemoor Community Club — the homeowner association.'
  }
];

/**
 * Wrap matching text nodes inside an element, skipping any child .term elements
 * to prevent double-wrapping.
 */
function wrapTermsInNode(el, term) {
  const childNodes = Array.from(el.childNodes);

  for (const node of childNodes) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.classList && node.classList.contains('term')) continue;
      wrapTermsInNode(node, term);
      continue;
    }

    if (node.nodeType !== Node.TEXT_NODE) continue;

    const text = node.textContent;
    term.pattern.lastIndex = 0;
    if (!term.pattern.test(text)) continue;

    term.pattern.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    let match;

    while ((match = term.pattern.exec(text)) !== null) {
      if (match.index > last) {
        frag.appendChild(document.createTextNode(text.slice(last, match.index)));
      }

      let el;
      if (term.href) {
        el = document.createElement('a');
        el.href = term.href;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        el.className = 'term text-teal-600 hover:underline';
      } else {
        el = document.createElement('span');
        el.className = 'term';
      }
      el.setAttribute('data-tooltip', term.tooltip);
      el.textContent = match[0];
      frag.appendChild(el);
      last = term.pattern.lastIndex;
    }

    if (last < text.length) {
      frag.appendChild(document.createTextNode(text.slice(last)));
    }

    node.parentNode.replaceChild(frag, node);
  }
}

function applyTermTooltips() {
  const targets = document.querySelectorAll('main p, main li');
  for (const term of TERMS) {
    for (const target of targets) {
      wrapTermsInNode(target, term);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyTermTooltips);
} else {
  applyTermTooltips();
}
