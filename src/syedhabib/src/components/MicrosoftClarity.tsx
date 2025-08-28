'use client';

import Script from 'next/script';

// Microsoft Clarity tracking ID
const CLARITY_PROJECT_ID = 'smv1x7gumt';

interface ClarityWindow extends Window {
  clarity?: {
    (method: string, ...args: any[]): void;
    q?: any[];
  };
}

declare const window: ClarityWindow;

export function MicrosoftClarity() {
  // Only load in production or when explicitly enabled
  const isEnabled = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_CLARITY === 'true';
  
  if (!isEnabled || !CLARITY_PROJECT_ID) {
    return null;
  }

  return (
    <Script
      id="clarity-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
        `,
      }}
    />
  );
}

// Helper function to trigger Clarity events (optional)
export const clarityTrack = (eventName: string, customData?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('set', eventName, customData);
  }
};
