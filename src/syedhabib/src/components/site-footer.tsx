'use client';

import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setSubscribeStatus('loading');
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setSubscribeStatus('success');
        setEmail('');
      } else {
        setSubscribeStatus('error');
      }
    } catch {
      setSubscribeStatus('error');
    }
  };

  return (
    <footer className="border-t bg-background">
      <div className="container py-12 md:py-20 px-4">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Column 1: About */}
          <div>
            <h3 className="font-bold text-lg mb-4">Ahsan Habib Akik</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Digital marketing and web development services that deliver real results for your business.
            </p>
            <div className="flex items-center space-x-3">
              <Link
                href="https://github.com/ahsanhabibakik"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-muted p-2 hover:bg-muted/80 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://twitter.com/syedhabib"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-muted p-2 hover:bg-muted/80 transition-colors"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://linkedin.com/in/ahsanhabibakik"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-muted p-2 hover:bg-muted/80 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <nav className="grid grid-cols-2 gap-2">
              <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Services
              </Link>
              <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/schedule" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Schedule
              </Link>
            </nav>
          </div>
          
          {/* Column 3: Newsletter */}
          <div>
            <h3 className="font-bold text-lg mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get the latest tips and insights on digital marketing and web development.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-r-none"
                  disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                />
                <Button 
                  type="submit" 
                  className="rounded-l-none"
                  disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
                >
                  {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </div>
              {subscribeStatus === 'success' && (
                <p className="text-xs text-green-600">Thanks for subscribing!</p>
              )}
              {subscribeStatus === 'error' && (
                <p className="text-xs text-red-600">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-4 border-t border-b gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a href="mailto:ahabibakik@gmail.com" className="text-sm hover:underline">
              ahabibakik@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href="tel:+8801234567890" className="text-sm hover:underline">
              
+8801518926700
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Dhaka, Bangladesh</span>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Ahsan Habib Akik. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}