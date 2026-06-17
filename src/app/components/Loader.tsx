'use client';

import { useState, useEffect } from 'react';

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [counts, setCounts] = useState<string[]>(['000', '050', '100']);

  useEffect(() => {
    const mid = Math.floor(Math.random() * 62) + 18;
    setCounts(['000', String(mid).padStart(3, '0'), '100']);
  }, []);

  useEffect(() => {
    const t0 = setTimeout(() => setStarted(true), 80);
    const t1 = setTimeout(() => setStep(1), 850);
    const t2 = setTimeout(() => setStep(2), 1600);
    const t3 = setTimeout(() => setSliding(true), 2300);
    const t4 = setTimeout(onComplete, 3700);
    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 bg-black z-[9999] flex items-center justify-center"
      style={{
        transform: sliding ? 'translateY(-100%)' : 'translateY(0)',
        transition: sliding ? 'transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }}
    >
      <div className="font-display font-black text-white flex" style={{ fontSize: 'clamp(48px, 10vw, 160px)', letterSpacing: '-0.03em' }}>
        {[0, 1, 2].map(digitPos => (
          <div key={digitPos} style={{ overflow: 'hidden', height: '0.85em', lineHeight: '0.85' }}>
            <div
              style={{
                transform: started ? `translateY(calc(${-step} * 0.9em))` : 'translateY(0.9em)',
                transition: started ? `transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${digitPos * 80}ms` : 'none',
              }}
            >
              {counts.map((count, i) => (
                <div key={i} style={{ height: '0.85em', lineHeight: '0.85', marginBottom: '0.05em' }}>
                  {count[digitPos]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
