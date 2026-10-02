'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, updateUser } from '@/redux/slices/auth';
import UserDashboardLayout from '@/contents/myAccount/UserDashboardLayout';
import {
  Add,
  Close,
  LocationOn,
  Edit,
  Delete,
  Home,
} from '@mui/icons-material';

export default function AddressesPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ locality: '', city: '', state: '', country: 'India', zipcode: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const addresses = user?.address || [];

  const openAdd = () => {
    setEditIndex(null);
    setForm({ locality: '', city: '', state: '', country: 'India', zipcode: '' });
    setModalOpen(true);
  };

  const openEdit = (index) => {
    setEditIndex(index);
    setForm({ ...addresses[index] });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const updated = [...addresses];
    if (editIndex !== null) {
      updated[editIndex] = form;
    } else {
      updated.push(form);
    }
    await dispatch(updateUser({ address: updated }, user.id));
    await dispatch(getUser());
    setSaving(false);
    setModalOpen(false);
  };

  const handleDelete = async (index) => {
    if (!confirm('Remove this address?')) return;
    const updated = addresses.filter((_, i) => i !== index);
    await dispatch(updateUser({ address: updated }, user.id));
    await dispatch(getUser());
  };

  return (
    <UserDashboardLayout title="Saved Addresses" subtitle="Manage your delivery addresses">
      <div className="space-y-4">
        {/* Add button */}
        <button
          onClick={openAdd}
          className="w-full flex items-center justify-center gap-2 h-14 border-2 border-dashed border-neutral-300 rounded-2xl text-sm font-medium text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors"
        >
          <Add sx={{ fontSize: 20 }} />
          Add New Address
        </button>

        {/* Address cards */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
              <LocationOn sx={{ fontSize: 24, color: '#d4d4d4' }} />
            </div>
            <p className="text-sm font-semibold text-neutral-800">No saved addresses</p>
            <p className="text-xs text-neutral-400 mt-1">Add an address for faster checkout.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((addr, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-4 relative group">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Home sx={{ fontSize: 18, color: '#737373' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    {addr.locality && <p className="text-sm text-neutral-800 font-medium">{addr.locality}</p>}
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {[addr.city, addr.state].filter(Boolean).join(', ')}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {[addr.country, addr.zipcode].filter(Boolean).join(' - ')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => openEdit(i)}
                    className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    <Edit sx={{ fontSize: 14 }} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Delete sx={{ fontSize: 14 }} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-neutral-900">
                {editIndex !== null ? 'Edit Address' : 'Add Address'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-neutral-100">
                <Close sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-600 mb-1">Address / Locality</label>
                <input
                  value={form.locality}
                  onChange={(e) => setForm({ ...form, locality: e.target.value })}
                  required
                  className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                  placeholder="Street, area, landmark"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">City</label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    required
                    className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">State</label>
                  <input
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    required
                    className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Country</label>
                  <input
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Pincode</label>
                  <input
                    type="number"
                    value={form.zipcode}
                    onChange={(e) => setForm({ ...form, zipcode: e.target.value })}
                    required
                    className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full h-10 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors"
              >
                {saving ? 'Saving...' : editIndex !== null ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </UserDashboardLayout>
  );
}
