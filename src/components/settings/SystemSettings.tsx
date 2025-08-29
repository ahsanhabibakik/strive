'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  CogIcon,
  ServerIcon,
  DatabaseIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface SystemSettingsProps {
  canEdit: boolean;
}

export function SystemSettings({ canEdit }: SystemSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [systemConfig, setSystemConfig] = useState({
    maintenance: {
      enabled: false,
      message: 'System is undergoing maintenance. Please check back later.',
      scheduledTime: ''
    },
    registration: {
      enabled: true,
      requireEmailVerification: true,
      allowedDomains: ''
    },
    security: {
      enforcePasswordStrength: true,
      requireTwoFactor: false,
      sessionTimeout: 24, // hours
      maxLoginAttempts: 5
    },
    features: {
      analytics: true,
      billing: true,
      apiKeys: true,
      contentManagement: true
    },
    limits: {
      maxUsersPerPlan: {
        free: 1,
        pro: 5,
        enterprise: -1 // unlimited
      },
      apiRateLimit: {
        free: 1000,
        pro: 50000,
        enterprise: -1 // unlimited
      }
    }
  });

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/admin/system-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(systemConfig),
      });

      if (!response.ok) {
        throw new Error('Failed to update system configuration');
      }

      alert('System configuration updated successfully');
    } catch (error) {
      console.error('Error updating system config:', error);
      alert('Failed to update system configuration');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (path: string[], value: any) => {
    setSystemConfig(prev => {
      const newConfig = { ...prev };
      let current = newConfig as any;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return newConfig;
    });
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    disabled = false 
  }: { 
    enabled: boolean; 
    onChange: (value: boolean) => void; 
    disabled?: boolean;
  }) => (
    <button
      type="button"
      className={`${
        enabled ? 'bg-indigo-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
    >
      <span
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-xs border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <CogIcon className="h-6 w-6 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">System Configuration</h3>
              <p className="text-sm text-gray-500">Manage system-wide settings and features</p>
            </div>
          </div>
          
          {canEdit && (
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Maintenance Mode */}
        <div>
          <div className="flex items-center gap-x-3 mb-4">
            <ServerIcon className="h-5 w-5 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-900">Maintenance Mode</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable Maintenance Mode</p>
                <p className="text-sm text-gray-500">
                  Temporarily disable access for all users except admins
                </p>
              </div>
              <ToggleSwitch
                enabled={systemConfig.maintenance.enabled}
                onChange={(value) => updateConfig(['maintenance', 'enabled'], value)}
                disabled={!canEdit}
              />
            </div>

            {systemConfig.maintenance.enabled && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-yellow-800">
                      Maintenance Mode Active
                    </h4>
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-yellow-800 mb-2">
                        Maintenance Message
                      </label>
                      <textarea
                        value={systemConfig.maintenance.message}
                        onChange={(e) => updateConfig(['maintenance', 'message'], e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-md shadow-xs focus:ring-yellow-500 focus:border-yellow-500"
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Registration */}
        <div>
          <div className="flex items-center gap-x-3 mb-4">
            <DatabaseIcon className="h-5 w-5 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-900">User Registration</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Allow New Registrations</p>
                <p className="text-sm text-gray-500">
                  Enable or disable new user account creation
                </p>
              </div>
              <ToggleSwitch
                enabled={systemConfig.registration.enabled}
                onChange={(value) => updateConfig(['registration', 'enabled'], value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Require Email Verification</p>
                <p className="text-sm text-gray-500">
                  New users must verify their email before accessing the system
                </p>
              </div>
              <ToggleSwitch
                enabled={systemConfig.registration.requireEmailVerification}
                onChange={(value) => updateConfig(['registration', 'requireEmailVerification'], value)}
                disabled={!canEdit || !systemConfig.registration.enabled}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Email Domains (optional)
              </label>
              <input
                type="text"
                value={systemConfig.registration.allowedDomains}
                onChange={(e) => updateConfig(['registration', 'allowedDomains'], e.target.value)}
                placeholder="example.com, company.com (leave empty to allow all)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!canEdit || !systemConfig.registration.enabled}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div>
          <div className="flex items-center gap-x-3 mb-4">
            <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-900">Security Settings</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Enforce Strong Passwords</p>
                <p className="text-sm text-gray-500">
                  Require users to use strong passwords
                </p>
              </div>
              <ToggleSwitch
                enabled={systemConfig.security.enforcePasswordStrength}
                onChange={(value) => updateConfig(['security', 'enforcePasswordStrength'], value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Require Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">
                  Force all users to enable 2FA
                </p>
              </div>
              <ToggleSwitch
                enabled={systemConfig.security.requireTwoFactor}
                onChange={(value) => updateConfig(['security', 'requireTwoFactor'], value)}
                disabled={!canEdit}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (hours)
                </label>
                <input
                  type="number"
                  value={systemConfig.security.sessionTimeout}
                  onChange={(e) => updateConfig(['security', 'sessionTimeout'], parseInt(e.target.value))}
                  min="1"
                  max="168"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!canEdit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={systemConfig.security.maxLoginAttempts}
                  onChange={(e) => updateConfig(['security', 'maxLoginAttempts'], parseInt(e.target.value))}
                  min="3"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Feature Toggles</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Analytics</p>
                <p className="text-sm text-gray-500">Enable analytics dashboard</p>
              </div>
              <ToggleSwitch
                enabled={systemConfig.features.analytics}
                onChange={(value) => updateConfig(['features', 'analytics'], value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Billing</p>
                <p className="text-sm text-gray-500">Enable subscription billing</p>
              </div>
              <ToggleSwitch
                enabled={systemConfig.features.billing}
                onChange={(value) => updateConfig(['features', 'billing'], value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">API Keys</p>
                <p className="text-sm text-gray-500">Enable API key management</p>
              </div>
              <ToggleSwitch
                enabled={systemConfig.features.apiKeys}
                onChange={(value) => updateConfig(['features', 'apiKeys'], value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Content Management</p>
                <p className="text-sm text-gray-500">Enable content management</p>
              </div>
              <ToggleSwitch
                enabled={systemConfig.features.contentManagement}
                onChange={(value) => updateConfig(['features', 'contentManagement'], value)}
                disabled={!canEdit}
              />
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-x-3 mb-4">
            <InformationCircleIcon className="h-5 w-5 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-900">System Information</h4>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Version</span>
                <p className="text-gray-900 font-medium">v1.0.0</p>
              </div>
              <div>
                <span className="text-gray-500">Environment</span>
                <p className="text-gray-900 font-medium">Production</p>
              </div>
              <div>
                <span className="text-gray-500">Last Updated</span>
                <p className="text-gray-900 font-medium">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="justify-start"
              disabled={!canEdit}
            >
              <ServerIcon className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              disabled={!canEdit}
            >
              <DatabaseIcon className="h-4 w-4 mr-2" />
              Backup Database
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              disabled={!canEdit}
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Health Check
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}