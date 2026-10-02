'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '@/redux/slices/product';
import { createCart } from '@/redux/slices/cart';
import { getUser } from '@/redux/slices/auth';
import { initWishlist, toggleWishlist } from '@/redux/slices/wishlist';
import {
  Star,
  LocalShipping,
  Timer,
  FavoriteBorder,
  Favorite,
  Share,
  ShieldOutlined,
  Replay,
  VerifiedUser,
  CheckCircle,
  ArrowForward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';

const Products = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { product } = useSelector((state) => state.product);
  const params = useParams();

  const wishlistItems = useSelector((state) => state.wishlist.items);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [qty, setQty] = useState(1);

  const wishlisted = wishlistItems.some((i) => i.id === product?.id);

  const colors = [
    { name: 'Midnight Black', hex: '#1a1a1a' },
    { name: 'Pearl White', hex: '#f0ece3' },
    { name: 'Ocean Blue', hex: '#2563eb' },
    { name: 'Rose Gold', hex: '#d4a373' },
    { name: 'Forest Green', hex: '#3e5844' },
    { name: 'Slate Grey', hex: '#64748b' },
  ];

  useEffect(() => {
    dispatch(getProduct(params.productItem));
    dispatch(getUser());
    dispatch(initWishlist());
  }, [params.productItem]);

  const allImages = [
    product?.image,
    ...(product?.productImages?.map((img) => img.path) || []),
  ].filter(Boolean);

  const handleCreateCart = async () => {
    if (!user?.id) {
      router.push('/login');
      return;
    }
    setAddingToCart(true);
    const data = {
      userId: user.id,
      products: [{ productId: product?.id, qty }],
    };
    const result = await dispatch(createCart(data));
    setAddingToCart(false);
    if (result) router.push(`/cart/${product?.id}`);
  };

  const handleBuyNow = async () => {
    if (!user?.id) {
      router.push('/login');
      return;
    }
    setAddingToCart(true);
    const data = {
      userId: user.id,
      products: [{ productId: product?.id, qty }],
    };
    const result = await dispatch(createCart(data));
    setAddingToCart(false);
    if (result) router.push(`/checkout/${product?.id}`);
  };

  const discount = product?.price?.mrp && product?.price?.cost
    ? Math.round((1 - product.price.cost / product.price.mrp) * 100)
    : null;

  if (!product?.id) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-neutral-200 border-t-neutral-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="hover:text-neutral-600 cursor-pointer transition-colors" onClick={() => router.push('/')}>Home</span>
          <span>/</span>
          <span className="hover:text-neutral-600 cursor-pointer transition-colors" onClick={() => router.push(`/collection/${product?.category}`)}>
            {product?.category?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Products'}
          </span>
          <span>/</span>
          <span className="text-neutral-600">{product?.title?.shortTitle}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left: Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[560px] shrink-0">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-16 lg:w-[72px] lg:h-[72px] rounded-xl border-2 overflow-hidden transition-all ${
                      selectedImage === i
                        ? 'border-neutral-900 shadow-sm'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 group">
              <div className="aspect-square lg:aspect-[4/5] rounded-2xl lg:rounded-3xl overflow-hidden bg-neutral-50 border border-neutral-100">
                <img
                  src={allImages[selectedImage] || product?.image}
                  alt={product?.title?.shortTitle}
                  className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Image nav arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <KeyboardArrowLeft sx={{ fontSize: 22 }} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <KeyboardArrowRight sx={{ fontSize: 22 }} />
                  </button>
                </>
              )}

              {/* Floating actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => product?.id && dispatch(toggleWishlist({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                  }))}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                >
                  {wishlisted ? (
                    <Favorite sx={{ fontSize: 20, color: '#ef4444' }} />
                  ) : (
                    <FavoriteBorder sx={{ fontSize: 20, color: '#525252' }} />
                  )}
                </button>
                <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                  <Share sx={{ fontSize: 18, color: '#525252' }} />
                </button>
              </div>

              {/* Discount badge */}
              {product?.price?.discount && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold">
                  {product.price.discount}
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:py-2">
            {/* Rating */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                <Star sx={{ fontSize: 14 }} />
                <span>4.8</span>
              </div>
              <span className="text-sm text-neutral-400">1,339 ratings</span>
              <span className="text-neutral-200">|</span>
              <span className="text-sm text-neutral-400">824 reviews</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-neutral-900 leading-tight tracking-tight">
              {product?.title?.shortTitle}
            </h1>
            {product?.title?.longTitle && (
              <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
                {product.title.longTitle}
              </p>
            )}
            {product?.tagLine && (
              <p className="text-sm text-neutral-500 mt-1">{product.tagLine}</p>
            )}

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3 mt-5 pb-5 border-b border-neutral-100">
              <span className="text-3xl lg:text-4xl font-bold text-neutral-900">
                &#8377;{product?.price?.cost?.toLocaleString()}
              </span>
              {product?.price?.mrp && (
                <span className="text-lg text-neutral-400 line-through">
                  &#8377;{product?.price?.mrp?.toLocaleString()}
                </span>
              )}
              {discount && (
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {discount}% off
                </span>
              )}
            </div>

            {/* Offer timer */}
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200/60 px-4 py-3 rounded-xl mt-5">
              <Timer sx={{ fontSize: 20, color: '#d97706' }} />
              <div>
                <p className="text-sm font-semibold text-amber-800">Limited time offer</p>
                <p className="text-xs text-amber-600">Ends in 5h 18m 36s</p>
              </div>
            </div>

            {/* Color selector */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-semibold text-neutral-800">Color:</span>
                <span className="text-sm text-neutral-500">{colors[selectedColor].name}</span>
              </div>
              <div className="flex gap-2">
                {colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    className={`w-10 h-10 rounded-xl border-2 transition-all ${
                      selectedColor === i
                        ? 'border-neutral-900 scale-110 shadow-md'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <span className="text-sm font-semibold text-neutral-800 block mb-2">Quantity</span>
              <div className="inline-flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold border-x border-neutral-200">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  className="w-10 h-10 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mt-7">
              <button
                onClick={handleCreateCart}
                disabled={addingToCart}
                className="flex-1 h-13 py-3.5 bg-neutral-900 text-white rounded-xl text-[15px] font-semibold hover:bg-neutral-800 disabled:bg-neutral-400 transition-colors flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Add to Cart'
                )}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="flex-1 h-13 py-3.5 bg-emerald-600 text-white rounded-xl text-[15px] font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
              >
                Buy Now
                <ArrowForward sx={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 px-4 py-3 rounded-xl mt-6">
              <LocalShipping sx={{ fontSize: 20, color: '#525252' }} />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-700">Free delivery</p>
                <p className="text-xs text-neutral-400">Estimated 3-5 business days</p>
              </div>
              <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Change pincode</span>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: ShieldOutlined, text: '1 Year Warranty' },
                { icon: Replay, text: '7 Day Return' },
                { icon: VerifiedUser, text: '100% Genuine' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 py-3 px-2 bg-neutral-50 rounded-xl border border-neutral-100 text-center">
                  <Icon sx={{ fontSize: 20, color: '#525252' }} />
                  <span className="text-[11px] font-medium text-neutral-600">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Highlights */}
        <div className="mt-12 lg:mt-20 border-t border-neutral-100 pt-10">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Product Highlights</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { img: '//cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_334305_small.svg?v=1682336123', title: '1 Year Warranty', desc: 'Hassle-free replacement' },
              { img: '//cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_334304_small.svg?v=1682336123', title: '7-Day Replacement', desc: 'No questions asked' },
              { img: '//cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_334303_small.svg?v=1682336123', title: 'Free Shipping', desc: 'On all prepaid orders' },
              { img: '//cdn.shopify.com/s/files/1/0057/8938/4802/files/Group_334302_small.svg?v=1682336123', title: 'GST Billing', desc: 'Available on request' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                <img src={item.img} alt={item.title} className="h-10 mb-3 opacity-80" />
                <p className="text-sm font-semibold text-neutral-800">{item.title}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specs / Description */}
        <div className="mt-12 border-t border-neutral-100 pt-10 pb-8">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 max-w-3xl">
            {[
              ['Category', product?.category?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())],
              ['Brand', 'SoundHub'],
              ['Model', product?.title?.shortTitle],
              ['Connectivity', 'Wireless / Bluetooth 5.3'],
              ['Battery Life', 'Up to 60 Hours'],
              ['Water Resistance', 'IPX5'],
              ['Driver Size', '13mm'],
              ['Warranty', '1 Year'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5 border-b border-neutral-100">
                <span className="text-sm text-neutral-500">{label}</span>
                <span className="text-sm font-medium text-neutral-800">{value || '-'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
