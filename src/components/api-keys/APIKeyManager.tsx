"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  KeyIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";

interface APIKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  masked: string;
  permissions: string[];
  lastUsed?: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  usage: {
    totalRequests: number;
    monthlyRequests: number;
    lastRequest?: string;
  };
}

interface APIKeyManagerProps {
  userId: string;
  canCreate: boolean;
  canDelete: boolean;
}

export function APIKeyManager({ userId, canCreate, canDelete }: APIKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKey, setNewKey] = useState({
    name: "",
    permissions: [] as string[],
    expiresIn: "0", // 0 = never, 30, 90, 365 days
  });

  const availablePermissions = [
    { id: "read", name: "Read Access", description: "Read data from the API" },
    { id: "write", name: "Write Access", description: "Create and update data" },
    { id: "delete", name: "Delete Access", description: "Delete data (requires approval)" },
    { id: "admin", name: "Admin Access", description: "Full administrative access" },
  ];

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  const fetchApiKeys = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/api-keys?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch API keys");
      }

      const data = await response.json();
      setApiKeys(data.apiKeys || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createApiKey = async () => {
    if (!newKey.name.trim()) {
      alert("Please provide a name for the API key");
      return;
    }

    if (newKey.permissions.length === 0) {
      alert("Please select at least one permission");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/user/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newKey.name,
          permissions: newKey.permissions,
          expiresIn: newKey.expiresIn === "0" ? null : parseInt(newKey.expiresIn),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create API key");
      }

      const data = await response.json();

      // Show the new key in a modal or alert
      alert(
        `API Key created successfully!\n\nKey: ${data.apiKey.key}\n\nPlease copy this key now as it won't be shown again.`
      );

      setNewKey({ name: "", permissions: [], expiresIn: "0" });
      setShowCreateForm(false);
      fetchApiKeys();
    } catch (error) {
      console.error("Error creating API key:", error);
      alert(error instanceof Error ? error.message : "Failed to create API key");
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string, keyName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the API key "${keyName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete API key");
      }

      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    } catch (error) {
      console.error("Error deleting API key:", error);
      alert("Failed to delete API key");
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could show a toast notification here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpired = (expiresAt?: string) => {
    return expiresAt && new Date(expiresAt) < new Date();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-2xs border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <KeyIcon className="h-6 w-6 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
              <p className="text-sm text-gray-500">
                Manage your API keys for accessing our services
              </p>
            </div>
          </div>

          {canCreate && (
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Key
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Create New API Key</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Name</label>
                <input
                  type="text"
                  value={newKey.name}
                  onChange={e => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Production API, Development Key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-2xs focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2">
                  {availablePermissions.map(permission => (
                    <label key={permission.id} className="flex items-start">
                      <input
                        type="checkbox"
                        checked={newKey.permissions.includes(permission.id)}
                        onChange={e => {
                          setNewKey(prev => ({
                            ...prev,
                            permissions: e.target.checked
                              ? [...prev.permissions, permission.id]
                              : prev.permissions.filter(p => p !== permission.id),
                          }));
                        }}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-sm"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">{permission.name}</span>
                        <p className="text-sm text-gray-500">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiration</label>
                <select
                  value={newKey.expiresIn}
                  onChange={e => setNewKey(prev => ({ ...prev, expiresIn: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-2xs focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="0">Never expires</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={createApiKey}
                  disabled={creating}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {creating ? "Creating..." : "Create API Key"}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewKey({ name: "", permissions: [], expiresIn: "0" });
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* API Keys List */}
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <KeyIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first API key to start using our services.
            </p>
            {canCreate && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map(apiKey => (
              <div
                key={apiKey.id}
                className={`p-4 border rounded-lg ${
                  !apiKey.isActive || isExpired(apiKey.expiresAt)
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 hover:bg-gray-50"
                } transition-colors`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-x-3 mb-2">
                      <h4 className="text-sm font-medium text-gray-900">{apiKey.name}</h4>

                      {!apiKey.isActive && (
                        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          Disabled
                        </span>
                      )}

                      {isExpired(apiKey.expiresAt) && (
                        <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          <ExclamationTriangleIcon className="h-3 w-3" />
                          Expired
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-x-4 mb-3">
                      <div className="flex items-center gap-x-2">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded-sm">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : apiKey.masked}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={visibleKeys.has(apiKey.id) ? "Hide key" : "Show key"}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeSlashIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(apiKey.key)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copy to clipboard"
                        >
                          <ClipboardDocumentIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-x-6 text-sm text-gray-500">
                      <div className="flex items-center gap-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        Created {formatDate(apiKey.createdAt)}
                      </div>

                      {apiKey.expiresAt && (
                        <div className="flex items-center gap-x-1">
                          <CalendarIcon className="h-4 w-4" />
                          Expires {formatDate(apiKey.expiresAt)}
                        </div>
                      )}

                      {apiKey.lastUsed && <div>Last used {formatDate(apiKey.lastUsed)}</div>}
                    </div>

                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {apiKey.permissions.map(permission => (
                          <span
                            key={permission}
                            className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {canDelete && (
                      <Button
                        onClick={() => deleteApiKey(apiKey.id, apiKey.name)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Total Requests</span>
                      <p className="font-medium text-gray-900">
                        {apiKey.usage.totalRequests.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">This Month</span>
                      <p className="font-medium text-gray-900">
                        {apiKey.usage.monthlyRequests.toLocaleString()}
                      </p>
                    </div>
                    {apiKey.usage.lastRequest && (
                      <div>
                        <span className="text-gray-500">Last Request</span>
                        <p className="font-medium text-gray-900">
                          {formatDate(apiKey.usage.lastRequest)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
