'use client';

import { useState } from 'react';
import { IUser } from '@/lib/models/User';
import { Button } from '@/components/ui/button';
import { 
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface NotificationSettingsProps {
  user: IUser;
  canEdit: boolean;
}

interface NotificationPreferences {
  email: {
    marketing: boolean;
    security: boolean;
    product: boolean;
    billing: boolean;
  };
  push: {
    enabled: boolean;
    security: boolean;
    mentions: boolean;
    updates: boolean;
  };
  inApp: {
    enabled: boolean;
    comments: boolean;
    mentions: boolean;
    updates: boolean;
  };
}

export function NotificationSettings({ user, canEdit }: NotificationSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      marketing: user.notifications?.email?.marketing ?? true,
      security: user.notifications?.email?.security ?? true,
      product: user.notifications?.email?.product ?? true,
      billing: user.notifications?.email?.billing ?? true,
    },
    push: {
      enabled: user.notifications?.push?.enabled ?? false,
      security: user.notifications?.push?.security ?? true,
      mentions: user.notifications?.push?.mentions ?? true,
      updates: user.notifications?.push?.updates ?? false,
    },
    inApp: {
      enabled: user.notifications?.inApp?.enabled ?? true,
      comments: user.notifications?.inApp?.comments ?? true,
      mentions: user.notifications?.inApp?.mentions ?? true,
      updates: user.notifications?.inApp?.updates ?? true,
    }
  });

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      alert('Notification preferences updated successfully');
    } catch (error) {
      console.error('Error updating notifications:', error);
      alert('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const updateEmailPreference = (key: keyof NotificationPreferences['email'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: value
      }
    }));
  };

  const updatePushPreference = (key: keyof NotificationPreferences['push'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      push: {
        ...prev.push,
        [key]: value
      }
    }));
  };

  const updateInAppPreference = (key: keyof NotificationPreferences['inApp'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      inApp: {
        ...prev.inApp,
        [key]: value
      }
    }));
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
            <BellIcon className="h-6 w-6 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
          </div>
          
          {canEdit && (
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Email Notifications */}
        <div>
          <div className="flex items-center gap-x-3 mb-4">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Security Alerts</p>
                <p className="text-sm text-gray-500">
                  Get notified about security events and login attempts
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.email.security}
                onChange={(value) => updateEmailPreference('security', value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Billing & Payments</p>
                <p className="text-sm text-gray-500">
                  Invoices, payment confirmations, and billing updates
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.email.billing}
                onChange={(value) => updateEmailPreference('billing', value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Product Updates</p>
                <p className="text-sm text-gray-500">
                  New features, improvements, and important announcements
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.email.product}
                onChange={(value) => updateEmailPreference('product', value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Marketing & Promotions</p>
                <p className="text-sm text-gray-500">
                  Tips, offers, and marketing communications
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.email.marketing}
                onChange={(value) => updateEmailPreference('marketing', value)}
                disabled={!canEdit}
              />
            </div>
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <div className="flex items-center gap-x-3 mb-4">
            <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable Push Notifications</p>
                <p className="text-sm text-gray-500">
                  Allow browser push notifications from this app
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.push.enabled}
                onChange={(value) => updatePushPreference('enabled', value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between opacity-60">
              <div>
                <p className="text-sm font-medium text-gray-900">Security Events</p>
                <p className="text-sm text-gray-500">
                  Immediate alerts for security-related events
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.push.security}
                onChange={(value) => updatePushPreference('security', value)}
                disabled={!canEdit || !preferences.push.enabled}
              />
            </div>

            <div className="flex items-center justify-between opacity-60">
              <div>
                <p className="text-sm font-medium text-gray-900">Mentions & Messages</p>
                <p className="text-sm text-gray-500">
                  When someone mentions you or sends a direct message
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.push.mentions}
                onChange={(value) => updatePushPreference('mentions', value)}
                disabled={!canEdit || !preferences.push.enabled}
              />
            </div>

            <div className="flex items-center justify-between opacity-60">
              <div>
                <p className="text-sm font-medium text-gray-900">System Updates</p>
                <p className="text-sm text-gray-500">
                  Notifications about system maintenance and updates
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.push.updates}
                onChange={(value) => updatePushPreference('updates', value)}
                disabled={!canEdit || !preferences.push.enabled}
              />
            </div>
          </div>
        </div>

        {/* In-App Notifications */}
        <div>
          <div className="flex items-center gap-x-3 mb-4">
            <BellIcon className="h-5 w-5 text-gray-400" />
            <h4 className="text-sm font-medium text-gray-900">In-App Notifications</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable In-App Notifications</p>
                <p className="text-sm text-gray-500">
                  Show notifications within the application
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.inApp.enabled}
                onChange={(value) => updateInAppPreference('enabled', value)}
                disabled={!canEdit}
              />
            </div>

            <div className="flex items-center justify-between opacity-60">
              <div>
                <p className="text-sm font-medium text-gray-900">Comments & Replies</p>
                <p className="text-sm text-gray-500">
                  When someone comments on your content
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.inApp.comments}
                onChange={(value) => updateInAppPreference('comments', value)}
                disabled={!canEdit || !preferences.inApp.enabled}
              />
            </div>

            <div className="flex items-center justify-between opacity-60">
              <div>
                <p className="text-sm font-medium text-gray-900">Mentions</p>
                <p className="text-sm text-gray-500">
                  When someone mentions you in a comment or post
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.inApp.mentions}
                onChange={(value) => updateInAppPreference('mentions', value)}
                disabled={!canEdit || !preferences.inApp.enabled}
              />
            </div>

            <div className="flex items-center justify-between opacity-60">
              <div>
                <p className="text-sm font-medium text-gray-900">Updates & Announcements</p>
                <p className="text-sm text-gray-500">
                  Product updates and important announcements
                </p>
              </div>
              <ToggleSwitch
                enabled={preferences.inApp.updates}
                onChange={(value) => updateInAppPreference('updates', value)}
                disabled={!canEdit || !preferences.inApp.enabled}
              />
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Quiet Hours</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-3">
              Set specific hours when you don't want to receive notifications
            </p>
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                <input
                  type="time"
                  defaultValue="22:00"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md"
                  disabled={!canEdit}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                <input
                  type="time"
                  defaultValue="08:00"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md"
                  disabled={!canEdit}
                />
              </div>
              <div className="pt-6">
                <ToggleSwitch
                  enabled={false}
                  onChange={() => {}}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}