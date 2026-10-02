'use client'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '@/redux/slices/product';
import { createCart } from '@/redux/slices/cart';
import { initWishlist, toggleWishlist } from '@/redux/slices/wishlist';
import { FilterList, Close, Star, FavoriteBorder, Favorite, GridView, ViewList, KeyboardArrowDown } from '@mui/icons-material';

const PRICE_FILTERS = [
  { key: 'ab', label: 'Under ₹1,000', min: 0, max: 1000 },
  { key: 'bc', label: '₹1,000 – ₹2,000', min: 1000, max: 2000 },
  { key: 'cd', label: '₹2,000 – ₹3,000', min: 2000, max: 3000 },
  { key: 'de', label: '₹3,000 – ₹5,000', min: 3000, max: 5000 },
  { key: 'ef', label: 'Above ₹5,000', min: 5000, max: 99999 },
];

const DISCOUNT_FILTERS = [
  { key: 'abc', label: 'Up to 20% off' },
  { key: 'bcd', label: '20% – 40% off' },
  { key: 'cde', label: '40% – 60% off' },
  { key: 'def', label: 'Above 60% off' },
];

const FEATURE_FILTERS = [
  { key: 'f1', label: 'Fast Charging' },
  { key: 'f2', label: 'Noise Cancellation' },
  { key: 'f3', label: 'Water Resistant' },
  { key: 'f4', label: 'Voice Assistant' },
];

const COLOR_FILTERS = [
  { key: 'c1', label: 'Black', color: '#111' },
  { key: 'c2', label: 'White', color: '#f5f5f5' },
  { key: 'c3', label: 'Blue', color: '#3b82f6' },
  { key: 'c4', label: 'Red', color: '#ef4444' },
  { key: 'c5', label: 'Green', color: '#22c55e' },
];

const ProductCollection = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const params = useParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Popular');
  const [expandedSections, setExpandedSections] = useState({ price: true, discount: false, features: false, colors: false });

  const [priceState, setPriceState] = useState({});
  const [discountState, setDiscountState] = useState({});

  const toggleSection = (key) => setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handlePriceChange = (key) => setPriceState((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleDiscountChange = (key) => setDiscountState((prev) => ({ ...prev, [key]: !prev[key] }));

  const activeFilterCount = Object.values(priceState).filter(Boolean).length + Object.values(discountState).filter(Boolean).length;

  const clearAllFilters = () => {
    setPriceState({});
    setDiscountState({});
  };

  useEffect(() => {
    const getProductData = async () => {
      let price = { "$or": [] };
      PRICE_FILTERS.forEach((f) => {
        if (priceState[f.key]) price.$or.push({ "price.mrp": { "$gte": f.min, "$lte": f.max } });
      });
      let query = { "$and": [{ "category": { "$regex": params.productId, "$options": "i" } }, price] };
      await dispatch(getProducts(1, 12, query));
    };
    getProductData();
  }, [params, priceState, discountState]);

  useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(getProducts(1, 12, { "title.longTitle": { "$regex": params?.productId }, "$options": "i" }));
    };
    fetchProducts();
    dispatch(initWishlist());
  }, [params]);

  const categoryName = params.productId?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const FilterSidebar = ({ mobile = false }) => (
    <div className={mobile ? '' : ''}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button onClick={clearAllFilters} className="text-xs text-gray-400 hover:text-gray-900 font-medium transition-colors">
            Clear all
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
            <Close sx={{ fontSize: 20 }} />
          </button>
        )}
      </div>

      <div className="space-y-1">
        <div className="border-b border-gray-100 pb-4 mb-4">
          <button onClick={() => toggleSection('price')} className="flex items-center justify-between w-full py-1.5 group">
            <span className="text-sm font-semibold text-gray-800">Price</span>
            <KeyboardArrowDown
              sx={{ fontSize: 18, color: '#9ca3af', transform: expandedSections.price ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>
          {expandedSections.price && (
            <div className="mt-3 space-y-1">
              {PRICE_FILTERS.map((f) => (
                <label key={f.key} className="flex items-center gap-3 py-1.5 cursor-pointer group/item">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    priceState[f.key] ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover/item:border-gray-400'
                  }`}>
                    {priceState[f.key] && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm transition-colors ${priceState[f.key] ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {f.label}
                  </span>
                  <input type="checkbox" className="hidden" checked={!!priceState[f.key]} onChange={() => handlePriceChange(f.key)} />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-gray-100 pb-4 mb-4">
          <button onClick={() => toggleSection('discount')} className="flex items-center justify-between w-full py-1.5">
            <span className="text-sm font-semibold text-gray-800">Discount</span>
            <KeyboardArrowDown
              sx={{ fontSize: 18, color: '#9ca3af', transform: expandedSections.discount ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>
          {expandedSections.discount && (
            <div className="mt-3 space-y-1">
              {DISCOUNT_FILTERS.map((f) => (
                <label key={f.key} className="flex items-center gap-3 py-1.5 cursor-pointer group/item">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                    discountState[f.key] ? 'bg-gray-900 border-gray-900' : 'border-gray-300 group-hover/item:border-gray-400'
                  }`}>
                    {discountState[f.key] && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm transition-colors ${discountState[f.key] ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {f.label}
                  </span>
                  <input type="checkbox" className="hidden" checked={!!discountState[f.key]} onChange={() => handleDiscountChange(f.key)} />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-gray-100 pb-4 mb-4">
          <button onClick={() => toggleSection('colors')} className="flex items-center justify-between w-full py-1.5">
            <span className="text-sm font-semibold text-gray-800">Color</span>
            <KeyboardArrowDown
              sx={{ fontSize: 18, color: '#9ca3af', transform: expandedSections.colors ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>
          {expandedSections.colors && (
            <div className="mt-3 flex flex-wrap gap-2">
              {COLOR_FILTERS.map((c) => (
                <button
                  key={c.key}
                  className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors relative"
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          )}
        </div>

        <div className="pb-4">
          <button onClick={() => toggleSection('features')} className="flex items-center justify-between w-full py-1.5">
            <span className="text-sm font-semibold text-gray-800">Features</span>
            <KeyboardArrowDown
              sx={{ fontSize: 18, color: '#9ca3af', transform: expandedSections.features ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
            />
          </button>
          {expandedSections.features && (
            <div className="mt-3 flex flex-wrap gap-2">
              {FEATURE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all"
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50/80 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <span className="hover:text-gray-600 cursor-pointer transition-colors" onClick={() => router.push('/')}>Home</span>
            <span>/</span>
            <span className="text-gray-600">{categoryName}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">{categoryName}</h1>
          <p className="text-sm text-gray-400 mt-1.5">
            {data ? data.length : 0} products found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
          >
            <FilterList sx={{ fontSize: 18 }} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="hidden md:block" />

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors"
            >
              Sort: {sortBy}
              <KeyboardArrowDown sx={{ fontSize: 18, color: '#9ca3af' }} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl shadow-black/5 py-1 min-w-[180px] z-20">
                {['Popular', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Rating'].map((option) => (
                  <button
                    key={option}
                    onClick={() => { setSortBy(option); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortBy === option ? 'text-gray-900 font-medium bg-gray-50' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block w-60 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </div>

          <div className="flex-1">
            {data && data.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {data.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                      {item.price?.discount && (
                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white">
                          {item.price.discount}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(toggleWishlist({
                            id: item.id,
                            title: item.title,
                            price: item.price,
                            image: item.image,
                            category: item.category,
                          }));
                        }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                      >
                        {wishlistItems.some((w) => w.id === item.id) ? (
                          <Favorite sx={{ fontSize: 16, color: '#ef4444' }} />
                        ) : (
                          <FavoriteBorder sx={{ fontSize: 16, color: '#374151' }} />
                        )}
                      </button>
                      <img
                        src={item.image}
                        alt={item?.title?.shortTitle}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
                        onClick={() => router.push(`/product/${item?.id}`)}
                      />
                      <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!user?.id) { router.push('/login'); return; }
                            dispatch(createCart({ userId: user.id, products: [{ productId: item.id, qty: 1 }] }))
                              .then((result) => { if (result) router.push(`/cart/${item.id}`); });
                          }}
                          className="w-full py-2.5 rounded-xl bg-gray-900/90 backdrop-blur-sm text-white text-xs font-medium hover:bg-gray-900 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 md:p-4">
                      <p className="text-xs text-gray-400 truncate">{item.title?.longTitle}</p>
                      <p
                        className="text-sm font-semibold text-gray-900 mt-1 cursor-pointer hover:text-gray-600 transition-colors truncate"
                        onClick={() => router.push(`/product/${item?.id}`)}
                      >
                        {item?.title?.shortTitle}
                      </p>

                      <div className="flex items-center gap-1 mt-1.5">
                        <Star sx={{ fontSize: 13, color: '#fbbf24' }} />
                        <span className="text-xs font-medium text-gray-600">4.5</span>
                        <span className="text-xs text-gray-300">(1.2k)</span>
                      </div>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base font-bold text-gray-900">₹{item.price?.mrp?.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 line-through">₹{item.price?.cost?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                  <FilterList sx={{ fontSize: 24, color: '#d1d5db' }} />
                </div>
                <p className="text-base font-semibold text-gray-900">No products found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms</p>
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="mt-4 text-sm font-medium text-gray-900 underline underline-offset-4 hover:no-underline">
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFilterOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-4" />
            <FilterSidebar mobile />
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full mt-6 h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
            >
              Show {data?.length || 0} Results
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCollection;
