"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBagOutlined, ArrowForward } from '@mui/icons-material';

const CartEmpty = () => {
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-70px)] bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-6">
          <ShoppingBagOutlined sx={{ fontSize: 32, color: '#d1d5db' }} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Your cart is empty</h2>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          Looks like you haven&apos;t added anything yet. Explore our collection and find something you love.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 inline-flex items-center gap-2 bg-[#0a0a0a] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-300"
        >
          Start Shopping
          <ArrowForward sx={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  );
};

export default CartEmpty;
