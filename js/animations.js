/**
 * digitAI motor — GSAP Animation Suite v2
 * Requiere: GSAP 3.x + ScrollTrigger (CDN, cargados antes de este archivo)
 *
 * Estructura:
 *  1. Speed lines (speed-lines.png overlay en hero)
 *  2. Contadores odómetro (data-count / data-target)
 *  3. Reveal de secciones con slide alternado + scrub
 *  4. Parallax del hero
 *  5. Hover glow en tarjetas
 *  6. Tacómetro (aguja SVG + overlay tachometer.png)
 *  7. Nodos de circuito como partículas IMG
 *  8. Patrón de circuito animado (background-position)
 *  9. Video del hero
 * 10. Speed strip hover pause
 */

(function () {
  'use strict';

  // ── Guards ────────────────────────────────────────────────────────────────
  if (typeof gsap === 'undefined') {
    // Fallback: mostrar todo si GSAP no carga
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IS_MOBILE = window.innerWidth < 768;

  if (REDUCED) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── Easings compartidos ───────────────────────────────────────────────────
  const OUT  = 'power2.out';
  const INOUT = 'power2.inOut';

  // =========================================================================
  // 1. SPEED LINES (speed-lines.png overlay)
  // =========================================================================
  function initSpeedLines() {
    const hero = document.getElementById('inicio');
    if (!hero) return;

    // Crear el overlay con la imagen
    const img = document.createElement('img');
    img.src = '/assets/speed-lines.png';
    img.id = 'speed-lines-img';
    img.setAttribute('aria-hidden', 'true');
    img.style.cssText = [
      'position:absolute',
      'inset:0',
      'width:100%',
      'height:100%',
      'object-fit:cover',
      'pointer-events:none',
      'z-index:2',
      'opacity:0',
      'transform-origin:center center',
    ].join(';');
    hero.appendChild(img);

    const playLines = () => {
      gsap.timeline()
        .to(img, { opacity: 0.6, scaleX: 1.2, duration: 0.8, ease: OUT })
        .to(img, { opacity: 0,   scaleX: 1,   duration: 0.5, ease: INOUT }, '+=1.5');
    };

    // Disparar al cargar y cada vez que el video termina
    window.addEventListener('load', () => setTimeout(playLines, 800), { once: true });
    const video = document.getElementById('hero-video');
    if (video) video.addEventListener('ended', playLines);
  }

  // =========================================================================
  // 2. CONTADORES ODÓMETRO
  // =========================================================================
  function initOdometerCounters() {
    // Soporte para data-count (existente) y data-target (spec)
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
          // Pulso de brillo al arrancar (efecto encendido de motor)
          gsap.fromTo(el,
            { filter: 'brightness(1)' },
            { filter: 'brightness(1.7)', duration: 0.25, yoyo: true, repeat: 1, ease: INOUT }
          );
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: OUT,
            onUpdate() {
              el.textContent = Math.round(obj.val) + suffix;
            },
            onComplete() {
              el.textContent = target + suffix;
            },
          });
        },
      });
    });
  }

  // =========================================================================
  // 3. REVEAL DE SECCIONES CON SLIDE ALTERNADO + SCRUB
  // =========================================================================
  function initSectionReveals() {
    // Secciones con slide lateral (excluye hero y speed-strip)
    if (!IS_MOBILE) {
      document.querySelectorAll('section:not(#inicio)').forEach((section, i) => {
        const fromX = i % 2 === 0 ? -80 : 80;

        gsap.from(section, {
          x: fromX,
          opacity: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end:   'top 40%',
            scrub: 0.5,
          },
        });
      });
    }

    // Elementos .reveal internos: fade-up individual
    document.querySelectorAll('.reveal').forEach(el => {
      if (el.closest('#inicio')) return; // el hero se maneja aparte

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
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          once: true,
        },
      });
    });

    // Tarjetas de servicio: slide desde lados opuestos
    document.querySelectorAll('.service-card').forEach((card, i) => {
      if (IS_MOBILE) return;
      gsap.from(card, {
        opacity: 0,
        x: i % 2 === 0 ? -60 : 60,
        y: 20,
        duration: 0.9,
        ease: OUT,
        scrollTrigger: {
          trigger: card,
          start: 'top 87%',
          once: true,
        },
      });
    });
  }

  // =========================================================================
  // 4. PARALLAX DEL HERO (hero-bg.png)
  // =========================================================================
  function initHeroParallax() {
    if (IS_MOBILE) return;

    const bg = document.getElementById('hero-parallax-bg');
    const hero = document.getElementById('inicio');
    if (!bg || !hero) return;

    gsap.to(bg, {
      y: '+=100',
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end:   'bottom top',
        scrub: true,
      },
    });
  }

  // =========================================================================
  // 5. HOVER GLOW EN TARJETAS
  // =========================================================================
  function initCardHoverGlow() {
    const selectors = '.service-card, .stat-card, .testimonial-card, .card';
    document.querySelectorAll(selectors).forEach(card => {
      const origShadow = getComputedStyle(card).boxShadow;
      const origBorder = getComputedStyle(card).borderColor;

      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          boxShadow:   '0 0 25px rgba(0,170,255,0.7)',
          borderColor: '#00aaff',
          duration: 0.3,
          ease: OUT,
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          boxShadow:   origShadow === 'none' ? '0 0 0 transparent' : origShadow,
          borderColor: origBorder,
          duration: 0.3,
          ease: OUT,
        });
      });
    });
  }

  // =========================================================================
  // 6. TACÓMETRO — aguja SVG + overlay tachometer.png
  // =========================================================================
  function initTachometer() {
    const wrap = document.getElementById('tachometer-wrap');
    if (!wrap) return;

    // 6a. Aguja SVG (método fino, más preciso que girar la imagen)
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

    // 6b. tachometer.png: rotación sutil de la imagen completa como fondo decorativo
    wrap.style.position = 'relative';
    const tachoImg = document.createElement('img');
    tachoImg.src = '/assets/tachometer.png';
    tachoImg.setAttribute('aria-hidden', 'true');
    tachoImg.style.cssText = [
      'position:absolute',
      'left:50%',
      'top:50%',
      'transform:translate(-50%,-50%) rotate(-60deg)',
      'width:220px',
      'height:auto',
      'opacity:0.08',
      'pointer-events:none',
      'z-index:0',
    ].join(';');
    wrap.insertBefore(tachoImg, wrap.firstChild);

    gsap.to(tachoImg, {
      rotation: 0,
      scrollTrigger: {
        trigger: wrap,
        start: 'top 80%',
        end:   'top 20%',
        scrub: true,
      },
    });
  }

  // =========================================================================
  // 7. NODOS DE CIRCUITO COMO PARTÍCULAS IMG
  // =========================================================================
  function initCircuitNodes() {
    const hero = document.getElementById('inicio');
    if (!hero) return;

    // Posiciones iniciales (porcentaje sobre el hero)
    const positions = [
      { top: '18%', left: '8%'  },
      { top: '72%', left: '12%' },
      { top: '25%', left: '88%' },
      { top: '68%', left: '82%' },
      { top: '12%', left: '52%' },
      { top: '82%', left: '48%' },
    ];

    const count = IS_MOBILE ? 3 : 6;

    // Contenedor de nodos
    const container = document.createElement('div');
    container.id = 'circuit-nodes-layer';
    container.setAttribute('aria-hidden', 'true');
    container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden;';

    // SVG para líneas entre nodos
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width',  '100%');
    svg.setAttribute('height', '100%');
    svg.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    container.appendChild(svg);

    const nodeEls = [];

    positions.slice(0, count).forEach((pos) => {
      const img = document.createElement('img');
      img.src = '/assets/circuit-node.png';
      img.className = 'circuit-node-img';
      img.setAttribute('aria-hidden', 'true');
      img.style.cssText = [
        'position:absolute',
        `top:${pos.top}`,
        `left:${pos.left}`,
        'width:20px',
        'height:20px',
        'opacity:0.4',
        'pointer-events:none',
        'will-change:transform,opacity',
      ].join(';');
      container.appendChild(img);
      nodeEls.push(img);

      // Movimiento flotante infinito con yoyo
      const dur = 3 + Math.random() * 2;
      gsap.to(img, {
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        opacity: gsap.utils.random(0.2, 0.8),
        duration: dur,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
      });
    });

    // Líneas SVG entre pares de nodos (0-1, 2-3, 4-5)
    for (let i = 0; i + 1 < nodeEls.length; i += 2) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('stroke',       'rgba(0,136,255,0.35)');
      line.setAttribute('stroke-width', '1');
      line.style.opacity = '0.4';
      svg.appendChild(line);

      // Actualizar coordenadas en cada frame (los nodos se mueven)
      const a = nodeEls[i];
      const b = nodeEls[i + 1];
      const tick = () => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        const parent = container.getBoundingClientRect();
        line.setAttribute('x1', ra.left - parent.left + ra.width  / 2);
        line.setAttribute('y1', ra.top  - parent.top  + ra.height / 2);
        line.setAttribute('x2', rb.left - parent.left + rb.width  / 2);
        line.setAttribute('y2', rb.top  - parent.top  + rb.height / 2);
      };
      gsap.ticker.add(tick);

      // Opacidad sincronizada con los nodos
      gsap.to(line, {
        opacity: 0.1,
        duration: 3.5 + Math.random() * 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2,
      });
    }

    // Insertar antes del primer hijo del hero
    hero.insertBefore(container, hero.firstChild);
  }

  // =========================================================================
  // 8. PATRÓN DE CIRCUITO CON MOVIMIENTO DE FONDO
  // =========================================================================
  function initCircuitPattern() {
    document.querySelectorAll('.circuit-bg').forEach(el => {
      // Agregar circuit-pattern.png como overlay animado
      const overlay = document.createElement('div');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.style.cssText = [
        'position:absolute',
        'inset:0',
        'background-image:url(/assets/circuit-pattern.png)',
        'background-repeat:repeat',
        'background-size:300px 300px',
        'background-position:0% 0%',
        'opacity:0.035',
        'pointer-events:none',
        'z-index:0',
      ].join(';');

      // Asegurar que el padre tenga posicionamiento
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.insertBefore(overlay, el.firstChild);

      // Desplazamiento infinito horizontal
      gsap.to(overlay, {
        backgroundPosition: '300px 0%',
        duration: 20,
        ease: 'none',
        repeat: -1,
      });
    });
  }

  // =========================================================================
  // 9. VIDEO DEL HERO
  // =========================================================================
  function initHeroVideo() {
    const video = document.getElementById('hero-video');
    if (!video) return;

    const fadeTo = (opacity) =>
      gsap.to(video, { opacity, duration: 1.6, ease: INOUT });

    const onReady = () => fadeTo(0.4);

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener('canplay', onReady, { once: true });
      // Fallback: si canplay no llega en 4s, mostrar igual
      setTimeout(() => {
        if (parseFloat(getComputedStyle(video).opacity) < 0.1) fadeTo(0.38);
      }, 4000);
    }

    video.addEventListener('ended', () => fadeTo(0.18));
  }

  // =========================================================================
  // 10. SPEED STRIP — pausar en hover
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
    initSpeedStripHover();

    // Refrescar después de que todo el DOM esté pintado
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Limpiar ScrollTriggers al navegar
  window.addEventListener('beforeunload', () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  });
})();
