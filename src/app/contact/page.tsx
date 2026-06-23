'use client';

import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from '@/components/Navbar';

export default function ContactPage() {
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
      <Navbar />

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


    </>
  );
}
