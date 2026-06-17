'use client';

import { useState, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Loader } from './Loader';

export function LayoutLoader() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    // Home page manages its own loader
    if (pathname === '/') return;

    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === 'reload') {
      setShow(true);
    }
  }, [pathname]);

  if (!show) return null;
  return <Loader onComplete={() => setShow(false)} />;
}
