'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';

// GTM ID should be in an environment variable
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-NLRZDN5P';

interface GoogleTagManagerProps {
  /**
   * Optional nonce for CSP
   */
  nonce?: string;
}

export function GoogleTagManager({ nonce = '' }: GoogleTagManagerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  useEffect(() => {
    if (pathname) {
      // Push to dataLayer
      window.dataLayer?.push({
        event: 'page_view',
        page: pathname,
        page_path: pathname,
        page_search: searchParams?.toString() || '',
        page_title: document.title,
      });
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* GTM Script */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />

      {/* GTM NoScript */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="GTM"
        />
      </noscript>
    </>
  );
}

// Helper functions for common events
export const gtmEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
  }
};

// Common event helpers
export const trackConversion = (value: number, currency = 'USD', transactionId?: string) => {
  gtmEvent('conversion', {
    value,
    currency,
    transaction_id: transactionId,
  });
};

export const trackFormSubmission = (formName: string, formData?: Record<string, unknown>) => {
  gtmEvent('form_submission', {
    form_name: formName,
    form_data: formData,
  });
};

export const trackButtonClick = (buttonName: string, buttonLocation: string) => {
  gtmEvent('button_click', {
    button_name: buttonName,
    button_location: buttonLocation,
  });
};

// Type definitions for global dataLayer
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}