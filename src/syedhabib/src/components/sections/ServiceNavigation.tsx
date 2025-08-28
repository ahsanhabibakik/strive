'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface ServiceLink {
  name: string;
  href: string;
}

export function ServiceNavigation() {
  const pathname = usePathname();
  
  const serviceLinks: ServiceLink[] = [
    { name: 'All Services', href: '/services' },
    { name: 'Website Development', href: '/services/website-development' },
    { name: 'Digital Marketing', href: '/services/digital-marketing' },
  ];
  
  return (
    <div className="bg-muted/30 py-3 mb-8">
      <div className="container px-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {serviceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}