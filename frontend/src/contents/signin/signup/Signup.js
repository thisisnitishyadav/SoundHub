'use client';
import { useFormik } from 'formik';
import React, { useState, useRef } from 'react';
import { SignUpSchema } from '../../../schema';
import { useDispatch } from 'react-redux';
import { register } from '@/redux/slices/auth';
import { authApi } from '@/mocks/auth';
import { useRouter } from 'next/navigation';
import {
  PersonOutline,
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  CheckCircle,
  ArrowBack,
} from '@mui/icons-material';

const Signup = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('form');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const otpRefs = useRef([]);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } =
    useFormik({
      validationSchema: SignUpSchema,
      initialValues: { name: '', email: '', password: '' },
      onSubmit: async (values, action) => {
        const { name, email, password } = values;
        const result = await dispatch(register({ name, email, password }));
        if (result) {
          setRegisteredEmail(email);
          setSendingOtp(true);
          const otpResult = await authApi.sendResetPasswordOtp({ email });
          setSendingOtp(false);
          if (otpResult?.status === 'SUCCESS') {
            setStep('otp');
          } else {
            setStep('success');
          }
        }
      },
    });

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 4) {
      setOtpError('Please enter the complete OTP');
      return;
    }
    setOtpLoading(true);
    setOtpError('');
    const result = await authApi.validateOtp({ otp: code });
    setOtpLoading(false);
    if (result?.status === 'SUCCESS') {
      setStep('success');
    } else {
      setOtpError(result?.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setSendingOtp(true);
    setOtpError('');
    setOtp(['', '', '', '', '', '']);
    await authApi.sendResetPasswordOtp({ email: registeredEmail });
    setSendingOtp(false);
  };

  // OTP verification step
  if (step === 'otp') {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[400px] text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mx-auto mb-6">
            <EmailOutlined sx={{ fontSize: 28, color: '#7c3aed' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Verify your email</h2>
          <p className="text-sm text-gray-400 mt-2">
            We sent a verification code to
            <br />
            <span className="text-gray-700 font-medium">{registeredEmail}</span>
          </p>

          <div className="flex justify-center gap-2.5 mt-8">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className={`w-11 h-13 text-center text-lg font-semibold border rounded-xl outline-none transition-all ${
                  otpError
                    ? 'border-red-300 bg-red-50/50'
                    : digit
                    ? 'border-gray-900 bg-white'
                    : 'border-gray-200 bg-gray-50 focus:border-gray-900 focus:bg-white'
                }`}
              />
            ))}
          </div>

          {otpError && (
            <p className="text-red-500 text-xs mt-3">{otpError}</p>
          )}

          <button
            onClick={handleVerifyOtp}
            disabled={otpLoading}
            className="w-full h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all mt-6"
          >
            {otpLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              'Verify Email'
            )}
          </button>

          <p className="text-sm text-gray-400 mt-4">
            Didn&apos;t receive the code?{' '}
            <button
              onClick={handleResendOtp}
              disabled={sendingOtp}
              className="text-gray-900 font-medium hover:underline disabled:opacity-50"
            >
              {sendingOtp ? 'Sending...' : 'Resend'}
            </button>
          </p>

          <button
            onClick={() => setStep('success')}
            className="text-xs text-gray-400 hover:text-gray-600 mt-3"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // Success step
  if (step === 'success') {
    return (
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[400px] text-center">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle sx={{ fontSize: 44, color: '#16a34a' }} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Account created!</h2>
          <p className="text-sm text-gray-400 mt-2">
            Your account has been successfully created. Sign in to start shopping.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all mt-8"
          >
            Continue to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Registration form
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
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
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
                    <path d="M2 5L4 7L8 3" stroke="#7c4dff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                  placeholder="Min 6 characters"
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
              disabled={isSubmitting || sendingOtp}
              className="w-full h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting || sendingOtp ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {sendingOtp ? 'Sending verification...' : 'Creating account...'}
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 text-xs text-gray-400">or</span></div>
          </div>

          <a
            href={`${process.env.NEXT_PUBLIC_HOST}/userapp/auth/login/google`}
            className="w-full h-12 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 2.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <button
            onClick={() => router.push('/login')}
            className="w-full h-12 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 mt-3"
          >
            Sign in to existing account
          </button>

          <p className="text-center text-[11px] text-gray-300 mt-8">
            By creating an account, you agree to SoundHub&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
