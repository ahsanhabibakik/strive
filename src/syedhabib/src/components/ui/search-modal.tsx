'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from './button';

interface SearchResult {
  title: string;
  description: string;
  href: string;
  type: 'page' | 'project' | 'service';
}

const searchData: SearchResult[] = [
  // Pages
  { title: 'Home', description: 'Welcome to my digital portfolio', href: '/', type: 'page' },
  { title: 'About', description: 'Learn more about my journey and skills', href: '/about', type: 'page' },
  { title: 'Services', description: 'Technologies and skills I work with', href: '/services', type: 'page' },
  { title: 'Projects', description: 'Explore my digital projects and work', href: '/projects', type: 'page' },
  { title: 'Contact', description: 'Get in touch for collaboration', href: '/contact', type: 'page' },
  { title: 'Blog', description: 'Read my thoughts and experiences', href: '/blog', type: 'page' },
  
  // Projects
  { title: 'Rupomoti', description: 'Premium jewelry and fashion business', href: '/projects/rupomoti', type: 'project' },
  { title: 'Qalbbox', description: 'Thoughtful gifting platform', href: '/projects/qalbbox', type: 'project' },
  { title: 'Ebrikkho', description: 'Eco-friendly plant selling platform', href: '/projects/ebrikkho', type: 'project' },
  
  // Services/Skills
  { title: 'Web Development', description: 'MERN Stack development and responsive websites', href: '/services', type: 'service' },
  { title: 'Digital Marketing', description: 'Facebook advertising and social media management', href: '/services', type: 'service' },
  { title: 'UI/UX Design', description: 'User interface design and brand assets', href: '/services', type: 'service' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filteredResults = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filteredResults.slice(0, 6)); // Limit to 6 results
  }, [query]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleResultClick = () => {
    setQuery('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-background border rounded-lg shadow-xl w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="flex items-center border-b p-4">
            <Search className="w-5 h-5 text-muted-foreground mr-3" />
            <input
              type="text"
              placeholder="Search for pages, projects, or services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim() === '' ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Search my website</p>
                <p className="text-sm">Find pages, projects, services, and more...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-lg font-medium mb-2">No results found</p>
                <p className="text-sm">Try searching for something else</p>
              </div>
            ) : (
              <div className="p-2">
                {results.map((result, index) => (
                  <Link
                    key={`${result.href}-${index}`}
                    href={result.href}
                    onClick={handleResultClick}
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{result.title}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                            {result.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search Footer */}
          <div className="border-t p-3 text-xs text-muted-foreground text-center">
            Press <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> to close
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
