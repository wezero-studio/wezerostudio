import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const alt = 'Wezero — Web Agency';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0A',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: wordmark */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#ffffff', fontSize: 22, fontWeight: 700, letterSpacing: '0.06em' }}>
            WEZERO
          </span>
        </div>

        {/* Bottom: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <span style={{ color: '#ffffff', fontSize: 88, fontWeight: 900, letterSpacing: '-4px', lineHeight: 1 }}>
              We build websites
            </span>
            <span style={{ color: '#1038CC', fontSize: 88, fontWeight: 900, letterSpacing: '-4px', lineHeight: 1 }}>
              that work.
            </span>
          </div>
          <span style={{ color: '#ffffff', fontSize: 24, fontWeight: 400, opacity: 0.4, letterSpacing: '-0.3px' }}>
            Fast, sharp, and built to last.
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
