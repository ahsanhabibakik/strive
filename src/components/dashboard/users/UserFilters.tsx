'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface UserFiltersProps {
  searchParams: any;
}

export function UserFilters({ searchParams }: UserFiltersProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const handleSearch = (search: string) => {
    const params = new URLSearchParams(urlSearchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page
    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handleRoleFilter = (role: string) => {
    const params = new URLSearchParams(urlSearchParams);
    if (role && role !== 'all') {
      params.set('role', role);
    } else {
      params.delete('role');
    }
    params.set('page', '1'); // Reset to first page
    router.push(`/dashboard/users?${params.toString()}`);
  };

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(urlSearchParams);
    if (status && status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    params.set('page', '1'); // Reset to first page
    router.push(`/dashboard/users?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          defaultValue={searchParams.search || ''}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onChange={(e) => {
            const timeoutId = setTimeout(() => handleSearch(e.target.value), 300);
            return () => clearTimeout(timeoutId);
          }}
        />
      </div>

      {/* Role Filter */}
      <select
        defaultValue={searchParams.role || 'all'}
        onChange={(e) => handleRoleFilter(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="all">All Roles</option>
        <option value="admin">Administrators</option>
        <option value="moderator">Moderators</option>
        <option value="user">Users</option>
      </select>

      {/* Status Filter */}
      <select
        defaultValue={searchParams.status || 'all'}
        onChange={(e) => handleStatusFilter(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}