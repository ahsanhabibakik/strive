'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Instagram, 
  Mail, 
  MessageCircle,
  FileText,
  Calendar
} from 'lucide-react';

const contactOptions = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    description: 'Chat with me directly',
    href: 'https://wa.me/8801518926700',
    color: 'bg-green-500 hover:bg-green-600',
    priority: true
  },
  {
    icon: Facebook,
    label: 'Facebook',
    description: 'Connect on Facebook',
    href: 'https://facebook.com/syedmirhabib',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    icon: Instagram,
    label: 'Instagram',
    description: 'Follow on Instagram',
    href: 'https://instagram.com/ahsanhabibakik',
    color: 'bg-pink-500 hover:bg-pink-600'
  },
  {
    icon: Calendar,
    label: 'Schedule a Call',
    description: 'Book a consultation',
    href: '/schedule',
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    icon: Mail,
    label: 'Email',
    description: 'Send me an email',
    href: 'mailto:ahabibakik@gmail.com',
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    icon: FileText,
    label: 'Project Brief',
    description: 'Submit project details',
    href: '/brief',
    color: 'bg-orange-500 hover:bg-orange-600'
  }
];

export default function ContactOptions() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
      {contactOptions.map((option, index) => (
        <motion.div
          key={option.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={option.priority ? 'col-span-1 sm:col-span-2' : ''}
        >
          <Button
            asChild
            variant="default"
            className={`w-full h-auto py-3 px-4 ${option.color} transition-transform active:scale-95`}
          >
            <Link
              href={option.href}
              target={option.href.startsWith('http') ? '_blank' : undefined}
              rel={option.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-3 sm:gap-4"
            >
              <div className="p-1.5 sm:p-2 bg-white/10 rounded-lg flex-shrink-0">
                <option.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-white text-sm sm:text-base">{option.label}</h3>
                <p className="text-xs sm:text-sm text-white/80">{option.description}</p>
              </div>
            </Link>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}