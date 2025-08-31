import Image from "next/image";

const testimonials = [
  {
    body: "Strive saved us months of development time. The authentication system and Stripe integration worked perfectly out of the box. We launched our SaaS in just 2 weeks!",
    author: {
      name: "Sarah Chen",
      handle: "sarahchen",
      role: "Founder",
      company: "TechFlow",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108755-2616b612e951?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "The code quality is exceptional. Everything is well-documented and follows best practices. The RBAC system and admin panel are exactly what we needed.",
    author: {
      name: "Michael Rodriguez",
      handle: "mrodriguez",
      role: "CTO",
      company: "DataSync Pro",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "As a solo developer, Strive gave me superpowers. The analytics dashboard and notification system helped me build a professional-grade application without a team.",
    author: {
      name: "Emily Johnson",
      handle: "emilyjohnson",
      role: "Solo Developer",
      company: "Indie Maker",
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "The deployment was seamless. Everything worked perfectly on Vercel, and the monitoring setup with Sentry caught issues before our users did. Excellent developer experience.",
    author: {
      name: "David Park",
      handle: "davidpark",
      role: "Lead Developer",
      company: "CloudVision",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "The billing system integration saved us weeks of Stripe development. Customer portal, webhooks, subscription management - everything works flawlessly.",
    author: {
      name: "Lisa Wang",
      handle: "lisawang",
      role: "Product Manager",
      company: "GrowthLab",
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "The TypeScript setup and component architecture is top-notch. Our team was productive from day one, and the codebase scales beautifully as we add features.",
    author: {
      name: "James Miller",
      handle: "jamesmiller",
      role: "Senior Engineer",
      company: "DevTools Inc",
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export function Testimonials() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-[#E53935]">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by developers and startups worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div key={columnGroupIdx} className="space-y-8 xl:contents xl:space-y-0">
              {[columnGroup].map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={`space-y-8 ${
                    columnGroupIdx === 0 && columnIdx === 0 ? "xl:row-span-2" : "xl:row-start-1"
                  }`}
                >
                  <figure className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5">
                    <blockquote className="text-gray-900">
                      <p>"{column.body}"</p>
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-x-4">
                      <Image
                        className="h-10 w-10 rounded-full bg-gray-50"
                        src={column.author.imageUrl}
                        alt={column.author.name}
                        width={40}
                        height={40}
                      />
                      <div>
                        <div className="font-semibold">{column.author.name}</div>
                        <div className="text-gray-600">
                          {column.author.role} at {column.author.company}
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
