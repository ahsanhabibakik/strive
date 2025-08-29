import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Help & Support - Strive',
  description: 'Get help and support for Strive - guides, tutorials, and resources for goal achievement.',
}

export default function SupportPage() {
  const supportCategories = [
    {
      title: 'Getting Started',
      description: 'New to Strive? Learn the basics and get up to speed quickly.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      articles: [
        'Creating your first goal',
        'Setting up your profile',
        'Understanding the dashboard',
        'Mobile app setup guide'
      ]
    },
    {
      title: 'Goal Management',
      description: 'Master the art of setting and managing your goals effectively.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      articles: [
        'SMART goal framework',
        'Breaking down large goals',
        'Setting realistic deadlines',
        'Milestone planning strategies'
      ]
    },
    {
      title: 'Progress Tracking',
      description: 'Learn different ways to track and measure your progress.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      articles: [
        'Using progress bars effectively',
        'Building consistent habits',
        'Photo progress tracking',
        'Understanding analytics'
      ]
    },
    {
      title: 'Community Features',
      description: 'Connect with others and leverage community support.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      articles: [
        'Finding accountability partners',
        'Joining goal-focused groups',
        'Sharing progress updates',
        'Community guidelines'
      ]
    },
    {
      title: 'Account & Billing',
      description: 'Manage your account settings and subscription details.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      articles: [
        'Updating profile information',
        'Subscription management',
        'Privacy settings',
        'Data export options'
      ]
    },
    {
      title: 'Troubleshooting',
      description: 'Solve common technical issues and problems.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.768 0L3.05 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      articles: [
        'Login and password issues',
        'Sync problems across devices',
        'Performance optimization',
        'Browser compatibility'
      ]
    }
  ]

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get personalized help from our support team',
      href: '/contact',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: 'FAQ',
      description: 'Find answers to frequently asked questions',
      href: '/faq',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15a2 2 0 002-2V9a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293L10.293 4.293A1 1 0 009.586 4H8a2 2 0 00-2 2v5a2 2 0 002 2z" />
        </svg>
      )
    }
  ]

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help & Support Center</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Everything you need to know to make the most of Strive and achieve your goals
        </p>
      </section>

      {/* Quick Actions */}
      <section className="mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Help Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Browse Help Topics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {supportCategories.map((category, index) => (
            <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center text-primary">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.articles.map((article, articleIndex) => (
                  <li key={articleIndex}>
                    <a
                      href="#"
                      className="text-sm text-gray-700 hover:text-primary hover:underline flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t">
                <a
                  href="#"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  View all {category.title.toLowerCase()} articles →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Status and Updates */}
      <section className="mb-16">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-green-800">System Status</h3>
          </div>
          <p className="text-green-700">
            All systems are operational. Last updated: {new Date().toLocaleString()}
          </p>
          <a href="#" className="text-sm text-green-600 hover:underline mt-2 inline-block">
            View detailed status →
          </a>
        </div>
      </section>

      {/* Popular Resources */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Popular Resources</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Goal Setting Masterclass</h3>
            <p className="text-blue-700 mb-4">
              A comprehensive guide to setting and achieving any goal using proven strategies and frameworks.
            </p>
            <Button variant="outline" size="sm">
              Start Learning
            </Button>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Community Best Practices</h3>
            <p className="text-purple-700 mb-4">
              Learn how to effectively use community features to accelerate your goal achievement.
            </p>
            <Button variant="outline" size="sm">
              Read Guide
            </Button>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Progress Tracking Tips</h3>
            <p className="text-orange-700 mb-4">
              Discover advanced techniques for tracking progress and staying motivated throughout your journey.
            </p>
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </div>
          
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-teal-800 mb-2">Productivity Integration</h3>
            <p className="text-teal-700 mb-4">
              Connect Strive with your favorite productivity tools and apps for a seamless workflow.
            </p>
            <Button variant="outline" size="sm">
              View Integrations
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Our support team is here to help you succeed. Whether you have a technical question 
          or need guidance on achieving your goals, we&apos;re just a message away.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <a href="mailto:support@strive-app.com">Email Us</a>
          </Button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Average response time: 4 hours • Available 24/7
        </p>
      </section>
    </div>
  )
}