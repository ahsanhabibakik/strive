"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Check, X } from "lucide-react";
import { trackNewsletter } from "@/lib/analytics";

interface NewsletterProps {
  onSubscribe?: (email: string) => Promise<void>;
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  apiEndpoint?: string;
}

export const Newsletter = ({
  onSubscribe,
  className,
  title = "Subscribe to Newsletter",
  description = "Be the first to know about new products, special offers and healthy recipes.",
  buttonText = "Subscribe",
  apiEndpoint = "/api/newsletter/subscribe"
}: NewsletterProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus("error");
      setMessage("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    
    try {
      if (onSubscribe) {
        await onSubscribe(email);
        setStatus("success");
        setMessage("Successfully subscribed!");
        setEmail("");
        return;
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
        trackNewsletter("newsletter_form");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  const resetStatus = () => {
    setStatus("idle");
    setMessage("");
  };

  if (status === "success") {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
        <CardContent className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl mb-2">Thank you!</CardTitle>
          <p className="text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500 mb-4">
            You will receive updates about new products, offers and recipes.
          </p>
          <Button variant="outline" onClick={resetStatus} size="sm">
            Add another email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-green-50 to-emerald-50 border-green-100 ${className || ""}`}>
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl mb-2">
            {title}
          </CardTitle>
          <p className="text-gray-600 max-w-md mx-auto">
            {description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
                disabled={status === "loading"}
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-8 text-base font-semibold"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {buttonText}
                </>
              )}
            </Button>
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <X className="w-4 h-4" />
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            We do not share your email. You can unsubscribe at any time.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-green-600 font-bold text-lg mb-1">🆕</div>
            <p className="text-sm text-gray-600">New Products</p>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-bold text-lg mb-1">💰</div>
            <p className="text-sm text-gray-600">Special Deals</p>
          </div>
          <div className="text-center">
            <div className="text-green-600 font-bold text-lg mb-1">🍽️</div>
            <p className="text-sm text-gray-600">Healthy Recipes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};