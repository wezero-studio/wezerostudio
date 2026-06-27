'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';
import { projects } from '@/data/projects';

export default function ProjectDetail({ slug }: { slug: string }) {
  const projectIndex = projects.findIndex(p => p.slug === slug);
  const project = projects[projectIndex] ?? projects[0];
  const prevProject = projects[projectIndex === 0 ? projects.length - 1 : projectIndex - 1];
  const nextProject = projects[projectIndex === projects.length - 1 ? 0 : projectIndex + 1];

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuBtnHovered, setMenuBtnHovered] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 3) });
    let raf: number;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

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

  const imgs = project.images ?? [];
  const zoomed = (idx: number) => (project.zoomSlots ?? []).includes(idx);

  return (
    <>
      {/* Sticky Prev / Next bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          background: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 clamp(24px, 4vw, 60px)',
          height: '64px',
        }}
      >
        <a
          href={`/work/${prevProject.slug}`}
          className="group flex items-center gap-3"
          style={{ textDecoration: 'none' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)', color: '#0A0A0A' }}>
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(10px, 0.8vw, 12px)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>
            Prev
          </span>
          <span
            className="group-hover:text-[#1038CC] transition-colors"
            style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(18px, 2vw, 28px)', textTransform: 'uppercase', color: '#0A0A0A', letterSpacing: '-0.02em' }}
          >
            {prevProject.name}
          </span>
        </a>

        <Link href="/work" style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(10px, 0.8vw, 12px)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.35)', textDecoration: 'none' }}>
          ALL WORK
        </Link>

        <a
          href={`/work/${nextProject.slug}`}
          className="group flex items-center gap-3"
          style={{ textDecoration: 'none' }}
        >
          <span
            className="group-hover:text-[#1038CC] transition-colors"
            style={{ fontFamily: 'var(--font-anton)', fontSize: 'clamp(18px, 2vw, 28px)', textTransform: 'uppercase', color: '#0A0A0A', letterSpacing: '-0.02em' }}
          >
            {nextProject.name}
          </span>
          <span style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(10px, 0.8vw, 12px)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)' }}>
            Next
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#0A0A0A' }}>
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </a>
      </div>

      {/* Nav — outside animated div so transform doesn't break position:fixed */}
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
          <span style={{ display: 'block', height: '1.5px', width: '100%', background: '#0A0A0A', marginTop: '6px', transform: menuBtnHovered ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)', transformOrigin: 'center' }} />
        </button>
      </nav>

      <div style={{ minHeight: '100vh', background: '#ffffff', position: 'relative', animation: 'pageEnter 0.9s cubic-bezier(0.16, 1, 0.3, 1) both', paddingBottom: '64px' }}>

        {/* Hero — centered, pushed well down */}
        <section
          style={{
            paddingTop: 'clamp(180px, 28vh, 340px)',
            paddingBottom: 'clamp(48px, 6vh, 80px)',
            paddingLeft: 'clamp(24px, 5vw, 80px)',
            paddingRight: 'clamp(24px, 5vw, 80px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-anton)',
              fontSize: 'clamp(60px, 10vw, 180px)',
              lineHeight: 0.9,
              color: '#0A0A0A',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {project.name}
          </h1>
          <p
            style={{
              marginTop: '20px',
              fontFamily: 'var(--font-space-grotesk)',
              fontSize: 'clamp(13px, 1.1vw, 17px)',
              fontWeight: 500,
              color: 'rgba(10,10,10,0.5)',
            }}
          >
            {project.services}
          </p>
        </section>

        {/* Hero Image */}
        <section style={{ padding: '0 clamp(24px, 5vw, 80px)', marginBottom: 'clamp(60px, 8vh, 100px)' }}>
          <div style={{ width: '100%', aspectRatio: '16/7', overflow: 'hidden', background: 'rgba(0,0,0,0.05)' }}>
            <img src={project.src} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </section>

        {/* Info Block — left-aligned, no max-width centering */}
        <section
          style={{
            padding: 'clamp(40px, 6vh, 80px) clamp(24px, 5vw, 80px)',
            gap: 'clamp(32px, 5vw, 80px)',
            marginBottom: 'clamp(60px, 8vh, 100px)',
          }}
          className="grid grid-cols-1 md:grid-cols-[1fr_2fr]"
        >
          <div>
            <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(10px, 0.75vw, 12px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: '16px' }}>Services</p>
            <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(14px, 1.1vw, 18px)', fontWeight: 500, color: '#0A0A0A', lineHeight: 1.5 }}>{project.services}</p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(10px, 0.75vw, 12px)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(10,10,10,0.4)', marginBottom: '16px' }}>Overview</p>
            <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(15px, 1.2vw, 20px)', fontWeight: 400, color: '#0A0A0A', lineHeight: 1.7 }}>{project.overview}</p>
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '32px', fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(12px, 0.9vw, 14px)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0A0A0A', textDecoration: 'none' }}>
                View Website
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2"/></svg>
              </a>
            )}
          </div>
        </section>

        {/* Image gallery — full screenshots, no cropping */}
        <section style={{ padding: '0 clamp(24px, 5vw, 80px)', marginBottom: 'clamp(80px, 10vh, 120px)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.5vw, 20px)' }}>

            {/* Row 1: single full-width screenshot */}
            <div style={{ background: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={imgs[0] ?? project.src} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

            {/* Row 2: two screenshots side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 'clamp(12px, 1.5vw, 20px)' }}>
              <div style={{ background: '#f2f2f2' }}>
                <img src={imgs[1] ?? project.src} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div style={{ background: '#f2f2f2', overflow: 'hidden' }}>
                <img src={imgs[2] ?? project.src} alt="" style={{ width: '100%', height: 'auto', display: 'block', ...(project.imgStyles?.[2] ?? {}) }} />
              </div>
            </div>

            {/* Row 3: three screenshots */}
            <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 'clamp(12px, 1.5vw, 20px)' }}>
              <div style={{ background: '#f2f2f2' }}>
                <img src={imgs[3] ?? imgs[0] ?? project.src} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div style={{ background: '#f2f2f2', overflow: zoomed(4) ? 'hidden' : 'visible' }}>
                <img src={imgs[4] ?? imgs[1] ?? project.src} alt="" style={{ width: '100%', height: 'auto', display: 'block', transform: zoomed(4) ? 'scale(1.35)' : 'none', transformOrigin: 'center center' }} />
              </div>
              <div style={{ background: '#f2f2f2' }}>
                <img src={imgs[5] ?? imgs[2] ?? project.src} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>

            {/* Row 4: single full-width screenshot */}
            <div style={{ background: '#f2f2f2' }}>
              <img src={imgs[6] ?? imgs[0] ?? project.src} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>

            {/* Row 5: two screenshots, unequal split */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr]" style={{ gap: 'clamp(12px, 1.5vw, 20px)', alignItems: 'start' }}>
              <div style={{ background: '#f2f2f2', overflow: (zoomed(7) || project.imgStyles?.[7]) ? 'hidden' : 'visible' }}>
                <img src={imgs[7] ?? imgs[1] ?? project.src} alt="" style={{ width: '100%', height: 'auto', display: 'block', transform: zoomed(7) ? 'scale(1.25)' : 'none', transformOrigin: 'center center', ...(project.imgStyles?.[7] ?? {}) }} />
              </div>
              <div style={{ background: '#f2f2f2', overflow: project.zoomLast ? 'hidden' : 'visible' }}>
                <img src={project.last ?? imgs[5] ?? imgs[2] ?? project.src} alt="" style={{ width: '100%', height: 'auto', display: 'block', transform: project.zoomLast ? 'scale(1.2)' : 'none', transformOrigin: 'center center' }} />
              </div>
            </div>

          </div>
        </section>

      </div>

      {/* Menu overlay — outside animated div so position:fixed works correctly */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#000000', clipPath: menuOpen ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)', transition: 'clip-path 1.15s cubic-bezier(0.76, 0, 0.24, 1)', display: 'flex', flexDirection: 'column', padding: 'clamp(18px, 2.5vh, 32px) clamp(24px, 4vw, 60px) clamp(28px, 4vh, 56px)', pointerEvents: menuOpen ? 'auto' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => { setMenuOpen(false); setHoveredMenuItem(null); }} className="hover:underline" style={{ color: '#ffffff', background: 'none', border: 'none', fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 'clamp(13px, 1.1vw, 17px)', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', textUnderlineOffset: '4px' }}>CLOSE</button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vh, 28px)' }}>
            {menuItems.map((item, idx) => (
              <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); setMenuOpen(false); setTimeout(() => { window.location.href = item.href; }, 750); }} style={{ display: 'block', fontFamily: 'var(--font-anton)', fontSize: 'clamp(52px, 9.5vw, 140px)', lineHeight: 0.88, textTransform: 'uppercase', color: item.href === '/work' ? '#1038CC' : '#ffffff', textDecoration: 'none', letterSpacing: '-0.02em' }} onMouseEnter={() => setHoveredMenuItem(item.label)} onMouseLeave={() => setHoveredMenuItem(null)}>
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
    </>
  );
}
