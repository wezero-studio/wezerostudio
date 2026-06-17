'use client';

import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';

function SliceUpText({ text, triggered, baseDelay = 0, descender = false }: { text: string; triggered: boolean; baseDelay?: number; descender?: boolean }) {
  const pb = descender ? '0.55em' : '0.15em';
  const mb = descender ? '-0.55em' : '-0.15em';
  return (
    <>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: pb, marginBottom: mb, paddingRight: '0.12em', marginRight: '-0.12em', paddingLeft: '0.05em', marginLeft: '-0.05em' }}>
          <span style={{
            display: 'inline-block',
            transform: triggered ? 'translateY(0)' : (descender ? 'translateY(170%)' : 'translateY(120%)'),
            transition: triggered ? `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + i * 30}ms` : 'none',
          }}>
            {char === ' ' ? ' ' : char}
          </span>
        </span>
      ))}
    </>
  );
}

function SliceUpWords({ text, triggered, baseDelay = 0 }: { text: string; triggered: boolean; baseDelay?: number }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.15em', marginBottom: '-0.15em', marginRight: '0.3em' }}>
          <span style={{
            display: 'inline-block',
            transform: triggered ? 'translateY(0)' : 'translateY(120%)',
            transition: triggered ? `transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + i * 40}ms` : 'none',
          }}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuBtnHovered, setMenuBtnHovered] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  const teamRef = useRef<HTMLDivElement>(null);
  const [teamVisible, setTeamVisible] = useState(false);

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
    const delay = nav?.type === 'reload' ? 2200 : 400;
    const t = setTimeout(() => setHeroVisible(true), delay);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = teamRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setTeamVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (menuOpen) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const menuItems = [
    { label: 'HOME',    href: '/' },
    { label: 'WORK',    href: '/work' },
    { label: 'ABOUT',   href: '/about' },
    { label: 'CONTACT', href: '/contact' },
  ];

  return (
    <>
      {/* Nav — outside animated div */}
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
          <span className="font-display font-black text-2xl sm:text-3xl tracking-[-0.08em] scale-y-[1.4] inline-block text-black">MENU</span>
          <span style={{ display: 'block', height: '1.5px', width: '100%', background: '#0A0A0A', transform: menuBtnHovered ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)', transformOrigin: 'center' }} />
        </button>
      </nav>

      <div style={{ minHeight: '100vh', background: '#ffffff', position: 'relative', animation: 'pageEnter 0.9s cubic-bezier(0.16, 1, 0.3, 1) both' }}>

        {/* Hero Section */}
         <section style={{ paddingTop: 'clamp(160px, 22vh, 300px)', opacity: heroVisible ? 1 : 0, transition: 'opacity 0.01s' }}>
          <div className="grid grid-cols-1 md:grid-cols-[62fr_38fr]" style={{ gap: 'clamp(32px, 5vw, 80px)', alignItems: 'flex-end', padding: '0 clamp(16px, 3vw, 52px)' }}>
            <h1 style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(48px, 10vw, 180px)', lineHeight: 0.92, textTransform: 'uppercase', color: '#0A0A0A', letterSpacing: '-0.02em', margin: 0, overflow: 'visible' }}>
              <span style={{ display: 'block' }}>
                <SliceUpText text="SMALL TEAM." triggered={heroVisible} baseDelay={0} />
              </span>
              <span style={{ display: 'block' }}>
                <SliceUpText text="SERIOUS " triggered={heroVisible} baseDelay={120} />
                <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.55em', marginBottom: '-0.55em' }}>
                  <span style={{ display: 'inline-block', fontFamily: 'var(--font-satisfy)', color: '#1038CC', textTransform: 'none', fontSize: 'clamp(72px, 11.5vw, 200px)', letterSpacing: '-0.01em', lineHeight: 0.9, transform: heroVisible ? 'translateY(0)' : 'translateY(170%)', transition: heroVisible ? 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 360ms' : 'none' }}>
                    craft.
                  </span>
                </span>
              </span>
            </h1>

            <div className="hidden md:flex" style={{ flexDirection: 'column', gap: 'clamp(10px, 1.4vh, 18px)', transform: 'translateY(clamp(60px, 10vh, 140px))' }}>
              <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(15px, 1.3vw, 20px)', fontWeight: 700, color: '#0A0A0A', lineHeight: 1.25, margin: 0 }}>
                <SliceUpWords text="Senior builders, not account managers." triggered={heroVisible} baseDelay={300} />
              </p>
              <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(13px, 1vw, 16px)', fontWeight: 400, color: 'rgba(10,10,10,0.6)', lineHeight: 1.65, margin: 0 }}>
                <SliceUpWords text="The people you talk to are the same people writing the code, pushing the pixels, and shipping the product — from strategy to launch. No hand-offs. No gaps." triggered={heroVisible} baseDelay={450} />
              </p>
            </div>
          </div>
        </section>

        {/* Wide Image */}
        <section style={{ marginTop: 'clamp(140px, 20vh, 260px)', marginBottom: 'clamp(120px, 16vh, 220px)', display: 'flex', justifyContent: 'center', padding: '0 clamp(24px, 5vw, 80px)' }}>
          <div style={{ width: '100%', maxWidth: '1500px', aspectRatio: '21/8', overflow: 'hidden', background: 'rgba(0,0,0,0.05)' }}>
            <img src="https://picsum.photos/seed/about-studio/1600/700" alt="About our studio" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </section>

        {/* The Team Info Block */}
        <section className="px-6 sm:px-10 mt-0 w-full pb-32 flex justify-center">
          <div ref={teamRef} className="w-full max-w-[1100px] flex flex-col">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-[#0A0A0A] leading-[1.1] tracking-tight mb-16 md:mb-24">
              <SliceUpWords text="Average is a counterproductive waste of time and is strictly not allowed in this studio." triggered={teamVisible} baseDelay={0} />
            </h2>

            <div className="flex flex-col md:flex-row items-start gap-8 md:gap-[clamp(32px,5vw,80px)] mt-[clamp(48px,8vh,100px)]">
              {/* (OUR TEAM) label */}
              <div style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1038CC', paddingTop: '4px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                (OUR TEAM)
              </div>
              {/* Body copy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-12 w-full ml-0 md:ml-12" style={{ marginTop: 'clamp(20px, 3vh, 40px)' }}>
                <div className="font-[family-name:var(--font-space-grotesk)] text-sm md:text-base lg:text-lg text-[#0A0A0A] font-medium leading-relaxed">
                  <SliceUpWords text="Our team is part engineer, part artist, and full-time problem solver. We care about performance and user experience just as much as the visual aesthetics, and we truly do mean that." triggered={teamVisible} baseDelay={200} />
                </div>
                <div className="font-[family-name:var(--font-space-grotesk)] text-sm md:text-base lg:text-lg text-[#0A0A0A] font-medium leading-relaxed flex flex-col gap-6">
                  <p>
                    <SliceUpWords text="Our structure is simple: a core team of digital experts across engineering, design, and strategy, surrounded by a network of specialized technical partners." triggered={teamVisible} baseDelay={300} />
                  </p>
                  <p>
                    <SliceUpWords text="Clients get the speed of an embedded team and the scale of a global development bench." triggered={teamVisible} baseDelay={450} />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Menu overlay — outside animated div */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#000000', clipPath: menuOpen ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)', transition: 'clip-path 1.15s cubic-bezier(0.76, 0, 0.24, 1)', display: 'flex', flexDirection: 'column', padding: 'clamp(18px, 2.5vh, 32px) clamp(24px, 4vw, 60px) clamp(28px, 4vh, 56px)', pointerEvents: menuOpen ? 'auto' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => { setMenuOpen(false); setHoveredMenuItem(null); }} style={{ color: '#ffffff', background: 'none', border: 'none', fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 'clamp(13px, 1.1vw, 17px)', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>CLOSE</button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vh, 28px)' }}>
            {menuItems.map((item, idx) => (
              <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); setMenuOpen(false); setTimeout(() => { window.location.href = item.href; }, 750); }} style={{ display: 'block', fontFamily: 'var(--font-anton)', fontSize: 'clamp(52px, 9.5vw, 140px)', lineHeight: 0.88, textTransform: 'uppercase', color: item.href === '/about' ? '#1038CC' : '#ffffff', textDecoration: 'none', letterSpacing: '-0.02em' }} onMouseEnter={() => setHoveredMenuItem(item.label)} onMouseLeave={() => setHoveredMenuItem(null)}>
                <div style={{ clipPath: 'inset(0 -20% 0 0)' }}>
                  <div style={{ transform: menuOpen ? 'translateY(0)' : 'translateY(110%)', transition: menuOpen ? ('transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ' + (idx * 80) + 'ms') : 'none' }}>
                    <div style={{ display: 'inline-block', transform: hoveredMenuItem === item.label ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)', transformOrigin: 'left center' }}>{item.label}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="menu-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="menu-social-links" style={{ display: 'flex', flexDirection: 'row', gap: 'clamp(16px, 2vw, 32px)', alignItems: 'center' }}>
            {[{ label: 'LinkedIn', href: '#' }, { label: 'Instagram', href: '#' }, { label: 'Twitter / X', href: '#' }, { label: 'hello@wezero.studio', href: 'mailto:hello@wezero.studio' }].map((link) => (
              <a key={link.label} href={link.href} style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(13px, 1.1vw, 16px)', fontWeight: 500, color: '#ffffff', textDecoration: 'none' }}>{link.label}</a>
            ))}
          </div>
          <a href="/contact" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setTimeout(() => { window.location.href = '/contact'; }, 750); }}>
            <button style={{ background: 'transparent', border: '1.5px solid #ffffff', borderRadius: '999px', padding: '14px 32px', fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 600, color: '#ffffff', cursor: 'pointer', transition: 'background 0.25s ease, color 0.25s ease' }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ffffff'; (e.currentTarget as HTMLButtonElement).style.color = '#0A0A0A'; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}>
              {"Let's talk"} &#8599;
            </button>
          </a>
        </div>
      </div>

      {/* ═══ Footer ═══ */}
      <footer style={{ marginTop: 'clamp(60px, 10vh, 120px)', background: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.1)', padding: 'clamp(48px, 7vh, 100px) clamp(24px, 5vw, 80px) clamp(32px, 4vh, 60px)' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(60px, 12vh, 140px)' }}>
          <div className="footer-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '40px' }}>
            <div style={{ width: 'clamp(120px, 14vw, 200px)', flexShrink: 0 }}>
              <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
                <polygon points="0,110 115,5 230,110 115,215" fill="#0A0A0A" />
                <polygon points="170,110 285,5 400,110 285,215" fill="#0A0A0A" />
                <circle cx="200" cy="110" r="68" fill="#1038CC" />
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: '280px' }}>
              {[{ label: 'hello@wezero.studio', href: 'mailto:hello@wezero.studio' }, { label: 'LinkedIn ↗', href: '#' }, { label: 'Instagram ↗', href: '#' }, { label: 'Twitter / X ↗', href: '#' }].map((link, i) => (
                <a key={i} href={link.href} style={{ display: 'block', fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(15px, 1.3vw, 20px)', fontWeight: 500, color: '#0A0A0A', textDecoration: 'none', padding: '14px 0', borderTop: '1px solid rgba(0,0,0,0.15)', transition: 'opacity 0.2s ease' }} onMouseEnter={e => (e.currentTarget.style.opacity = '0.45')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  {link.label}
                </a>
              ))}
              <div style={{ borderBottom: '1px solid rgba(0,0,0,0.15)' }} />
            </div>
          </div>
          <div className="footer-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(15px, 1.3vw, 20px)', fontWeight: 500, lineHeight: 1.5, color: '#0A0A0A', margin: 0 }}>
                Got a project in mind?<br />Let&apos;s see if we&apos;re the right fit.
              </p>
              <a href="/contact" style={{ display: 'inline-block' }}>
                <button className="bg-[#0A0A0A] text-white font-[family-name:var(--font-anton)] uppercase tracking-[0.05em] text-sm md:text-lg flex items-center gap-3 hover:bg-[#1038CC] transition-colors cursor-pointer group" style={{ padding: '13px 32px 11px', lineHeight: 1, border: 'none' }}>
                  START A PROJECT
                  <svg className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
              </a>
            </div>
            <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(12px, 1vw, 15px)', fontWeight: 400, color: 'rgba(10,10,10,0.45)', margin: 0, textAlign: 'right', lineHeight: 1.6 }}>
              © 2026 Wezero. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
