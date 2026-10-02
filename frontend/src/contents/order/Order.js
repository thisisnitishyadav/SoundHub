'use client';

import { getUser, logoutUser } from '@/redux/slices/auth';
import { Avatar, Box, Button, Divider, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getOrder } from '@/redux/slices/order';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import LogoutIcon from '@mui/icons-material/Logout';
import InboxIcon from '@mui/icons-material/Inbox';

const Order = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { orders } = useSelector((state) => state.order);

  const [skeletonState, setSkeletonState] = useState(true);

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    await dispatch(logoutUser());
    router.push('/login');
  };

  const fetchUser = async () => { await dispatch(getUser()); };
  const fetchOrder = async () => {
    setSkeletonState(true);
    const result = await dispatch(getOrder(1, 10));
    if (result) setSkeletonState(false);
  };

  useEffect(() => { fetchUser(); fetchOrder(); }, []);

  const handleClick = (id) => { router.push(`/orderDetails/${id}`); };

  const sidebarItems = [
    { label: 'Profile', icon: <PersonIcon sx={{ fontSize: 18 }} />, onClick: () => router.push('/myAccount') },
    { label: 'Orders', icon: <ShoppingBagIcon sx={{ fontSize: 18 }} />, active: true },
    { label: 'Wishlist', icon: <FavoriteIcon sx={{ fontSize: 18 }} /> },
    { label: 'Saved Address', icon: <LocationOnIcon sx={{ fontSize: 18 }} /> },
    { label: 'Contact Us', icon: <HeadsetMicIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Box sx={{ maxWidth: '1100px', mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
        <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#111827', mb: 3 }}>My Orders</Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>

          <Box sx={{ flexDirection: 'column', width: '280px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden', display: { xs: 'none', md: 'flex' }, height: 'fit-content' }}>
            <Box sx={{ p: 2.5, display: 'flex', gap: 2, alignItems: 'center', background: 'linear-gradient(135deg,#111827,#1f2937)' }}>
              <Avatar sx={{ width: 44, height: 44, backgroundColor: '#374151' }} />
              <Box>
                <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '15px' }}>{user?.name}</Typography>
                <Typography sx={{ color: '#9ca3af', fontSize: '12px' }}>{user?.email}</Typography>
              </Box>
            </Box>
            {sidebarItems.map((item, i) => (
              <Box key={i} onClick={item.onClick} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.8, cursor: 'pointer', '&:hover': { backgroundColor: '#f9fafb' }, borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.15s' }}>
                <Box sx={{ color: item.active ? '#111827' : '#9ca3af' }}>{item.icon}</Box>
                <Typography sx={{ fontSize: '14px', fontWeight: item.active ? 600 : 400, color: item.active ? '#111827' : '#4b5563' }}>{item.label}</Typography>
              </Box>
            ))}
            <Box onClick={handleLogout} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.8, cursor: 'pointer', '&:hover': { backgroundColor: '#fef2f2' }, transition: 'background-color 0.15s' }}>
              <LogoutIcon sx={{ fontSize: 18, color: '#ef4444' }} />
              <Typography sx={{ fontSize: '14px', color: '#ef4444', fontWeight: 500 }}>Logout</Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {skeletonState ? (
            [...Array(3)].map((_, index) => (
              <Box key={index} sx={{ backgroundColor: 'white', borderRadius: '16px', p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                  <Skeleton variant="rounded" sx={{ width: { xs: '100%', md: '140px' }, height: '160px', borderRadius: '12px' }} />
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Skeleton variant="text" sx={{ width: '60%', height: '24px' }} />
                    <Skeleton variant="text" sx={{ width: '40%', height: '20px' }} />
                    <Skeleton variant="text" sx={{ width: '30%', height: '20px' }} />
                    <Skeleton variant="rounded" sx={{ width: '120px', height: '32px', borderRadius: '8px', mt: 1 }} />
                  </Box>
                </Box>
              </Box>
            ))
          ) : orders && orders.length > 0 ? (
            orders.map((order) =>
              order.products.map((cart) => (
                <Box key={`${order.id}-${cart.id}`}
                  sx={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }, transition: 'box-shadow 0.2s' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 1.5, borderBottom: '1px solid #f3f4f6', flexWrap: 'wrap', gap: 1 }}>
                    <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>Order #{order.id?.slice(-8)}</Typography>
                    <Typography onClick={() => handleClick(cart.id)} sx={{ fontSize: '13px', color: '#3b82f6', cursor: 'pointer', fontWeight: 600, '&:hover': { color: '#2563eb' } }}>
                      View Details
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, p: 3 }}>
                    <img
                      src={cart.productId?.image || 'https://via.placeholder.com/130x170'}
                      alt="Product"
                      style={{ width: '120px', height: '150px', objectFit: 'cover', borderRadius: '12px' }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#111827' }}>
                        {cart.productId?.title?.shortTitle || 'Unknown Title'}
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#9ca3af', mt: 0.5 }}>Boat</Typography>
                      <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111827', mt: 1 }}>₹{cart.productId?.price?.cost || 'N/A'}</Typography>
                      <Button variant="outlined" size="small" sx={{ mt: 2, borderRadius: '8px', textTransform: 'none', borderColor: '#fecaca', color: '#ef4444', '&:hover': { borderColor: '#ef4444', backgroundColor: '#fef2f2' }, fontSize: '13px' }}>
                        Cancel Order
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))
            )
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <InboxIcon sx={{ fontSize: 48, color: '#d1d5db', mb: 2 }} />
              <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#374151' }}>No Orders Found</Typography>
              <Typography sx={{ fontSize: '14px', color: '#9ca3af', mt: 0.5 }}>You haven&apos;t placed any orders yet.</Typography>
            </Box>
          )}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Order;
