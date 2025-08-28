'use client';

import { useEffect } from 'react';
import Script from 'next/script';

// Get Crisp website ID from environment variables
const CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || '';

// Check if the ID is valid (not empty and not the placeholder)
const isValidCrispId = CRISP_WEBSITE_ID && 
  CRISP_WEBSITE_ID !== '00000000-0000-0000-0000-000000000000';

export function CrispChat() {
  // Only initialize Crisp if we have a valid website ID
  useEffect(() => {
    if (isValidCrispId) {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;
    }
  }, []);

  // Don't render the script if we don't have a valid ID
  if (!isValidCrispId) {
    return null;
  }

  return (
    <Script
      id="crisp-chat"
      strategy="afterInteractive"
      src="https://client.crisp.chat/l.js"
    />
  );
}

// Type definitions
declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
  }
}