"use client";

import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";
import { useState } from "react";

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      {/* Floating CTA Button - Mobile Only */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
        className="fixed bottom-4 right-4 hidden z-50"
      >
        <Button
          asChild
          size="lg"
          className="rounded-full h-14 w-14 p-0 overflow-hidden hover:shadow-xl transition-all duration-300 primary text-primary-foreground"
        >
          <Link href="/contact">
            <MessageCircle className="h-6 w-6" />
          </Link>
        </Button>
      </motion.div>

      {/* Close Button for Floating CTA */}
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsVisible(false)}
          className="fixed bottom-20 right-4 z-50 lg:hidden bg-muted hover:bg-muted/80 rounded-full h-8 w-8 p-0 shadow-md transition-all duration-300"
        >
          <X className="h-4 w-4" />
        </motion.button>
      )}
    </>
  );
} 