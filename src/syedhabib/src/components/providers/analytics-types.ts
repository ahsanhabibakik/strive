// Type definitions for analytics tools

// Hotjar
declare global {
  interface Window {
    hj?: (command: string, eventName: string, eventData?: Record<string, unknown>) => void;
    clarity?: (command: string, eventName: string, eventData?: Record<string, unknown>) => void;
  }
}

export {};