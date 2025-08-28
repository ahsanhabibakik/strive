'use client';

import { Fragment, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CogIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  DatabaseIcon,
  BarChart3Icon,
  SettingsIcon,
  ActivityIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { IUser } from '@/lib/models/User';
import { RBAC } from '@/lib/rbac';
import Link from 'next/link';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  current?: boolean;
  permission?: string;
  badge?: string | number;
}

interface DashboardSidebarProps {
  user: IUser;
}

const navigationItems: NavigationItem[] = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartPieIcon, permission: 'analytics:read' },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon, permission: 'users:read' },
  { name: 'Content', href: '/dashboard/content', icon: DocumentDuplicateIcon, permission: 'content:read' },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: KeyIcon, permission: 'api-keys:read' },
  { name: 'Billing', href: '/dashboard/billing', icon: CalendarIcon, permission: 'billing:read' },
  { name: 'System Health', href: '/dashboard/system', icon: DatabaseIcon, permission: 'system:admin' },
  { name: 'Activity', href: '/dashboard/activity', icon: ActivityIcon },
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, permission: 'settings:read' },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Filter navigation items based on user permissions
  const filteredNavigation = navigationItems.filter(item => {
    if (!item.permission) return true;
    return RBAC.hasPermission(user, item.permission);
  });

  // Add current state to navigation items
  const navigation = filteredNavigation.map(item => ({
    ...item,
    current: pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
  }));

  const userRole = RBAC.getUserRole(user);

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                <SidebarContent navigation={navigation} user={user} userRole={userRole} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <SidebarContent navigation={navigation} user={user} userRole={userRole} />
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">Dashboard</div>
      </div>
    </>
  );
}

function SidebarContent({ 
  navigation, 
  user, 
  userRole 
}: { 
  navigation: NavigationItem[]; 
  user: IUser;
  userRole: any;
}) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg">
      <div className="flex h-16 shrink-0 items-center">
        <h1 className="text-2xl font-bold text-indigo-600">Strive</h1>
      </div>
      
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      item.current
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50',
                      'group flex gap-x-3 rounded-l-md p-2 text-sm leading-6 font-medium transition-colors'
                    )}
                  >
                    <item.icon
                      className={cn(
                        item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-600',
                        'h-6 w-6 shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          
          <li className="mt-auto">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {userRole?.name || user.role}
                    {user.subscriptionPlan !== 'free' && (
                      <span className="ml-1 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {user.subscriptionPlan}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}