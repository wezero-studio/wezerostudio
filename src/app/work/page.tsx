'use client';

import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { projects } from '@/data/projects';

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
            {char === ' ' ? ' ' : char}
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

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      if (!imgRef.current) return;
      const rect = imgRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        const offset = (rect.top - window.innerHeight / 2) * 0.08;
        imgRef.current.style.transform = `translateY(${offset}px) scale(1.18)`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-[filter] duration-700 group-hover:brightness-90"
      style={{ transform: 'scale(1.18)' }}
    />
  );
}

/* ─── Portfolio Section ─── */
function PortfolioSection() {
  const [view, setView] = useState<'List' | 'Grid'>('Grid');
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  return (
    <section className="-mt-40 pb-32 px-6 sm:px-10 text-[#0A0A0A]">
      <div className="max-w-[1600px] mx-auto flex justify-center mb-10 font-[family-name:var(--font-space-grotesk)] text-sm md:text-lg font-bold tracking-tight">
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
        <div className="relative max-w-[1600px] mx-auto py-10">
          <div className="flex flex-col items-center justify-center relative z-10">
            {projects.map((p) => (
              <a
                key={p.slug}
                href={`/work/${p.slug}`}
                className="block font-[family-name:var(--font-anton)] text-center leading-[0.88] text-[#0A0A0A] transition-colors hover:text-[#1038CC] uppercase"
                style={{ fontSize: 'clamp(50px, 9vw, 150px)', letterSpacing: '-0.02em' }}
                onMouseEnter={() => setHoveredImage(p.src)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                {p.name}
              </a>
            ))}
          </div>
          
          {/* Floating Hover Image */}
          <div className="pointer-events-none absolute inset-0 z-0">
            <div className="sticky top-0 h-screen w-full flex items-end justify-end p-10 pb-20">
              <div
                className="w-[180px] md:w-[260px] aspect-[4/3] overflow-hidden transition-opacity duration-300"
                style={{ opacity: hoveredImage ? 1 : 0 }}
              >
                {hoveredImage && (
                  <img src={hoveredImage} alt="Preview" className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'Grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-x-4 gap-y-10 sm:gap-y-16 max-w-[1600px] mx-auto">
          {projects.map((p, i) => (
            <div key={i} className={`col-span-1 sm:${p.span} flex flex-col gap-4`}>
              <div className={`w-full ${p.aspect} overflow-hidden bg-black/5 relative group`}>
                <a href={`/work/${p.slug}`} className="block w-full h-full transition-transform duration-700 group-hover:scale-[1.03]">
                  <ParallaxImage src={p.src} alt={p.name} />
                </a>
              </div>
              <div className="flex justify-center font-[family-name:var(--font-space-grotesk)] text-xs sm:text-sm md:text-base font-semibold tracking-tight">
                <a href={`/work/${p.slug}`} className="hover:text-[#1038CC] transition-colors">{p.name}</a>
                <span className="mx-2 text-black/40">/</span>
                <span className="text-[#0A0A0A]">{p.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function WorkPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuBtnHovered, setMenuBtnHovered] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const menuItems = [
    { label: 'HOME',    href: '/' },
    { label: 'WORK',    href: '/work' },
    { label: 'ABOUT',   href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  const rightCol = [
    'Every campaign, experience, and story we create starts with strategy and ends with impact.',
    'Our work moves real people and numbers, because we design for both.',
    "Every project you'll see here was built on trust, collaboration, and a shared obsession with getting it right.",
    'Scroll for the receipts.',
  ];

  return (
    <>
      {/* Nav — outside animated div so position:fixed works correctly */}
      <nav
        className="fixed top-0 left-0 right-0 z-[200] flex justify-between items-start font-body text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-black"
        style={{ padding: 'clamp(16px, 2.5vh, 28px) clamp(24px, 4vw, 52px)' }}
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-black" />
            ISLAMABAD, PK
          </span>
          <span>33.6844 N, 73.0479 E</span>
        </div>
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen(true)}
          onMouseEnter={() => setMenuBtnHovered(true)}
          onMouseLeave={() => setMenuBtnHovered(false)}
          className="cursor-pointer flex flex-col items-center justify-center"
          style={{ background: 'none', border: 'none' }}
        >
          <span className="font-display font-black text-2xl sm:text-3xl tracking-[-0.08em] scale-y-[1.4] inline-block text-black">
            MENU
          </span>
          <span style={{
            display: 'block', height: '1.5px', width: '100%', background: '#0A0A0A',
            transform: menuBtnHovered ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'center',
          }} />
        </button>
      </nav>

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
      <footer style={{ marginTop: 'clamp(60px, 10vh, 120px)',
        background: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.1)',
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

            {/* Right: contact + social links with separators */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '280px' }}>
              {[
                { label: 'hello@wezero.studio', href: 'mailto:hello@wezero.studio' },
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

          {/* Bottom row: tagline + button on left, copyright on right */}
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

      {/* Menu overlay — outside animated div so position:fixed works correctly */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 300,
          background: '#000000',
          clipPath: menuOpen ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
          transition: 'clip-path 1.15s cubic-bezier(0.76, 0, 0.24, 1)',
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(18px, 2.5vh, 32px) clamp(24px, 4vw, 60px) clamp(28px, 4vh, 56px)',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => { setMenuOpen(false); setHoveredMenuItem(null); }}
            style={{ color: '#ffffff', background: 'none', border: 'none', fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 'clamp(13px, 1.1vw, 17px)', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            CLOSE
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vh, 28px)' }}>
            {menuItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => { e.preventDefault(); setMenuOpen(false); setTimeout(() => { window.location.href = item.href; }, 750); }}
                style={{ display: 'block', fontFamily: 'var(--font-anton)', fontSize: 'clamp(52px, 9.5vw, 140px)', lineHeight: 0.88, textTransform: 'uppercase', color: item.href === '/work' ? '#1038CC' : '#ffffff', textDecoration: 'none', letterSpacing: '-0.02em' }}
                onMouseEnter={() => setHoveredMenuItem(item.label)}
                onMouseLeave={() => setHoveredMenuItem(null)}
              >
                <div style={{ clipPath: 'inset(0 -20% 0 0)' }}>
                  <div style={{ transform: menuOpen ? 'translateY(0)' : 'translateY(110%)', transition: menuOpen ? ('transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ' + (idx * 80) + 'ms') : 'none' }}>
                    <div style={{ display: 'inline-block', transform: hoveredMenuItem === item.label ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)', transformOrigin: 'left center' }}>
                      {item.label}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="menu-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="menu-social-links" style={{ display: 'flex', flexDirection: 'row', gap: 'clamp(16px, 2vw, 32px)', alignItems: 'center' }}>
            {[
              { label: 'LinkedIn', href: '#' },
              { label: 'Instagram', href: '#' },
              { label: 'Twitter / X', href: '#' },
              { label: 'hello@wezero.studio', href: 'mailto:hello@wezero.studio' },
            ].map((link) => (
              <a key={link.label} href={link.href} style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(13px, 1.1vw, 16px)', fontWeight: 500, color: '#ffffff', textDecoration: 'none' }}>
                {link.label}
              </a>
            ))}
          </div>
          <a href="/contact" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setTimeout(() => { window.location.href = '/contact'; }, 750); }}>
            <button
              style={{ background: 'transparent', border: '1.5px solid #ffffff', borderRadius: '999px', padding: '14px 32px', fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 600, color: '#ffffff', cursor: 'pointer', transition: 'background 0.25s ease, color 0.25s ease' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ffffff'; (e.currentTarget as HTMLButtonElement).style.color = '#0A0A0A'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
            >
              {"Let's talk"} &#8599;
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
