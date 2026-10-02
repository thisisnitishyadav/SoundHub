const FEATURED_KEY = 'soundhub_featured_products';
const TRENDING_KEY = 'soundhub_trending_products';

export const defaultFeatured = [
  {
    id: 'featured-1',
    name: 'Airdopes 131',
    category: 'wireless-earphones',
    categoryLabel: 'True Wireless',
    price: 899,
    mrp: 2999,
    rating: 4.5,
    reviews: 2341,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/131_f04f74fd-45d4-4614-85cf-6ccf69c4cf90.jpg?v=1691395049',
    badge: 'Best Seller',
    badgeColor: '#0a0a0a',
  },
  {
    id: 'featured-2',
    name: 'Airdopes 141',
    category: 'wireless-earphones',
    categoryLabel: 'True Wireless',
    price: 1299,
    mrp: 4490,
    rating: 4.3,
    reviews: 1823,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/AD_141.png?v=1703145765',
    badge: 'New',
    badgeColor: '#00e5ff',
  },
  {
    id: 'featured-3',
    name: 'Storm Smartwatch',
    category: 'smart-watches',
    categoryLabel: 'Smart Watch',
    price: 1499,
    mrp: 5999,
    rating: 4.6,
    reviews: 3120,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/boAt-Storm.jpg?v=1682583585',
    badge: 'Trending',
    badgeColor: '#7c4dff',
  },
  {
    id: 'featured-4',
    name: 'Nirvana 751 ANC',
    category: 'headphone',
    categoryLabel: 'Headphones',
    price: 2499,
    mrp: 7990,
    rating: 4.7,
    reviews: 987,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Nirvana_751_ANC.jpg?v=1698909797',
    badge: 'Premium',
    badgeColor: '#ffd740',
  },
  {
    id: 'featured-5',
    name: 'Stone 750',
    category: 'wireless-speakers',
    categoryLabel: 'Wireless Speaker',
    price: 1799,
    mrp: 5990,
    rating: 4.4,
    reviews: 1456,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Stone_750.jpg?v=1699500834',
    badge: null,
    badgeColor: null,
  },
  {
    id: 'featured-6',
    name: 'Airdopes 161',
    category: 'wireless-earphones',
    categoryLabel: 'True Wireless',
    price: 999,
    mrp: 2490,
    rating: 4.2,
    reviews: 2678,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/AD_161.jpg?v=1686297917',
    badge: 'Sale',
    badgeColor: '#ff5252',
  },
  {
    id: 'featured-7',
    name: 'Rockerz 551 ANC',
    category: 'headphone',
    categoryLabel: 'Headphones',
    price: 1999,
    mrp: 5990,
    rating: 4.5,
    reviews: 1102,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Rockerz_551_ANC_75520e83-ecd9-48d4-8d58-cb6ca3c78374.jpg?v=1698912191',
    badge: null,
    badgeColor: null,
  },
  {
    id: 'featured-8',
    name: 'Wave Call',
    category: 'smart-watches',
    categoryLabel: 'Smart Watch',
    price: 1299,
    mrp: 4990,
    rating: 4.3,
    reviews: 2045,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Wave_Call__1.jpg?v=1689751649',
    badge: 'Popular',
    badgeColor: '#00e676',
  },
];

export const defaultTrending = [
  {
    id: 'trending-1',
    name: 'Airdopes 121 v2',
    category: 'wireless-earphones',
    tagline: '8mm Drivers | BEAST Mode',
    price: 1299,
    mrp: 2999,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/121v2.png?v=1701427775',
    rating: 4.4,
  },
  {
    id: 'trending-2',
    name: 'Xtend Smartwatch',
    category: 'smart-watches',
    tagline: 'Alexa Enabled | AMOLED',
    price: 1677,
    mrp: 7964,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Xtend_6a57e3cd-0fa0-47ac-a46e-ea788a526627.jpg?v=1682583585',
    rating: 4.6,
  },
  {
    id: 'trending-3',
    name: 'Stone 350 Speaker',
    category: 'wireless-speakers',
    tagline: '10W Output | IPX7',
    price: 1499,
    mrp: 3490,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Stone_350.jpg?v=1701847157',
    rating: 4.3,
  },
  {
    id: 'trending-4',
    name: 'Storm Call Watch',
    category: 'smart-watches',
    tagline: 'BT Calling | SpO2',
    price: 1499,
    mrp: 7364,
    image: 'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/Stormcall_1.webp?v=1709108774',
    rating: 4.5,
  },
];

export function getFeaturedProducts() {
  if (typeof window === 'undefined') return defaultFeatured;
  try {
    const raw = localStorage.getItem(FEATURED_KEY);
    return raw ? JSON.parse(raw) : defaultFeatured;
  } catch {
    return defaultFeatured;
  }
}

export function setFeaturedProducts(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FEATURED_KEY, JSON.stringify(items));
}

export function getTrendingProducts() {
  if (typeof window === 'undefined') return defaultTrending;
  try {
    const raw = localStorage.getItem(TRENDING_KEY);
    return raw ? JSON.parse(raw) : defaultTrending;
  } catch {
    return defaultTrending;
  }
}

export function setTrendingProducts(items) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TRENDING_KEY, JSON.stringify(items));
}

export function dbProductToFeatured(p) {
  return {
    id: p.id,
    name: p.title?.shortTitle || p.title?.longTitle || 'Product',
    category: p.category || '',
    categoryLabel: p.category?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '',
    price: p.price?.cost || 0,
    mrp: p.price?.mrp || 0,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 3000) + 500,
    image: p.image || '',
    badge: null,
    badgeColor: null,
  };
}

export function dbProductToTrending(p) {
  return {
    id: p.id,
    name: p.title?.shortTitle || p.title?.longTitle || 'Product',
    category: p.category || '',
    tagline: p.tagLine || p.title?.longTitle || '',
    price: p.price?.cost || 0,
    mrp: p.price?.mrp || 0,
    image: p.image || '',
    rating: 4.5,
  };
}
