/* ==========================================================================
   Vendicto Pharma — Shared JS
   Handles: Navbar, Mobile Menu, Scroll Reveal, GSAP Animations, Product Filter
   ========================================================================== */

/* --------------------------------------------------------------------------
   GSAP SETUP
   -------------------------------------------------------------------------- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* --------------------------------------------------------------------------
   NAVBAR
   -------------------------------------------------------------------------- */
const navbar      = document.querySelector('.navbar');
const hamburger   = document.querySelector('.nav-hamburger');
const mobileMenu  = document.querySelector('.nav-mobile');
const mobileClose = document.querySelector('.nav-mobile-close');

// Determine if the page has a hero (dark background) behind the navbar
const hasHero = document.querySelector('.hero') || document.querySelector('.page-hero');

function updateNavbar() {
  const scrolled = window.scrollY > 20;
  navbar.classList.toggle('scrolled', scrolled);

  if (hasHero) {
    navbar.classList.toggle('hero-mode', !scrolled);
  }
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Mobile menu helpers
function closeMobileMenu() {
  if (!hamburger || !mobileMenu) return;
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
  hamburger.setAttribute('aria-expanded', 'false');
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', isOpen);
  });
}

if (mobileClose) {
  mobileClose.addEventListener('click', closeMobileMenu);
}

// Close on overlay click
const mobileOverlay = document.querySelector('.nav-mobile-overlay');
if (mobileOverlay) {
  mobileOverlay.addEventListener('click', closeMobileMenu);
}

// Close on mobile link click
document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* --------------------------------------------------------------------------
   ACTIVE NAV LINK
   -------------------------------------------------------------------------- */
(function setActiveNavLink() {
  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === filename) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* --------------------------------------------------------------------------
   SCROLL REVEAL (Intersection Observer)
   -------------------------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* --------------------------------------------------------------------------
   GSAP HERO ANIMATION
   -------------------------------------------------------------------------- */
function animateHero() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  const badge      = document.querySelector('.hero-badge');
  const headline   = document.querySelector('.hero-headline');
  const subtext    = document.querySelector('.hero-subtext');
  const ctas       = document.querySelector('.hero-ctas');
  const card       = document.querySelector('.hero-visual-card');
  const statItems  = document.querySelectorAll('.hero-stat-item');
  const scrollHint = document.querySelector('.hero-scroll');

  if (badge)     tl.fromTo(badge,    { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.1);
  if (headline)  tl.fromTo(headline, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3);
  if (subtext)   tl.fromTo(subtext,  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.5);
  if (ctas)      tl.fromTo(ctas,     { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 0.7);
  if (card)      tl.fromTo(card,     { opacity: 0, x: 40, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 0.8 }, 0.4);
  if (statItems.length) {
    tl.fromTo(statItems, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12 }, 0.6);
  }
  if (scrollHint) tl.fromTo(scrollHint, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.2);
}

document.addEventListener('DOMContentLoaded', animateHero);

/* --------------------------------------------------------------------------
   GSAP STATS COUNTER
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo({ val: 0 },
          { val: target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: function() {
              el.textContent = Math.round(this.targets()[0].val) + (el.dataset.suffix || '');
            }
          }
        );
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initStatsCounter);

/* --------------------------------------------------------------------------
   PRODUCT FILTER
   -------------------------------------------------------------------------- */
function initProductFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // Filter cards
      let visibleCards = [];
      productCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) visibleCards.push(card);
      });

      // Re-animate visible cards
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(visibleCards,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out' }
        );
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initProductFilter);

/* --------------------------------------------------------------------------
   SMOOTH SCROLL FOR ANCHOR LINKS
   -------------------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* --------------------------------------------------------------------------
   PAGE HERO ENTRANCE (non-home pages)
   -------------------------------------------------------------------------- */
function animatePageHero() {
  if (typeof gsap === 'undefined') return;
  const pageHero = document.querySelector('.page-hero');
  if (!pageHero) return;

  const label = pageHero.querySelector('.page-hero-label');
  const h1    = pageHero.querySelector('h1');
  const p     = pageHero.querySelector('p');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (label) tl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
  if (h1)    tl.fromTo(h1,    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.35);
  if (p)     tl.fromTo(p,     { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5);
}

document.addEventListener('DOMContentLoaded', animatePageHero);

/* --------------------------------------------------------------------------
   CONTACT FORM — Basic validation + loading state
   -------------------------------------------------------------------------- */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    const btn = this.querySelector('.form-submit');
    if (btn) {
      btn.textContent = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    }
  });
}
