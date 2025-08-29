'use client';

import { useState } from 'react';
import { IUser } from '@/lib/models/User';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

interface SecuritySettingsProps {
  user: IUser;
  canEdit: boolean;
}

export function SecuritySettings({ user, canEdit }: SecuritySettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSend2FASetup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/setup-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup 2FA');
      }

      alert('2FA setup instructions sent to your email');
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      alert('Failed to setup 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const renderPasswordStrength = (password: string) => {
    const strength = getPasswordStrength(password);
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    
    return (
      <div className="mt-2">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-1 w-full rounded-full ${
                level <= strength ? colors[strength - 1] : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        {password && (
          <p className="text-xs text-gray-500 mt-1">
            Strength: {labels[strength - 1] || 'Very Weak'}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-x-3">
          <ShieldCheckIcon className="h-6 w-6 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Password Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <KeyIcon className="h-4 w-4" />
                Password
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Keep your account secure with a strong password
              </p>
            </div>
            
            {canEdit && !isChangingPassword && (
              <Button
                onClick={() => setIsChangingPassword(true)}
                variant="outline"
                size="sm"
              >
                Change Password
              </Button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {renderPasswordStrength(passwordForm.newPassword)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    Passwords do not match
                  </p>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={handlePasswordChange}
                  disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
                <Button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!isChangingPassword && (
            <div className="text-sm text-gray-600">
              Password last changed: {new Date(user.updatedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Two-Factor Authentication */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <DevicePhoneMobileIcon className="h-4 w-4" />
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {user.twoFactorEnabled ? (
                <>
                  <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    <CheckCircleIcon className="h-3 w-3" />
                    Enabled
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    Manage
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSend2FASetup}
                  disabled={loading}
                  size="sm"
                >
                  {loading ? 'Setting up...' : 'Enable 2FA'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Account Recovery */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Account Recovery</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Recovery Email</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Active Sessions</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Current Session</p>
                <p className="text-sm text-gray-500">
                  Last active: {new Date().toLocaleString()}
                </p>
              </div>
              <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                <CheckCircleIcon className="h-3 w-3" />
                Active
              </span>
            </div>
          </div>
          <div className="mt-3">
            <Button variant="outline" size="sm">
              View All Sessions
            </Button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">
                  Danger Zone
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Irreversible and destructive actions
                </p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}