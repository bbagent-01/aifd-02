/* ============================================
   BB Animations — Brightbase Animation Stack
   Lenis smooth scroll + GSAP ScrollTrigger

   Rules:
   - h1, h2, .bb-reveal → word slide-up from baseline
   - All other text → scroll-driven opacity fade (scrub)
   - All elements → stagger load on scroll entry
   - All animations retrigger when scrolling back
   ============================================ */

(function () {
  'use strict';

  // ---- Lenis Smooth Scroll ----
  function initLenis() {
    if (typeof Lenis === 'undefined') return null;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    return lenis;
  }

  // ---- Headline: Slide Up from Baseline (word stagger) ----
  // Applies to: h1, h2, .bb-reveal
  function initHeadlineReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Select all h1, h2, and .bb-reveal that haven't been processed
    const targets = document.querySelectorAll('h1, h2, h3.bb-reveal, .bb-reveal');
    const processed = new Set();

    targets.forEach((el) => {
      if (processed.has(el)) return;
      processed.add(el);

      // Skip elements inside cards/grid cells — they get stagger treatment
      if (el.closest('.bb-card, .bb-card-dark') && !el.classList.contains('bb-reveal')) return;

      if (typeof SplitType !== 'undefined') {
        const split = new SplitType(el, { types: 'words' });

        split.words.forEach((word) => {
          const wrapper = document.createElement('span');
          wrapper.style.display = 'inline-block';
          wrapper.style.overflow = 'hidden';
          wrapper.style.verticalAlign = 'top';
          wrapper.style.paddingBottom = '0.1em';
          word.parentNode.insertBefore(wrapper, word);
          wrapper.appendChild(word);
        });

        gsap.set(split.words, { yPercent: 110, opacity: 0 });

        gsap.to(split.words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          },
        });
      } else {
        gsap.set(el, { y: 40, opacity: 0 });
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse',
          },
        });
      }
    });
  }

  // ---- Body Text: Scroll-driven opacity fade ----
  // Applies to: all text elements that aren't h1/h2
  function initBodyTextFades() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Select body text, labels, descriptions — everything not h1/h2
    const textSelectors = [
      'h3:not(.bb-reveal)',
      'h4', 'h5', 'h6',
      '.bb-subheading:not(.bb-reveal)',
      '.bb-title:not(.bb-reveal)',
      '.bb-body',
      '.bb-body-sm',
      '.bb-label',
      '.bb-label-lg',
      '.bb-mono',
      '.hero-description',
      '.demo-label',
      'p:not([class])',
    ].join(', ');

    const allText = document.querySelectorAll(textSelectors);
    const processed = new Set();

    allText.forEach((el) => {
      if (processed.has(el)) return;
      processed.add(el);

      // Skip text inside elements that get stagger treatment
      if (el.closest('.bb-stagger-group, .bb-card, .bb-card-dark, .bb-grid-cell, .bb-grid-figure, footer, nav')) return;
      // Skip SplitType-generated wrappers
      if (el.classList.contains('word') || el.classList.contains('line') || el.classList.contains('char')) return;

      gsap.set(el, { opacity: 0, y: 12 });

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 65%',
          scrub: 0.8,
          toggleActions: 'play reverse play reverse',
        },
      });
    });
  }

  // ---- Stagger load for all element groups ----
  function initStaggerGroups() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Explicit stagger groups
    const groups = document.querySelectorAll('.bb-stagger-group');
    groups.forEach((group) => {
      const children = Array.from(group.children);
      gsap.set(children, { y: 40, opacity: 0 });
      gsap.to(children, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
        },
      });
    });

    // Auto-stagger: swatch rows, demo rows, button rows
    const autoGroups = document.querySelectorAll('.swatch-row, .demo-row');
    autoGroups.forEach((group) => {
      const children = Array.from(group.children);
      if (children.length < 2) return;
      gsap.set(children, { y: 20, opacity: 0 });
      gsap.to(children, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 90%',
          toggleActions: 'play reverse play reverse',
        },
      });
    });
  }

  // ---- Fade-in for standalone elements ----
  function initFadeIns() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Auto-apply to cards, inputs, sections not in stagger groups
    const autoTargets = document.querySelectorAll(
      '.bb-card:not(.bb-stagger-group *), ' +
      '.bb-card-dark:not(.bb-stagger-group *), ' +
      '.bb-fade-in, ' +
      '.easing-row, ' +
      '.radius-demo'
    );

    autoTargets.forEach((el) => {
      if (el.closest('.bb-stagger-group')) return;

      gsap.set(el, { y: 30, opacity: 0 });
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play reverse play reverse',
        },
      });
    });
  }

  // ---- Grid cells: stagger within grid ----
  function initGridAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const grids = document.querySelectorAll('.bb-grid');
    grids.forEach((grid) => {
      const cells = Array.from(grid.children);
      gsap.set(cells, { opacity: 0, y: 20 });
      gsap.to(cells, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
        },
      });
    });
  }

  // ---- Parallax elements ----
  function initParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const parallaxElements = document.querySelectorAll('.bb-parallax');
    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.2;
      gsap.to(el, {
        yPercent: -100 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('.section, section, [class*="bg-"]') || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  // ---- Initialize everything ----
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    initLenis();

    requestAnimationFrame(() => {
      initHeadlineReveals();
      initBodyTextFades();
      initStaggerGroups();
      initGridAnimations();
      initFadeIns();
      initParallax();
    });
  });
})();
