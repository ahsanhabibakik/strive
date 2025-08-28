'use client';

import { Howl } from 'howler';
import { useState, useEffect, useCallback } from 'react';

// Simple sound manager for web interactions
class SoundManager {
  private sounds: Map<string, Howl> = new Map();
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeSounds();
      this.loadUserPreferences();
    }
  }

  private initializeSounds() {
    // Create simple beep sounds using data URIs
    const hoverSound = new Howl({
      src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGi89+STGQx/m+P0umEgBCuAzvLciTUIG2m99+STGQx+m+P0umEgBC2AzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBC2AzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBQ=='],
      volume: 0.2,
      preload: false
    });

    const clickSound = new Howl({
      src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGi89+STGQx/m+P0umEgBCuAzvLciTUIG2m99+STGQx+m+P0umEgBC2AzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBC2AzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBSyAzvLbizUIGWq+9+STGwx8m+P0uWEgBQ=='],
      volume: 0.3,
      preload: false
    });

    this.sounds.set('hover', hoverSound);
    this.sounds.set('click', clickSound);
    this.sounds.set('magic', clickSound); // Reuse click sound for magic
    this.sounds.set('typing', hoverSound); // Reuse hover sound for typing
  }

  private loadUserPreferences() {
    const saved = localStorage.getItem('soundEnabled');
    if (saved !== null) {
      this.isEnabled = JSON.parse(saved);
    }
  }

  private saveUserPreferences() {
    localStorage.setItem('soundEnabled', JSON.stringify(this.isEnabled));
  }

  public enable() {
    this.isEnabled = true;
    this.saveUserPreferences();
  }

  public disable() {
    this.isEnabled = false;
    this.saveUserPreferences();
  }

  public toggle() {
    this.isEnabled = !this.isEnabled;
    this.saveUserPreferences();
  }

  public isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  public play(soundType: string) {
    if (!this.isEnabled) return;
    
    const sound = this.sounds.get(soundType);
    if (sound) {
      try {
        sound.play();
      } catch {
        // Silently fail if audio context is not ready
      }
    }
  }

  // Convenience methods
  public playButtonHover() { this.play('hover'); }
  public playButtonClick() { this.play('click'); }
  public playCardHover() { this.play('hover'); }
  public playWhoosh() { this.play('click'); }
  public playMagic() { this.play('magic'); }
  public playTyping() { this.play('typing'); }
}

// Global instance
let soundManagerInstance: SoundManager | null = null;

function getSoundManager(): SoundManager {
  if (!soundManagerInstance && typeof window !== 'undefined') {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance || new SoundManager();
}

// React hook for using sound manager
export function useSoundManager() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const manager = getSoundManager();
    setIsEnabled(manager.isAudioEnabled());
  }, []);

  const toggleSound = useCallback(() => {
    const manager = getSoundManager();
    manager.toggle();
    setIsEnabled(manager.isAudioEnabled());
  }, []);

  const manager = getSoundManager();

  return {
    isEnabled,
    toggleSound,
    playButtonHover: manager.playButtonHover.bind(manager),
    playButtonClick: manager.playButtonClick.bind(manager),
    playCardHover: manager.playCardHover.bind(manager),
    playWhoosh: manager.playWhoosh.bind(manager),
    playMagic: manager.playMagic.bind(manager),
    playTyping: manager.playTyping.bind(manager),
  };
}