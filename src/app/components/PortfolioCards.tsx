'use client';

import type { RefObject } from 'react';

interface Card {
  bg: string;
  title1: string;
  title2: string;
  copy: string;
  diamonds: { text: string; w: number; h: number; fontSize: number; ml: number }[];
  diamondFill: string;
  textColor?: string;
}

const CARDS: Card[] = [
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
    copy: "Next.js, TypeScript, clean architecture. We write code that future developers won't hate. Production-ready from day one.",
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

const CARD_COUNT = CARDS.length;
const SCROLL_PER_CARD = 1.5;

interface Props {
  scrollY: number;
  vh: number;
  cardsWrapperTop: number;
  isMobile: boolean;
  cardsWrapperRef: RefObject<HTMLDivElement | null>;
}

export function PortfolioCards({ scrollY, vh, cardsWrapperTop, isMobile, cardsWrapperRef }: Props) {
  const cardsProgress = Math.max(0, (scrollY - cardsWrapperTop) / vh);

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {CARDS.map((card, idx) => {
          const textColor = card.textColor || '#ffffff';
          return (
            <div
              key={idx}
              style={{ background: card.bg, padding: '80px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}
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

  return (
    <div ref={cardsWrapperRef} style={{ height: `${CARD_COUNT * SCROLL_PER_CARD * 100 + 25}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {CARDS.map((card, idx) => {
          const cardStart = idx * SCROLL_PER_CARD;
          const cardEnd = cardStart + SCROLL_PER_CARD;
          const localProgress = Math.max(0, Math.min((cardsProgress - cardStart) / SCROLL_PER_CARD, 1));

          const isLast = idx === CARD_COUNT - 1;
          const isActive = cardsProgress >= cardStart && (isLast || cardsProgress < cardEnd);
          const isPast = cardsProgress >= cardEnd;
          const isFuture = cardsProgress < cardStart;

          let translateY = 0;
          let opacity = 1;
          let scale = 1;

          if (isPast && !isLast) {
            translateY = 40; opacity = 0; scale = 0.85;
          } else if (isActive && !isLast) {
            translateY = localProgress * 40;
            opacity = localProgress < 0.5 ? 1 : 1 - ((localProgress - 0.5) / 0.5);
            scale = 1 - localProgress * 0.15;
          }

          if (isFuture) {
            const prevStart = (idx - 1) * SCROLL_PER_CARD;
            const prevProgress = Math.max(0, Math.min((cardsProgress - prevStart) / SCROLL_PER_CARD, 1));
            translateY = 100 - prevProgress * 100;
            opacity = 1;
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
}
