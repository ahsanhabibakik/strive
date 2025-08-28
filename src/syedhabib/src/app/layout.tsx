import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { QuickContactButton } from '@/components/ui/QuickContactModal'
import { SoundToggle } from '@/components/ui/SoundToggle'
import { AnalyticsProvider } from '@/components/providers/analytics-provider'
// Import SEO components individually to avoid path confusion with seo.tsx file
import OrganizationSchema from '@/components/seo/OrganizationSchema'
import LocalBusinessSchema from '@/components/seo/LocalBusinessSchema'
import LogoSchema from '@/components/seo/LogoSchema'
import WebsiteSchema from '@/components/seo/WebsiteSchema'
import PersonSchema from '@/components/seo/PersonSchema'
import { GoogleTagManager } from '@/components/seo/GoogleTagManager'

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true,
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Custom Web Development & Software Solutions | Professional Web Developer',
    template: '%s | Custom Web Development & Software Solutions'
  },
  description: 'Professional web developer specializing in custom websites, web applications, and e-commerce solutions. Expert in React, Next.js, Node.js, and modern web technologies.',
  keywords: [
    'Web Development', 
    'Custom Websites', 
    'E-commerce Solutions', 
    'Web Applications', 
    'React Development', 
    'Next.js Developer', 
    'Node.js', 
    'Full-Stack Developer', 
    'Responsive Design', 
    'Website Development'
  ],
  authors: [{ name: 'Ahsan Habib Akik' }],
  creator: 'Ahsan Habib Akik',
  publisher: 'Custom Web Development & Software Solutions',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  alternates: {
    canonical: 'https://syedhabib.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://syedhabib.com',
    title: 'Custom Web Development & Software Solutions | Professional Web Developer',
    description: 'Professional web developer specializing in custom websites, web applications, and e-commerce solutions. Expert in React, Next.js, Node.js, and modern web technologies.',
    siteName: 'Custom Web Development & Software Solutions',
    images: [
      {
        url: 'https://syedhabib.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Custom Web Development & Software Solutions',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom Web Development & Software Solutions | Professional Web Developer',
    description: 'Professional web developer specializing in custom websites, web applications, and e-commerce solutions. Expert in React, Next.js, Node.js, and modern web technologies.',
    creator: '@ahsanhabibakik',
    images: ['https://syedhabib.com/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
    yandex: 'yandex-verification-code', // Replace with actual verification code
    other: {
      'msvalidate.01': 'bing-verification-code', // Replace with actual Bing verification code
    }
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AnalyticsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
              <QuickContactButton />
              <SoundToggle />
            </div>
            {/* Structured Data for SEO */}
            <OrganizationSchema />
            <LocalBusinessSchema />
            <WebsiteSchema />
            <LogoSchema />
            <PersonSchema />
            <GoogleTagManager />
          </ThemeProvider>
          <Toaster />
        </AnalyticsProvider>
      </body>
    </html>
  )
}
