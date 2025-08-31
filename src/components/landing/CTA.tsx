import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <div className="bg-[#E53935]">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to build your SaaS?
            <br />
            Start with Strive today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-red-200">
            Join thousands of developers who have saved months of development time with our
            production-ready starter template.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="bg-white text-[#E53935] hover:bg-gray-50 focus-visible:outline-white px-8 py-3"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 px-8 py-3"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-16">
            <p className="text-red-200 text-sm mb-8">Trusted by developers worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-white font-semibold">
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm">Downloads</div>
              </div>
              <div className="text-white font-semibold">
                <div className="text-2xl font-bold">99%</div>
                <div className="text-sm">Satisfaction</div>
              </div>
              <div className="text-white font-semibold">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
