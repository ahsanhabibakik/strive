"use client";

import { useState, useEffect, useRef } from "react";
import {
  TrendingUp,
  Users,
  Trophy,
  Globe,
  Calendar,
  Award,
  Target,
  Sparkles,
  DollarSign,
  Heart,
  Star,
  Zap,
  Rocket,
  PartyPopper,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({});
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Custom hook for number animation
  const animateValue = (start: number, end: number, duration: number, key: string) => {
    const startTimestamp = Date.now();
    const step = () => {
      const now = Date.now();
      const progress = Math.min((now - startTimestamp) / duration, 1);

      // Easing function for smooth animation
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(start + (end - start) * easeOutExpo);

      setAnimatedValues(prev => ({ ...prev, [key]: current }));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Trigger confetti when first stat completes
        if (key === "opportunities" && !hasAnimated.current) {
          setConfettiTrigger(true);
          setTimeout(() => setConfettiTrigger(false), 3000);
          hasAnimated.current = true;
        }
      }
    };
    requestAnimationFrame(step);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Start animations with staggered delays
          setTimeout(() => animateValue(0, 5800, 2000, "opportunities"), 500);
          setTimeout(() => animateValue(0, 25000, 2500, "members"), 800);
          setTimeout(() => animateValue(0, 2800000, 2800, "awards"), 1100);
          setTimeout(() => animateValue(0, 180, 1500, "countries"), 1400);
          setTimeout(() => animateValue(0, 1200, 1800, "events"), 1700);
          setTimeout(() => animateValue(0, 15000, 2200, "goals"), 2000);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  // Format number with commas and suffixes
  const formatValue = (value: number, suffix: string = "") => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M${suffix}`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K${suffix}`;
    }
    return `${value}${suffix}`;
  };

  const stats = [
    {
      icon: Trophy,
      value: formatValue(animatedValues.opportunities || 0, "+"),
      staticValue: "5,800+",
      label: "Active Opportunities",
      description: "Live events, competitions, and scholarships",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      hoverBg: "hover:bg-blue-200",
      emoji: "🏆",
      animationKey: "opportunities",
    },
    {
      icon: Users,
      value: formatValue(animatedValues.members || 0, "+"),
      staticValue: "25,000+",
      label: "Active Members",
      description: "Students and professionals achieving goals",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      hoverBg: "hover:bg-blue-200",
      emoji: "👥",
      animationKey: "members",
    },
    {
      icon: DollarSign,
      value: animatedValues.awards ? formatValue(animatedValues.awards) : "$0",
      staticValue: "$2.8M+",
      label: "Total Awards Won",
      description: "Scholarships and prizes won by our community",
      color: "text-green-600",
      bgColor: "bg-green-100",
      hoverBg: "hover:bg-green-200",
      emoji: "💰",
      animationKey: "awards",
    },
    {
      icon: Globe,
      value: `${animatedValues.countries || 0}+`,
      staticValue: "180+",
      label: "Countries",
      description: "Global opportunities from around the world",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      hoverBg: "hover:bg-blue-200",
      emoji: "🌍",
      animationKey: "countries",
    },
    {
      icon: Calendar,
      value: formatValue(animatedValues.events || 0, "+"),
      staticValue: "1,200+",
      label: "Events This Month",
      description: "New opportunities added monthly",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      hoverBg: "hover:bg-blue-200",
      emoji: "📅",
      animationKey: "events",
    },
    {
      icon: Target,
      value: formatValue(animatedValues.goals || 0, "+"),
      staticValue: "15,000+",
      label: "Goals Achieved",
      description: "Personal and professional goals completed",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      hoverBg: "hover:bg-blue-200",
      emoji: "🎯",
      animationKey: "goals",
    },
  ];

  const achievements = [
    {
      title: "Top Platform for Opportunities",
      description: "Rated #1 by students worldwide",
      year: "2024",
    },
    {
      title: "Excellence in Education Technology",
      description: "EdTech Innovation Award Winner",
      year: "2023",
    },
    {
      title: "Best Student Resource Platform",
      description: "University Partnership Award",
      year: "2023",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="stats"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
    >
      {/* Confetti Effect */}
      {confettiTrigger && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <PartyPopper className="h-6 w-6 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-pulse" style={{ animationDelay: "0s" }}>
          <Star className="h-8 w-8 text-blue-300 opacity-20" />
        </div>
        <div
          className="absolute top-40 right-20 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "4s" }}
        >
          <Heart className="h-6 w-6 text-pink-300 opacity-30" />
        </div>
        <div className="absolute bottom-40 left-1/4 animate-pulse" style={{ animationDelay: "1s" }}>
          <Zap className="h-10 w-10 text-yellow-300 opacity-25" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 relative z-10">
          <Badge
            variant="outline"
            className="mb-4 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-300 cursor-default group"
          >
            <Sparkles className="h-3 w-3 mr-1 group-hover:text-yellow-500 group-hover:animate-spin transition-all duration-300" />
            Our Impact
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="inline-block animate-in slide-in-from-left duration-700">
              Trusted by{" "}
            </span>
            <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent animate-in slide-in-from-right duration-700 delay-200 hover:scale-105 transition-transform duration-300 cursor-default">
              Thousands
            </span>
            <span className="inline-block animate-in slide-in-from-left duration-700 delay-400">
              {" "}
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-in fade-in duration-1000 delay-600">
            Join a thriving community of goal-achievers who are discovering opportunities and
            turning their dreams into reality.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const hasValue = animatedValues[stat.animationKey] > 0;
            return (
              <div
                key={index}
                className={cn(
                  `bg-white rounded-2xl p-8 shadow-sm border group cursor-default transition-all duration-500`,
                  `hover:shadow-xl hover:scale-105 ${stat.hoverBg}`,
                  isVisible
                    ? "animate-in slide-in-from-bottom duration-700"
                    : "opacity-0 translate-y-10"
                )}
                style={{
                  animationDelay: isVisible ? `${800 + index * 150}ms` : "0ms",
                }}
              >
                <div
                  className={cn(
                    `${stat.bgColor} rounded-2xl p-4 w-fit mb-6 transition-all duration-300 relative`,
                    "group-hover:scale-125 group-hover:shadow-lg group-hover:rotate-3"
                  )}
                >
                  <Icon
                    className={cn(
                      `h-8 w-8 ${stat.color} transition-all duration-300`,
                      hasValue && "group-hover:scale-110"
                    )}
                  />
                  {/* Emoji overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center text-2xl transition-all duration-300",
                      hasValue ? "opacity-100 scale-110 animate-pulse" : "opacity-0"
                    )}
                  >
                    {stat.emoji}
                  </div>
                </div>

                <div className="mb-4">
                  <div
                    className={cn(
                      "text-4xl font-bold mb-2 transition-all duration-500",
                      hasValue
                        ? "text-transparent bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text scale-110"
                        : "text-gray-900"
                    )}
                  >
                    {isVisible ? stat.value : "0"}
                    {hasValue && confettiTrigger && index === 0 && (
                      <span className="ml-2 animate-bounce text-yellow-500">✨</span>
                    )}
                  </div>
                  <div className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-blue-700 group-hover:bg-clip-text transition-all duration-300">
                    {stat.label}
                  </div>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {stat.description}
                  </p>
                  {/* Fun hover bar */}
                  <div className="w-0 h-1 bg-blue-600 mt-4 group-hover:w-full transition-all duration-500 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Award className="h-8 w-8 text-yellow-500" />
              Recognition & Awards
            </h3>
            <p className="text-gray-600">
              Our commitment to excellence has been recognized by leading organizations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100"
              >
                <div className="bg-yellow-100 rounded-full p-3 w-fit mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                  {achievement.year}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-gray-600 mb-4">
            <TrendingUp className="h-5 w-5" />
            <span>Join the growing community</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Be part of something bigger</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every day, more people discover life-changing opportunities and achieve their goals with
            Strive. Your success story could be next.
          </p>
        </div>
      </div>
    </section>
  );
}
