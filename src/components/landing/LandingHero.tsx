"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowRight,
  Sparkles,
  Globe,
  Calendar,
  Trophy,
  Zap,
  Heart,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<{id: number, emoji: string, x: number, y: number}[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [statsAnimated, setStatsAnimated] = useState(false);
  const { data: session } = useSession();
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Trigger stats animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
        }
      },
      { threshold: 0.3 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => observer.disconnect();
  }, [statsAnimated]);

  // Fun floating emojis on category hover
  const addFloatingEmoji = (emoji: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const newEmoji = {
      id: Date.now(),
      emoji,
      x: rect.left + Math.random() * rect.width,
      y: rect.top + Math.random() * rect.height
    };
    
    setFloatingEmojis(prev => [...prev, newEmoji]);
    
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 2000);
  };

  // Typing indicator for search
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Scroll to opportunities section with search query
      const element = document.getElementById('opportunities');
      element?.scrollIntoView({ behavior: 'smooth' });
      // You can pass the search query to the opportunities component
    }
  };

  const categories = [
    { name: "Scholarships", count: "2,400+", color: "bg-blue-100 text-blue-800", emoji: "🎓", hoverColor: "hover:bg-blue-200" },
    { name: "Competitions", count: "1,800+", color: "bg-green-100 text-green-800", emoji: "🏆", hoverColor: "hover:bg-green-200" },
    { name: "Internships", count: "950+", color: "bg-purple-100 text-purple-800", emoji: "💼", hoverColor: "hover:bg-purple-200" },
    { name: "Conferences", count: "650+", color: "bg-orange-100 text-orange-800", emoji: "🎤", hoverColor: "hover:bg-orange-200" },
  ];

  return (
    <section ref={heroRef} className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16 overflow-hidden">
      {/* Floating Emojis */}
      {floatingEmojis.map((item) => (
        <div
          key={item.id}
          className="fixed text-2xl animate-bounce pointer-events-none z-10"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            animation: 'float-up 2s ease-out forwards'
          }}
        >
          {item.emoji}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }
      `}</style>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        {/* Floating sparkles */}
        <div className="absolute top-20 left-20 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}>
          <Star className="h-4 w-4 text-yellow-400 opacity-60" />
        </div>
        <div className="absolute top-40 right-32 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '4s'}}>
          <Sparkles className="h-6 w-6 text-blue-400 opacity-40" />
        </div>
        <div className="absolute bottom-32 left-1/3 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>
          <Heart className="h-3 w-3 text-pink-400 opacity-50" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main heading */}
          <div className="mb-8">
            <Badge variant="outline" className="mb-4 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 cursor-default group">
              <Sparkles className="h-3 w-3 mr-1 group-hover:text-yellow-500 group-hover:animate-spin transition-all duration-300" />
              Discover Your Next Opportunity
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="block animate-in slide-in-from-left duration-700 delay-100">Find Amazing</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-in slide-in-from-right duration-700 delay-300 hover:scale-105 transition-transform duration-300 cursor-default">
                Opportunities
              </span>
              <span className="block animate-in slide-in-from-left duration-700 delay-500">& Achieve Your Goals</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover scholarships, competitions, internships, and events from around the world. 
              Set goals, track your progress, and turn your aspirations into achievements.
            </p>
          </div>

          {/* Search bar */}
          <div className="mb-12 max-w-2xl mx-auto animate-in fade-in duration-1000 delay-700">
            <div className={cn(
              "flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-lg border transition-all duration-300",
              searchFocused 
                ? "border-blue-300 shadow-xl shadow-blue-100 scale-105" 
                : "border-gray-200 hover:shadow-xl hover:border-blue-200"
            )}>
              <div className="flex-1 relative">
                <Search className={cn(
                  "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-all duration-300",
                  searchFocused ? "text-blue-500 scale-110" : "text-gray-400"
                )} />
                {isTyping && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                    </div>
                  </div>
                )}
                <Input
                  type="text"
                  placeholder="Search for scholarships, competitions, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="pl-12 border-0 text-lg h-12 focus-visible:ring-0 pr-16"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleSearch}
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-200 hover:shadow-lg group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Search
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </div>
            {searchQuery && (
              <div className="text-center mt-2 text-sm text-gray-500 animate-in fade-in duration-300">
                <Zap className="inline h-3 w-3 mr-1" />
                Press Enter or click Search to explore!
              </div>
            )}
          </div>

          {/* Category badges */}
          <div className="mb-12 animate-in fade-in duration-1000 delay-1000">
            <p className="text-sm text-gray-500 mb-4 flex items-center justify-center gap-2">
              <Star className="h-3 w-3" />
              Popular categories:
              <Star className="h-3 w-3" />
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  href={`#opportunities?category=${category.name.toLowerCase()}`}
                  className="group"
                  style={{
                    animationDelay: `${1200 + index * 100}ms`
                  }}
                >
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      `${category.color} ${category.hoverColor} px-4 py-2 text-sm font-medium transition-all duration-300 cursor-pointer animate-in slide-in-from-bottom`,
                      "hover:scale-110 hover:shadow-lg hover:shadow-current/20 active:scale-95 group-hover:animate-pulse"
                    )}
                    onMouseEnter={(e) => addFloatingEmoji(category.emoji, e)}
                  >
                    <span className="mr-1">{category.emoji}</span>
                    {category.name}
                    <span className="ml-2 text-xs opacity-75 group-hover:opacity-100 transition-opacity duration-200">{category.count}</span>
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in duration-1000 delay-1400">
            {session ? (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 hover:scale-105 transition-all duration-300 hover:shadow-lg group">
                    <Target className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/opportunities/create">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 hover:scale-105 transition-all duration-300 hover:shadow-lg group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
                    <Trophy className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    Post an Event
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200 group relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      <Target className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                      Get Started Free
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Button>
                </Link>
                <Link href="#opportunities">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 hover:scale-105 transition-all duration-300 hover:shadow-lg group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300">
                    <Globe className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                    Explore Opportunities
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Trophy, value: "5,800+", label: "Active Events", color: "text-blue-600", delay: 0 },
              { icon: Users, value: "25K+", label: "Members", color: "text-purple-600", delay: 100 },
              { icon: Award, value: "$2.8M+", label: "Awards Won", color: "text-green-600", delay: 200 },
              { icon: Calendar, value: "180+", label: "Countries", color: "text-orange-600", delay: 300 }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className={cn(
                    "text-center group cursor-default",
                    statsAnimated && "animate-in slide-in-from-bottom duration-700"
                  )}
                  style={{
                    animationDelay: statsAnimated ? `${1600 + stat.delay}ms` : '0ms'
                  }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Icon className={cn(
                      "h-8 w-8 mr-2 transition-all duration-300",
                      stat.color,
                      "group-hover:scale-125 group-hover:rotate-12"
                    )} />
                    <span className="text-3xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">{stat.label}</p>
                  {/* Fun hover effect */}
                  <div className="w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-2 group-hover:w-full transition-all duration-300 rounded-full" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}