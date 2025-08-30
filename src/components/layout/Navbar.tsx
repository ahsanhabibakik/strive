"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  MagnifyingGlassIcon as SearchIcon,
  Bars3Icon as MenuIcon,
  XMarkIcon as XIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navigationLinks = [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Support", href: "/support" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              Strive
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              {navigationLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </form>

            {/* Auth Section */}
            {session ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">
                  Dashboard
                </Link>
                <span className="text-sm text-gray-600">
                  {session.user?.name || session.user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative mb-3">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </form>

              {/* Mobile Navigation Links */}
              {navigationLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {session ? (
                  <div className="space-y-2">
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="px-3 py-2">
                      <span className="text-sm text-gray-600">
                        {session.user?.name || session.user?.email}
                      </span>
                    </div>
                    <div className="px-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
