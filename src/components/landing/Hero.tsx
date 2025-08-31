import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  RocketLaunchIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export function Hero() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Achieve Your Goals
            <span className="text-[#E53935]"> Together</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            A powerful platform to help you set, track, and achieve your personal and professional
            goals. Stay motivated and organized with our comprehensive goal management system.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/auth/signin">
              <Button size="lg" className="px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8 py-3">
                View Features
              </Button>
            </Link>
          </div>

          {/* Key Features Preview */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-white/5 p-4 text-center">
              <RocketLaunchIcon className="mx-auto h-8 w-8 text-[#E53935]" />
              <p className="mt-2 text-sm font-semibold text-gray-900">Goal Setting</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4 text-center">
              <ChartBarIcon className="mx-auto h-8 w-8 text-[#2196F3]" />
              <p className="mt-2 text-sm font-semibold text-gray-900">Progress Tracking</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4 text-center">
              <ShieldCheckIcon className="mx-auto h-8 w-8 text-[#FF7043]" />
              <p className="mt-2 text-sm font-semibold text-gray-900">Team Accountability</p>
            </div>
            <div className="rounded-lg bg-white/5 p-4 text-center">
              <CurrencyDollarIcon className="mx-auto h-8 w-8 text-[#E53935]" />
              <p className="mt-2 text-sm font-semibold text-gray-900">Achievement Rewards</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </div>
  );
}
