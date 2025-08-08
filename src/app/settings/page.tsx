"use client";

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { UserIcon, ShieldCheckIcon, BellIcon, CogIcon } from '@heroicons/react/24/outline';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export default function SettingsPage() {
  const { user, signOut } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setFormData({
        username: data.username || '',
        avatar_url: data.avatar_url || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          username: formData.username,
          avatar_url: formData.avatar_url,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Sidebar />
        <Header />
        <main className="pl-16 pt-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-white mb-4">Please log in to access settings</p>
              <a
                href="/auth"
                className="inline-block rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white hover:bg-pink-400"
              >
                Sign In
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-100">
        <Sidebar />
        <Header />
        <main className="pl-16 pt-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-white">Loading settings...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100">
      <Sidebar />
      <Header />
      
      <main className="pl-16 pt-16">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="mt-2 text-dark-600">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Profile Section */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-dark-200 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <UserIcon className="h-6 w-6 text-pink-500" />
                  <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profile?.email || ''}
                      disabled
                      className="mt-1 block w-full rounded-md border-0 bg-dark-300 py-2 px-3 text-white/60 shadow-sm ring-1 ring-inset ring-dark-300"
                    />
                    <p className="mt-1 text-xs text-dark-600">Email cannot be changed</p>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-white">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 bg-dark-300 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-dark-300 focus:ring-2 focus:ring-inset focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="avatar_url" className="block text-sm font-medium text-white">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      id="avatar_url"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      className="mt-1 block w-full rounded-md border-0 bg-dark-300 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-dark-300 focus:ring-2 focus:ring-inset focus:ring-pink-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-md bg-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Info */}
              <div className="rounded-lg bg-dark-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ShieldCheckIcon className="h-6 w-6 text-pink-500" />
                  <h3 className="text-lg font-semibold text-white">Account Info</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-dark-600">Member since:</span>
                    <p className="text-white">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-dark-600">Account type:</span>
                    <p className="text-white">Free Account</p>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="rounded-lg bg-dark-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CogIcon className="h-6 w-6 text-pink-500" />
                  <h3 className="text-lg font-semibold text-white">Preferences</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-dark-300 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="ml-2 text-sm text-white">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-dark-300 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="ml-2 text-sm text-white">Public profile</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-lg bg-dark-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <BellIcon className="h-6 w-6 text-pink-500" />
                  <h3 className="text-lg font-semibold text-white">Actions</h3>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleSignOut}
                    className="w-full rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Sign Out
                  </button>
                  <button className="w-full rounded-md bg-dark-300 px-4 py-2 text-sm font-semibold text-white hover:bg-dark-400">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
