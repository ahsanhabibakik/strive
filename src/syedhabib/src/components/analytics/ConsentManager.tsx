'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ConsentManagerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentManager({ onAccept, onDecline }: ConsentManagerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    if (typeof window !== 'undefined') {
      const hasConsent = localStorage.getItem('cookie-consent');
      
      if (hasConsent === null) {
        // Only show if no choice has been made
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      } else if (hasConsent === 'accepted') {
        // If consent was previously given, trigger the accept handler
        onAccept();
      }
    }
  }, [onAccept]);

  const handleAccept = () => {
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    setIsVisible(false);
    onDecline();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="max-w-2xl mx-auto p-4 md:p-6 shadow-lg border-primary/20 bg-background/95 backdrop-blur-sm">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Cookie Consent</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleDecline}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          This website uses cookies to enhance your browsing experience, analyze site traffic, 
          and personalize content. By clicking "Accept", you consent to our use of cookies as 
          described in our Cookie Policy.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDecline}
          >
            Decline
          </Button>
          <Button 
            size="sm" 
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </Card>
    </div>
  );
}