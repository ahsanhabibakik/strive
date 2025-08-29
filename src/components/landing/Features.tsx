import { 
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  KeyIcon,
  UserGroupIcon,
  BellIcon,
  CogIcon,
  GlobeAltIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Authentication & Security',
    description: 'Complete authentication system with NextAuth.js, email verification, password reset, and two-factor authentication.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Subscription & Billing',
    description: 'Stripe integration with multiple pricing tiers, subscription management, and billing portal.',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Beautiful charts and metrics to track user engagement, revenue, and key business metrics.',
    icon: ChartBarIcon,
  },
  {
    name: 'API Key Management',
    description: 'Generate and manage API keys with fine-grained permissions and usage tracking.',
    icon: KeyIcon,
  },
  {
    name: 'User Management',
    description: 'Role-based access control (RBAC) with admin panels for user and permission management.',
    icon: UserGroupIcon,
  },
  {
    name: 'Notification System',
    description: 'Email notifications, in-app alerts, and customizable notification preferences.',
    icon: BellIcon,
  },
  {
    name: 'Admin Settings',
    description: 'System configuration, maintenance mode, feature toggles, and security settings.',
    icon: CogIcon,
  },
  {
    name: 'Modern Tech Stack',
    description: 'Built with Next.js 15, TypeScript, Tailwind CSS v4, MongoDB, and deployed on Vercel.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Production Ready',
    description: 'Error tracking with Sentry, email service with Resend, and comprehensive monitoring.',
    icon: ServerIcon,
  },
];

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything Included</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Production-ready features out of the box
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Skip months of development time with our comprehensive starter template. 
            All the essential features you need to launch your SaaS application.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}