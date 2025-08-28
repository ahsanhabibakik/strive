"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const VercelAnalytics = () => {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
};