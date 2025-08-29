import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Pricing } from '@/components/landing/Pricing';
import { Testimonials } from '@/components/landing/Testimonials';
import { FAQ } from '@/components/landing/FAQ';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';

export const metadata = {
  title: 'Strive - The Complete SaaS Starter Template',
  description: 'Build your next SaaS application with our production-ready starter template featuring authentication, billing, analytics, and more.',
  keywords: 'SaaS, starter template, Next.js, React, TypeScript, Stripe, authentication',
};

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect authenticated users to dashboard
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Features />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}