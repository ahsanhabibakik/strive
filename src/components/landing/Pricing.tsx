import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@heroicons/react/24/outline";
import { SUBSCRIPTION_PLANS } from "@/lib/stripe/config";

const tiers = [
  {
    ...SUBSCRIPTION_PLANS.free,
    featured: false,
    cta: "Get Started",
    href: "/auth/signin",
  },
  {
    ...SUBSCRIPTION_PLANS.pro,
    featured: true,
    cta: "Start Free Trial",
    href: "/auth/signin",
  },
  {
    ...SUBSCRIPTION_PLANS.enterprise,
    featured: false,
    cta: "Contact Sales",
    href: "/contact",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function Pricing() {
  return (
    <div className="bg-white py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-[#E53935]">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the right plan for&nbsp;you
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Start free and scale as you grow. All plans include core features with different usage
          limits.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map(tier => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured ? "lg:z-10 lg:rounded-b-none" : "lg:mt-8",
                tier.featured ? "ring-2 ring-[#E53935]" : "ring-1 ring-gray-200",
                "rounded-3xl p-8 xl:p-10"
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  className={classNames(
                    tier.featured ? "text-[#E53935]" : "text-gray-900",
                    "text-lg font-semibold leading-8"
                  )}
                >
                  {tier.name}
                </h3>
                {tier.featured ? (
                  <p className="rounded-full bg-[#E53935]/10 px-2.5 py-1 text-xs font-semibold leading-5 text-[#E53935]">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  ${tier.price}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-600">
                  {tier.price > 0 ? `/${tier.interval}` : ""}
                </span>
              </p>
              <Link href={tier.href}>
                <Button
                  className={classNames(
                    tier.featured
                      ? "bg-[#E53935] text-white shadow-xs hover:bg-[#D32F2F]"
                      : "text-[#E53935] ring-1 ring-inset ring-red-200 hover:ring-red-300",
                    "mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E53935]"
                  )}
                  variant={tier.featured ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </Link>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                {tier.features.map(feature => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon className="h-6 w-5 flex-none text-[#E53935]" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
