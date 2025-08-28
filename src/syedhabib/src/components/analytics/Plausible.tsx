'use client';

import Script from 'next/script';

// Replace with your domain when ready
const DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'yourdomain.com';

export function Plausible() {
  return (
    <Script
      data-domain={DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}