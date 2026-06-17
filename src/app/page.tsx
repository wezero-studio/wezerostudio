"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
import { Loader } from "./components/Loader";

const HERO_LETTERS = ["w", "e", "z", "e", "r", "o"];

/* ─── Animated Letter ─── */
// Supports: 
//   1. Vertical slice-up entrance (revealed = letters slide up into view)
//   2. Horizontal side-slice on hover + auto-trigger
function AnimatedLetter({
  letter,
  revealed,
  autoSlice,
}: {
  letter: string;
  revealed: boolean;
  autoSlice: boolean;
}) {
  const [isSlicing, setIsSlicing] = useState(false);

  const handleMouseEnter = () => {
    if (!isSlicing) {
      setIsSlicing(true);
      setTimeout(() => setIsSlicing(false), 500);
    }
  };

  // Auto-trigger side-slice once
  useEffect(() => {
    if (autoSlice && !isSlicing) {
      setIsSlicing(true);
      setTimeout(() => setIsSlicing(false), 500);
    }
  }, [autoSlice]);

  return (
    // Outer wrapper: vertical overflow mask for the slice-up entrance
    <span
      className="relative inline-block"
      style={{
        overflow: 'hidden',
        paddingBottom: '0.25em',
        marginBottom: '-0.25em',
      }}
    >
      {/* Inner wrapper: slides up from below for entrance, then holds position */}
      <span
        className="inline-block"
        style={{
          transform: revealed ? 'translateY(0)' : 'translateY(115%)',
          transition: revealed
            ? 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none',
        }}
      >
        {/* Side-slice container: horizontal overflow mask */}
        <span
          className="relative inline-block cursor-default"
          style={{
            overflow: 'hidden',
            paddingRight: '0.1em',
            marginRight: '-0.1em',
            paddingBottom: '0.3em',
            marginBottom: '-0.3em',
            transform: 'translateZ(0)',
          }}
          onMouseEnter={handleMouseEnter}
        >
          {/* Original letter — slides left on slice */}
          <span
            className={`inline-block transition-transform duration-500 ease-in-out ${isSlicing ? '-translate-x-[110%]' : 'translate-x-0'}`}
          >
            {letter}
          </span>
          {/* Blue copy — slides in from right on slice */}
          <span
            className={`absolute left-0 top-0 inline-block transition-transform duration-500 ease-in-out text-[#1038CC] ${isSlicing ? 'translate-x-0' : 'translate-x-[250%]'}`}
            aria-hidden="true"
          >
            {letter}
          </span>
        </span>
      </span>
    </span>
  );
}

/* ─── Slice-down text ─── */
function SliceDownText({ text, triggered }: { text: string; triggered: boolean }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <span style={{
            display: 'inline-block',
            transform: triggered ? 'translateY(0)' : 'translateY(-115%)',
            transition: triggered
              ? `transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${i * 45}ms`
              : 'none',
          }}>
            {char === ' ' ? ' ' : char}
          </span>
        </span>
      ))}
    </>
  );
}

/* ─── Slice-up text ─── */
function SliceUpText({ text, triggered }: { text: string; triggered: boolean }) {
  let charIndex = 0;
  return (
    <>
      {text.split(' ').map((word, wordIdx, wordsArr) => {
        const wordNode = (
          <span key={`word-${wordIdx}`} style={{ whiteSpace: 'nowrap' }}>
            {word.split('').map((char, i) => {
              const currentI = charIndex++;
              return (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.1em', marginBottom: '-0.1em', paddingTop: '0.15em', marginTop: '-0.15em', paddingRight: '0.12em', marginRight: '-0.12em', paddingLeft: '0.05em', marginLeft: '-0.05em' }}>
                  <span style={{
                    display: 'inline-block',
                    transform: triggered ? 'translateY(0)' : 'translateY(115%)',
                    transition: triggered
                      ? `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${currentI * 90}ms`
                      : 'none',
                  }}>
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        );
        
        if (wordIdx < wordsArr.length - 1) {
          const spaceI = charIndex++;
          return (
            <span key={`frag-${wordIdx}`} style={{ display: 'inline' }}>
              {wordNode}
              <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.1em', marginBottom: '-0.1em', paddingTop: '0.15em', marginTop: '-0.15em', paddingRight: '0.12em', marginRight: '-0.12em', paddingLeft: '0.05em', marginLeft: '-0.05em' }}>
                <span style={{
                  display: 'inline-block',
                  transform: triggered ? 'translateY(0)' : 'translateY(115%)',
                  transition: triggered
                    ? `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) ${spaceI * 90}ms`
                    : 'none',
                }}>
                  &nbsp;
                </span>
              </span>
            </span>
          );
        }
        return wordNode;
      })}
    </>
  );
}

/* ─── Slice-up words ─── */
function SliceUpWords({ text, triggered }: { text: string; triggered: boolean }) {
  return (
    <>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.15em', marginBottom: '-0.15em', marginRight: '0.25em' }}>
          <span style={{
            display: 'inline-block',
            transform: triggered ? 'translateY(0)' : 'translateY(115%)',
            transition: triggered
              ? `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms`
              : 'none',
          }}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

/* ─── Animation phases ─── */
// Phase 0: Loader is showing, wezero hidden
// Phase 1: Loader done → wezero letters slice UP into view (centered on screen)
// Phase 2: Side-slice animation fires on ALL letters simultaneously
// Phase 3: wezero moves up to final position at top
// Phase 4: Nav + bottom content slides in

export default function Home() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [phase, setPhase] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const [movedLeft2_5, setMovedLeft2_5] = useState(false);
  const [slice2_5Triggered, setSlice2_5Triggered] = useState(false);
  const [section3Visible, setSection3Visible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [finalSectionVisible, setFinalSectionVisible] = useState(false);
  const [cardsWrapperTop, setCardsWrapperTop] = useState(999999);
  const [servicesWrapperTop, setServicesWrapperTop] = useState(999999);
  const [navHidden, setNavHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuBtnHovered, setMenuBtnHovered] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);

  const section3Ref = useRef<HTMLElement>(null);
  const finalSectionRef = useRef<HTMLElement>(null);
  const section2_5Ref = useRef<HTMLElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const servicesWrapperRef = useRef<HTMLDivElement>(null);
  const prevScrollRef = useRef(0);
  const svgInnerRef = useRef<HTMLDivElement>(null);
  const sec2LockFired = useRef(false);
  const sec2LockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // useLayoutEffect fires before the browser paints, so skipping the loader is invisible (no flash)
  useLayoutEffect(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === 'reload') {
      sessionStorage.removeItem('wezero-loader-shown');
      return;
    }
    if (sessionStorage.getItem('wezero-loader-shown')) {
      setLoaderDone(true);
      setPhase(4);
    }
  }, []);

  // Always start at top on load/reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
    }
  }, []);

  // Lock scroll in section 2 until text animation completes
  useEffect(() => {
    const sec2P = Math.max(0, Math.min((scrollY - 2 * vh) / (2 * vh), 1));

    // Reset lock when user scrolls back above trigger so it re-fires on next pass
    if (sec2P <= 0.15 && sec2LockFired.current) {
      sec2LockFired.current = false;
      if (sec2LockTimer.current) { clearTimeout(sec2LockTimer.current); sec2LockTimer.current = null; }
      lenisRef.current?.start();
    }

    // Fire lock when text triggers
    if (sec2P > 0.3 && !sec2LockFired.current) {
      sec2LockFired.current = true;
      lenisRef.current?.stop();
      // ~28 words × 40ms stagger + 0.8s animation = ~1.9s; add 300ms buffer
      sec2LockTimer.current = setTimeout(() => {
        lenisRef.current?.start();
        sec2LockTimer.current = null;
      }, 1600);
    }
  }, [scrollY]);

  // Hide nav on scroll down, show on scroll up; always hide in cards section
  useEffect(() => {
    const prev = prevScrollRef.current;
    prevScrollRef.current = scrollY;
    const cardsEnd = cardsWrapperTop + 6.25 * vh;
    const inCards = cardsWrapperTop < 999999 && scrollY >= cardsWrapperTop && scrollY < cardsEnd;
    if (inCards) {
      setNavHidden(true);
    } else if (scrollY > prev + 4) {
      setNavHidden(true);
    } else if (scrollY < prev - 4) {
      setNavHidden(false);
    }
  }, [scrollY, cardsWrapperTop]);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    lenisRef.current = lenis;
    lenis.on('scroll', ({ scroll }: { scroll: number }) => setScrollY(scroll));
    
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Lock/unlock Lenis during loader/intro animations
  useEffect(() => {
    if (phase < 4) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [phase]);

  // 0→1 as user scrolls one viewport height through the sticky zone
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const scrollProgress = Math.min(scrollY / vh, 1);
  const transitionProgress = Math.max(0, Math.min((scrollY - vh) / vh, 1));
  const diagramMoveAmount = 150; // px the SVG drops during hero scroll
  // Compute where the SVG center will be at scrollProgress=1, using the live DOM rect
  const diagramStartY = (() => {
    if (typeof window === 'undefined' || !svgInnerRef.current) return 70;
    const rect = svgInnerRef.current.getBoundingClientRect();
    const currentCenterY = rect.top + rect.height / 2;
    // currentCenterY already includes scrollProgress * diagramMoveAmount offset
    // so base + moveAmount = currentCenterY + (1 - scrollProgress) * diagramMoveAmount
    return ((currentCenterY + (1 - scrollProgress) * diagramMoveAmount) / vh) * 100;
  })();
  const transitionDiagY = diagramStartY + transitionProgress * (72 - diagramStartY);
  // Match the circle size to the hero SVG's actual rendered width at each breakpoint
  const fixedDiagWidth = vw >= 768 ? 460 : vw >= 640 ? 380 : 300;
  const svgCircleVmax = (68 / 400) * fixedDiagWidth / Math.max(vw, vh) * 100;
  // starts exactly at the SVG inner circle size, expands with cubic easing
  const circleRadius = svgCircleVmax + Math.pow(transitionProgress, 3) * (130 - svgCircleVmax);
  // 0→1 while section 2 is sticky
  const section2Progress = Math.max(0, Math.min((scrollY - 2 * vh) / (2 * vh), 1));
  // Trigger section 2.5 on enter, reset on exit so it replays on scroll-back
  const moveTimer2_5 = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const el = section2_5Ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSlice2_5Triggered(true);
        moveTimer2_5.current = setTimeout(() => setMovedLeft2_5(true), 1100);
      } else {
        if (moveTimer2_5.current) clearTimeout(moveTimer2_5.current);
        setSlice2_5Triggered(false);
        setMovedLeft2_5(false);
      }
    }, { threshold: 0.05 });
    observer.observe(el);
    return () => { observer.disconnect(); if (moveTimer2_5.current) clearTimeout(moveTimer2_5.current); };
  }, []);

  // Trigger section 3 animations the instant it enters the viewport
  useEffect(() => {
    const el = section3Ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSection3Visible(true);
      } else {
        setSection3Visible(false);
      }
    }, { threshold: 0.05 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Bidirectional trigger for final statement section
  useEffect(() => {
    const el = finalSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setFinalSectionVisible(true);
      } else {
        setFinalSectionVisible(false);
      }
    }, { threshold: 0.05 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Measure cards wrapper top so cardsProgress is always accurate regardless of section heights above
  useEffect(() => {
    const measure = () => {
      const el = cardsWrapperRef.current;
      if (el) setCardsWrapperTop(el.getBoundingClientRect().top + window.scrollY);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = servicesWrapperRef.current;
      if (el) setServicesWrapperTop(el.getBoundingClientRect().top + window.scrollY);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const handleLoaderComplete = useCallback(() => {
    if (typeof window !== 'undefined') sessionStorage.setItem('wezero-loader-shown', '1');
    setLoaderDone(true);

    // Phase 1: letters slice up into view (centered)
    requestAnimationFrame(() => {
      setPhase(1);
    });

    // Phase 2: side-slice on all letters at once
    setTimeout(() => setPhase(2), 1000);

    // Phase 3: move wezero up to final position
    setTimeout(() => setPhase(3), 1700);

    // Phase 4: reveal all other content
    setTimeout(() => setPhase(4), 2400);
  }, []);

  // Lock scroll while menu is open
  useEffect(() => {
    if (menuOpen) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [menuOpen]);

  const showFixedNav = phase >= 4 && !navHidden;

  return (
    <>
      {!loaderDone && <Loader onComplete={handleLoaderComplete} />}

      {/* Fixed nav — hides on scroll down, hides in cards section */}
      <nav
        className="fixed top-0 left-0 right-0 z-[200] flex justify-between items-start font-body text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-black"
        style={{
          padding: 'clamp(16px, 2.5vh, 28px) clamp(24px, 4vw, 52px)',
          transform: showFixedNav ? 'translateY(0)' : 'translateY(-110%)',
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: showFixedNav ? 'auto' : 'none',
        }}
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5">
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-black"></span>
            ISLAMABAD, PK
          </span>
          <span>33.6844° N, 73.0479° E</span>
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
            transform: menuBtnHovered ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            transformOrigin: 'center',
          }} />
        </button>
      </nav>

      {/* ═══ Full-screen menu overlay ═══ */}
      {(() => {
        const menuItems = [
          { label: 'HOME',    href: '/',        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=600&fit=crop&q=80' },
          { label: 'WORK',    href: '/work',    img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=600&fit=crop&q=80' },
          { label: 'ABOUT',   href: '/about',   img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=600&fit=crop&q=80' },
          { label: 'CONTACT', href: '/contact', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop&q=80' },
        ];
        return (
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
                {menuItems.map((item, idx) => (
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
                      color: item.href === '/' ? '#1038CC' : '#ffffff',
                      textDecoration: 'none',
                      letterSpacing: '-0.02em',
                    }}
                    onMouseEnter={() => setHoveredMenuItem(item.label)}
                    onMouseLeave={() => setHoveredMenuItem(null)}
                  >
                    {/* clipPath clips top/bottom (hides slide-up text) but -20% right gives room for scale */}
                    <div style={{ clipPath: 'inset(0 -20% 0 0)' }}>
                      {/* Slide-up on open */}
                      <div style={{
                        transform: menuOpen ? 'translateY(0)' : 'translateY(110%)',
                        transition: menuOpen
                          ? `transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 80}ms`
                          : 'none',
                      }}>
                        {/* Scale on hover */}
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
                ))}
              </div>

              {/* Hover images — positioned right side, expand from center (hidden on mobile) */}
              <div className="hide-mobile" style={{
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
                  { label: 'hello@wezero.studio', href: 'mailto:hello@wezero.studio' },
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
        );
      })()}

      <div className="bg-cream">
      {/* 200vh wrapper: hero sticks for the first 100vh of scroll, animations play, then section 2 appears */}
      <div style={{ height: '200vh' }}>
      <section className="relative h-screen flex flex-col sticky top-0" style={{ overflow: phase >= 4 ? 'visible' : 'hidden' }}>

        {/* wezero — centered during phases 0-2, moves to top in phase 3+ */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center w-full z-10"
          style={{
            top: '50%',
            transform: phase >= 3
              ? 'translateY(calc(-50% - 32vh))'
              : 'translateY(-50%)',
            transition: phase >= 3
              ? 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'none',
            willChange: 'transform',
          }}
        >
          <h1
            className="font-display font-black text-black leading-[0.8] w-full flex justify-center gap-[0.3vw] sm:gap-[0.8vw] select-none lowercase"
            style={{ fontSize: "clamp(60px, 24vw, 500px)" }}
          >
            {HERO_LETTERS.map((letter, i) => (
              <AnimatedLetter
                key={i}
                letter={letter}
                revealed={phase >= 1}
                autoSlice={phase >= 2}
              />
            ))}
          </h1>
        </div>

        {/* Middle Section: Text - Orange Box - Text — slides in from top in phase 4 */}
        <div
          className="relative flex items-center justify-center w-full z-20"
          style={{
            flex: phase >= 3 ? '1' : '0 0 0px',
            overflow: phase >= 3 ? 'visible' : 'hidden',
            marginTop: isMobile ? '24vh' : '36vh',
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(-60px)',
            opacity: phase >= 4 ? 1 : 0,
            transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, opacity 0.8s ease 0.15s',
          }}
        >
          
          {/* Left Text */}
          <h2 className="font-[family-name:var(--font-anton)] text-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide uppercase whitespace-nowrap z-30 absolute left-0" style={{ marginLeft: '8vw' }}>
            <SliceDownText text="A DIGITAL" triggered={phase >= 4} />
          </h2>

          {/* Center Shape (Absolute Center) — hidden on mobile */}
          <div
            className="flex-col items-center w-full max-w-[300px] sm:max-w-[380px] md:max-w-[460px] z-0 hidden sm:flex"
            style={{ opacity: scrollY > vh * 0.99 ? 0 : 1 }}
          >
            {/* Label — always visible, never moves */}
            <div className="w-full flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#555' }}>
              <span>WEB DESIGN</span>
              <span>2026</span>
            </div>
            {/* Only the SVG moves down */}
            <div ref={svgInnerRef} style={{ transform: `translateY(${scrollProgress * diagramMoveAmount}px)`, willChange: 'transform', width: '100%' }}>
              <svg
                viewBox="0 0 400 220"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full"
              >
                <polygon points="0,110 115,5 230,110 115,215" fill="#0A0A0A" />
                <polygon points="170,110 285,5 400,110 285,215" fill="#0A0A0A" />
                <circle cx="200" cy="110" r="68" fill="#1038CC" />
              </svg>
            </div>
          </div>

          {/* Right Text */}
          <h2 className="font-[family-name:var(--font-anton)] text-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide uppercase whitespace-nowrap z-30 absolute right-0" style={{ marginRight: '8vw' }}>
            <SliceDownText text="AGENCY" triggered={phase >= 4} />
          </h2>

        </div>

        {/* Mobile only: static diagram + tagline, no scroll animation */}
        <div
          className="flex sm:hidden flex-col items-center gap-5 absolute left-0 right-0 px-8"
          style={{
            bottom: '14vh',
            zIndex: 20,
            opacity: phase >= 4 ? 1 : 0,
            transition: 'opacity 0.8s ease 0.4s',
          }}
        >
          <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '58vw', maxWidth: '220px' }}>
            <polygon points="0,110 115,5 230,110 115,215" fill="#0A0A0A" />
            <polygon points="170,110 285,5 400,110 285,215" fill="#0A0A0A" />
            <circle cx="200" cy="110" r="68" fill="#1038CC" />
          </svg>
          <p style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '14px', fontWeight: 500, color: 'rgba(10,10,10,0.6)', textAlign: 'center', lineHeight: 1.5, maxWidth: '260px', margin: 0 }}>
            A web agency for companies that care about the details.
          </p>
        </div>

        {/* Bottom Scroll Cue — fades in with phase 4, desktop only */}
        <div
          className="hidden sm:flex absolute bottom-5 left-0 w-full justify-center text-[10px] font-bold tracking-widest uppercase text-black z-20"
          style={{
            opacity: phase >= 4 ? 1 : 0,
            transition: 'opacity 1s ease 0.4s',
          }}
        >
          SCROLL DOWN
        </div>

      </section>
      </div>{/* end sticky wrapper */}

      {/* Transition: SVG diagram floats, inner circle expands to fill screen (Desktop only) */}
      {!isMobile && scrollY > vh * 0.99 && scrollY < vh * 2 + 80 && (
        <>
          {/* Floating diagram — no fade, just gets covered by the circle */}
          <div style={{
            position: 'fixed',
            left: '50%',
            top: `${transitionDiagY}%`,
            transform: 'translate(-50%, -50%)',
            width: `${fixedDiagWidth}px`,
            zIndex: 44,
            pointerEvents: 'none',
          }}>
            <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
              <polygon points="0,110 115,5 230,110 115,215" fill="#0A0A0A" />
              <polygon points="170,110 285,5 400,110 285,215" fill="#0A0A0A" />
              <circle cx="200" cy="110" r="68" fill="#1038CC" />
            </svg>
          </div>
          {/* Blue circle — starts at SVG inner circle size, expands above everything */}
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: '#1038CC',
            clipPath: `circle(${circleRadius}vmax at 50% ${transitionDiagY}%)`,
            pointerEvents: 'none',
          }} />
        </>
      )}

      {/* Section 2 — sticky manifesto zone */}
      <div style={{ height: '165vh' }}>
        <section
          className="sticky top-0 h-screen overflow-hidden"
          style={{ background: '#1038CC', opacity: isMobile ? 1 : (transitionProgress >= 1 ? 1 : 0) }}
        >
          {/* OUR MOTTO label */}
          <div
            className="font-[family-name:var(--font-anton)] text-3xl sm:text-4xl text-black uppercase tracking-wide"
            style={{
              position: 'absolute',
              top: 72,
              left: 36,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SliceUpText text="OUR MOTTO" triggered={transitionProgress >= 1} />
          </div>

          {/* Central text block */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: '1200px',
              textAlign: 'center',
              fontFamily: 'var(--font-anton)',
              fontSize: 'clamp(36px, 6vw, 72px)',
              lineHeight: 1.2,
              textTransform: 'uppercase',
              color: 'black',
              pointerEvents: 'none',
            }}
          >
            <SliceUpWords
              text="Wezero is a web agency for companies that care about the details, bringing ambitious digital visions to life with cutting-edge design and flawless engineering."
              triggered={section2Progress > 0.3}
            />
          </div>
        </section>
      </div>

      {/* Section 2.5 — We Build Experiences That Matter */}
      <section ref={section2_5Ref} className="relative bg-cream text-[#0A0A0A]" style={{ height: '85vh', zIndex: 2, position: 'relative' }}>

          {/* Main Heading — direct child of section so left:0 = viewport left.
              Desktop: starts centered (transform-only), animates to left.
              Mobile: fixed left with padding (no centering animation). */}
          <div
            className="absolute flex flex-col items-start sm:whitespace-nowrap"
            style={{
              top: '44vh',
              left: isMobile ? 'clamp(20px, 5.5vw, 50px)' : 0,
              transform: isMobile
                ? 'translateY(-50%)'
                : movedLeft2_5
                  ? 'translate(6vw, -50%)'
                  : 'translate(calc(50vw - 50%), -50%)',
              transition: isMobile ? 'none' : 'transform 1.4s cubic-bezier(0.76, 0, 0.24, 1)',
              willChange: 'transform',
            }}
          >
            <h2 className="font-[family-name:var(--font-anton)] text-[clamp(48px,9.5vw,160px)] leading-[1.1] uppercase tracking-tight m-0">
              <SliceUpText text="WE BUILD" triggered={slice2_5Triggered} />
            </h2>
            <h2 className="font-[family-name:var(--font-anton)] text-[clamp(48px,9.5vw,160px)] leading-[1.1] uppercase tracking-tight m-0 mt-2">
              <SliceUpText text="EXPERIENCES" triggered={slice2_5Triggered} />
            </h2>
            <div className="flex items-center gap-4 md:gap-6 mt-2">
              <h2 className="font-[family-name:var(--font-anton)] text-[clamp(48px,9.5vw,160px)] leading-[1.1] uppercase tracking-tight m-0">
                <SliceUpText text="THAT" triggered={slice2_5Triggered} />
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-satisfy), cursive',
                  color: '#1038CC',
                  fontSize: 'clamp(64px,13vw,210px)',
                  lineHeight: 0.85,
                  transform: 'rotate(-4deg) translateY(-6%)',
                  display: 'inline-block',
                  opacity: slice2_5Triggered ? 1 : 0,
                  transition: 'opacity 0.8s ease 0.5s',
                }}
              >
                Matter
              </span>
            </div>
          </div>

          {/* Subtext — appears simultaneously with auto-move */}
          <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 relative h-full">
            <div
              className="absolute left-6 right-6 sm:left-auto sm:right-10 md:right-16 max-w-[460px]"
              style={{
                top: isMobile ? '55vh' : '68vh',
                opacity: movedLeft2_5 ? 1 : 0,
                transform: movedLeft2_5 ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.9s ease, transform 0.9s ease',
                willChange: 'transform, opacity',
              }}
            >
              <p className="font-[family-name:var(--font-space-grotesk)] text-xl md:text-2xl font-medium leading-[1.25] tracking-tight mb-6">
                <SliceUpWords
                  text="Part strategists, part builders. We're obsessed with getting the details right."
                  triggered={movedLeft2_5}
                />
              </p>
              <p className="font-[family-name:var(--font-space-grotesk)] text-base md:text-lg font-medium leading-[1.4] text-black/70">
                <SliceUpWords
                  text="Because great digital products aren't just seen — they're felt strategically, emotionally, and operationally."
                  triggered={movedLeft2_5}
                />
              </p>
            </div>
          </div>

      </section>

      {/* ═══ Services sticky list ═══ */}
      {(() => {
        const SERVICES = [
          { name: 'Design',    desc: 'Clarity-first interfaces built to convert.',    boxColor: '#dde8f5', img: 'https://picsum.photos/seed/uxdesign/400/500' },
          { name: 'Build',     desc: 'Clean code. Zero legacy debt. Ships on time.',  boxColor: '#e2e2e2', img: 'https://picsum.photos/seed/devcode/400/500'  },
          { name: 'Strategy',  desc: 'Hard questions asked before a file is opened.', boxColor: '#f0e4d7', img: 'https://picsum.photos/seed/strategy9/400/500' },
          { name: 'SEO',       desc: 'Sites that rank — and stay ranked.',             boxColor: '#d7ece2', img: 'https://picsum.photos/seed/seoweb/400/500'   },
          { name: 'Branding',  desc: 'Identity that holds up at every scale.',         boxColor: '#dde8f5', img: 'https://picsum.photos/seed/branding7/400/500' },
          { name: 'Motion',    desc: 'Animation that adds meaning, not noise.',        boxColor: '#e8e2f0', img: 'https://picsum.photos/seed/motion33/400/500'  },
          { name: 'Analytics', desc: 'Data wired to decisions, not dashboards.',       boxColor: '#f0ead7', img: 'https://picsum.photos/seed/analytics8/400/500'},
        ];

        const rawProgress = Math.max(0, (scrollY - servicesWrapperTop) / (vh * 0.22));
        const activeIndex = Math.min(Math.floor(rawProgress), SERVICES.length - 1);

        const ITEM_HEIGHT_VH = 15;
        const listTranslateY = -(rawProgress * ITEM_HEIGHT_VH);

        if (isMobile) {
          return (
            <section className="bg-cream py-24 px-6 sm:px-10 flex flex-col items-center justify-center w-full gap-6">
              <span
                className="font-[family-name:var(--font-space-grotesk)] text-black mb-8"
                style={{ fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 500 }}
              >
                The services we provide
              </span>
              {SERVICES.map((s, i) => (
                <div key={i} className="flex flex-col items-center w-full mb-8">
                  <span
                    className="font-[family-name:var(--font-space-grotesk)] font-bold tracking-tight block mb-3 text-center"
                    style={{ fontSize: 'clamp(36px, 10vw, 64px)', color: '#1038CC' }}
                  >
                    {s.name}
                  </span>
                  <p className="font-[family-name:var(--font-space-grotesk)] font-medium leading-[1.4] text-black text-[17px] sm:text-lg max-w-[300px] text-center">
                    {s.desc}
                  </p>
                </div>
              ))}
            </section>
          );
        }

        return (
          <div ref={servicesWrapperRef} style={{ height: `${Math.ceil(SERVICES.length * 22 + 120)}vh`, marginTop: '-15vh' }}>
            <section className="sticky top-0 h-screen overflow-hidden bg-cream flex items-center" style={{ zIndex: 1 }}>
              <div
                className="w-full max-w-[1600px] mx-auto flex items-center h-full relative"
                style={{ padding: '0 clamp(24px, 5vw, 80px)' }}
              >
                {/* Column 1: Static label */}
                <div style={{ flex: '0 0 18%', paddingRight: '20px' }}>
                  <span
                    className="font-[family-name:var(--font-space-grotesk)] text-black"
                    style={{ fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 500 }}
                  >
                    The services we provide
                  </span>
                </div>

                {/* Column 2: Scrolling List */}
                <div style={{ flex: '0 0 36%', position: 'relative', height: '100%' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      width: '100%',
                      transform: `translateY(calc(-${ITEM_HEIGHT_VH / 2}vh + ${listTranslateY}vh))`,
                      willChange: 'transform',
                      backfaceVisibility: 'hidden' as const
                    }}
                  >
                    {SERVICES.map((s, i) => {
                      const isActive = i === activeIndex;

                      return (
                        <div
                          key={i}
                          style={{
                            height: `${ITEM_HEIGHT_VH}vh`,
                            display: 'flex',
                            alignItems: 'center',
                            fontFamily: 'var(--font-space-grotesk)',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            fontSize: 'clamp(38px, 6vw, 94px)',
                            lineHeight: 1.05,
                            color: isActive ? '#1038CC' : '#0A0A0A',
                            opacity: 1,
                            transition: 'color 0.3s ease',
                            cursor: 'default',
                            userSelect: 'none',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {s.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Column 3: Image placeholder (hidden on mobile) */}
                <div className="hidden md:flex" style={{ flex: '0 0 23%', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: 'clamp(100px, 12vw, 200px)', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden' }}>
                    {/* Static background box */}
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#EBEBEB', zIndex: -1 }} />
                    
                    {SERVICES.map((s, i) => {
                      const progressDiff = i - rawProgress;
                      
                      let transformStr = '';
                      let opacityVal = 1;
                      
                      if (progressDiff >= 0) {
                        const t = Math.max(0, Math.min(progressDiff, 1));
                        const easeT = t * t * (3 - 2 * t);
                        transformStr = `translateY(${easeT * 100}%) rotate(${easeT * 45}deg) scale(${1 - easeT * 0.6})`;
                        opacityVal = progressDiff > 1 ? 0 : 1;
                      } else {
                        const outT = Math.max(0, Math.min(-progressDiff, 1));
                        const easeOutT = outT * outT * (3 - 2 * outT);
                        transformStr = `translateY(-${easeOutT * 40}%) rotate(-${easeOutT * 45}deg) scale(${1 - easeOutT * 0.4})`;
                        opacityVal = outT >= 1 ? 0 : 1;
                      }
                      
                      return (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: s.boxColor || '#dce3ed',
                            zIndex: i,
                            transformOrigin: 'center center',
                            transform: transformStr,
                            opacity: opacityVal,
                            willChange: 'transform'
                          }}
                        >
                          {s.img && (
                            <img 
                              src={s.img} 
                              alt={s.name} 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Column 4: Description text */}
                <div style={{ flex: '1', position: 'relative', height: '100%' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: '320px', minHeight: '80px', textAlign: 'center' }}>
                    {SERVICES.map((s, i) => (
                      <p
                        key={i}
                        className="font-[family-name:var(--font-space-grotesk)] font-medium leading-[1.25] tracking-tight"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          margin: 0,
                          fontSize: 'clamp(16px, 1.5vw, 22px)',
                          color: '#0A0A0A',
                          opacity: i === activeIndex ? 1 : 0,
                          transform: `translateY(${i === activeIndex ? '-50%' : 'calc(-50% + 15px)'})`,
                          transition: 'opacity 0.45s ease, transform 0.45s ease',
                        }}
                      >
                        {s.desc}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      })()}

      {/* Section 3 — What We Do */}
      <section ref={section3Ref} className="relative min-h-screen bg-cream pt-48 px-6 sm:px-10 overflow-hidden text-[#0A0A0A]" style={{ paddingBottom: '18vh', marginTop: '-10vh' }}>
        <div className="w-full max-w-[1600px] mx-auto flex flex-col">
          {/* WHAT */}
          <h2
            className="font-[family-name:var(--font-anton)] text-[clamp(100px,22vw,300px)] leading-[0.75] uppercase tracking-tight text-left m-0"
            style={{ paddingTop: '15vh', paddingLeft: '10vw' }}
          >
            <SliceUpText text="WHAT" triggered={section3Visible} />
          </h2>

          <div className="relative mt-8 md:mt-[-4vw] w-full">
            {/* Paragraph Block */}
            <div
              className="w-full max-w-[450px] flex flex-col gap-6 items-start z-10 relative"
              style={{ marginLeft: '22%', marginTop: '4.5vw' }}
            >
              {/* Removed "We handle the full stack..." text here */}
              <div style={{
                opacity: section3Visible ? 1 : 0,
                transform: section3Visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
                marginTop: '0.2vw'
              }}>
                <Link href="/work">
                  <button className="bg-[#0A0A0A] text-white font-[family-name:var(--font-anton)] uppercase tracking-[0.05em] text-sm md:text-xl flex items-center gap-3 hover:bg-[#1038CC] transition-colors cursor-pointer group" style={{ padding: '13px 32px 11px', lineHeight: 1 }}>
                    OUR WORKS
                    <svg className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </Link>
              </div>
            </div>

            {/* WE */}
            <h2
              className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 font-[family-name:var(--font-anton)] text-[clamp(100px,22vw,300px)] leading-[0.75] uppercase tracking-tight text-right m-0 z-0 pointer-events-none md:-mt-[2vw]"
              style={{ paddingRight: '18vw' }}
            >
              <SliceUpText text="WE" triggered={section3Visible} />
            </h2>
            {/* Mobile WE */}
            <h2
              className="block md:hidden font-[family-name:var(--font-anton)] text-[clamp(100px,22vw,300px)] leading-[0.75] uppercase tracking-tight text-right m-0 mt-8"
              style={{ paddingRight: '10vw' }}
            >
              <SliceUpText text="WE" triggered={section3Visible} />
            </h2>
          </div>

          {/* DO */}
          <h2
            className="font-[family-name:var(--font-anton)] text-[clamp(100px,22vw,300px)] leading-[0.75] uppercase tracking-tight"
            style={{ paddingLeft: '35vw', textAlign: 'left', margin: 0, marginTop: '4vw' }}
          >
            <SliceUpText text="DO" triggered={section3Visible} />
          </h2>
        </div>
      </section>

      {/* ═══ Sticky card stack ═══ */}
      {(() => {
        const CARD_COUNT = 4;
        const SCROLL_PER_CARD = 1.5; // vh units of scroll per card transition
        const cardsProgress = Math.max(0, (scrollY - cardsWrapperTop) / vh);

        const cards = [
          {
            bg: '#0A0A0A',
            title1: 'WEB', title2: 'DESIGN',
            copy: 'Interfaces that are fast to learn and hard to leave. We design for clarity first, beauty second — and both tend to show up.',
            diamonds: [
              { text: 'STRATEGY', w: 200, h: 500, fontSize: 26, ml: 0 },
              { text: 'NARRATIVE', w: 250, h: 620, fontSize: 32, ml: -75 },
              { text: 'DIRECTION', w: 200, h: 500, fontSize: 26, ml: -75 },
            ],
            diamondFill: '#0A0A0A',
          },
          {
            bg: '#E84220',
            title1: 'BRAND', title2: 'IDENTITY',
            copy: 'Identity that holds up at every size, screen, and surface. From wordmarks to full brand systems — built to last and built to scale.',
            diamonds: [
              { text: 'MARK', w: 200, h: 500, fontSize: 26, ml: 0 },
              { text: 'PALETTE', w: 250, h: 620, fontSize: 32, ml: -75 },
              { text: 'VOICE', w: 200, h: 500, fontSize: 26, ml: -75 },
            ],
            diamondFill: '#E84220',
            textColor: '#0A0A0A',
          },
          {
            bg: '#1038CC',
            title1: 'WEB', title2: 'DEV',
            copy: 'Next.js, TypeScript, clean architecture. We write code that future developers won\'t hate. Production-ready from day one.',
            diamonds: [
              { text: 'NEXT.JS', w: 200, h: 500, fontSize: 26, ml: 0 },
              { text: 'TYPESCRIPT', w: 250, h: 620, fontSize: 32, ml: -75 },
              { text: 'DEPLOY', w: 200, h: 500, fontSize: 26, ml: -75 },
            ],
            diamondFill: '#1038CC',
          },
          {
            bg: '#1A3A28',
            title1: 'DIGITAL', title2: 'STRAT',
            copy: 'Before we open a design file, we ask hard questions. What does this need to do? For who? By when? Good strategy makes everything downstream easier.',
            diamonds: [
              { text: 'RESEARCH', w: 200, h: 500, fontSize: 26, ml: 0 },
              { text: 'STRATEGY', w: 250, h: 620, fontSize: 32, ml: -75 },
              { text: 'ROADMAP', w: 200, h: 500, fontSize: 26, ml: -75 },
            ],
            diamondFill: '#1A3A28',
          },
        ];

        if (isMobile) {
          // Mobile view: Simple stacked blocks
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cards.map((card, idx) => {
                const textColor = card.textColor || '#ffffff';
                return (
                  <div
                    key={idx}
                    style={{
                      background: card.bg,
                      padding: '80px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '32px',
                    }}
                  >
                    <h2
                      className="font-[family-name:var(--font-anton)] text-[clamp(48px,11vw,200px)] uppercase tracking-tight m-0"
                      style={{ lineHeight: 1, color: textColor }}
                    >
                      <span style={{ display: 'block' }}>{card.title1}</span>
                      <span style={{ display: 'block', marginTop: '0.06em' }}>{card.title2}</span>
                    </h2>
                    <p
                      className="font-[family-name:var(--font-space-grotesk)] text-xl font-medium leading-[1.3]"
                      style={{ color: textColor === '#0A0A0A' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)' }}
                    >
                      {card.copy}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        }

        // Desktop view: Sticky scroll stack
        return (
          <div ref={cardsWrapperRef} style={{ height: `${CARD_COUNT * SCROLL_PER_CARD * 100 + 25}vh` }}>
            <div className="sticky top-0 h-screen overflow-hidden">
              {cards.map((card, idx) => {
                const cardStart = idx * SCROLL_PER_CARD;
                const cardEnd = cardStart + SCROLL_PER_CARD;
                const localProgress = Math.max(0, Math.min((cardsProgress - cardStart) / SCROLL_PER_CARD, 1));

                const isLast = idx === CARD_COUNT - 1;
                const isActive = cardsProgress >= cardStart && (isLast || cardsProgress < cardEnd);
                const isPast = cardsProgress >= cardEnd;
                const isFuture = cardsProgress < cardStart;

                // Outgoing: current card slides down + fades at the end
                let translateY = 0;
                let opacity = 1;
                let scale = 1;

                if (isPast && !isLast) {
                  translateY = 40;
                  opacity = 0;
                  scale = 0.85;
                } else if (isActive && !isLast) {
                  translateY = localProgress * 40; // slides DOWN further (40%)
                  opacity = localProgress < 0.5 ? 1 : 1 - ((localProgress - 0.5) / 0.5); // smoother fade over last 50%
                  scale = 1 - localProgress * 0.15; // bends/shrinks deeper into background
                }

                // Incoming: next card slides up from bottom
                if (isFuture) {
                  const prevStart = (idx - 1) * SCROLL_PER_CARD;
                  const prevProgress = Math.max(0, Math.min((cardsProgress - prevStart) / SCROLL_PER_CARD, 1));
                  translateY = 100 - prevProgress * 100;
                  opacity = 1; // no fade in, just slide up
                  scale = 1;
                }

                const textColor = card.textColor || '#ffffff';
                const strokeColor = card.textColor === '#0A0A0A' ? '#0A0A0A' : '#f2eddf';
                const diamondTextColor = card.textColor === '#0A0A0A' ? '#0A0A0A' : '#f2eddf';

                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: card.bg,
                      transform: `translateY(${translateY}%) scale(${scale})`,
                      opacity,
                      zIndex: idx + 1,
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: 'clamp(24px, 4vw, 60px)',
                      paddingRight: 'clamp(24px, 4vw, 60px)',
                      willChange: 'transform, opacity',
                      backfaceVisibility: 'hidden' as const,
                    }}
                  >
                    <div className="w-full max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8">

                      {/* Left: heading + copy */}
                      <div className="flex flex-col gap-8 md:max-w-[50%] z-10" style={{ paddingLeft: '3vw' }}>
                        <h2
                          className="font-[family-name:var(--font-anton)] text-[clamp(64px,11vw,200px)] uppercase tracking-tight m-0"
                          style={{ lineHeight: 1, color: textColor }}
                        >
                          <span style={{ display: 'block' }}>{card.title1}</span>
                          <span style={{ display: 'block', marginTop: '0.06em' }}>{card.title2}</span>
                        </h2>
                        <p
                          className="font-[family-name:var(--font-space-grotesk)] text-2xl md:text-[28px] font-medium leading-[1.3] max-w-[500px]"
                          style={{ color: textColor === '#0A0A0A' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)', marginTop: '8vh' }}
                        >
                          {card.copy}
                        </p>
                      </div>

                      {/* Right: Elongated diamonds (hidden on mobile) */}
                      <div className="md:w-[50%] w-full hidden md:flex items-center justify-end md:pt-0" style={{ paddingRight: '4vw' }}>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', padding: '40px 0' }}>
                          {card.diamonds.map((item, i) => (
                            <div
                              key={i}
                              style={{
                                width: item.w,
                                height: item.h,
                                flexShrink: 0,
                                marginLeft: item.ml,
                                position: 'relative',
                                zIndex: i === 1 ? 2 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <svg viewBox="0 0 100 240" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                                <polygon points="50,2 98,120 50,238 2,120" fill={card.diamondFill} stroke={strokeColor} strokeWidth="1.5" />
                              </svg>
                              <span style={{
                                fontFamily: 'var(--font-anton)',
                                fontSize: item.fontSize,
                                color: diamondTextColor,
                                whiteSpace: 'nowrap',
                                letterSpacing: '0.06em',
                                position: 'relative',
                                zIndex: 1,
                                writingMode: 'vertical-rl' as const,
                                textOrientation: 'mixed' as const,
                                transform: 'rotate(180deg)',
                              }}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ═══ Final Statement ═══ */}
      <section
        ref={finalSectionRef}
        style={{
          background: '#ffffff',
          padding: 'clamp(80px, 12vh, 160px) clamp(24px, 6vw, 96px)',
          paddingBottom: 'clamp(80px, 15vh, 200px)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-anton)',
            fontSize: 'clamp(64px, 12vw, 200px)',
            lineHeight: 0.9,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: '#0A0A0A',
            margin: 0,
            marginBottom: '8vh',
            textAlign: 'center',
          }}>
            <span style={{ display: 'block' }}><SliceUpText text="WE BUILD" triggered={finalSectionVisible} /></span>
            <span style={{ display: 'block' }}><SliceUpText text="WEBSITES THAT" triggered={finalSectionVisible} /></span>
            <span style={{ display: 'block' }}>
              <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.55em', marginBottom: '-0.55em' }}>
                <span style={{ display: 'inline-block', fontFamily: 'var(--font-satisfy)', textTransform: 'none', color: '#1038CC', fontSize: 'clamp(60px, 11vw, 175px)', transform: finalSectionVisible ? 'translateY(0)' : 'translateY(170%)', transition: finalSectionVisible ? 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0ms' : 'none' }}>
                  Work.
                </span>
              </span>
            </span>
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5vh',
            opacity: finalSectionVisible ? 1 : 0,
            transform: finalSectionVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.9s ease 0.9s, transform 0.9s ease 0.9s',
          }}>
            <div style={{ display: 'flex', gap: 'clamp(32px, 5vw, 80px)', maxWidth: '900px', width: '100%' }} className="flex-col sm:flex-row">
              <p style={{ flex: 1, fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(15px, 1.3vw, 20px)', fontWeight: 500, lineHeight: 1.5, color: '#0A0A0A', margin: 0 }}>
                We don&apos;t cut corners. The difference between a site that lasts two years and one that needs a full rebuild in six months is almost always craft.
              </p>
              <p style={{ flex: 1, fontFamily: 'var(--font-space-grotesk)', fontSize: 'clamp(15px, 1.3vw, 20px)', fontWeight: 500, lineHeight: 1.5, color: '#0A0A0A', margin: 0 }}>
                When we&apos;re done, you own everything — the repo, the assets, the docs. Built to run without us. No lock-in, ever.
              </p>
            </div>
            <a href="/contact">
              <button className="bg-[#0A0A0A] text-white font-[family-name:var(--font-anton)] uppercase tracking-[0.05em] text-sm md:text-xl flex items-center gap-3 hover:bg-[#ff5520] transition-colors cursor-pointer group" style={{ padding: '13px 40px 11px', lineHeight: 1 }}>
                CONTACT US
                <svg className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </a>
          </div>
        </div>
      </section>

      </div>

      {/* ═══ Footer ═══ */}
      <footer style={{
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
    </>
  );
}

