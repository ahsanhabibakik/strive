"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Menu, X, Target, Search, BookOpen, Users, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const { data: session } = useSession();

  // Add scroll detection for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: "Opportunities", href: "#opportunities", icon: Search },
    { name: "Features", href: "#features", icon: Target },
    { name: "About", href: "#about", icon: BookOpen },
    { name: "Community", href: "#community", icon: Users },
  ];

  return (
    <header className={cn(
      "fixed top-0 w-full backdrop-blur-sm border-b z-50 transition-all duration-500 ease-out",
      scrolled 
        ? "bg-white/95 border-gray-200 shadow-lg" 
        : "bg-white/80 border-transparent"
    )}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-2 group"
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
            >
              <div className={cn(
                "bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg transition-all duration-300 relative",
                "group-hover:shadow-lg group-hover:shadow-blue-200 group-hover:scale-110"
              )}>
                <Target className={cn(
                  "h-6 w-6 text-white transition-all duration-300",
                  logoHovered && "rotate-180"
                )} />
                {logoHovered && (
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
                  </div>
                )}
              </div>
              <span className={cn(
                "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300",
                logoHovered && "tracking-wider"
              )}>
                Strive
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-all duration-300 relative py-2 px-3 rounded-lg hover:bg-gray-50"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">{item.name}</span>
                  {/* Playful hover indicator */}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300 rounded-full" />
                </a>
              );
            })})
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button 
                    variant="outline" 
                    className="hover:scale-105 transition-all duration-200 hover:shadow-md"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/opportunities/create">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 group">
                    <Trophy className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    Post Event
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button 
                    variant="outline" 
                    className="hover:scale-105 transition-all duration-200 hover:shadow-md hover:border-blue-300"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-200 hover:shadow-lg hover:shadow-blue-200 group relative overflow-hidden">
                    <span className="relative z-10">Get Started</span>
                    {/* Animated background shimmer */}
                    <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>
                </Link>
              </div>
            )})
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="hover:scale-110 transition-all duration-200 hover:bg-blue-50 relative"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 hover:rotate-180 transition-transform duration-300" />
              )}
              {/* Pulse indicator for interactivity */}
              <div className="absolute -inset-1 bg-blue-200 rounded-lg opacity-0 hover:opacity-20 transition-opacity duration-200" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-300 ease-out">
            <div className="flex flex-col space-y-4">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 px-3 py-2 rounded-md hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:scale-105 animate-in slide-in-from-left",
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationDuration: '400ms'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 hover:scale-110 transition-transform duration-200" />
                    <span className="hover:translate-x-1 transition-transform duration-200">{item.name}</span>
                  </a>
                );
              })})
              
              <div className="pt-4 border-t border-gray-200">
                {session ? (
                  <div className="flex flex-col space-y-2">
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                    <Link href="/opportunities/create" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">
                        <Trophy className="h-4 w-4 mr-2" />
                        Post Event
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}