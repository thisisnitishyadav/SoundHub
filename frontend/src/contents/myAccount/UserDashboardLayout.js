'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/redux/slices/auth';
import {
  Person,
  ShoppingBag,
  FavoriteBorder,
  LocationOn,
  Logout,
  Dashboard,
  ChevronRight,
} from '@mui/icons-material';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/myAccount', icon: Dashboard, exact: true },
  { label: 'My Orders', href: '/orders', icon: ShoppingBag },
  { label: 'Wishlist', href: '/myAccount/wishlist', icon: FavoriteBorder },
  { label: 'Addresses', href: '/myAccount/addresses', icon: LocationOn },
  { label: 'Profile', href: '/myAccount/profile', icon: Person },
];

export default function UserDashboardLayout({ children, title, subtitle }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    await dispatch(logoutUser());
    router.push('/login');
  };

  const isLoggedIn = user && Object.keys(user).length > 0;

  return (
    <div className="bg-neutral-50 min-h-[calc(100vh-130px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Mobile: User header + horizontal nav */}
        <div className="lg:hidden mb-6">
          {isLoggedIn && (
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-neutral-900 flex items-center justify-center text-white text-sm font-bold">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{user.name || 'User'}</p>
                <p className="text-xs text-neutral-400">{user.email}</p>
              </div>
            </div>
          )}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {NAV_ITEMS.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? 'bg-neutral-900 text-white'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <item.icon sx={{ fontSize: 15 }} />
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors"
            >
              <Logout sx={{ fontSize: 15 }} />
              Logout
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <div className="sticky top-24">
              {isLoggedIn && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-white text-base font-bold">
                      {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {user.name || 'User'}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                {NAV_ITEMS.map((item) => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors border-b border-neutral-100 last:border-b-0 ${
                        active
                          ? 'text-neutral-900 bg-neutral-50'
                          : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                      }`}
                    >
                      <item.icon sx={{ fontSize: 19, color: active ? '#171717' : '#a3a3a3' }} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {active && <ChevronRight sx={{ fontSize: 16, color: '#a3a3a3' }} />}
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Logout sx={{ fontSize: 19 }} />
                  <span className="flex-1 text-left">Sign Out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {title && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
