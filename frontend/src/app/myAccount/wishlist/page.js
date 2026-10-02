'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { initWishlist, removeFromWishlist, clearWishlist } from '@/redux/slices/wishlist';
import { createCart } from '@/redux/slices/cart';
import UserDashboardLayout from '@/contents/myAccount/UserDashboardLayout';
import {
  FavoriteBorder,
  ArrowForward,
  Close,
  ShoppingBag,
  Star,
  DeleteOutline,
} from '@mui/icons-material';

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(initWishlist());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = async (product) => {
    if (!user?.id) {
      router.push('/login');
      return;
    }
    const data = { userId: user.id, products: [{ productId: product.id, qty: 1 }] };
    const result = await dispatch(createCart(data));
    if (result) {
      dispatch(removeFromWishlist(product.id));
      router.push(`/cart/${product.id}`);
    }
  };

  const handleMoveAllToCart = async () => {
    if (!user?.id) {
      router.push('/login');
      return;
    }
    for (const product of items) {
      const data = { userId: user.id, products: [{ productId: product.id, qty: 1 }] };
      await dispatch(createCart(data));
    }
    dispatch(clearWishlist());
    router.push('/cart/products');
  };

  return (
    <UserDashboardLayout
      title="Wishlist"
      subtitle={`${items.length} ${items.length === 1 ? 'item' : 'items'} saved`}
    >
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <FavoriteBorder sx={{ fontSize: 28, color: '#d4d4d4' }} />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-neutral-400 mt-1.5 max-w-xs mx-auto">
            Browse our collection and tap the heart icon on products you love to save them here.
          </p>
          <button
            onClick={() => router.push('/collection/wireless-earphones')}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Browse Products
            <ArrowForward sx={{ fontSize: 16 }} />
          </button>
        </div>
      ) : (
        <>
          {/* Actions bar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-500">
              {items.length} {items.length === 1 ? 'product' : 'products'}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <ShoppingBag sx={{ fontSize: 14 }} />
                Move All to Cart
              </button>
              <button
                onClick={() => dispatch(clearWishlist())}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <DeleteOutline sx={{ fontSize: 14 }} />
                Clear All
              </button>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden group hover:shadow-md hover:border-neutral-300 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square bg-neutral-50 overflow-hidden">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all"
                  >
                    <Close sx={{ fontSize: 16, color: '#ef4444' }} />
                  </button>
                  {product.price?.discount && (
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                      {product.price.discount}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.title?.shortTitle}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                    onClick={() => router.push(`/product/${product.id}`)}
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-neutral-400 truncate">
                    {product.category?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <p
                    className="text-sm font-semibold text-neutral-900 mt-0.5 truncate cursor-pointer hover:text-neutral-600 transition-colors"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    {product.title?.shortTitle}
                  </p>

                  <div className="flex items-center gap-1 mt-1.5">
                    <Star sx={{ fontSize: 13, color: '#fbbf24' }} />
                    <span className="text-xs font-medium text-neutral-600">4.5</span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-bold text-neutral-900">
                      ₹{product.price?.cost?.toLocaleString() || product.price?.mrp?.toLocaleString()}
                    </span>
                    {product.price?.mrp && product.price?.cost && product.price.mrp !== product.price.cost && (
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{product.price.mrp.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-3 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag sx={{ fontSize: 15 }} />
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </UserDashboardLayout>
  );
}
