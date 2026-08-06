/* =========================================================
   BELLATORES — script.js
   Script PARTAGÉ par toutes les pages : menu mobile, header
   au scroll, apparition progressive des blocs au scroll.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Header : fond plein une fois qu'on a scrollé --- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- Menu mobile --- */
  const toggle = document.querySelector('.nav-toggle');
  const navGroup = document.querySelector('.nav-group');
  if (toggle && navGroup) {
    toggle.addEventListener('click', () => {
      const isOpen = navGroup.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // referme le menu si on clique un lien
    navGroup.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navGroup.classList.remove('is-open'));
    });
  }

  /* --- Lien de nav actif selon la page courante --- */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('is-active');
  });

  /* --- Apparition progressive au scroll --- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* --- Parallax : décale les couches .scene-far / .scene-near au scroll ---
     Chaque couche porte data-parallax-speed="0.08" (lent, fond) ou "0.18"
     (plus rapide, premier plan) — plus la valeur est grande, plus ça bouge. */
  const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (parallaxLayers.length && !prefersReducedMotion) {
    let ticking = false;

    const updateParallax = () => {
      parallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.parallaxSpeed) || 0;
        const section = layer.closest('.hero, .page-hero');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        // 0 quand la section touche le haut de l'écran, plafonné à sa propre hauteur
        const scrolled = Math.min(Math.max(-rect.top, 0), rect.height);
        layer.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
      });
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }

});
