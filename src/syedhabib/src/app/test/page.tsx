'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-6">Test Page</h1>
      <p className="mb-4">This is a simple test page to check if Next.js is working correctly.</p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}