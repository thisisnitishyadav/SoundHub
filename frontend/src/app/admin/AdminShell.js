'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/AdminAuthContext';
import { useEffect, useState } from 'react';
import {
  Dashboard,
  People,
  Inventory2,
  ShoppingCart,
  Payment,
  Settings,
  Logout,
  Menu,
  Close,
  KeyboardArrowRight,
} from '@mui/icons-material';

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Dashboard },
  { label: 'Users', href: '/admin/users', icon: People },
  { label: 'Products', href: '/admin/products', icon: Inventory2 },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Payments', href: '/admin/payments', icon: Payment },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminShell({ children }) {
  const { admin, loading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !admin) router.replace('/admin/login');
  }, [loading, admin, router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-[3px] border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-[260px] bg-white border-r border-neutral-200 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <span className="text-white text-xs font-bold">SH</span>
            </div>
            <span className="font-semibold text-sm text-neutral-800">
              Admin Panel
            </span>
          </div>
          <button
            className="lg:hidden p-1 rounded hover:bg-neutral-100"
            onClick={() => setSidebarOpen(false)}
          >
            <Close sx={{ fontSize: 20 }} />
          </button>
        </div>

        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <Icon sx={{ fontSize: 20 }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-100 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
              {admin.name?.[0]?.toUpperCase() || admin.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 truncate">
                {admin.name || 'Admin'}
              </p>
              <p className="text-[11px] text-neutral-400 truncate">
                {admin.email}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1"
          >
            <Logout sx={{ fontSize: 20 }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 lg:px-8 sticky top-0 z-30 shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-neutral-100 mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu sx={{ fontSize: 22 }} />
          </button>
          <div className="flex items-center gap-1.5 text-sm text-neutral-400">
            <span>Admin</span>
            <KeyboardArrowRight sx={{ fontSize: 16 }} />
            <span className="text-neutral-700 font-medium capitalize">
              {pathname.split('/').pop()}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
