'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  {
    label: 'Wireless Earbuds',
    value: 'wireless-earphones',
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/131_f04f74fd-45d4-4614-85cf-6ccf69c4cf90.jpg?v=1691395049',
    color: '#edfefe',
  },
  {
    label: 'Smart Watches',
    value: 'smart-watches',
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/boAt-Storm.jpg?v=1682583585',
    color: '#fff1d6',
  },
  {
    label: 'Neckbands',
    value: 'neckbands',
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Nirvana_751_ANC.jpg?v=1698909797',
    color: '#f2edff',
  },
  {
    label: 'Headphones',
    value: 'headphone',
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Rockerz_551_ANC_75520e83-ecd9-48d4-8d58-cb6ca3c78374.jpg?v=1698912191',
    color: '#dfeeeb',
  },
  {
    label: 'Wireless Speakers',
    value: 'wireless-speakers',
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Stone_350.jpg?v=1701847157',
    color: '#e6ecff',
  },
  {
    label: 'Party Speakers',
    value: 'party-speakers',
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Partypal_200.jpg?v=1699524655',
    color: '#ffe8e8',
  },
];

const CategoryShowcase = () => {
  const router = useRouter();

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10 md:mb-14">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Browse</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Shop by Category</h2>
        </div>
        <button
          onClick={() => router.push('/collection/wireless-earphones')}
          className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          View all categories
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-1">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.value}
            onClick={() => router.push(`/collection/${cat.value}`)}
            className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer aspect-[4/3] md:aspect-[3/2]"
            style={{ backgroundColor: cat.color }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={cat.image}
              alt={cat.label}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-6">
              <p className="text-sm md:text-lg font-semibold text-white drop-shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {cat.label}
              </p>
              <p className="text-xs text-white/0 group-hover:text-white/70 transition-all duration-300 translate-y-4 group-hover:translate-y-0 mt-1">
                Shop now →
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
