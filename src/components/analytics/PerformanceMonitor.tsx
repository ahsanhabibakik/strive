"use client";

import { useEffect } from "react";
import { measurePerformance, trackPerformance } from "@/lib/analytics";

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Initial performance measurement
    measurePerformance();

    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });

      try {
        clsObserver.observe({ type: "layout-shift", buffered: true });
      } catch (e) {
        // Layout shift not supported
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackPerformance("FID", (entry as any).processingStart - entry.startTime, window.location.pathname);
        }
      });

      try {
        fidObserver.observe({ type: "first-input", buffered: true });
      } catch (e) {
        // First input not supported
      }

      // Cleanup on component unmount
      return () => {
        clsObserver.disconnect();
        fidObserver.disconnect();
        
        // Report final CLS value
        if (clsValue > 0) {
          trackPerformance("CLS", clsValue * 1000, window.location.pathname); // Convert to ms
        }
      };
    }
  }, []);

  return null; // This component doesn't render anything
};