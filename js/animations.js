/**
 * digitAI motor — GSAP Animation Suite v3
 * Requiere: GSAP 3.x + ScrollTrigger (CDN cargados antes)
 *
 * FIX v3:
 * - Section reveals: SOLO slide X (sin opacity) para evitar efecto multiplicativo
 *   que dejaba las service-cards invisibles
 * - Service cards: excluidas del loop .reveal, animadas UNA sola vez con fromTo
 * - engine-turbine.png: agregada en #proceso
 * - circuit-canvas: removido del HTML, no se usa aquí
 */

(function () {
  'use strict';

  // ── Guards ────────────────────────────────────────────────────────────────
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const REDUCED  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_MOBILE = window.innerWidth < 768;

  if (REDUCED) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const OUT   = 'power2.out';
  const INOUT = 'power2.inOut';

  // =========================================================================
  // 1. VIDEO DEL HERO
  // =========================================================================
  function initHeroVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    const fadeTo = (o) => gsap.to(video, { opacity: o, duration: 1.6, ease: INOUT });

    if (video.readyState >= 2) {
      fadeTo(0.4);
    } else {
      video.addEventListener('canplay', () => fadeTo(0.4), { once: true });
      // Fallback si canplay no llega
      setTimeout(() => {
        if (parseFloat(getComputedStyle(video).opacity) < 0.1) fadeTo(0.38);
      }, 4000);
    }
    video.addEventListener('ended', () => fadeTo(0.18));
  }

  // =========================================================================
  // 2. SPEED LINES (speed-lines.png overlay en el hero)
  // =========================================================================
  function initSpeedLines() {
    const hero = document.getElementById('inicio');
    if (!hero) return;

    const img = document.createElement('img');
    img.src = '/assets/speed-lines.png';
    img.id  = 'speed-lines-img';
    img.setAttribute('aria-hidden', 'true');
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;z-index:2;opacity:0;transform-origin:center center;';
    hero.appendChild(img);

    const play = () => {
      gsap.timeline()
        .to(img, { opacity: 0.6, scaleX: 1.2, duration: 0.8, ease: OUT })
        .to(img, { opacity: 0,   scaleX: 1,   duration: 0.5, ease: INOUT }, '+=1.5');
    };

    window.addEventListener('load', () => setTimeout(play, 800), { once: true });
    const video = document.getElementById('hero-video');
    if (video) video.addEventListener('ended', play);
  }

  // =========================================================================
  // 3. NODOS DE CIRCUITO (circuit-node.png como partículas en el hero)
  // =========================================================================
  function initCircuitNodes() {
    const hero = document.getElementById('inicio');
    if (!hero) return;

    const positions = [
      { top: '18%', left: '8%'  },
      { top: '72%', left: '12%' },
      { top: '25%', left: '88%' },
      { top: '68%', left: '82%' },
      { top: '12%', left: '52%' },
      { top: '82%', left: '48%' },
    ];
    const count = IS_MOBILE ? 3 : 6;

    const container = document.createElement('div');
    container.id = 'circuit-nodes-layer';
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden;';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    container.appendChild(svg);

    const nodeEls = [];

    positions.slice(0, count).forEach(pos => {
      const img = document.createElement('img');
      img.src = '/assets/circuit-node.png';
      img.className = 'circuit-node-img';
      img.setAttribute('aria-hidden', 'true');
      img.style.cssText = `position:absolute;top:${pos.top};left:${pos.left};width:20px;height:20px;opacity:0.4;pointer-events:none;will-change:transform,opacity;`;
      container.appendChild(img);
      nodeEls.push(img);

      gsap.to(img, {
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        opacity: gsap.utils.random(0.2, 0.8),
        duration: 3 + Math.random() * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
      });
    });

    // Líneas SVG entre pares de nodos
    for (let i = 0; i + 1 < nodeEls.length; i += 2) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('stroke', 'rgba(0,136,255,0.35)');
      line.setAttribute('stroke-width', '1');
      svg.appendChild(line);

      const a = nodeEls[i], b = nodeEls[i + 1];
      const tick = () => {
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const p  = container.getBoundingClientRect();
        line.setAttribute('x1', ra.left - p.left + ra.width  / 2);
        line.setAttribute('y1', ra.top  - p.top  + ra.height / 2);
        line.setAttribute('x2', rb.left - p.left + rb.width  / 2);
        line.setAttribute('y2', rb.top  - p.top  + rb.height / 2);
      };
      gsap.ticker.add(tick);

      gsap.to(line, {
        opacity: 0.1,
        duration: 3.5 + Math.random() * 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
      });
    }

    hero.insertBefore(container, hero.firstChild);
  }

  // =========================================================================
  // 4. PATRÓN DE CIRCUITO (circuit-pattern.png, desplazamiento background)
  // =========================================================================
  function initCircuitPattern() {
    document.querySelectorAll('.circuit-bg').forEach(el => {
      const overlay = document.createElement('div');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.cssText = 'position:absolute;inset:0;background-image:url(/assets/circuit-pattern.png);background-repeat:repeat;background-size:300px 300px;background-position:0% 0%;opacity:0.035;pointer-events:none;z-index:0;';
      if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
      el.insertBefore(overlay, el.firstChild);

      gsap.to(overlay, {
        backgroundPosition: '300px 0%',
        duration: 20,
        ease: 'none',
        repeat: -1,
      });
    });
  }

  // =========================================================================
  // 5. PARALLAX DEL HERO (hero-bg.png a 50% velocidad)
  // =========================================================================
  function initHeroParallax() {
    if (IS_MOBILE) return;
    const bg   = document.getElementById('hero-parallax-bg');
    const hero = document.getElementById('inicio');
    if (!bg || !hero) return;

    gsap.to(bg, {
      y: '+=100',
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  // =========================================================================
  // 6. CONTADORES ODÓMETRO
  // =========================================================================
  function initOdometerCounters() {
    document.querySelectorAll('[data-count], [data-target]').forEach(el => {
      const target = parseInt(el.dataset.count || el.dataset.target, 10);
      if (!target || isNaN(target)) return;
      const suffix = el.dataset.suffix || '';
      const obj = { val: 0 };

      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter() {
          gsap.fromTo(el,
            { filter: 'brightness(1)' },
            { filter: 'brightness(1.7)', duration: 0.25, yoyo: true, repeat: 1, ease: INOUT }
          );
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: OUT,
            onUpdate()  { el.textContent = Math.round(obj.val) + suffix; },
            onComplete() { el.textContent = target + suffix; },
          });
        },
      });
    });
  }

  // =========================================================================
  // 7. REVEALS — FIX PRINCIPAL
  //
  // SEPARACIÓN CLARA:
  //   A) Secciones: solo slide-X con scrub (SIN opacity → evita multiplicación)
  //   B) .reveal (excluye .service-card): fade-up individual
  //   C) .service-card: fromTo propio (UNA SOLA vez, sin conflicto)
  // =========================================================================
  function initSectionReveals() {

    // A. Secciones: solo X, sin opacity (secciones siempre visibles)
    if (!IS_MOBILE) {
      document.querySelectorAll('section:not(#inicio)').forEach((section, i) => {
        gsap.from(section, {
          x: i % 2 === 0 ? -60 : 60,
          // opacity omitida intencionalmente — evita que hijos aparezcan al %
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 45%', scrub: 0.5 },
        });
      });
    }

    // B. Elementos .reveal (excluye hero, excluye .service-card que tiene su propio bloque)
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.closest('#inicio'))               return; // hero: manejado aparte
      if (el.classList.contains('service-card')) return; // evitar doble animación

      const delay =
        el.classList.contains('delay-300') ? 0.3 :
        el.classList.contains('delay-200') ? 0.2 :
        el.classList.contains('delay-100') ? 0.1 : 0;

      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        delay,
        ease: OUT,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    });

    // C. Service cards: fromTo explícito (una sola animación, sin conflicto)
    document.querySelectorAll('.service-card').forEach((card, i) => {
      const fromX = IS_MOBILE ? 0 : (i % 2 === 0 ? -50 : 50);
      gsap.fromTo(
        card,
        { opacity: 0, x: fromX, y: IS_MOBILE ? 20 : 16 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.85,
          ease: OUT,
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        }
      );
    });
  }

  // =========================================================================
  // 8. HOVER GLOW EN TARJETAS
  // =========================================================================
  function initCardHoverGlow() {
    document.querySelectorAll('.service-card, .stat-card, .testimonial-card').forEach(card => {
      const origShadow = getComputedStyle(card).boxShadow;
      const origBorder = getComputedStyle(card).borderColor;

      card.addEventListener('mouseenter', () => {
        gsap.to(card, { boxShadow: '0 0 25px rgba(0,170,255,0.7)', borderColor: '#00aaff', duration: 0.3, ease: OUT });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { boxShadow: origShadow === 'none' ? '0 0 0 transparent' : origShadow, borderColor: origBorder, duration: 0.3, ease: OUT });
      });
    });
  }

  // =========================================================================
  // 9. TACÓMETRO — aguja SVG + overlay tachometer.png
  // =========================================================================
  function initTachometer() {
    const wrap = document.getElementById('tachometer-wrap');
    if (!wrap) return;

    // Aguja SVG
    const needle = document.getElementById('tacho-needle');
    if (needle) {
      ScrollTrigger.create({
        trigger: wrap,
        start: 'top 80%',
        end:   'top 25%',
        scrub: 1,
        onUpdate(self) {
          const rot = -130 + 180 * self.progress;
          needle.setAttribute('transform', `rotate(${rot}, 100, 100)`);
        },
      });
    }

    // tachometer.png: fondo decorativo con rotación sutil
    wrap.style.position = 'relative';
    const tachoImg = document.createElement('img');
    tachoImg.src = '/assets/tachometer.png';
    tachoImg.setAttribute('aria-hidden', 'true');
    tachoImg.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(-60deg);width:220px;height:auto;opacity:0.07;pointer-events:none;z-index:0;';
    wrap.insertBefore(tachoImg, wrap.firstChild);

    gsap.to(tachoImg, {
      rotation: 0,
      scrollTrigger: { trigger: wrap, start: 'top 80%', end: 'top 20%', scrub: true },
    });
  }

  // =========================================================================
  // 10. ENGINE TURBINE en sección Proceso
  //     engine-turbine.png como decoración flotante (asset no usado hasta ahora)
  // =========================================================================
  function initEngineTurbine() {
    const proceso = document.getElementById('proceso');
    if (!proceso || IS_MOBILE) return;

    const img = document.createElement('img');
    img.src = '/assets/engine-turbine.png';
    img.setAttribute('aria-hidden', 'true');
    img.style.cssText = [
      'position:absolute',
      'right:-60px',
      'top:50%',
      'transform:translateY(-50%)',
      'width:260px',
      'height:auto',
      'opacity:0.06',
      'pointer-events:none',
      'z-index:0',
      'filter:blur(1px) saturate(0.5) hue-rotate(200deg)',
    ].join(';');

    if (getComputedStyle(proceso).position === 'static') proceso.style.position = 'relative';
    proceso.appendChild(img);

    // Rotación lenta infinita (efecto turbina)
    gsap.to(img, { rotation: 360, duration: 20, ease: 'none', repeat: -1 });

    // Opacidad con parallax leve al scroll
    gsap.to(img, {
      opacity: 0.12,
      scrollTrigger: { trigger: proceso, start: 'top 80%', end: 'center center', scrub: true },
    });
  }

  // =========================================================================
  // 11. SPEED STRIP — pausar en hover
  // =========================================================================
  function initSpeedStripHover() {
    const track = document.querySelector('.speed-strip-track');
    if (!track) return;
    track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  }

  // =========================================================================
  // INIT
  // =========================================================================
  function init() {
    initHeroVideo();
    initSpeedLines();
    initCircuitNodes();
    initCircuitPattern();
    initHeroParallax();
    initOdometerCounters();
    initSectionReveals();
    initCardHoverGlow();
    initTachometer();
    initEngineTurbine();
    initSpeedStripHover();

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  });
})();
