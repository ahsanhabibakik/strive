'use client';

import React, { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';



declare global {
  interface Window {
    dataLayer: unknown[]; // Using unknown[] to match the expected type
  }
}

function GoogleTagManagerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'pageview',
        page: pathname,
        search: searchParams?.toString(),
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function GoogleTagManager() {
  return (
    <Suspense fallback={null}>
      <GoogleTagManagerContent />
    </Suspense>
  );
} 