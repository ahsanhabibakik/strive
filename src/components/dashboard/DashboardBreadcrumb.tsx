"use client";

import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  name: string;
  href: string;
  current: boolean;
}

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  users: "Users",
  content: "Content",
  "api-keys": "API Keys",
  billing: "Billing",
  system: "System Health",
  activity: "Activity Log",
  notifications: "Notifications",
  settings: "Settings",
  profile: "Profile",
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const isLast = index === pathSegments.length - 1;

    return {
      name: routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      href,
      current: isLast,
    };
  });

  // Don't show breadcrumb on dashboard root
  if (pathname === "/dashboard") {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-500 transition-colors">
              <HomeIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>

        {breadcrumbs.map(item => (
          <li key={item.href}>
            <div className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-300" aria-hidden="true" />
              {item.current ? (
                <span className="ml-4 text-sm font-medium text-gray-500">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
