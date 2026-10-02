'use client';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '@/redux/slices/product';
import { createCart } from '@/redux/slices/cart';
import { getUser } from '@/redux/slices/auth';
import StarIcon from '@mui/icons-material/Star';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TimerIcon from '@mui/icons-material/Timer';

const Products = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { product } = useSelector((state) => state.product);
  const params = useParams();

  const fetchProductDetail = async () => {
    await dispatch(getProduct(params.productItem));
  };

  const handleGetUser = async () => {
    await dispatch(getUser());
  };

  const handleCreateCart = async (productId) => {
    const data = {
      userId: user?.id,
      products: [{ productId: productId, qty: 1 }],
    };
    let result = await dispatch(createCart(data));
    if (result) {
      router.push(`/cart/${product?.id}`);
    }
  };

  useEffect(() => {
    fetchProductDetail();
    handleGetUser();
  }, []);

  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1">
              {product?.productImages &&
                product?.productImages.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 overflow-hidden cursor-pointer h-[70px] w-[70px] md:h-[80px] md:w-[80px] hover:border-gray-900 transition-colors"
                  >
                    <img src={item?.path} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
            </div>

            <div className="bg-white flex justify-center items-center rounded-2xl overflow-hidden cursor-pointer w-full md:flex-1 shadow-sm border border-gray-100 order-1 md:order-2">
              <img src={product?.image} alt="" className="max-h-[500px] w-full object-contain p-4" />
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className='flex items-center gap-2 mb-2'>
                <div className='flex items-center gap-0.5 bg-green-600 text-white px-2 py-0.5 rounded-md text-xs font-semibold'>
                  <StarIcon sx={{ fontSize: 14 }} />
                  <span>4.8</span>
                </div>
                <span className='text-gray-400 text-sm'>1,339 reviews</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {product?.title?.shortTitle}
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Wireless Earbuds with upto 60 Hours Playback, 13mm Drivers, IWP Technology, 650mAh Charging Case
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2.5">
                <p className="text-3xl font-bold text-gray-900">
                  &#8377;{product?.price?.mrp}
                </p>
                <p className="line-through text-gray-400 text-lg">
                  &#8377;{product?.price?.cost}
                </p>
                <span className="bg-green-50 text-green-600 text-sm font-semibold px-2.5 py-0.5 rounded-full">{product?.price?.discount}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2.5 rounded-xl">
              <TimerIcon sx={{ fontSize: 20, color: '#ea580c' }} />
              <p className='text-sm font-medium text-orange-700'>Offer ends in: 5h 18m 36s</p>
            </div>

            <div className="bg-white border border-gray-200 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <p className="font-semibold text-sm text-gray-900">Choose Your Color:</p>
                <p className='text-sm text-gray-500'>Light Pink</p>
              </div>
              <div className="flex gap-2.5">
                {['#d48f87','#22201f','#d1d1d1','#c5b898','#586575','#3e5844'].map((color) => (
                  <div key={color} className={`border-2 border-transparent hover:border-gray-900 rounded-full p-0.5 cursor-pointer transition-colors`}>
                    <div className={`rounded-full h-8 w-8`} style={{backgroundColor: color}}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center bg-white border border-gray-200 px-4 py-3 rounded-xl">
              <LocalShippingIcon sx={{ fontSize: 20, color: '#6b7280' }} />
              <p className="font-medium text-sm text-gray-700 ml-3">Delivering to:</p>
              <p className="ml-2 text-sm text-gray-900 font-semibold">122028</p>
              <span className="ml-auto text-sm text-blue-600 cursor-pointer hover:underline font-medium">Change</span>
            </div>

            <div className='bg-white border border-gray-200 p-4 rounded-xl'>
              <p className='font-semibold text-sm text-gray-900'>Make Your Airdopes Personal</p>
              <p className="text-gray-400 text-xs mt-1">Get a Customized Engraving And Make It Unmistakably Yours</p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="contained"
                onClick={() => handleCreateCart(product?.id)}
                sx={{ flex: 1, backgroundColor: '#111827', '&:hover': { backgroundColor: '#1f2937' }, borderRadius: '12px', py: 1.5, textTransform: 'none', fontSize: '15px', fontWeight: 600 }}
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push('/checkout')}
                sx={{ flex: 1, backgroundColor: '#16a34a', '&:hover': { backgroundColor: '#15803d' }, borderRadius: '12px', py: 1.5, textTransform: 'none', fontSize: '15px', fontWeight: 600 }}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {[
            { img: '//cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_334305_small.svg?v=1682336123', text: '1 Year Warranty' },
            { img: '//cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_334304_small.svg?v=1682336123', text: '7-day Replacement' },
            { img: '//cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_334303_small.svg?v=1682336123', text: 'Free Shipping' },
            { img: '//cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_334302_small.svg?v=1682336123', text: 'GST Billing' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-2 py-2">
              <img src={item.img} alt={item.text} className="h-10 opacity-80" />
              <p className='text-xs font-medium text-gray-600'>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
