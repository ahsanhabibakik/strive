'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSoundManager } from '@/lib/soundManager';

export function SoundToggle() {
  const { isEnabled, toggleSound, playButtonClick } = useSoundManager();

  const handleToggle = () => {
    if (isEnabled) {
      playButtonClick();
    }
    toggleSound();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="fixed bottom-4 right-4 z-50 h-10 w-10 p-0 rounded-full bg-background/80 backdrop-blur-sm border border-border/20 shadow-lg hover:shadow-xl transition-all duration-300"
      title={isEnabled ? 'Disable sounds' : 'Enable sounds'}
    >
      {isEnabled ? (
        <Volume2 className="h-4 w-4 text-primary" />
      ) : (
        <VolumeX className="h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}