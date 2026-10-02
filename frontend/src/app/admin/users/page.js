'use client';
import AdminShell from '../AdminShell';
import { useEffect, useState, useCallback } from 'react';
import { adminUsers } from '@/lib/adminApi';
import {
  Search,
  PersonAdd,
  MoreVert,
  Edit,
  Delete,
  Close,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';

const USER_TYPE_LABEL = { 1: 'User', 2: 'Admin' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [paginator, setPaginator] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', userType: 1 });
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const query = search
        ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
        : {};
      const res = await adminUsers.list(page, 10, query);
      if (res.data?.data) {
        setUsers(res.data.data.data || []);
        setPaginator(res.data.data.paginator || {});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminUsers.softDelete(id);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
    setMenuOpen(null);
  };

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: '', email: '', phone: '', userType: 1, password: '' });
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', userType: u.userType || 1 });
    setModalOpen(true);
    setMenuOpen(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editUser) {
        await adminUsers.update(editUser.id, form);
      } else {
        await adminUsers.create(form);
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">Users</h1>
            <p className="text-sm text-neutral-500 mt-0.5">
              {paginator.itemCount ?? 0} total users
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 h-9 px-4 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <PersonAdd sx={{ fontSize: 18 }} />
            Add User
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search
            sx={{ fontSize: 18 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full sm:w-80 h-10 pl-9 pr-4 text-sm bg-white border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-neutral-400">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-sm text-neutral-400">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 text-xs">
                    <th className="text-left font-medium px-5 py-3">Name</th>
                    <th className="text-left font-medium px-5 py-3">Email</th>
                    <th className="text-left font-medium px-5 py-3">Phone</th>
                    <th className="text-left font-medium px-5 py-3">Type</th>
                    <th className="text-left font-medium px-5 py-3">Status</th>
                    <th className="text-left font-medium px-5 py-3">Joined</th>
                    <th className="text-right font-medium px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
                            {u.name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-neutral-800">{u.name || '-'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-neutral-600">{u.email || '-'}</td>
                      <td className="px-5 py-3 text-neutral-600">{u.phone || '-'}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${
                            u.userType === 2
                              ? 'bg-violet-50 text-violet-700'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {USER_TYPE_LABEL[u.userType] || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            u.isActive ? 'bg-emerald-500' : 'bg-neutral-300'
                          }`}
                        />
                      </td>
                      <td className="px-5 py-3 text-neutral-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-5 py-3 text-right relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === u.id ? null : u.id)}
                          className="p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                        >
                          <MoreVert sx={{ fontSize: 18, color: '#737373' }} />
                        </button>
                        {menuOpen === u.id && (
                          <div className="absolute right-5 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-20 w-36">
                            <button
                              onClick={() => openEdit(u)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                            >
                              <Edit sx={{ fontSize: 16 }} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Delete sx={{ fontSize: 16 }} /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {paginator.pageCount > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 text-sm">
              <span className="text-neutral-500">
                Page {paginator.currentPage} of {paginator.pageCount}
              </span>
              <div className="flex gap-1">
                <button
                  disabled={!paginator.prev}
                  onClick={() => setPage(page - 1)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft sx={{ fontSize: 18 }} />
                </button>
                <button
                  disabled={!paginator.next}
                  onClick={() => setPage(page + 1)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronRight sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl border border-neutral-200 w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-neutral-900">
                {editUser ? 'Edit User' : 'Create User'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-neutral-100">
                <Close sx={{ fontSize: 20 }} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                />
              </div>
              {!editUser && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={form.password || ''}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">User Type</label>
                <select
                  value={form.userType}
                  onChange={(e) => setForm({ ...form, userType: Number(e.target.value) })}
                  className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white"
                >
                  <option value={1}>User</option>
                  <option value={2}>Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full h-10 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors"
              >
                {saving ? 'Saving...' : editUser ? 'Update User' : 'Create User'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
