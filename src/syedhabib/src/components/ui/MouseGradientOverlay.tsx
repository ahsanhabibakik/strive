'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface MousePosition {
  x: number;
  y: number;
}

export function MouseGradientOverlay() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const rafRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsMoving(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 150);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleMouseMove]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-pink-900/10" />
      
      {/* Large gradient orb following mouse */}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, rgba(236,72,153,0.2) 50%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          filter: 'blur(40px)',
        }}
        animate={{
          scale: isMoving ? 1.2 : 0.8,
          opacity: isMoving ? 0.3 : 0.15,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Secondary gradient orb */}
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(168,85,247,0.2) 50%, transparent 70%)',
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          filter: 'blur(30px)',
        }}
        animate={{
          scale: isMoving ? 1.1 : 0.9,
          opacity: isMoving ? 0.25 : 0.1,
        }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      />
      
      {/* Small cursor follower */}
      <motion.div
        className="absolute w-32 h-32 rounded-full opacity-25"
        style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.4) 0%, rgba(59,130,246,0.3) 50%, transparent 70%)',
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          filter: 'blur(20px)',
        }}
        animate={{
          scale: isMoving ? 1.3 : 1,
          opacity: isMoving ? 0.4 : 0.2,
        }}
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
      />
      
      {/* Ambient gradient overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(ellipse 80% 50% at ${(mousePosition.x / window.innerWidth) * 100}% ${(mousePosition.y / window.innerHeight) * 100}%, rgba(147,51,234,0.3) 0%, transparent 50%)`,
        }}
      />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}

// Optimized version for better performance
export function MouseGradientOverlayOptimized() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isEnabled, setIsEnabled] = useState(true);
  const rafRef = useRef<number>();
  const lastUpdateTime = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isEnabled) return;
    
    const now = Date.now();
    if (now - lastUpdateTime.current < 32) return; // Throttle to ~30fps for better performance
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      lastUpdateTime.current = now;
    });
  }, [isEnabled]);

  useEffect(() => {
    // Disable on mobile devices
    const isMobile = window.innerWidth < 768;
    setIsEnabled(!isMobile);
    
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    
    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleMouseMove]);

  if (!isEnabled) {
    return (
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-background to-pink-900/3 dark:from-purple-900/5 dark:to-pink-900/5" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Static base layer with theme support */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/2 via-background to-pink-900/2 dark:from-purple-900/5 dark:via-black dark:to-pink-900/5" />
      
      {/* Single optimized gradient following mouse */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 dark:opacity-40 will-change-transform transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, rgba(236,72,153,0.04) 40%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
          filter: 'blur(40px)',
          transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
        }}
      />
    </div>
  );
}