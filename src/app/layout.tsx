import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { SkipLink } from "@/components/accessibility/SkipLink";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { GoogleAnalytics } from "@/lib/analytics/google-analytics";
import { CookieConsent } from "@/components/cookies/CookieConsent";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

export const metadata: Metadata = generateSEOMetadata({
  title: "Strive - Achieve Your Goals",
  description: "A powerful platform to help you set, track, and achieve your personal and professional goals. Stay motivated and organized with our comprehensive goal management system.",
  keywords: [
    "goal tracking", 
    "productivity", 
    "achievement", 
    "personal development",
    "goal setting",
    "progress tracking",
    "motivation",
    "success planning",
    "habit formation",
    "life goals"
  ],
  type: "website"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* DNS prefetching for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* PWA support */}
        <meta name="application-name" content="Strive" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Strive" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Accessibility enhancements */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body 
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        {/* Skip to main content for keyboard users */}
        <SkipLink />
        
        {/* Screen reader announcements */}
        <div id="announcement-region" aria-live="polite" aria-atomic="true" className="sr-only" />
        
        <Providers>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </Providers>
        
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        {/* Cookie Consent */}
        <CookieConsent />
        
        {/* High contrast mode styles */}
        <style jsx global>{`
          @media (prefers-contrast: high) {
            * {
              outline: 2px solid transparent;
            }
            *:focus {
              outline: 3px solid currentColor !important;
              outline-offset: 2px;
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
              scroll-behavior: auto !important;
            }
          }
          
          /* Screen reader only class */
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
          
          /* High contrast theme variables */
          @media (prefers-contrast: high) {
            :root {
              --color-bg: Canvas;
              --color-text: CanvasText;
              --color-border: CanvasText;
              --color-link: LinkText;
              --color-button-bg: ButtonFace;
              --color-button-text: ButtonText;
            }
          }
        `}</style>
      </body>
    </html>
  );
}