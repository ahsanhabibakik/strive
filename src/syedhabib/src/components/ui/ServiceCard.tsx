'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function ServiceCard({ title, description, icon: Icon, href }: ServiceCardProps) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-md transition-colors hover:bg-accent"
      >
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold leading-none tracking-tight">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <motion.div
          className="absolute inset-0 border-2 border-primary/50 rounded-lg"
          initial={false}
          whileHover={{ opacity: 1 }}
          animate={{ opacity: 0 }}
        />
      </motion.div>
    </Link>
  );
} 