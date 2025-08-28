'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

function LoginButtons({ callbackUrl }: { callbackUrl: string | null }) {
  return (
    <div className="grid gap-2">
      <Button variant="outline" asChild>
        <a
          href={`/api/auth/signin/github${
            callbackUrl ? `?callbackUrl=${callbackUrl}` : ''
          }`}
          className="w-full"
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          Continue with GitHub
        </a>
      </Button>
      <Button variant="outline" asChild>
        <a
          href={`/api/auth/signin/google${
            callbackUrl ? `?callbackUrl=${callbackUrl}` : ''
          }`}
          className="w-full"
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Continue with Google
        </a>
      </Button>
    </div>
  );
}

export function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <div className="grid gap-6">
      <LoginButtons callbackUrl={callbackUrl} />
    </div>
  );
} 