"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import { IUser } from "@/lib/models/User";
import { RBAC } from "@/lib/rbac";

interface UsersTableProps {
  users: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  currentUser: IUser;
  searchParams: any;
}

const roleColors = {
  admin: "bg-red-50 text-red-700 ring-red-600/20",
  moderator: "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  user: "bg-blue-50 text-blue-700 ring-blue-600/20",
};

const statusColors = {
  active: "bg-green-50 text-green-700 ring-green-600/20",
  inactive: "bg-gray-50 text-gray-700 ring-gray-600/20",
};

export function UsersTable({
  users,
  pagination,
  currentUser,
  searchParams: _searchParams,
}: UsersTableProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const canEdit = RBAC.hasPermission(currentUser, "users:write");
  const canDelete = RBAC.hasPermission(currentUser, "users:delete");
  const canViewDetails = RBAC.hasPermission(currentUser, "users:read");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return ShieldCheckIcon;
      case "moderator":
        return ShieldExclamationIcon;
      default:
        return UserIcon;
    }
  };

  return (
    <div className="bg-white shadow-xs rounded-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Users ({pagination.total})</h3>

          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{selectedUsers.length} selected</span>
              <div className="flex gap-1">
                <button className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button className="p-2 text-red-400 hover:text-red-500 rounded-md hover:bg-red-50">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  checked={users.length > 0 && selectedUsers.length === users.length}
                  onChange={e => handleSelectAll(e.target.checked)}
                />
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Subscription
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Joined
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Last Active
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => {
              const RoleIcon = getRoleIcon(user.role);
              const isSelected = selectedUsers.includes(user._id);

              return (
                <tr key={user._id} className={cn("hover:bg-gray-50", isSelected && "bg-indigo-50")}>
                  <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      value={user._id}
                      checked={isSelected}
                      onChange={e => handleSelectUser(user._id, e.target.checked)}
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.image ? (
                          <Image
                            className="h-10 w-10 rounded-full"
                            src={user.image}
                            alt={user.name}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-700">
                              {user.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <RoleIcon className="h-4 w-4 text-gray-400" />
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                          roleColors[user.role as keyof typeof roleColors]
                        )}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                        statusColors[user.isActive ? "active" : "inactive"]
                      )}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={cn(
                        "capitalize",
                        user.subscription?.plan === "free"
                          ? "text-gray-500"
                          : "text-indigo-600 font-medium"
                      )}
                    >
                      {user.subscription?.plan || "free"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : "Never"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                        <span className="sr-only">Open options</span>
                        <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
                      </Menu.Button>

                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow ring-3 ring-black ring-opacity-5 focus:outline-hidden">
                        <div className="py-1">
                          {canViewDetails && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href={`/dashboard/users/${user._id}`}
                                  className={cn(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "flex items-center gap-3 px-4 py-2 text-sm"
                                  )}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                  View Details
                                </Link>
                              )}
                            </Menu.Item>
                          )}

                          {canEdit && RBAC.canModifyUser(currentUser, user) && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href={`/dashboard/users/${user._id}/edit`}
                                  className={cn(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "flex items-center gap-3 px-4 py-2 text-sm"
                                  )}
                                >
                                  <PencilIcon className="h-4 w-4" />
                                  Edit User
                                </Link>
                              )}
                            </Menu.Item>
                          )}

                          {canDelete && RBAC.canDeleteUser(currentUser, user) && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  type="button"
                                  className={cn(
                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                    "flex w-full items-center gap-3 px-4 py-2 text-sm"
                                  )}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                  Delete User
                                </button>
                              )}
                            </Menu.Item>
                          )}
                        </div>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            disabled={!pagination.hasPrev}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            disabled={!pagination.hasNext}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-xs -space-x-px"
              aria-label="Pagination"
            >
              <button
                disabled={!pagination.hasPrev}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={!pagination.hasNext}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
