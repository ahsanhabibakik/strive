"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

interface TawkChatProps {
  siteId?: string;
  chatId?: string;
}

export function TawkChat({
  siteId = "687d63483b2af81922772e0e", // Your actual Tawk.to Site ID
  chatId = "1j0ksnlru", // Your actual Tawk.to Chat ID
}: TawkChatProps) {
  const [isClient, setIsClient] = useState(false);

  // Only run on client-side to avoid SSR issues
  useEffect(() => {
    setIsClient(true);

    // Direct script injection for faster loading
    if (typeof window !== "undefined" && !document.getElementById('tawk-script')) {
      const script = document.createElement('script');
      script.id = 'tawk-script';
      script.async = true;
      script.src = `https://embed.tawk.to/${siteId}/${chatId}`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.head.appendChild(script);
    }

    // Clean up function to handle component unmounting
    return () => {
      if (typeof window !== "undefined") {
        // Try to remove any Tawk.to related elements
        const tawkElements = [
          "tawkScript",
          "tawk-script",
          "tawk-script-widget",
          "tawk-min",
        ];

        tawkElements.forEach((id) => {
          const element = document.getElementById(id);
          if (element) {
            element.remove();
          }
        });
      }
    };
  }, [siteId, chatId]);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  // We're using direct script injection in the useEffect hook
  // This is just a fallback in case the direct injection fails
  return (
    <Script
      id="tawk-script-fallback"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          if (!document.getElementById('tawk-script')) {
            var Tawk_API = Tawk_API || {};
            var Tawk_LoadStart = new Date();
            (function(){
              var s1 = document.createElement("script");
              s1.id = "tawk-script";
              var s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/${siteId}/${chatId}';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          }
        `,
      }}
    />
  );
}

// Add type definitions for Tawk_API
declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
  }
}