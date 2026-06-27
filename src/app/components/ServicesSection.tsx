'use client';

import type { RefObject } from 'react';

const SERVICES = [
  { name: 'Design',    desc: 'Clarity-first interfaces built to convert.',    boxColor: '#dde8f5', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=500&fit=crop&q=80' },
  { name: 'Build',     desc: 'Clean code. Zero legacy debt. Ships on time.',  boxColor: '#e2e2e2', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=500&fit=crop&q=80'  },
  { name: 'Strategy',  desc: 'Hard questions asked before a file is opened.', boxColor: '#f0e4d7', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=500&fit=crop&q=80' },
  { name: 'SEO',       desc: 'Sites that rank — and stay ranked.',             boxColor: '#d7ece2', img: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=500&fit=crop&q=80'   },
  { name: 'Branding',  desc: 'Identity that holds up at every scale.',         boxColor: '#dde8f5', img: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=500&fit=crop&q=80' },
  { name: 'Motion',    desc: 'Animation that adds meaning, not noise.',        boxColor: '#e8e2f0', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop&q=80'  },
  { name: 'Analytics', desc: 'Data wired to decisions, not dashboards.',       boxColor: '#f0ead7', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=500&fit=crop&q=80' },
  { name: 'Scale',     desc: 'Infrastructure ready for your next phase.',      boxColor: '#d7e2ec', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=500&fit=crop&q=80' },
];

interface Props {
  scrollY: number;
  vh: number;
  servicesWrapperTop: number;
  isMobile: boolean;
  servicesWrapperRef: RefObject<HTMLDivElement>;
}

export function ServicesSection({ scrollY, vh, servicesWrapperTop, isMobile, servicesWrapperRef }: Props) {
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
    <div ref={servicesWrapperRef} style={{ height: `${Math.ceil(SERVICES.length * 22 + 100)}vh`, marginTop: '-15vh' }}>
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
                backfaceVisibility: 'hidden' as const,
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
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.name}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: Image carousel */}
          <div className="hidden md:flex" style={{ flex: '0 0 23%', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 'clamp(100px, 12vw, 200px)', aspectRatio: '1/1', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: '#EBEBEB', zIndex: -1 }} />
              {[...SERVICES, SERVICES[0]].map((s, i) => {
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
                      willChange: 'transform',
                    }}
                  >
                    {s.img && (
                      <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
}
