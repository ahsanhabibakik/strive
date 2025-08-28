"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

interface NewsletterSubscribeProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: "default" | "compact" | "inline";
}

export function NewsletterSubscribe({
  title = "Subscribe to Our Newsletter",
  description = "Get the latest insights and tips delivered to your inbox.",
  className = "",
  variant = "default",
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");

    try {
      // Use the Mailchimp API endpoint
      const response = await fetch("/api/subscribe-mailchimp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing!");
        setEmail("");

        // Track the subscription event
        if (typeof window !== "undefined" && window.dataLayer) {
          window.dataLayer.push({
            event: "newsletter_subscription",
            email_domain: email.split("@")[1],
          });
        }
      } else {
        throw new Error(data.message || "Subscription failed");
      }
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  if (variant === "compact") {
    return (
      <Card className={`p-4 bg-muted/30 ${className}`}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="text-sm font-medium">{title}</h3>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9"
              disabled={status === "loading" || status === "success"}
            />
            <Button
              type="submit"
              size="sm"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
          {status === "success" && (
            <p className="text-xs flex items-center text-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              {message}
            </p>
          )}
          {status === "error" && (
            <p className="text-xs flex items-center text-red-600">
              <AlertCircle className="w-3 h-3 mr-1" />
              {message}
            </p>
          )}
        </form>
      </Card>
    );
  }

  if (variant === "inline") {
    return (
      <div className={className}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-grow">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={status === "loading" || status === "success"}
            />
          </div>
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
        {status === "success" && (
          <p className="mt-2 text-sm flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            {message}
          </p>
        )}
        {status === "error" && (
          <p className="mt-2 text-sm flex items-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {message}
          </p>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <Card className={`p-6 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={status === "loading" || status === "success"}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe Now"}
        </Button>

        {status === "success" && (
          <p className="text-sm flex items-center justify-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            {message}
          </p>
        )}

        {status === "error" && (
          <p className="text-sm flex items-center justify-center text-red-600">
            <AlertCircle className="w-4 h-4 mr-1" />
            {message}
          </p>
        )}

        <p className="text-xs text-center text-muted-foreground">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </Card>
  );
}
