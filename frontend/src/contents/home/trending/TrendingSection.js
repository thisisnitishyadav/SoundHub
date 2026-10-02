'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, LocalShipping, Verified, HeadsetMic } from '@mui/icons-material';

const trendingProducts = [
  {
    name: 'Airdopes 121 v2',
    tagline: '8mm Drivers | BEAST Mode',
    price: 1299,
    mrp: 2999,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/121v2.png?v=1701427775',
    rating: 4.4,
  },
  {
    name: 'Xtend Smartwatch',
    tagline: 'Alexa Enabled | AMOLED',
    price: 1677,
    mrp: 7964,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Xtend_6a57e3cd-0fa0-47ac-a46e-ea788a526627.jpg?v=1682583585',
    rating: 4.6,
  },
  {
    name: 'Stone 350 Speaker',
    tagline: '10W Output | IPX7',
    price: 1499,
    mrp: 3490,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Stone_350.jpg?v=1701847157',
    rating: 4.3,
  },
  {
    name: 'Storm Call Watch',
    tagline: 'BT Calling | SpO2',
    price: 1499,
    mrp: 7364,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Stormcall_1.webp?v=1709108774',
    rating: 4.5,
  },
];

const features = [
  { icon: LocalShipping, title: 'Free Shipping', desc: 'On orders above ₹499' },
  { icon: Verified, title: '1 Year Warranty', desc: 'Hassle-free replacement' },
  { icon: HeadsetMic, title: '24/7 Support', desc: 'Dedicated help center' },
];

const TrendingSection = () => {
  const router = useRouter();

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Hot right now</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Trending Products</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {trendingProducts.map((product, i) => (
            <div
              key={i}
              className="group flex items-center gap-4 md:gap-6 bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-5 hover:border-gray-200 hover:shadow-lg transition-all duration-500 cursor-pointer"
              onClick={() => router.push('/product')}
            >
              <div className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-xl md:rounded-2xl overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <Star sx={{ fontSize: 14, color: '#fbbf24' }} />
                  <span className="text-xs font-medium text-gray-600">{product.rating}</span>
                </div>
                <p className="text-base md:text-lg font-semibold text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{product.tagline}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                </div>
                <button className="mt-3 px-5 py-2 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 md:mt-20">
          {features.map((feat, i) => (
            <div key={i} className="flex items-center gap-4 p-5 md:p-6 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                <feat.icon sx={{ fontSize: 22, color: 'white' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{feat.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
