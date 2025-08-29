import { Metadata } from "next";
import { AnalyticsExample } from "@/components/examples/AnalyticsExample";

export const metadata: Metadata = {
  title: "Analytics Demo - Strive",
  description: "Test and demonstration page for all integrated analytics tools",
  robots: {
    index: false, // Don't index demo pages
    follow: false,
  },
};

export default function AnalyticsDemoPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Analytics Integration Demo</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            This page demonstrates all the analytics tools integrated into Strive: Microsoft
            Clarity, Hotjar, PostHog, Mixpanel, and Facebook Pixel.
          </p>
        </div>

        <AnalyticsExample />

        <div className="text-center text-sm text-muted-foreground max-w-3xl">
          <p>
            <strong>Note:</strong> This is a development/testing page. In production, analytics
            tracking happens automatically across your application based on user interactions, page
            views, and goal-related actions.
          </p>
        </div>
      </div>
    </div>
  );
}
