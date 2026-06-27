"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import Lenis from "lenis";
import { Loader } from "./components/Loader";
import { Navbar } from "@/components/Navbar";
import { AnimatedLetter, SliceDownText, SliceUpText, SliceUpWords } from "./components/TextAnimations";
import { ServicesSection } from "./components/ServicesSection";
import { PortfolioCards } from "./components/PortfolioCards";

const HERO_LETTERS = ["w", "e", "z", "e", "r", "o"];

/* â”€â”€â”€ Animation phases â”€â”€â”€ */
// Phase 0: Loader is showing, wezero hidden
// Phase 1: Loader done â†’ wezero letters slice UP into view (centered on screen)
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
      // ~28 words Ã— 40ms stagger + 0.8s animation = ~1.9s; add 300ms buffer
      sec2LockTimer.current = setTimeout(() => {
        lenisRef.current?.start();
        sec2LockTimer.current = null;
      }, 1600);
    }
  }, [scrollY]); // eslint-disable-line react-hooks/exhaustive-deps -- vh is window.innerHeight at render, not tracked state

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
  }, [scrollY, cardsWrapperTop]); // eslint-disable-line react-hooks/exhaustive-deps -- vh is window.innerHeight at render, not tracked state

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

  // 0â†’1 as user scrolls one viewport height through the sticky zone
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
  // 0â†’1 while section 2 is sticky
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

  const handleMenuToggle = useCallback((isOpen: boolean) => {
    if (isOpen) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, []);

  const showFixedNav = phase >= 4 && !navHidden;

  return (
    <>
      {!loaderDone && <Loader onComplete={handleLoaderComplete} />}

      <Navbar navHidden={!showFixedNav} onMenuToggle={handleMenuToggle} />

      <div className="bg-cream">
      {/* 200vh wrapper: hero sticks for the first 100vh of scroll, animations play, then section 2 appears */}
      <div style={{ height: '200vh' }}>
      <section className="relative h-screen flex flex-col sticky top-0" style={{ overflow: phase >= 4 ? 'visible' : 'hidden' }}>

        {/* wezero â€” centered during phases 0-2, moves to top in phase 3+ */}
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

        {/* Middle Section: Text - Orange Box - Text â€” slides in from top in phase 4 */}
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

          {/* Center Shape (Absolute Center) â€” hidden on mobile */}
          <div
            className="flex-col items-center w-full max-w-[300px] sm:max-w-[380px] md:max-w-[460px] z-0 hidden sm:flex"
            style={{ opacity: scrollY > vh * 0.99 ? 0 : 1 }}
          >
            {/* Label â€” always visible, never moves */}
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

        {/* Bottom Scroll Cue â€” fades in with phase 4, desktop only */}
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
          {/* Floating diagram â€” no fade, just gets covered by the circle */}
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
          {/* Blue circle â€” starts at SVG inner circle size, expands above everything */}
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

      {/* Section 2 â€” sticky manifesto zone */}
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

      {/* Section 2.5 â€” We Build Experiences That Matter */}
      <section ref={section2_5Ref} className="relative bg-cream text-[#0A0A0A]" style={{ height: '85vh', zIndex: 2, position: 'relative' }}>

          {/* Main Heading â€” direct child of section so left:0 = viewport left.
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

          {/* Subtext â€” appears simultaneously with auto-move */}
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
                  text="Because great digital products aren't just seen â€” they're felt strategically, emotionally, and operationally."
                  triggered={movedLeft2_5}
                />
              </p>
            </div>
          </div>

      </section>

      {/* ═══ Services sticky list ═══ */}
      <ServicesSection scrollY={scrollY} vh={vh} servicesWrapperTop={servicesWrapperTop} isMobile={isMobile} servicesWrapperRef={servicesWrapperRef} />

      {/* Section 3 â€” What We Do */}
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
                <button onClick={() => { window.location.href = '/work'; }} className="bg-[#0A0A0A] text-white font-[family-name:var(--font-anton)] uppercase tracking-[0.05em] text-sm md:text-xl flex items-center gap-3 hover:bg-[#1038CC] transition-colors cursor-pointer group" style={{ padding: '13px 32px 11px', lineHeight: 1 }}>
                  OUR WORKS
                  <svg className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
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
      <PortfolioCards scrollY={scrollY} vh={vh} cardsWrapperTop={cardsWrapperTop} isMobile={isMobile} cardsWrapperRef={cardsWrapperRef} />

      {/* â•â•â• Final Statement â•â•â• */}
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
                When we&apos;re done, you own everything â€” the repo, the assets, the docs. Built to run without us. No lock-in, ever.
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

      {/* â•â•â• Footer â•â•â• */}
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
                { label: 'LinkedIn â†—', href: '#' },
                { label: 'Instagram â†—', href: '#' },
                { label: 'Twitter / X â†—', href: '#' },
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
              Â© 2026 Wezero. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}