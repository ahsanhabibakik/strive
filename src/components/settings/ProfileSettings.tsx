'use client';

import { useState } from 'react';
import { IUser } from '@/lib/models/User';
import { Button } from '@/components/ui/button';
import { 
  UserCircleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface ProfileSettingsProps {
  user: IUser;
  canEdit: boolean;
}

export function ProfileSettings({ user, canEdit }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email,
    bio: user.profile?.bio || '',
    website: user.profile?.website || '',
    location: user.profile?.location || '',
    company: user.profile?.company || ''
  });

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          profile: {
            bio: formData.bio,
            website: formData.website,
            location: formData.location,
            company: formData.company
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setIsEditing(false);
      // In a real app, you'd want to update the user context or refetch
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email,
      bio: user.profile?.bio || '',
      website: user.profile?.website || '',
      location: user.profile?.location || '',
      company: user.profile?.company || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <UserCircleIcon className="h-6 w-6 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
          </div>
          
          {canEdit && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
          
          {isEditing && (
            <div className="flex space-x-2">
              <Button
                onClick={handleSave}
                disabled={loading}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || 'User'} 
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-medium text-white">
                  {(user.name || user.email).charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {canEdit && isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
              >
                Change Photo
              </Button>
            )}
          </div>

          {/* Profile Details */}
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 py-2">{user.name || 'Not set'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <p className="text-gray-900 py-2">{user.email}</p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-900 py-2">
                  {user.profile?.bio || 'No bio provided'}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://example.com"
                  />
                ) : (
                  <p className="text-gray-900 py-2">
                    {user.profile?.website ? (
                      <a 
                        href={user.profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        {user.profile.website}
                      </a>
                    ) : (
                      'Not set'
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="text-gray-900 py-2">
                    {user.profile?.location || 'Not set'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your company name"
                />
              ) : (
                <p className="text-gray-900 py-2">
                  {user.profile?.company || 'Not set'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Account Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-gray-500">Member since</span>
              <p className="text-gray-900 font-medium">
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Role</span>
              <p className="text-gray-900 font-medium capitalize">{user.role}</p>
            </div>
            <div>
              <span className="text-gray-500">Account Status</span>
              <p className="text-gray-900 font-medium">
                {user.emailVerified ? (
                  <span className="text-green-600">Verified</span>
                ) : (
                  <span className="text-yellow-600">Pending Verification</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}