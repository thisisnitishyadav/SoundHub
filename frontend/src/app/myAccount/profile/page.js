'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, updateUser } from '@/redux/slices/auth';
import { useFormik } from 'formik';
import UserDashboardLayout from '@/contents/myAccount/UserDashboardLayout';
import { Save, CheckCircle } from '@mui/icons-material';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || user?.name || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      sex: user?.sex || '',
      date: user?.date || '',
    },
    onSubmit: async (values) => {
      setSaving(true);
      const result = await dispatch(updateUser(values, user.id));
      setSaving(false);
      if (result) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    },
  });

  const isLoggedIn = user && Object.keys(user).length > 0;
  if (!isLoggedIn) {
    return null;
  }

  return (
    <UserDashboardLayout title="Edit Profile" subtitle="Update your personal information">
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <form onSubmit={formik.handleSubmit}>
          <div className="p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full h-11 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full h-11 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-11 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full h-11 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                  Date of Birth
                </label>
                <input
                  name="date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full h-11 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                name="sex"
                value={formik.values.sex}
                onChange={formik.handleChange}
                className="w-full sm:w-48 h-11 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-4 border-t border-neutral-100 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 h-10 px-5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save sx={{ fontSize: 18 }} />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span className="text-sm text-emerald-600 flex items-center gap-1">
                <CheckCircle sx={{ fontSize: 16 }} /> Saved
              </span>
            )}
          </div>
        </form>
      </div>
    </UserDashboardLayout>
  );
}
