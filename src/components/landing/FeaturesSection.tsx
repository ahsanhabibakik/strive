"use client";

import { useState, useRef, useEffect } from "react";
import {
  Target,
  Search,
  TrendingUp,
  Users,
  Bell,
  Shield,
  Calendar,
  BookOpen,
  Award,
  Globe,
  Sparkles,
  ArrowRight,
  Zap,
  Heart,
  Star,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function FeaturesSection() {
  const [visibleCards, setVisibleCards] = useState(new Set<number>());
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setVisibleCards(prev => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-index]");
    cards?.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const mainFeatures = [
    {
      icon: Search,
      title: "Discover Opportunities",
      description:
        "Find scholarships, competitions, internships, and events from around the world with our powerful search and filtering system.",
      color: "text-[#2196F3]",
      bgColor: "bg-blue-100",
      hoverBg: "group-hover:bg-blue-200",
      badge: "Popular",
      badgeColor: "bg-[#2196F3]",
      emoji: "🔍",
      hoverEmoji: "✨",
    },
    {
      icon: Target,
      title: "Set & Track Goals",
      description:
        "Create SMART goals, track your progress, and stay motivated with our comprehensive goal management system.",
      color: "text-[#E53935]",
      bgColor: "bg-red-100",
      hoverBg: "group-hover:bg-red-200",
      badge: "New",
      badgeColor: "bg-[#E53935]",
      emoji: "🎯",
      hoverEmoji: "🚀",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description:
        "Get detailed analytics on your applications, success rates, and progress towards your personal and professional goals.",
      color: "text-[#FF7043]",
      bgColor: "bg-orange-100",
      hoverBg: "group-hover:bg-orange-200",
      badge: "Pro",
      badgeColor: "bg-[#FF7043]",
      emoji: "📊",
      hoverEmoji: "💡",
    },
  ];

  const additionalFeatures = [
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Never miss a deadline with personalized notifications for applications and goal milestones.",
      emoji: "🔔",
      color: "text-yellow-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work with teams, share goals, and collaborate on applications with built-in team features.",
      emoji: "👥",
      color: "text-blue-600",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security and privacy controls.",
      emoji: "🛡️",
      color: "text-green-600",
    },
    {
      icon: Calendar,
      title: "Deadline Management",
      description: "Keep track of all your important dates with our integrated calendar system.",
      emoji: "📅",
      color: "text-purple-600",
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description:
        "Access guides, templates, and resources to improve your applications and goal setting.",
      emoji: "📚",
      color: "text-orange-600",
    },
    {
      icon: Globe,
      title: "Global Community",
      description:
        "Connect with like-minded individuals from around the world pursuing similar goals.",
      emoji: "🌍",
      color: "text-indigo-600",
    },
  ];

  return (
    <section ref={sectionRef} id="features" className="py-20 bg-white relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "4s" }}
        >
          <Star className="h-6 w-6 text-blue-300 opacity-20" />
        </div>
        <div
          className="absolute top-40 right-20 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        >
          <Heart className="h-4 w-4 text-pink-300 opacity-30" />
        </div>
        <div
          className="absolute bottom-40 left-1/4 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "3s" }}
        >
          <Zap className="h-5 w-5 text-yellow-300 opacity-25" />
        </div>
        <div
          className="absolute bottom-20 right-1/3 animate-bounce"
          style={{ animationDelay: "3s", animationDuration: "4s" }}
        >
          <Rocket className="h-7 w-7 text-purple-300 opacity-20" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <Badge
            variant="outline"
            className="mb-4 hover:bg-white hover:scale-105 transition-all duration-300 cursor-default group"
          >
            <Sparkles className="h-3 w-3 mr-1 group-hover:text-yellow-500 group-hover:animate-spin transition-all duration-300" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block animate-in slide-in-from-left duration-700">
              Everything You Need to{" "}
            </span>
            <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-in slide-in-from-right duration-700 delay-200 hover:scale-105 transition-transform duration-300 cursor-default">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-in fade-in duration-1000 delay-400">
            From opportunity discovery to goal achievement, we provide all the tools you need to
            turn your aspirations into reality.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleCards.has(index);
            const isHovered = hoveredCard === index;
            return (
              <Card
                key={index}
                data-index={index}
                className={cn(
                  "relative overflow-hidden group transition-all duration-500 cursor-pointer",
                  "hover:shadow-xl hover:shadow-blue-100 hover:-translate-y-2",
                  isVisible
                    ? "animate-in slide-in-from-bottom duration-700"
                    : "opacity-0 translate-y-10"
                )}
                style={{ animationDelay: isVisible ? `${index * 200}ms` : "0ms" }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardContent className="p-8 relative">
                  {feature.badge && (
                    <Badge
                      className={cn(
                        `absolute top-4 right-4 text-white transition-all duration-300`,
                        feature.badgeColor,
                        "group-hover:scale-110 group-hover:rotate-3"
                      )}
                    >
                      {feature.badge}
                    </Badge>
                  )}

                  <div
                    className={cn(
                      `${feature.bgColor} ${feature.hoverBg} rounded-2xl p-4 w-fit mb-6 transition-all duration-300 relative`,
                      "group-hover:scale-110 group-hover:shadow-lg"
                    )}
                  >
                    <Icon
                      className={cn(
                        `h-8 w-8 ${feature.color} transition-all duration-300`,
                        "group-hover:scale-110",
                        isHovered && "animate-bounce"
                      )}
                    />
                    {/* Fun emoji overlay on hover */}
                    <div
                      className={cn(
                        "absolute inset-0 flex items-center justify-center text-2xl transition-all duration-300",
                        isHovered ? "opacity-100 scale-110" : "opacity-0 scale-50"
                      )}
                    >
                      {isHovered ? feature.hoverEmoji : feature.emoji}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>

                  <Button
                    variant="ghost"
                    className="p-0 h-auto text-sm group-hover:translate-x-2 transition-all duration-300 group-hover:text-blue-600"
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>

                  {/* Hover glow effect */}
                  <div
                    className={cn(
                      "absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur opacity-0 transition-opacity duration-300",
                      isHovered && "opacity-100"
                    )}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {additionalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const cardIndex = index + 3; // Offset for main features
            const isVisible = visibleCards.has(cardIndex);
            return (
              <div
                key={index}
                data-index={cardIndex}
                className={cn(
                  "group cursor-default transition-all duration-500",
                  isVisible
                    ? "animate-in slide-in-from-bottom duration-700"
                    : "opacity-0 translate-y-10"
                )}
                style={{ animationDelay: isVisible ? `${(cardIndex - 3) * 100 + 600}ms` : "0ms" }}
              >
                <div className="flex items-start space-x-4 p-6 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border hover:border-blue-200">
                  <div className="bg-gray-100 rounded-lg p-3 group-hover:bg-white group-hover:shadow-md transition-all duration-300 relative group-hover:scale-110">
                    <Icon
                      className={cn(
                        "h-6 w-6 text-gray-600 transition-all duration-300",
                        `group-hover:${feature.color} group-hover:scale-110`
                      )}
                    />
                    {/* Emoji overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125">
                      {feature.emoji}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                    {/* Fun hover indicator */}
                    <div className="w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mt-3 group-hover:w-full transition-all duration-500 rounded-full" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden group">
          {/* Animated background effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 animate-pulse">
              <Star className="h-8 w-8" />
            </div>
            <div className="absolute top-8 right-8 animate-bounce" style={{ animationDelay: "1s" }}>
              <Heart className="h-6 w-6" />
            </div>
            <div
              className="absolute bottom-8 left-12 animate-pulse"
              style={{ animationDelay: "2s" }}
            >
              <Zap className="h-10 w-10" />
            </div>
            <div
              className="absolute bottom-4 right-16 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              <Sparkles className="h-7 w-7" />
            </div>
          </div>

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="relative mb-6">
              <Award className="h-16 w-16 mx-auto opacity-90 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
              {/* Magic sparkle effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-8 w-8 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-all duration-500" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300">
              Ready to Start Your Journey?
            </h3>
            <p className="text-xl mb-8 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
              Join thousands of successful individuals who are using Strive to discover
              opportunities and achieve their goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto px-8 hover:scale-105 transition-all duration-300 hover:shadow-xl group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    <Target className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                    Get Started Free
                  </span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </Button>
              </Link>
              <Link href="#opportunities">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-8 border-white/20 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 hover:shadow-xl group"
                >
                  <Search className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
