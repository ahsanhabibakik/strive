'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface CanonicalUrlProps {
  baseUrl?: string;
}

export default function CanonicalUrl({ baseUrl = 'https://syedhabib.com' }: CanonicalUrlProps) {
  const pathname = usePathname();
  const canonicalUrl = `${baseUrl}${pathname}`;

  return (
    <link rel="canonical" href={canonicalUrl} />
  );
}