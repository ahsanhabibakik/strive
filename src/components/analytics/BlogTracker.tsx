'use client';

import { useEffect } from 'react';
import { Analytics } from '@/lib/analytics/google-analytics';

interface BlogTrackerProps {
  title: string;
}

export function BlogTracker({ title }: BlogTrackerProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Analytics.trackBlogView(title);
    }
  }, [title]);

  return null;
}