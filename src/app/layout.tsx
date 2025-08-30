import type { Metadata, Viewport } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { SkipLink } from "@/components/accessibility/SkipLink";
import { generateMetadata as generateSEOMetadata } from "@/lib/utils/seo";
import { AnalyticsProvider } from "@/lib/analytics";
import { CookieConsent } from "@/components/cookies/CookieConsent";
import { Navbar } from "@/components/layout/Navbar";

// const inter = Inter({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-inter",
// });

export const metadata: Metadata = generateSEOMetadata({
  title: "Strive - Achieve Your Goals",
  description:
    "A powerful platform to help you set, track, and achieve your personal and professional goals. Stay motivated and organized with our comprehensive goal management system.",
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
    "life goals",
  ],
  type: "website",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Font preloading handled by Next.js Google Fonts */}

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
      <body className="antialiased" suppressHydrationWarning>
        {/* Skip to main content for keyboard users */}
        <SkipLink />

        {/* Screen reader announcements */}
        <div id="announcement-region" aria-live="polite" aria-atomic="true" className="sr-only" />

        <AnalyticsProvider>
          <Providers>
            <Navbar />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </Providers>

          {/* Cookie Consent */}
          <CookieConsent />
        </AnalyticsProvider>

        {/* Accessibility styles are now in globals.css */}
      </body>
    </html>
  );
}
