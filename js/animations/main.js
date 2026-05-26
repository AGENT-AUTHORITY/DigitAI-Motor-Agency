/**
 * digitAI motor — GSAP Animation Suite
 * Requires GSAP 3.x + ScrollTrigger (loaded via CDN before this file)
 *
 * Lens weighting (design-motion-principles):
 *   Primary:   Jakub Krehel  → polish, inevitable motion
 *   Secondary: Jhey Tompkins → creative (speed/motor theme)
 *   Selective: Emil Kowalski → restraint on functional elements
 */

(function () {
  'use strict';

  // ── Guards ──────────────────────────────────────────────────────────────
  if (typeof gsap === 'undefined') return;

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_MOBILE = window.innerWidth < 768;

  if (REDUCED) {
    // Still make reveals visible without animation
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── Shared easing ────────────────────────────────────────────────────────
  const EASE_OUT = 'power3.out';
  const EASE_IN_OUT = 'power2.inOut';

  // ── 1. HERO VIDEO ────────────────────────────────────────────────────────
  function initHeroVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    // Start invisible, fade in once data is ready
    gsap.set(video, { opacity: 0 });

    const reveal = () => gsap.to(video, { opacity: 0.4, duration: 1.6, ease: EASE_IN_OUT });

    if (video.readyState >= 2) reveal();
    else video.addEventListener('canplay', reveal, { once: true });

    // On video end: dim slightly, let the static bg take over
    video.addEventListener('ended', () => {
      gsap.to(video, { opacity: 0.18, duration: 2, ease: EASE_IN_OUT });
    });
  }

  // ── 2. HERO PARALLAX (hero-bg.png moves at 60% scroll speed) ─────────────
  function initHeroParallax() {
    if (IS_MOBILE) return;

    const heroBg = document.getElementById('hero-parallax-bg');
    const heroSection = document.getElementById('inicio');
    if (!heroBg || !heroSection) return;

    gsap.to(heroBg, {
      yPercent: 28,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // ── 3. SPEED LINES (GSAP-driven, replacing the CSS version) ─────────────
  function initSpeedLines() {
    const container = document.getElementById('speed-lines-container');
    if (!container) return;

    const count = IS_MOBILE ? 4 : 10;

    for (let i = 0; i < count; i++) {
      const line = document.createElement('div');
      const isBright = i % 4 === 0;
      const lineW = gsap.utils.random(28, 60);

      Object.assign(line.style, {
        position: 'absolute',
        height: '1px',
        width: lineW + '%',
        top: gsap.utils.random(8, 92) + '%',
        left: '-65%',
        background: isBright
          ? 'linear-gradient(90deg,transparent,rgba(180,220,255,0.88),transparent)'
          : 'linear-gradient(90deg,transparent,rgba(0,136,255,0.6),transparent)',
        pointerEvents: 'none',
        borderRadius: '1px',
      });

      container.appendChild(line);

      const dur = gsap.utils.random(2.8, 4.8);
      const delay = gsap.utils.random(0, 6);

      gsap.fromTo(
        line,
        { x: 0, opacity: 0 },
        {
          x: '320%',
          opacity: 1,
          duration: dur,
          delay,
          ease: 'power1.in',
          repeat: -1,
          repeatDelay: gsap.utils.random(1.5, 5),
          onRepeat() {
            gsap.set(line, {
              top: gsap.utils.random(8, 92) + '%',
              width: gsap.utils.random(28, 60) + '%',
              x: 0,
              opacity: 0,
            });
          },
        }
      );
    }
  }

  // ── 4. RPM COUNTERS (odometer effect) ────────────────────────────────────
  function initRpmCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const obj = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter() {
          // Glow pulse at start (engine-rev feel)
          gsap.fromTo(
            el,
            { filter: 'brightness(1)' },
            { filter: 'brightness(1.6)', duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' }
          );

          gsap.to(obj, {
            val: target,
            duration: 1.9,
            ease: 'power2.out',
            onUpdate() {
              // Odometer flicker: show random digit while approaching target
              const progress = obj.val / target;
              const displayed =
                progress > 0.85
                  ? Math.round(obj.val)
                  : Math.round(obj.val) + Math.floor(Math.random() * (target * 0.06));
              el.textContent = Math.min(displayed, target) + suffix;
            },
            onComplete() {
              el.textContent = target + suffix;
            },
          });
        },
      });
    });
  }

  // ── 5. SCROLL REVEAL ANIMATIONS ──────────────────────────────────────────
  function initScrollAnimations() {
    // Override the CSS-only reveal: GSAP handles them now
    gsap.set('.reveal', { opacity: 0, y: 32, clearProps: false });

    document.querySelectorAll('.reveal').forEach((el, i) => {
      const delay = parseFloat(
        getComputedStyle(el).transitionDelay ||
        el.classList.contains('delay-100') ? 0.1 :
        el.classList.contains('delay-200') ? 0.2 :
        el.classList.contains('delay-300') ? 0.3 : 0
      );

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        delay,
        ease: EASE_OUT,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
      });
    });

    // Service cards: alternate slide from left / right
    if (!IS_MOBILE) {
      document.querySelectorAll('.service-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -48 : 48, y: 16 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.9,
            ease: EASE_OUT,
            scrollTrigger: { trigger: card, start: 'top 87%', once: true },
          }
        );
      });
    }

    // Stat cards: scale pop
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length) {
      gsap.from(statCards, {
        scale: 0.86,
        opacity: 0,
        stagger: 0.09,
        duration: 0.65,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: statCards[0], start: 'top 88%', once: true },
      });
    }

    // Pain items: slide from left with stagger
    const painItems = document.querySelectorAll('.pain-item');
    if (painItems.length) {
      gsap.from(painItems, {
        opacity: 0,
        x: -36,
        stagger: 0.07,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: painItems[0], start: 'top 85%', once: true },
      });
    }

    // Testimonial cards: fade up stagger
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length) {
      gsap.from(testimonials, {
        opacity: 0,
        y: 40,
        stagger: 0.12,
        duration: 0.7,
        ease: EASE_OUT,
        scrollTrigger: { trigger: testimonials[0], start: 'top 87%', once: true },
      });
    }
  }

  // ── 6. CARD HOVER GLOW (engine-rev effect) ───────────────────────────────
  function initCardHoverGlow() {
    const cards = document.querySelectorAll('.service-card, .testimonial-card, .stat-card');

    cards.forEach(card => {
      const tl = gsap.timeline({ paused: true });
      tl.to(card, {
        boxShadow:
          '0 22px 64px rgba(0,0,0,0.55), 0 0 38px rgba(0,136,255,0.2), inset 0 0 20px rgba(0,136,255,0.04)',
        duration: 0.32,
        ease: 'power2.out',
      });

      card.addEventListener('mouseenter', () => tl.play());
      card.addEventListener('mouseleave', () => tl.reverse());
    });
  }

  // ── 7. TACHOMETER SVG ────────────────────────────────────────────────────
  function initTachometer() {
    const needle = document.getElementById('tacho-needle');
    if (!needle) return;

    const state = { angle: -130 };

    ScrollTrigger.create({
      trigger: '#tachometer-wrap',
      start: 'top 80%',
      once: true,
      onEnter() {
        gsap.to(state, {
          angle: 50,
          duration: 2.4,
          ease: 'power3.out',
          onUpdate() {
            needle.setAttribute(
              'transform',
              `rotate(${state.angle}, 100, 100)`
            );
          },
        });
      },
    });
  }

  // ── 8. CIRCUIT NODE PARTICLES (canvas) ───────────────────────────────────
  function initCircuitCanvas() {
    if (IS_MOBILE) return;

    const canvas = document.getElementById('circuit-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const NODE_COUNT = 22;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.5 + 0.15,
    }));

    let frameId;
    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = 0.1 * (1 - dist / 180);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,136,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        // Outer glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        grad.addColorStop(0, `rgba(0,136,255,${n.alpha * 0.25})`);
        grad.addColorStop(1, 'rgba(0,136,255,0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,180,255,${n.alpha})`;
        ctx.fill();

        // Move
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      frameId = requestAnimationFrame(draw);
    }

    draw();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(frameId);
    });
  }

  // ── 9. SPEED STRIP PAUSE ON HOVER ────────────────────────────────────────
  function initSpeedStripHover() {
    const track = document.querySelector('.speed-strip-track');
    if (!track) return;
    track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  }

  // ── 10. SECTION DIVIDER LIGHT SWEEP ──────────────────────────────────────
  function initDividerSweep() {
    if (IS_MOBILE) return;

    document.querySelectorAll('.section-divider').forEach(div => {
      ScrollTrigger.create({
        trigger: div,
        start: 'top 90%',
        once: true,
        onEnter() {
          gsap.fromTo(
            div,
            { backgroundSize: '0% 100%' },
            { backgroundSize: '100% 100%', duration: 1, ease: 'power2.inOut' }
          );
        },
      });
    });
  }

  // ── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    initHeroVideo();
    initHeroParallax();
    initSpeedLines();
    initRpmCounters();
    initScrollAnimations();
    initCardHoverGlow();
    initTachometer();
    initCircuitCanvas();
    initSpeedStripHover();
    initDividerSweep();
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Cleanup ScrollTriggers on navigate
  window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  });
})();
