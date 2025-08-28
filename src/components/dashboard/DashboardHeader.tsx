'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { 
  BellIcon, 
  UserIcon, 
  CogIcon, 
  ArrowRightOnRectangleIcon,
  KeyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IUser } from '@/lib/models/User';
import { RBAC } from '@/lib/rbac';

interface DashboardHeaderProps {
  user: IUser;
}

const userNavigation = [
  { name: 'Your Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
];

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const userRole = RBAC.getUserRole(user);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              id="search-field"
              className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:ring-indigo-600 sm:text-sm"
              placeholder="Search..."
              type="search"
              name="search"
            />
          </div>
        </form>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Quick Stats */}
          {RBAC.hasPermission(user, 'analytics:read') && (
            <Link
              href="/dashboard/analytics"
              className="hidden sm:flex items-center gap-x-2 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              <ChartBarIcon className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
          )}

          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5 hover:bg-gray-50 rounded-lg">
              <span className="sr-only">Open user menu</span>
              <div className="flex items-center gap-x-3">
                {user.image ? (
                  <img
                    className="h-8 w-8 rounded-full bg-gray-50"
                    src={user.image}
                    alt={user.name || 'User'}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="hidden lg:flex lg:flex-col lg:items-start">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userRole?.name || user.role}
                  </p>
                </div>
              </div>
            </Menu.Button>
            
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-64 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                      userRole?.name === 'admin' 
                        ? "bg-red-50 text-red-700 ring-red-600/10"
                        : userRole?.name === 'moderator'
                        ? "bg-yellow-50 text-yellow-700 ring-yellow-600/10" 
                        : "bg-blue-50 text-blue-700 ring-blue-600/10"
                    )}>
                      {userRole?.name || user.role}
                    </span>
                    {user.subscriptionPlan !== 'free' && (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {user.subscriptionPlan}
                      </span>
                    )}
                  </div>
                </div>

                {/* Navigation items */}
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <Link
                        href={item.href}
                        className={cn(
                          active ? 'bg-gray-50' : '',
                          'flex items-center gap-x-3 px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        <item.icon className="h-5 w-5 text-gray-400" />
                        {item.name}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
                
                <div className="border-t border-gray-100 mt-2 pt-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={cn(
                          active ? 'bg-gray-50' : '',
                          'flex w-full items-center gap-x-3 px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  );
}