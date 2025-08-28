'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Home,
  Info,
  LayoutGrid,
  Palette,
  Phone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const routes = [
  {
    path: '/',
    name: 'Home',
    icon: Home,
    description: 'Welcome to my portfolio',
  },
  {
    path: '/about',
    name: 'About',
    icon: Info,
    description: 'Learn more about me and my companies',
  },
  {
    path: '/projects',
    name: 'Projects',
    icon: Briefcase,
    description: 'View my professional work',
  },
  {
    path: '/services',
    name: 'Services',
    icon: LayoutGrid,
    description: 'Explore my professional services',
  },
  {
    path: '/designs',
    name: 'Designs',
    icon: Palette,
    description: 'Browse my Canva designs',
  },
  {
    path: '/contact',
    name: 'Contact',
    icon: Phone,
    description: 'Get in touch with me',
  },
]

export function SiteNav() {
  return (
    <nav className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {routes.map((route, index) => (
        <Link
          key={route.path}
          href={route.path}
          className="group relative"
        >
          <div
            className={cn(
              'group flex items-start gap-4 rounded-lg border p-4',
              'bg-background hover:bg-accent transition-colors',
              'hover:shadow-lg'
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                display: 'flex',
                width: '100%',
                gap: '1rem'
              }}
            >
              <div className="rounded-lg border p-2 group-hover:border-primary">
                <route.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold leading-none tracking-tight">
                  {route.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {route.description}
                </p>
              </div>
            </motion.div>
          </div>
        </Link>
      ))}
    </nav>
  )
} 