'use client';

import { useState, useEffect } from 'react';
import Lenis from 'lenis';

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuBtnHovered, setMenuBtnHovered] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', name: '', phone: '', subject: '', message: '' });
  const [headingVisible, setHeadingVisible] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4) });
    let raf: number;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const nav = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined);
    const delay = nav?.type === 'reload' ? 2200 : 400;
    const t = setTimeout(() => setHeadingVisible(true), delay);
    return () => clearTimeout(t);
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

  const fields = [
    { key: 'email',   label: 'EMAIL',          type: 'email',    tag: 'input'    },
    { key: 'name',    label: 'FIRST/LAST NAME', type: 'text',     tag: 'input'    },
    { key: 'phone',   label: 'PHONE',           type: 'tel',      tag: 'input'    },
    { key: 'subject', label: 'SUBJECT',         type: 'text',     tag: 'input'    },
    { key: 'message', label: 'MESSAGE',         type: 'text',     tag: 'textarea' },
  ] as const;

  const fieldStyle = (key: string) => ({
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: 'var(--font-space-grotesk)',
    fontSize: 'clamp(13px, 1.1vw, 16px)',
    fontWeight: 500,
    color: '#0A0A0A',
    padding: 'clamp(16px, 2.2vh, 28px) 0',
    resize: 'none' as const,
  });

  const labelStyle = (key: string) => ({
    fontFamily: 'var(--font-space-grotesk)',
    fontSize: 'clamp(10px, 0.85vw, 13px)',
    fontWeight: 700,
    letterSpacing: '0.12em',
    color: '#0A0A0A',
    display: 'block' as const,
    paddingTop: 'clamp(16px, 2.2vh, 28px)',
    transition: 'color 0.35s ease',
  });

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

      {/* Page */}
      <div style={{ minHeight: '100vh', background: '#ffffff', animation: 'pageEnter 0.9s cubic-bezier(0.16, 1, 0.3, 1) both', padding: 'clamp(120px, 18vh, 200px) clamp(24px, 5vw, 80px) clamp(80px, 10vh, 140px)' }}>

        {/* Heading */}
        <h1 style={{
          fontFamily: 'var(--font-anton)',
          fontSize: 'clamp(36px, 6vw, 100px)',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          color: '#0A0A0A',
          letterSpacing: '-0.02em',
          marginBottom: 'clamp(32px, 5vh, 64px)',
          overflow: 'hidden',
        }}>
          <span style={{
            display: 'block',
            transform: headingVisible ? 'translateY(0)' : 'translateY(110%)',
            transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            LET&apos;S TALK ABOUT YOUR PROJECT.
          </span>
        </h1>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} style={{ width: '100%' }}>
          <div style={{ borderTop: '1.5px solid rgba(10,10,10,0.15)' }}>
            {fields.map(({ key, label, type, tag }) => (
              <div key={key} style={{ borderBottom: `1.5px solid ${focused === key ? '#0A0A0A' : 'rgba(10,10,10,0.15)'}`, transition: 'border-color 0.4s ease' }}>
                <label style={labelStyle(key)}>{label}</label>
                {tag === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={form[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused(null)}
                    style={fieldStyle(key)}
                  />
                ) : (
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused(null)}
                    style={fieldStyle(key)}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Send button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'clamp(32px, 5vh, 64px)' }}>
            <button
              type="submit"
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-anton)',
                fontSize: 'clamp(28px, 4vw, 64px)',
                letterSpacing: '-0.01em',
                color: '#0A0A0A',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1038CC')}
              onMouseLeave={e => (e.currentTarget.style.color = '#0A0A0A')}
            >
              (SEND)
            </button>
          </div>
        </form>

      </div>

      {/* Menu overlay — outside animated div */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#000000', clipPath: menuOpen ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)', transition: 'clip-path 1.15s cubic-bezier(0.76, 0, 0.24, 1)', display: 'flex', flexDirection: 'column', padding: 'clamp(18px, 2.5vh, 32px) clamp(24px, 4vw, 60px) clamp(28px, 4vh, 56px)', pointerEvents: menuOpen ? 'auto' : 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => { setMenuOpen(false); setHoveredMenuItem(null); }} style={{ color: '#ffffff', background: 'none', border: 'none', fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: 'clamp(13px, 1.1vw, 17px)', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>CLOSE</button>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vh, 28px)' }}>
            {menuItems.map((item, idx) => (
              <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); setMenuOpen(false); setTimeout(() => { window.location.href = item.href; }, 750); }} style={{ display: 'block', fontFamily: 'var(--font-anton)', fontSize: 'clamp(52px, 9.5vw, 140px)', lineHeight: 0.88, textTransform: 'uppercase', color: item.href === '/contact' ? '#1038CC' : '#ffffff', textDecoration: 'none', letterSpacing: '-0.02em' }} onMouseEnter={() => setHoveredMenuItem(item.label)} onMouseLeave={() => setHoveredMenuItem(null)}>
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
