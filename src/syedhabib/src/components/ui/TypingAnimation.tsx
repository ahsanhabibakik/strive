'use client';

import { useState, useEffect } from 'react';
import { useSoundManager } from '@/lib/soundManager';

interface TypingAnimationProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  enableSound?: boolean;
}

export function TypingAnimation({ 
  text, 
  delay = 50, 
  className = '', 
  onComplete,
  enableSound = true 
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { playTyping } = useSoundManager();

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        
        // Play typing sound for visible characters (not spaces)
        if (enableSound && text[currentIndex] !== ' ') {
          playTyping();
        }
      }, delay);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete, enableSound, playTyping]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}