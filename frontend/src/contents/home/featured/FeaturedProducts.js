'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { FavoriteBorder, Star } from '@mui/icons-material';

const products = [
  {
    name: 'Airdopes 131',
    category: 'True Wireless',
    price: 899,
    mrp: 2999,
    rating: 4.5,
    reviews: 2341,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/131_f04f74fd-45d4-4614-85cf-6ccf69c4cf90.jpg?v=1691395049',
    badge: 'Best Seller',
    badgeColor: '#0a0a0a',
  },
  {
    name: 'Airdopes 141',
    category: 'True Wireless',
    price: 1299,
    mrp: 4490,
    rating: 4.3,
    reviews: 1823,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/AD_141.png?v=1703145765',
    badge: 'New',
    badgeColor: '#00e5ff',
  },
  {
    name: 'Storm Smartwatch',
    category: 'Smart Watch',
    price: 1499,
    mrp: 5999,
    rating: 4.6,
    reviews: 3120,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/boAt-Storm.jpg?v=1682583585',
    badge: 'Trending',
    badgeColor: '#7c4dff',
  },
  {
    name: 'Nirvana 751 ANC',
    category: 'Headphones',
    price: 2499,
    mrp: 7990,
    rating: 4.7,
    reviews: 987,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Nirvana_751_ANC.jpg?v=1698909797',
    badge: 'Premium',
    badgeColor: '#ffd740',
  },
  {
    name: 'Stone 750',
    category: 'Wireless Speaker',
    price: 1799,
    mrp: 5990,
    rating: 4.4,
    reviews: 1456,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Stone_750.jpg?v=1699500834',
    badge: null,
  },
  {
    name: 'Airdopes 161',
    category: 'True Wireless',
    price: 999,
    mrp: 2490,
    rating: 4.2,
    reviews: 2678,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/AD_161.jpg?v=1686297917',
    badge: 'Sale',
    badgeColor: '#ff5252',
  },
  {
    name: 'Rockerz 551 ANC',
    category: 'Headphones',
    price: 1999,
    mrp: 5990,
    rating: 4.5,
    reviews: 1102,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Rockerz_551_ANC_75520e83-ecd9-48d4-8d58-cb6ca3c78374.jpg?v=1698912191',
    badge: null,
  },
  {
    name: 'Wave Call',
    category: 'Smart Watch',
    price: 1299,
    mrp: 4990,
    rating: 4.3,
    reviews: 2045,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Wave_Call__1.jpg?v=1689751649',
    badge: 'Popular',
    badgeColor: '#00e676',
  },
];

const FeaturedProducts = () => {
  const router = useRouter();

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Curated for you</p>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Featured Products</h2>
          </div>
          <button
            onClick={() => router.push('/collection/wireless-earphones')}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            View all products
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                {product.badge && (
                  <span
                    className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: product.badgeColor }}
                  >
                    {product.badge}
                  </span>
                )}
                <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
                  <FavoriteBorder sx={{ fontSize: 16, color: '#374151' }} />
                </button>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
                  onClick={() => router.push('/product')}
                />
              </div>

              <div className="p-3 md:p-4">
                <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-medium">{product.category}</p>
                <p
                  className="text-sm md:text-base font-semibold text-gray-900 mt-1 cursor-pointer hover:text-gray-600 transition-colors truncate"
                  onClick={() => router.push('/product')}
                >
                  {product.name}
                </p>

                <div className="flex items-center gap-1 mt-1.5">
                  <Star sx={{ fontSize: 13, color: '#fbbf24' }} />
                  <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviews.toLocaleString()})</span>
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-base md:text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
                  <span className="text-xs font-semibold text-emerald-600">
                    {Math.round((1 - product.price / product.mrp) * 100)}% off
                  </span>
                </div>

                <button className="w-full mt-3 py-2.5 rounded-xl bg-gray-900 text-white text-xs md:text-sm font-medium hover:bg-gray-800 transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
