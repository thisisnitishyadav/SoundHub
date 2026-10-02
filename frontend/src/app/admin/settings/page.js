'use client';
import AdminShell from '../AdminShell';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { useState } from 'react';
import { adminUsers } from '@/lib/adminApi';
import { Save, Person, Lock } from '@mui/icons-material';

export default function SettingsPage() {
  const { admin, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [profile, setProfile] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwdMsg, setPwdMsg] = useState('');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg('');
    try {
      await adminUsers.update(admin.id, profile);
      setProfileMsg('Profile updated successfully');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Failed to update');
    } finally {
      setProfileSaving(false);
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: Person },
    { key: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <AdminShell>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">Settings</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            Manage your account and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-neutral-100 rounded-xl p-1 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <Icon sx={{ fontSize: 18 }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6">
            <h2 className="text-base font-semibold text-neutral-900 mb-4">
              Profile Information
            </h2>
            <form onSubmit={handleProfileSave} className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Name
                </label>
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                />
              </div>

              {profileMsg && (
                <p
                  className={`text-sm ${
                    profileMsg.includes('success')
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {profileMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={profileSaving}
                className="inline-flex items-center gap-2 h-10 px-5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors"
              >
                <Save sx={{ fontSize: 18 }} />
                {profileSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-1">
                Session
              </h2>
              <p className="text-sm text-neutral-500 mb-4">
                Signed in as{' '}
                <span className="font-medium text-neutral-700">
                  {admin?.email}
                </span>
              </p>
              <button
                onClick={logout}
                className="h-9 px-4 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-base font-semibold text-neutral-900 mb-4">
                Change Password
              </h2>
              <p className="text-sm text-neutral-500 mb-4">
                Use the password reset flow to change your password. An OTP will be sent to your email.
              </p>
              <button
                onClick={() =>
                  alert(
                    'Use the forgot password flow on the login page to reset your password.'
                  )
                }
                className="h-9 px-4 text-sm font-medium text-neutral-700 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                Reset Password
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
