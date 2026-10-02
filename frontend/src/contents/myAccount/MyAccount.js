'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '@/redux/slices/auth';
import { getOrder } from '@/redux/slices/order';
import { readCart } from '@/redux/slices/cart';
import UserDashboardLayout from './UserDashboardLayout';
import {
  ShoppingBag,
  FavoriteBorder,
  LocationOn,
  Person,
  ArrowForward,
  LocalShipping,
  CheckCircle,
  Schedule,
  Inventory2,
} from '@mui/icons-material';

function QuickAction({ icon: Icon, label, desc, href, color, onClick }) {
  const router = useRouter();
  return (
    <button
      onClick={onClick || (() => router.push(href))}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all text-left group w-full"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}12` }}
      >
        <Icon sx={{ fontSize: 22, color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-800">{label}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
      </div>
      <ArrowForward
        sx={{ fontSize: 16 }}
        className="text-neutral-300 group-hover:text-neutral-500 transition-colors"
      />
    </button>
  );
}

const statusConfig = {
  pending: { label: 'Pending', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', icon: Schedule },
  active: { label: 'Active', color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700', icon: LocalShipping },
  success: { label: 'Delivered', color: '#16a34a', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  cancel: { label: 'Cancelled', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', icon: CheckCircle },
  failed: { label: 'Failed', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-600', icon: CheckCircle },
};

const MyAccount = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { orders } = useSelector((state) => state.order);
  const { carts } = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [userResult] = await Promise.all([
        dispatch(getUser()),
        dispatch(getOrder(1, 5)),
      ]);
      setLoading(false);
    };
    load();
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      dispatch(readCart(1, 10, { isDeleted: false, userId: user.id }));
    }
  }, [user?.id]);

  const isLoggedIn = user && Object.keys(user).length > 0;

  if (!isLoggedIn && !loading) {
    router.push('/login');
    return null;
  }

  const recentOrders = orders?.slice(0, 3) || [];
  const cartCount = carts?.length || 0;
  const orderCount = orders?.length || 0;

  return (
    <UserDashboardLayout title="Dashboard" subtitle="Welcome back to your account">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-[3px] border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{ background: 'radial-gradient(ellipse at 80% 20%, #6366f1 0%, transparent 60%)' }}
            />
            <div className="relative z-10">
              <p className="text-neutral-400 text-xs uppercase tracking-wider font-medium mb-2">
                Welcome back
              </p>
              <h2 className="text-xl sm:text-2xl font-bold">
                {user.name || user.firstName || 'Hey there'}! 👋
              </h2>
              <p className="text-neutral-400 text-sm mt-1.5 max-w-md">
                Manage your orders, saved addresses, and account settings all in one place.
              </p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Orders', value: orderCount, icon: ShoppingBag, color: '#6366f1', href: '/orders' },
              { label: 'In Cart', value: cartCount, icon: Inventory2, color: '#0ea5e9', href: '/cart/products' },
              { label: 'Wishlist', value: 0, icon: FavoriteBorder, color: '#ec4899', href: '/myAccount/wishlist' },
              { label: 'Addresses', value: user?.address?.length || 0, icon: LocationOn, color: '#f59e0b', href: '/myAccount/addresses' },
            ].map((stat) => (
              <button
                key={stat.label}
                onClick={() => router.push(stat.href)}
                className="bg-white rounded-xl border border-neutral-200 p-4 text-left hover:shadow-md hover:border-neutral-300 transition-all"
              >
                <stat.icon sx={{ fontSize: 20, color: stat.color }} />
                <p className="text-2xl font-bold text-neutral-900 mt-2">{stat.value}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{stat.label}</p>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickAction
                icon={ShoppingBag}
                label="View Orders"
                desc="Track and manage your orders"
                href="/orders"
                color="#6366f1"
              />
              <QuickAction
                icon={Person}
                label="Edit Profile"
                desc="Update your personal info"
                href="/myAccount/profile"
                color="#0ea5e9"
              />
              <QuickAction
                icon={LocationOn}
                label="Manage Addresses"
                desc="Add or edit delivery addresses"
                href="/myAccount/addresses"
                color="#f59e0b"
              />
              <QuickAction
                icon={FavoriteBorder}
                label="Wishlist"
                desc="Items you've saved for later"
                href="/myAccount/wishlist"
                color="#ec4899"
              />
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-900">Recent Orders</h3>
              {orderCount > 0 && (
                <button
                  onClick={() => router.push('/orders')}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-700 flex items-center gap-1"
                >
                  View all <ArrowForward sx={{ fontSize: 12 }} />
                </button>
              )}
            </div>

            {recentOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag sx={{ fontSize: 24, color: '#d4d4d4' }} />
                </div>
                <p className="text-sm font-semibold text-neutral-800">No orders yet</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Your order history will appear here once you make a purchase.
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping <ArrowForward sx={{ fontSize: 14 }} />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const status = statusConfig[order.status] || statusConfig.pending;
                  const firstProduct = order.products?.[0];
                  return (
                    <button
                      key={order.id}
                      onClick={() => router.push(`/orderDetails/${order.id}`)}
                      className="w-full bg-white rounded-2xl border border-neutral-200 p-4 flex items-center gap-4 hover:shadow-md hover:border-neutral-300 transition-all text-left"
                    >
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                        {firstProduct?.productId?.image ? (
                          <img
                            src={firstProduct.productId.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag sx={{ fontSize: 20, color: '#d4d4d4' }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-800 truncate">
                          {firstProduct?.productId?.title?.shortTitle || 'Order'}
                          {order.products?.length > 1 && (
                            <span className="text-neutral-400 font-normal">
                              {' '}+{order.products.length - 1} more
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          Order #{order.orderId || order.id?.slice(-8)}
                          {order.createdAt && (
                            <span> · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          )}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900">Account Information</h3>
              <button
                onClick={() => router.push('/myAccount/profile')}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-700"
              >
                Edit
              </button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', value: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || '-' },
                { label: 'Email', value: user.email || '-' },
                { label: 'Phone', value: user.phone || '-' },
                { label: 'Gender', value: user.sex || '-' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm text-neutral-800 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </UserDashboardLayout>
  );
};

export default MyAccount;
