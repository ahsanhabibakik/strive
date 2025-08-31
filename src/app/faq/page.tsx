"use client";

// import { Metadata } from 'next' // Not needed in client components
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Note: For better SEO, consider making this a server component and moving the accordion logic to a separate client component

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is Strive and how does it work?",
        answer:
          "Strive is a goal achievement platform that helps you set, track, and accomplish your personal and professional objectives. It works by breaking down your goals into manageable milestones, providing progress tracking tools, and connecting you with a supportive community.",
      },
      {
        question: "How do I create my first goal?",
        answer:
          'To create your first goal, sign up for an account and navigate to the Goals section. Click "Create New Goal" and follow our guided setup process that helps you define SMART goals with specific milestones and deadlines.',
      },
      {
        question: "Is Strive free to use?",
        answer:
          "Strive offers both free and premium plans. The free plan includes basic goal tracking and community features. Premium plans offer advanced analytics, unlimited goals, priority support, and additional collaboration tools.",
      },
      {
        question: "Can I use Strive on my mobile device?",
        answer:
          "Yes! Strive is fully responsive and works great on mobile devices through your web browser. We also have dedicated mobile apps for iOS and Android coming soon.",
      },
    ],
  },
  {
    category: "Goal Management",
    questions: [
      {
        question: "How many goals can I track at once?",
        answer:
          "Free users can track up to 5 active goals simultaneously. Premium users have unlimited goals. We recommend focusing on 3-5 goals at a time for optimal results and focus.",
      },
      {
        question: "Can I share my goals with others?",
        answer:
          "Absolutely! You can share your goals with friends, family, or accountability partners. You can control privacy settings for each goal - make them public, private, or share with specific people.",
      },
      {
        question: "What happens if I miss a milestone?",
        answer:
          "Missing a milestone isn't the end of the world! Strive helps you analyze what went wrong and adjust your approach. You can reschedule milestones, break them into smaller steps, or seek support from the community.",
      },
      {
        question: "Can I edit or delete goals after creating them?",
        answer:
          "Yes, you can edit goal details, milestones, and deadlines at any time. You can also archive completed goals or delete goals you no longer want to pursue. Your progress history is always preserved.",
      },
    ],
  },
  {
    category: "Progress Tracking",
    questions: [
      {
        question: "How do I track my progress?",
        answer:
          "Strive offers multiple ways to track progress: check-ins for milestones, progress bars, streak counters, photo uploads, notes, and quantitative measurements. Choose the method that works best for each goal.",
      },
      {
        question: "Can I see my progress over time?",
        answer:
          "Yes! Your dashboard includes visual charts and graphs showing your progress over time, completion rates, streaks, and patterns. Premium users get access to detailed analytics and insights.",
      },
      {
        question: "What are streaks and how do they work?",
        answer:
          "Streaks track consecutive days of progress toward your goals. They're great for building habits and maintaining momentum. You can customize what counts as streak-worthy activity for each goal.",
      },
      {
        question: "Can I export my progress data?",
        answer:
          "Premium users can export their progress data in various formats (CSV, PDF) for personal records or sharing with coaches, mentors, or healthcare providers.",
      },
    ],
  },
  {
    category: "Community & Collaboration",
    questions: [
      {
        question: "How does the community feature work?",
        answer:
          "Our community connects you with people pursuing similar goals. You can join groups, share updates, ask for advice, celebrate achievements, and find accountability partners.",
      },
      {
        question: "Can I find an accountability partner?",
        answer:
          "Yes! Use our matching system to find accountability partners based on similar goals, interests, or experience levels. You can also invite friends to be your accountability partners.",
      },
      {
        question: "Is my information private?",
        answer:
          "Your privacy is important to us. You control what information is shared publicly. By default, your goals are private, and you can choose what to share with the community or specific people.",
      },
      {
        question: "Can teams use Strive together?",
        answer:
          "Absolutely! Teams can create shared goals, track collective progress, and collaborate on projects. This feature is available in our Team and Enterprise plans.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "I forgot my password. How do I reset it?",
        answer:
          "Click the \"Forgot Password\" link on the login page, enter your email address, and we'll send you a reset link. If you don't receive the email within a few minutes, check your spam folder.",
      },
      {
        question: "How do I change my email address?",
        answer:
          "Go to your Account Settings and update your email address in the Profile section. You'll need to verify the new email address before the change takes effect.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can delete your account anytime from the Account Settings page. Please note that this action is irreversible and will permanently delete all your data.",
      },
      {
        question: "I'm having trouble with a feature. How do I get help?",
        answer:
          "You can contact our support team through the Contact page, use the in-app help chat, or visit our Support Center for guides and tutorials. We typically respond within 24 hours.",
      },
    ],
  },
  {
    category: "Billing & Subscriptions",
    questions: [
      {
        question: "How much does Strive cost?",
        answer:
          "Strive offers a free plan with basic features. Premium plans start at $9.99/month or $99/year (save 17%). Team and Enterprise plans are also available with custom pricing.",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "Yes, you can cancel your subscription anytime from your Account Settings. Your premium features will remain active until the end of your billing period.",
      },
      {
        question: "Do you offer refunds?",
        answer:
          "We offer a 30-day money-back guarantee for premium subscriptions. If you're not satisfied within the first 30 days, contact support for a full refund.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. All payments are processed securely through Stripe.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const toggleAccordion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredData = faqData
    .map(category => ({
      ...category,
      questions: category.questions.filter(
        q =>
          (selectedCategory === "all" || category.category === selectedCategory) &&
          (searchQuery === "" ||
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    }))
    .filter(category => category.questions.length > 0);

  const categories = ["all", ...faqData.map(cat => cat.category)];

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600">
          Find answers to common questions about Strive and goal achievement
        </p>
      </section>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline-solid"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      {filteredData.length > 0 ? (
        <div className="space-y-8">
          {filteredData.map((category, categoryIndex) => (
            <section key={category.category}>
              <h2 className="text-2xl font-bold mb-6 text-primary">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const isOpen = openAccordions[`${categoryIndex}-${questionIndex}`];
                  return (
                    <div key={questionIndex} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => toggleAccordion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-inset"
                      >
                        <h3 className="font-semibold text-gray-900 pr-4">{faq.question}</h3>
                        <svg
                          className={`w-5 h-5 text-gray-500 transform transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.005-5.709-2.709M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching questions found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or browse all categories
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Contact CTA */}
      <section className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-6">
          Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
        </p>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/support">Visit Help Center</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
