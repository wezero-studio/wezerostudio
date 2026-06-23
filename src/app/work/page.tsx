'use client';

import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { projects } from '@/data/projects';
import { Navbar } from '@/components/Navbar';

function SliceUpText({ text, triggered }: { text: string; triggered: boolean }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.15em', marginBottom: '-0.15em', paddingRight: '0.12em', marginRight: '-0.12em', paddingLeft: '0.05em', marginLeft: '-0.05em' }}>
          <span style={{
            display: 'inline-block',
            transform: triggered ? 'translateY(0)' : 'translateY(120%)',
            transition: triggered ? ('transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ' + (i * 35) + 'ms') : 'none',
          }}>
            {char === ' ' ? '\u00a0' : char}
          </span>
        </span>
      ))}
    </>
  );
}

function SliceUpWords({ text, triggered, delay = 0 }: { text: string; triggered: boolean; delay?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.15em', marginBottom: '-0.15em', marginRight: '0.3em' }}>
          <span style={{
            display: 'inline-block',
            transform: triggered ? 'translateY(0)' : 'translateY(120%)',
            transition: triggered ? ('transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ' + (delay + i * 45) + 'ms') : 'none',
          }}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

/* ─── Parallax Grid ─── */
function ParallaxGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgLayerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const rafScrollRef = useRef<number | null>(null);
  const rafMouseRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const mousePosRef = useRef({ x: 0, y: 0 });

  const applyImgContainerStyle = () => {
    const el = imgContainerRef.current;
    if (!el) return;
    const { x, y } = mousePosRef.current;
    const hovered = isHoveredRef.current;
    el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${hovered ? 1 : 0.6})`;
    el.style.opacity = hovered ? '1' : '0';
    el.style.transition = hovered
      ? 'transform 0.15s ease-out, opacity 0.2s ease-out'
      : 'transform 0.2s cubic-bezier(0.4, 0, 1, 1), opacity 0.18s cubic-bezier(0.4, 0, 1, 1)';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePosRef.current = {
      x: (e.clientX - rect.left - rect.width / 2) * 0.35,
      y: (e.clientY - rect.top - rect.height / 2) * 0.35,
    };
    if (!isHoveredRef.current) {
      isHoveredRef.current = true;
      applyImgContainerStyle();
    } else if (rafMouseRef.current === null) {
      rafMouseRef.current = requestAnimationFrame(() => {
        rafMouseRef.current = null;
        applyImgContainerStyle();
      });
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    applyImgContainerStyle();
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    applyImgContainerStyle();
  };

  useEffect(() => {
    const handle = () => {
      if (rafScrollRef.current !== null) return;
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = null;
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const scrolledIntoContainer = -rect.top;
        const vh = window.innerHeight;

        projects.forEach((_, i) => {
          let progress = 0;
          if (i > 0) {
            // Project 1 starts transitioning at scroll 0, project 2 at 1vh, etc.
            const start = (i - 1) * vh;
            const end = i * vh;
            const raw = (scrolledIntoContainer - start) / (end - start);
            progress = Math.min(1, Math.max(0, raw));
          }

          const bgLayer = bgLayerRefs.current[i];
          if (bgLayer) {
            // inset(TOP right bottom left)
            // Clipping from the TOP → bottom of layer appears first → bottom-to-top reveal ✓
            bgLayer.style.clipPath = `inset(${i === 0 ? 0 : (1 - progress) * 100}% 0 0 0)`;
          }

          const imgLayer = imgLayerRefs.current[i];
          if (imgLayer) {
            // Auto-trigger the inner image when background is 40% of the way in
            imgLayer.style.clipPath = `inset(${i === 0 || progress > 0.4 ? 0 : 100}% 0 0 0)`;
          }
        });
      });
    };

    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => {
      window.removeEventListener('scroll', handle);
      if (rafScrollRef.current !== null) cancelAnimationFrame(rafScrollRef.current);
      if (rafMouseRef.current !== null) cancelAnimationFrame(rafMouseRef.current);
    };
  }, []);

  // Total scroll height matches exact number of transitions
  const totalVh = projects.length;

  // This exact width is shared between the invisible text spacer and the visible image container.
  // They must match so text never overlaps the image.
  const IMG_WIDTH = 'clamp(300px, 42vw, 650px)';

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ height: `${totalVh * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/*
          ╔══════════════════════════════════════════════════════╗
          ║  LAYER STACK 1 — Blurred background + text          ║
          ║  z-index: 1…N (lowest)                              ║
          ║  Slides up from the bottom, stacks over each other. ║
          ║  The central image sits ABOVE all of these.         ║
          ╚══════════════════════════════════════════════════════╝
        */}
        {projects.map((p, i) => (
          <div
            key={`bg-${i}`}
            ref={el => { bgLayerRefs.current[i] = el; }}
            className="absolute inset-0"
            style={{
              zIndex: i + 1,
              clipPath: i === 0 ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)',
              willChange: 'clip-path',
            }}
          >
            {/* Blurred background image */}
            <img
              src={p.src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-110"
              style={{ filter: 'blur(16px) brightness(0.62)' }}
            />

            {/* Text row — flex with an invisible spacer the same width as the central image.
                Guarantees title and services sit to the LEFT and RIGHT of the image, never on top. */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <div
                className="flex items-center w-full px-6 md:px-16 max-w-[1800px]"
                style={{ gap: 'clamp(16px, 2.5vw, 40px)' }}
              >
                {/* Left: project name */}
                <div className="flex-1 text-right min-w-0">
                  <h2
                    className="font-[family-name:var(--font-anton)] text-white uppercase drop-shadow-2xl leading-none"
                    style={{ fontSize: 'clamp(16px, 2.2vw, 38px)', letterSpacing: '0.05em', wordBreak: 'break-word' }}
                  >
                    {p.name}
                  </h2>
                </div>

                {/* Invisible spacer — same width as the image container */}
                <div className="flex-shrink-0" style={{ width: IMG_WIDTH }} />

                {/* Right: services + year */}
                <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                  <span
                    className="font-[family-name:var(--font-space-grotesk)] text-white uppercase font-bold drop-shadow-xl"
                    style={{ fontSize: 'clamp(7px, 0.65vw, 10px)', letterSpacing: '0.15em' }}
                  >
                    {p.services || 'CREATIVE DIRECTION'}
                  </span>
                  <span
                    className="font-[family-name:var(--font-space-grotesk)] text-white font-bold drop-shadow-xl"
                    style={{ fontSize: 'clamp(7px, 0.65vw, 10px)', letterSpacing: '0.1em', opacity: 0.65 }}
                  >
                    {p.date ? p.date.split(' ').pop() : '2024'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/*
          ╔══════════════════════════════════════════════════════╗
          ║  LAYER STACK 2 — Central sharp image                ║
          ║  z-index: N + 10 (always above all backgrounds)     ║
          ║  The image NEVER gets covered by backgrounds.       ║
          ║  Inside this fixed container, each project's image  ║
          ║  stacks up and reveals bottom-to-top when the BG    ║
          ║  has already come up 50% of the way.                ║
          ╚══════════════════════════════════════════════════════╝
        */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: projects.length + 10 }}
        >
          {/* Boundary box — slightly larger than the image itself */}
          <div
            className="relative pointer-events-auto"
            style={{ width: 'clamp(500px, 72vw, 1100px)', aspectRatio: '16 / 9' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          >
            <div
              ref={imgContainerRef}
              className="absolute top-1/2 left-1/2"
              style={{
                width: IMG_WIDTH,
                aspectRatio: '16 / 9',
                transform: 'translate(-50%, -50%) scale(0.6)',
                opacity: 0,
                transition: 'transform 0.2s cubic-bezier(0.4, 0, 1, 1), opacity 0.18s cubic-bezier(0.4, 0, 1, 1)',
              }}
            >
              {projects.map((p, i) => (
                <div
                  key={`img-${i}`}
                  ref={el => { imgLayerRefs.current[i] = el; }}
                  className="absolute inset-0"
                  style={{
                    zIndex: i + 1,
                    clipPath: i === 0 ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)',
                    transition: 'clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <a
                    href={`/work/${p.slug}`}
                    className="block w-full h-full relative group"
                    style={{ transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <img
                      src={p.src}
                      alt={p.name}
                      className="w-full h-full object-cover shadow-2xl"
                      style={{ display: 'block' }}
                    />

                    {/* VIEW PROJECT labels — inside the image on all 4 edges */}
                    {[
                      'top-2.5 left-1/2 -translate-x-1/2',
                      'bottom-2.5 left-1/2 -translate-x-1/2',
                      'top-1/2 left-3 -translate-y-1/2 -rotate-90 origin-center',
                      'top-1/2 right-3 -translate-y-1/2 rotate-90 origin-center',
                    ].map((cls, li) => (
                      <div
                        key={li}
                        className={`absolute ${cls} font-[family-name:var(--font-space-grotesk)] text-[7px] md:text-[9px] font-bold text-white tracking-[0.22em] opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none`}
                        style={{ transition: 'opacity 0.3s ease' }}
                      >
                        VIEW PROJECT
                      </div>
                    ))}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Portfolio Section ─── */
function PortfolioSection() {
  const [view, setView] = useState<'List' | 'Grid'>('Grid');

  return (
    <section className="-mt-40 pb-0 text-[#0A0A0A]">
      <div className="max-w-[1600px] mx-auto flex justify-center mb-10 px-6 sm:px-10 font-[family-name:var(--font-space-grotesk)] text-sm md:text-lg font-bold tracking-tight relative z-20">
        <div className="flex gap-3">
          {(['List', 'Grid'] as const).map((v) => (
            <span key={v} className="flex items-center gap-3">
              <button
                onClick={() => setView(v)}
                className={`transition-colors cursor-pointer ${view === v ? 'text-[#0A0A0A]' : 'text-black/30 hover:text-black/60'}`}
              >
                {v}
              </button>
              {v !== 'Grid' && <span className="text-black/30">/</span>}
            </span>
          ))}
        </div>
      </div>

      {view === 'List' && (
        <div className="relative max-w-[1600px] mx-auto py-10 px-6 sm:px-10 mb-32">
          <div className="flex flex-col items-center justify-center relative z-10">
            {projects.map((p) => (
              <a
                key={p.slug}
                href={`/work/${p.slug}`}
                className="block font-[family-name:var(--font-anton)] text-center leading-[0.88] text-[#0A0A0A] transition-colors hover:text-[#1038CC] uppercase w-full py-4"
                style={{ fontSize: 'clamp(50px, 9vw, 150px)', letterSpacing: '-0.02em' }}
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>
      )}

      {view === 'Grid' && <ParallaxGrid />}
    </section>
  );
}

export default function WorkPage() {
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 3) });
    let raf: number;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const nav = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined);
    const delay = nav?.type === 'reload' ? 2200 : 450;
    const t = setTimeout(() => setTextVisible(true), delay);
    return () => clearTimeout(t);
  }, []);

  const rightCol = [
    'Every campaign, experience, and story we create starts with strategy and ends with impact.',
    'Our work moves real people and numbers, because we design for both.',
    "Every project you'll see here was built on trust, collaboration, and a shared obsession with getting it right.",
    'Scroll for the receipts.',
  ];

  return (
    <>
      <Navbar />

      <div style={{ minHeight: '100vh', background: '#ffffff', position: 'relative', animation: 'pageEnter 0.9s cubic-bezier(0.16, 1, 0.3, 1) both' }}>

        {/* Hero */}
        <section
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: 'clamp(110px, 16vh, 180px)',
            paddingBottom: 'clamp(60px, 8vh, 100px)',
            paddingLeft: 'clamp(16px, 3vw, 48px)',
            paddingRight: 'clamp(24px, 4vw, 72px)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gap: 'clamp(40px, 6vw, 100px)',
              alignItems: 'flex-start',
              width: '100%',
            }}
            className="grid-cols-1 md:grid-cols-[68fr_32fr]"
          >
            {/* Left heading */}
            <h1
              style={{
                fontFamily: 'var(--font-anton)',
                fontSize: 'clamp(70px, 11vw, 180px)',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                color: '#0A0A0A',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              <span style={{ display: 'block' }}>
                <SliceUpText text="WE LET THE" triggered={textVisible} />
              </span>
              <span style={{ display: 'block' }}>
                <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.55em', marginBottom: '-0.55em' }}>
                  <span style={{ display: 'inline-block', fontFamily: 'var(--font-satisfy)', fontSize: 'clamp(80px, 12vw, 200px)', color: '#1038CC', letterSpacing: '-0.01em', lineHeight: 0.85, textTransform: 'none', transform: textVisible ? 'translateY(0)' : 'translateY(170%)', transition: textVisible ? 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0ms' : 'none' }}>
                    work
                  </span>
                </span>
                <SliceUpText text=" SPEAK," triggered={textVisible} />
              </span>
              <span style={{ display: 'block' }}>
                <SliceUpText text="LOUDLY" triggered={textVisible} />
              </span>
            </h1>

            {/* Right body copy */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(12px, 1.6vh, 20px)',
                paddingLeft: 'clamp(12px, 2vw, 32px)',
                marginTop: 'clamp(60px, 8vw, 140px)',
              }}
            >
              {rightCol.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'var(--font-space-grotesk)',
                    fontSize: 'clamp(13px, 1vw, 15px)',
                    fontWeight: 600,
                    lineHeight: 1.7,
                    color: '#0A0A0A',
                    margin: 0,
                  }}
                >
                  <SliceUpWords text={para} triggered={textVisible} delay={i * 80} />
                </p>
              ))}
            </div>
          </div>
        </section>

        <PortfolioSection />

        {/* ═══ Footer ═══ */}
        <footer style={{ marginTop: '0',
          background: '#ffffff',
          padding: 'clamp(48px, 7vh, 100px) clamp(24px, 5vw, 80px) clamp(32px, 4vh, 60px)',
        }}>
          <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(60px, 12vh, 140px)' }}>

            {/* Top row */}
            <div className="footer-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px' }}>

              {/* Left: hero diagram */}
              <div style={{ width: 'clamp(120px, 14vw, 200px)', flexShrink: 0 }}>
                <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
                  <polygon points="0,110 115,5 230,110 115,215" fill="#0A0A0A" />
                  <polygon points="170,110 285,5 400,110 285,215" fill="#0A0A0A" />
                  <circle cx="200" cy="110" r="68" fill="#1038CC" />
                </svg>
              </div>

              {/* Right: contact + social links */}
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: '280px' }}>
                {[
                  { label: 'hello@wezerostudio.com', href: 'mailto:hello@wezerostudio.com' },
                  { label: 'LinkedIn ↗', href: '#' },
                  { label: 'Instagram ↗', href: '#' },
                  { label: 'Twitter / X ↗', href: '#' },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-space-grotesk)',
                      fontSize: 'clamp(15px, 1.3vw, 20px)',
                      fontWeight: 500,
                      color: '#0A0A0A',
                      textDecoration: 'none',
                      padding: '14px 0',
                      borderTop: '1px solid rgba(0,0,0,0.15)',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.45')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    {link.label}
                  </a>
                ))}
                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.15)' }} />
              </div>
            </div>

            {/* Bottom row */}
            <div className="footer-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(15px, 1.3vw, 20px)', fontWeight: 500, lineHeight: 1.5, color: '#0A0A0A', margin: 0 }}>
                  Got a project in mind?<br />Let&apos;s see if we&apos;re the right fit.
                </p>
                <a href="/contact" style={{ display: 'inline-block' }}>
                  <button
                    className="bg-[#0A0A0A] text-white font-[family-name:var(--font-anton)] uppercase tracking-[0.05em] text-sm md:text-lg flex items-center gap-3 hover:bg-[#1038CC] transition-colors cursor-pointer group"
                    style={{ padding: '13px 32px 11px', lineHeight: 1, border: 'none' }}
                  >
                    START A PROJECT
                    <svg className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" width="14" height="14" viewBox="0 0 12 12" fill="none">
                      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </a>
              </div>
              <p style={{
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(12px, 1vw, 15px)',
                fontWeight: 400,
                color: 'rgba(10,10,10,0.45)',
                margin: 0,
                textAlign: 'right',
                lineHeight: 1.6,
              }}>
                © 2026 Wezero. All rights reserved.
              </p>
            </div>

          </div>
        </footer>

      </div>
    </>
  );
}
