"use client";

import { useState, useEffect } from "react";
import { Header } from "./Header";
import { LandingHero } from "./LandingHero";
import { OpportunitiesShowcase } from "./OpportunitiesShowcase";
import { FeaturesSection } from "./FeaturesSection";
import { StatsSection } from "./StatsSection";
import { Footer } from "@/components/layout/Footer";
import { ArrowUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 1000);

      // Track current section for fun effects
      const sections = ["hero", "opportunities", "features", "stats"];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section === "hero" ? "hero" : section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Easter egg: Konami code detection
  useEffect(() => {
    let konamiCode: number[] = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

    const handleKeyDown = (e: KeyboardEvent) => {
      konamiCode.push(e.keyCode);
      if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
      }

      if (
        konamiCode.length === konamiSequence.length &&
        konamiCode.every((code, index) => code === konamiSequence[index])
      ) {
        // Easter egg activated! Add some fun effects
        document.body.style.animation = "rainbow 2s infinite";
        setTimeout(() => {
          document.body.style.animation = "";
        }, 10000);

        // Show a fun message
        const message = document.createElement("div");
        message.innerHTML = "🎉 You found the secret! Welcome to the Strive family! 🎉";
        message.className =
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl animate-bounce text-xl font-bold";
        document.body.appendChild(message);

        setTimeout(() => {
          document.body.removeChild(message);
        }, 5000);

        konamiCode = [];
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* Rainbow animation styles for easter egg */}
      <style jsx global>{`
        @keyframes rainbow {
          0% {
            filter: hue-rotate(0deg);
          }
          25% {
            filter: hue-rotate(90deg);
          }
          50% {
            filter: hue-rotate(180deg);
          }
          75% {
            filter: hue-rotate(270deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }

        @keyframes cursor-glow {
          0% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
        }
      `}</style>

      {/* Custom cursor effect - only on desktop */}
      <div
        className="fixed w-6 h-6 pointer-events-none z-[9999] transition-all duration-300 ease-out hidden lg:block"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: currentSection === "features" ? "cursor-glow 2s infinite" : "none",
        }}
      />

      <div className="min-h-screen bg-white relative">
        <Header />
        <div id="hero">
          <LandingHero />
        </div>
        <OpportunitiesShowcase />
        <FeaturesSection />
        <StatsSection />
        <Footer />

        {/* Scroll to top button with delightful animation */}
        <Button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 z-50 transition-all duration-500 group",
            "bg-blue-600 hover:bg-blue-700",
            "hover:scale-110 hover:shadow-xl hover:shadow-blue-200",
            "rounded-full w-14 h-14 p-0",
            showScrollTop
              ? "opacity-100 translate-y-0 rotate-0"
              : "opacity-0 translate-y-10 rotate-180 pointer-events-none"
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-6 w-6 group-hover:animate-bounce" />
          <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" />
        </Button>

        {/* Fun floating elements based on current section */}
        {currentSection === "hero" && (
          <div
            className="fixed top-20 right-20 animate-bounce pointer-events-none z-10 hidden lg:block"
            style={{ animationDuration: "3s" }}
          >
            <Sparkles className="h-8 w-8 text-yellow-400 opacity-30" />
          </div>
        )}
      </div>
    </>
  );
}
