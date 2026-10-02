'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from '@/redux/store/store';
import { useFormik } from 'formik';
import { getUser, updateUser } from '@/redux/slices/auth';
import { readCart, deleteMany } from '@/redux/slices/cart';
import { createOrder } from '@/redux/slices/order';
import {
  LocalShipping,
  ShieldOutlined,
  CheckCircle,
  Add,
  Edit,
  ArrowForward,
  ArrowBack,
  CreditCard,
  AccountBalance,
  Payments,
  Payment,
  Lock,
} from '@mui/icons-material';

const STEPS = ['Address', 'Review', 'Payment'];

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { carts } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editAddressIndex, setEditAddressIndex] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) return;
    dispatch(readCart(1, 10, { isDeleted: false, userId: user.id }));
    if (!user.address || user.address.length === 0) {
      setShowAddressForm(true);
    }
  }, [user?.id]);

  const addresses = user?.address || [];

  let subtotal = 0;
  let mrpTotal = 0;
  let itemCount = 0;
  for (const cart of carts || []) {
    for (const product of cart.products || []) {
      subtotal += (product.productId?.price?.cost || 0);
      mrpTotal += (product.productId?.price?.mrp || 0);
      itemCount++;
    }
  }
  const discount = mrpTotal - subtotal;
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  const addressFormik = useFormik({
    initialValues: { locality: '', city: '', state: '', country: 'India', zipcode: '' },
    onSubmit: async (values, { resetForm }) => {
      const updated = [...addresses];
      if (editAddressIndex !== null) {
        updated[editAddressIndex] = values;
      } else {
        updated.push(values);
      }
      await dispatch(updateUser({ address: updated }, user.id));
      await dispatch(getUser());
      resetForm();
      setShowAddressForm(false);
      setEditAddressIndex(null);
      setSelectedAddress(editAddressIndex !== null ? editAddressIndex : updated.length - 1);
    },
  });

  const openEditAddress = (index) => {
    setEditAddressIndex(index);
    addressFormik.setValues({ ...addresses[index] });
    setShowAddressForm(true);
  };

  const openNewAddress = () => {
    setEditAddressIndex(null);
    addressFormik.resetForm();
    setShowAddressForm(false);
    setTimeout(() => setShowAddressForm(true), 0);
  };

  const handlePlaceOrder = async () => {
    if (!carts || carts.length === 0) return;

    setPlacing(true);
    const products = carts.flatMap((cart) =>
      cart.products.map((p) => ({
        productId: p.productId?.id || p.productId,
        qty: p.qty || 1,
      }))
    );

    const orderData = {
      userId: user.id,
      products,
      address: addresses[selectedAddress] || {},
      status: 'pending',
    };

    const result = await dispatch(createOrder(orderData));
    if (result) {
      const ids = carts.map((c) => c.id);
      await dispatch(deleteMany(ids));
      setOrderPlaced(true);
    } else {
      alert('Failed to place order. Please try again.');
    }
    setPlacing(false);
  };

  // Redirect if no items
  if ((!carts || carts.length === 0) && !orderPlaced) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-neutral-800">Your cart is empty</p>
          <p className="text-sm text-neutral-400 mt-1">Add items to checkout.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Order placed success
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-b from-emerald-50/50 to-white">
        <div className="w-full max-w-md text-center">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle sx={{ fontSize: 44, color: '#16a34a' }} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Order Placed!</h1>
          <p className="text-neutral-500 mt-2">
            Your order has been placed successfully. You'll receive a confirmation shortly.
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => router.push('/orders')}
              className="w-full h-12 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
            >
              View My Orders <ArrowForward sx={{ fontSize: 16 }} />
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full h-11 text-neutral-600 text-sm font-medium hover:text-neutral-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { key: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: Payments },
    { key: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Payment },
    { key: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
    { key: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: AccountBalance },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header + Stepper */}
        <div className="mb-8">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : router.back()}
            className="flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 transition-colors mb-4"
          >
            <ArrowBack sx={{ fontSize: 16 }} />
            {step > 0 ? 'Back' : 'Back to Cart'}
          </button>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Checkout</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-5">
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 ${i <= step ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i < step
                        ? 'bg-emerald-500 text-white'
                        : i === step
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-200 text-neutral-400'
                    }`}
                  >
                    {i < step ? <CheckCircle sx={{ fontSize: 16 }} /> : i + 1}
                  </div>
                  <span
                    className={`text-sm font-medium hidden sm:block ${
                      i <= step ? 'text-neutral-800' : 'text-neutral-400'
                    }`}
                  >
                    {label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 rounded ${
                      i < step ? 'bg-emerald-500' : 'bg-neutral-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Step Content */}
          <div className="flex-1 min-w-0">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-neutral-900">Delivery Address</h2>

                {/* Saved addresses */}
                {addresses.length > 0 && !showAddressForm && (
                  <div className="space-y-3">
                    {addresses.map((addr, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedAddress(i)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                          selectedAddress === i
                            ? 'border-neutral-900 bg-white shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                                selectedAddress === i ? 'border-neutral-900' : 'border-neutral-300'
                              }`}
                            >
                              {selectedAddress === i && (
                                <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-neutral-800">
                                {addr.locality || 'Address'}
                              </p>
                              <p className="text-xs text-neutral-500 mt-0.5">
                                {[addr.city, addr.state].filter(Boolean).join(', ')}
                                {addr.zipcode && ` - ${addr.zipcode}`}
                              </p>
                              {addr.country && (
                                <p className="text-xs text-neutral-400">{addr.country}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditAddress(i); }}
                            className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
                          >
                            <Edit sx={{ fontSize: 16 }} />
                          </button>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={openNewAddress}
                      className="w-full flex items-center justify-center gap-2 h-12 border-2 border-dashed border-neutral-300 rounded-2xl text-sm font-medium text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      <Add sx={{ fontSize: 18 }} />
                      Add New Address
                    </button>
                  </div>
                )}

                {/* Address form */}
                {showAddressForm && (
                  <form
                    onSubmit={addressFormik.handleSubmit}
                    className="bg-white rounded-2xl border border-neutral-200 p-5 space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {editAddressIndex !== null ? 'Edit Address' : 'New Address'}
                    </h3>
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Address / Locality</label>
                      <input
                        name="locality"
                        value={addressFormik.values.locality}
                        onChange={addressFormik.handleChange}
                        required
                        placeholder="Street, area, landmark"
                        className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">City</label>
                        <input
                          name="city"
                          value={addressFormik.values.city}
                          onChange={addressFormik.handleChange}
                          required
                          className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">State</label>
                        <input
                          name="state"
                          value={addressFormik.values.state}
                          onChange={addressFormik.handleChange}
                          required
                          className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">Pincode</label>
                        <input
                          name="zipcode"
                          type="number"
                          value={addressFormik.values.zipcode}
                          onChange={addressFormik.handleChange}
                          required
                          className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-600 mb-1">Country</label>
                        <input
                          name="country"
                          value={addressFormik.values.country}
                          onChange={addressFormik.handleChange}
                          className="w-full h-10 px-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl outline-none focus:border-neutral-400 focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button
                        type="submit"
                        className="h-10 px-5 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors"
                      >
                        {editAddressIndex !== null ? 'Update Address' : 'Save Address'}
                      </button>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => { setShowAddressForm(false); setEditAddressIndex(null); }}
                          className="h-10 px-4 text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Continue */}
                {addresses.length > 0 && !showAddressForm && (
                  <button
                    onClick={() => setStep(1)}
                    className="w-full h-12 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    Continue to Review <ArrowForward sx={{ fontSize: 16 }} />
                  </button>
                )}
              </div>
            )}

            {/* Step 1: Order Review */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-neutral-900">Review Your Order</h2>

                {/* Delivery address summary */}
                {addresses[selectedAddress] && (
                  <div className="bg-white rounded-2xl border border-neutral-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Delivering to</p>
                      <button
                        onClick={() => setStep(0)}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-sm font-medium text-neutral-800">
                      {addresses[selectedAddress].locality}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {[addresses[selectedAddress].city, addresses[selectedAddress].state, addresses[selectedAddress].zipcode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                )}

                {/* Cart items */}
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </p>
                  </div>
                  <div className="divide-y divide-neutral-100">
                    {carts?.map((cart, ci) =>
                      cart.products?.map((item, pi) => (
                        <div key={`${ci}-${pi}`} className="flex gap-4 p-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                            {item.productId?.image && (
                              <img
                                src={item.productId.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-800 truncate">
                              {item.productId?.title?.shortTitle || 'Product'}
                            </p>
                            <p className="text-xs text-neutral-400 mt-0.5 truncate">
                              {item.productId?.title?.longTitle}
                            </p>
                            <div className="flex items-baseline gap-2 mt-1.5">
                              <span className="text-sm font-bold text-neutral-900">
                                ₹{(item.productId?.price?.cost || 0).toLocaleString()}
                              </span>
                              {item.productId?.price?.mrp && item.productId.price.mrp !== item.productId.price.cost && (
                                <span className="text-xs text-neutral-400 line-through">
                                  ₹{item.productId.price.mrp.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 mt-1">Qty: {item.qty || 1}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full h-12 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowForward sx={{ fontSize: 16 }} />
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-base font-semibold text-neutral-900">Payment Method</h2>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.key}
                        onClick={() => setSelectedPayment(method.key)}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                          selectedPayment === method.key
                            ? 'border-neutral-900 bg-white shadow-sm'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedPayment === method.key ? 'border-neutral-900' : 'border-neutral-300'
                          }`}
                        >
                          {selectedPayment === method.key && (
                            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                          <Icon sx={{ fontSize: 20, color: '#525252' }} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-800">{method.label}</p>
                          <p className="text-xs text-neutral-400">{method.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="w-full h-12 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:bg-emerald-400 transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  {placing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <Lock sx={{ fontSize: 16 }} />
                      Place Order — ₹{total.toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right: Order Summary (always visible) */}
          <div className="lg:w-[320px] shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-neutral-200 p-5">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
                  Order Summary
                </h3>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Subtotal ({itemCount} items)</span>
                    <span className="font-medium text-neutral-800">₹{mrpTotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Discount</span>
                      <span className="font-medium text-emerald-600">- ₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Shipping</span>
                    <span className="font-medium text-emerald-600">
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-neutral-200 my-2" />
                  <div className="flex justify-between">
                    <span className="font-bold text-neutral-900">Total</span>
                    <span className="text-lg font-bold text-neutral-900">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {discount > 0 && (
                  <div className="mt-3 px-3 py-2 bg-emerald-50 rounded-lg text-xs font-medium text-emerald-700 text-center">
                    You're saving ₹{discount.toLocaleString()} on this order!
                  </div>
                )}
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldOutlined sx={{ fontSize: 18, color: '#a3a3a3' }} />
                  <span className="text-xs text-neutral-500">100% Secure Payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <LocalShipping sx={{ fontSize: 18, color: '#a3a3a3' }} />
                  <span className="text-xs text-neutral-500">Free shipping on orders above ₹499</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
