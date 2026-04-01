/* ============================================
   BB Animations — Brightbase Animation Stack
   Lenis smooth scroll + GSAP ScrollTrigger
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

    // Connect Lenis to GSAP ticker if available
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

  // ---- GSAP Text Reveal (per-character stagger) ----
  function initTextReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Split text elements
    const revealElements = document.querySelectorAll('.bb-reveal');

    revealElements.forEach((el) => {
      // Use SplitType if available, otherwise fall back to word-level
      if (typeof SplitType !== 'undefined') {
        const split = new SplitType(el, { types: 'chars,words' });

        gsap.set(split.chars, { opacity: 0.15 });

        gsap.to(split.chars, {
          opacity: 1,
          duration: 0.3,
          stagger: 0.02,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 25%',
            scrub: 1,
          },
        });
      } else {
        // Fallback: animate the whole element
        gsap.set(el, { opacity: 0.15 });
        gsap.to(el, {
          opacity: 1,
          duration: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        });
      }
    });
  }

  // ---- Fade-in on scroll (CSS transition trigger) ----
  function initFadeIns() {
    const elements = document.querySelectorAll('.bb-fade-in');
    if (!elements.length) return;

    // Use GSAP ScrollTrigger if available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      elements.forEach((el, i) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      });
    } else {
      // Fallback: IntersectionObserver
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      elements.forEach((el) => observer.observe(el));
    }
  }

  // ---- Staggered fade-in for groups ----
  function initStaggerGroups() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const groups = document.querySelectorAll('.bb-stagger-group');
    groups.forEach((group) => {
      const children = group.children;
      gsap.from(children, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          toggleActions: 'play none none none',
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
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  // ---- Counter animation ----
  function initCounters() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const counters = document.querySelectorAll('.bb-counter');
    counters.forEach((el) => {
      const target = parseInt(el.dataset.target) || 0;
      const obj = { val: 0 };

      gsap.to(obj, {
        val: target,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val);
        },
      });
    });
  }

  // ---- Initialize everything on DOM ready ----
  document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initTextReveals();
    initFadeIns();
    initStaggerGroups();
    initParallax();
    initCounters();
  });
})();
