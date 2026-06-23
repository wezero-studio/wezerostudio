'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar({ navHidden = false, onMenuToggle }: { navHidden?: boolean; onMenuToggle?: (isOpen: boolean) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuBtnHovered, setMenuBtnHovered] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    if (onMenuToggle) {
      onMenuToggle(menuOpen);
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, onMenuToggle]);

  const menuItems = [
    { label: 'HOME',    href: '/',        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop&q=80' },
    { label: 'WORK',    href: '/work',    img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=600&fit=crop&q=80' },
    { label: 'ABOUT',   href: '/about',   img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop&q=80' },
    { label: 'CONTACT', href: '/contact', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop&q=80' },
  ];

  return (
    <>
      {/* Fixed Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-[200] flex justify-between items-start font-body text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-black"
        style={{
          padding: 'clamp(16px, 2.5vh, 28px) clamp(24px, 4vw, 52px)',
          transform: navHidden ? 'translateY(-110%)' : 'translateY(0)',
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: navHidden ? 'none' : 'auto',
        }}
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-black"></span>
            ISLAMABAD, PK
          </span>
          <a
            href="https://www.google.com/maps/place/33.66925980228898,73.07748838465798"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative cursor-pointer hover:text-[#1038CC] transition-colors"
          >
            <span className="block group-hover:hidden">33.6692 N, 73.0774 E</span>
            <span className="hidden group-hover:block">33.66925980228898 N, 73.07748838465798 E</span>
          </a>
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
            display: 'block',
            height: '1.5px',
            width: '100%',
            background: '#0A0A0A',
            marginTop: '6px',
            transform: menuBtnHovered ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'center',
          }} />
        </button>
      </nav>

      {/* Menu Overlay */}
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
        {/* Top: close right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => { setMenuOpen(false); setHoveredMenuItem(null); }}
            className="font-body font-bold uppercase tracking-widest hover:underline cursor-pointer"
            style={{ color: '#ffffff', background: 'none', border: 'none', fontSize: 'clamp(13px, 1.1vw, 17px)', letterSpacing: '0.12em' }}
          >
            CLOSE
          </button>
        </div>

        {/* Center: big nav links + hover images */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }}>
          {/* Nav items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 2vh, 28px)' }}>
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMenuOpen(false);
                    setTimeout(() => { window.location.href = item.href; }, 750);
                  }}
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-anton)',
                    fontSize: 'clamp(52px, 9.5vw, 140px)',
                    lineHeight: 0.88,
                    textTransform: 'uppercase',
                    color: isActive ? '#1038CC' : '#ffffff',
                    textDecoration: 'none',
                    letterSpacing: '-0.02em',
                  }}
                  onMouseEnter={() => setHoveredMenuItem(item.label)}
                  onMouseLeave={() => setHoveredMenuItem(null)}
                >
                  <div style={{ clipPath: 'inset(0 -20% 0 0)' }}>
                    <div style={{
                      transform: menuOpen ? 'translateY(0)' : 'translateY(110%)',
                      transition: menuOpen
                        ? `transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 80}ms`
                        : 'none',
                    }}>
                      <div style={{
                        display: 'inline-block',
                        transform: hoveredMenuItem === item.label ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                        transformOrigin: 'left center',
                      }}>
                        {item.label}
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Hover images — positioned right side, expand from center (hidden on mobile) */}
          <div className="hidden sm:block" style={{
            position: 'absolute',
            right: 'clamp(0px, 4vw, 60px)',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 'clamp(220px, 32vw, 480px)',
            aspectRatio: '1 / 1',
            pointerEvents: 'none',
          }}>
            {menuItems.map((item) => (
              <div
                key={item.label}
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: hoveredMenuItem === item.label ? 'inset(0%)' : 'inset(50%)',
                  transition: 'clip-path 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <img
                  src={item.img}
                  alt={item.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: left links + right CTA */}
        <div className="menu-bottom-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div className="menu-social-links" style={{ display: 'flex', flexDirection: 'row', gap: 'clamp(16px, 2vw, 32px)', alignItems: 'center' }}>
            {[
              { label: 'LinkedIn', href: '#' },
              { label: 'Instagram', href: '#' },
              { label: 'Twitter / X', href: '#' },
              { label: 'hello@wezerostudio.com', href: 'mailto:hello@wezerostudio.com' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:underline"
                style={{
                  fontFamily: 'var(--font-space-grotesk)',
                  fontSize: 'clamp(13px, 1.1vw, 16px)',
                  fontWeight: 500,
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a href="/contact" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setTimeout(() => { window.location.href = '/contact'; }, 750); }}>
            <button
              style={{
                background: 'transparent',
                border: '1.5px solid #ffffff',
                borderRadius: '999px',
                padding: '14px 32px',
                fontFamily: 'var(--font-space-grotesk)',
                fontSize: 'clamp(14px, 1.2vw, 18px)',
                fontWeight: 600,
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'background 0.25s ease, color 0.25s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ffffff'; (e.currentTarget as HTMLButtonElement).style.color = '#0A0A0A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
            >
              Let&apos;s talk ↗
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
