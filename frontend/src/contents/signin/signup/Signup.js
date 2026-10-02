'use client'
import { useFormik } from "formik";
import React, { useState } from 'react'
import { SignUpSchema } from "../../../schema";
import { useDispatch } from "react-redux";
import { register } from '@/redux/slices/auth';
import { useRouter } from 'next/navigation';
import { PersonOutline, EmailOutlined, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const initialValue = {
    name: "",
    email: "",
    password: "",
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useFormik({
    validationSchema: SignUpSchema,
    initialValues: initialValue,
    onSubmit: async (values, action) => {
      const { name, email, password } = values;
      const data = { name, email, password };
      const result = await dispatch(register(data));
      if (result) {
        alert("Registered Successfully");
        router.push("/login");
        action.resetForm();
      }
    },
  });

  return (
    <div className="min-h-[calc(100vh-70px)] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] relative overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #7c4dff40 0%, transparent 70%)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="relative z-10 px-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-[#7c4dff] animate-pulse" />
            <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Join Us</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
            Start your<br />
            <span className="text-[#7c4dff]">audio journey.</span>
          </h1>

          <p className="text-white/40 mt-6 text-base leading-relaxed">
            Create an account to unlock exclusive deals, early access to new launches, and a personalized shopping experience.
          </p>

          <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
            {[
              { label: 'Exclusive member deals', desc: 'Up to 70% off on select products' },
              { label: 'Early access', desc: 'Be the first to shop new drops' },
              { label: 'Free shipping', desc: 'On all orders above ₹499' },
            ].map((perk) => (
              <div key={perk.label} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#7c4dff]/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="#7c4dff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{perk.label}</p>
                  <p className="text-xs text-white/30">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <img
              src="https://soundhub.io/wp-content/uploads/2023/08/SoundHub-Logo-2048x410.png"
              alt="SoundHub"
              className="h-7 mb-8 cursor-pointer"
              onClick={() => router.push('/')}
            />
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create your account</h2>
            <p className="text-sm text-gray-400 mt-1.5">Fill in the details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                  <PersonOutline sx={{ fontSize: 18 }} />
                </div>
                <input
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full h-12 pl-10 pr-4 border rounded-xl text-sm transition-all placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 ${
                    errors.name && touched.name ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                  }`}
                />
              </div>
              {errors.name && touched.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                  <EmailOutlined sx={{ fontSize: 18 }} />
                </div>
                <input
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full h-12 pl-10 pr-4 border rounded-xl text-sm transition-all placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 ${
                    errors.email && touched.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                  }`}
                />
              </div>
              {errors.email && touched.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                  <LockOutlined sx={{ fontSize: 18 }} />
                </div>
                <input
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  className={`w-full h-12 pl-10 pr-11 border rounded-xl text-sm transition-all placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 ${
                    errors.password && touched.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                </button>
              </div>
              {errors.password && touched.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs text-gray-400">or</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="w-full h-12 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
          >
            Sign in to existing account
          </button>

          <p className="text-center text-[11px] text-gray-300 mt-8">
            By creating an account, you agree to SoundHub&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup;
