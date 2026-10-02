'use client';
import { useFormik } from 'formik';
import React, { useState, useRef } from 'react';
import { LoginSchema } from '../../../schema/Login';
import { useRouter } from 'next/navigation';
import { login } from '@/redux/slices/auth';
import { useDispatch } from 'react-redux';
import { authApi } from '@/mocks/auth';
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  LockOutlined,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';

const Login = ({ setDilogOpen }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password state
  const [forgotStep, setForgotStep] = useState(null); // null | 'email' | 'otp' | 'newPassword' | 'done'
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const otpRefs = useRef([]);

  const handleClear = () => {
    if (setDilogOpen) setDilogOpen(false);
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched, isSubmitting } =
    useFormik({
      initialValues: { username: '', password: '' },
      validationSchema: LoginSchema,
      onSubmit: async (values, action) => {
        const result = await dispatch(login(values));
        if (result) {
          localStorage.setItem('accessToken', result.token);
          router.push('/myAccount');
          handleClear();
          action.resetForm();
        }
      },
    });

  // Forgot password handlers
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotError('');
    const result = await authApi.sendResetPasswordOtp({ email: forgotEmail });
    setForgotLoading(false);
    if (result?.status === 'SUCCESS') {
      setForgotStep('otp');
    } else {
      setForgotError(result?.message || 'Failed to send OTP. Check your email and try again.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setForgotError('');
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
      setForgotError('Please enter the complete OTP');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    const result = await authApi.validateOtp({ otp: code });
    setForgotLoading(false);
    if (result?.status === 'SUCCESS') {
      setOtpCode(code);
      setForgotStep('newPassword');
    } else {
      setForgotError(result?.message || 'Invalid OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match');
      return;
    }
    setForgotLoading(true);
    setForgotError('');
    const result = await authApi.resetPassword({ code: otpCode, newPassword });
    setForgotLoading(false);
    if (result?.status === 'SUCCESS') {
      setForgotStep('done');
    } else {
      setForgotError(result?.message || 'Failed to reset password');
    }
  };

  const resetForgotFlow = () => {
    setForgotStep(null);
    setForgotEmail('');
    setOtp(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setForgotError('');
    setOtpCode('');
  };

  // ─── Forgot Password Overlays ────────────────────────

  const renderForgotPassword = () => {
    if (forgotStep === 'done') {
      return (
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle sx={{ fontSize: 36, color: '#16a34a' }} />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Password Reset!</h2>
          <p className="text-sm text-gray-400 mt-2">
            Your password has been changed successfully. Sign in with your new password.
          </p>
          <button
            onClick={resetForgotFlow}
            className="w-full h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all mt-6"
          >
            Back to Sign In
          </button>
        </div>
      );
    }

    if (forgotStep === 'newPassword') {
      return (
        <div>
          <button onClick={() => setForgotStep('otp')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6">
            <ArrowBack sx={{ fontSize: 16 }} /> Back
          </button>
          <h2 className="text-xl font-bold text-gray-900">Set new password</h2>
          <p className="text-sm text-gray-400 mt-1.5 mb-6">Choose a strong password for your account.</p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setForgotError(''); }}
                placeholder="Min 6 characters"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setForgotError(''); }}
                placeholder="Re-enter password"
                className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
              />
            </div>
            {forgotError && <p className="text-red-500 text-xs">{forgotError}</p>}
            <button
              type="submit"
              disabled={forgotLoading}
              className="w-full h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all"
            >
              {forgotLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      );
    }

    if (forgotStep === 'otp') {
      return (
        <div className="text-center">
          <button onClick={() => setForgotStep('email')} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6">
            <ArrowBack sx={{ fontSize: 16 }} /> Back
          </button>
          <h2 className="text-xl font-bold text-gray-900">Enter verification code</h2>
          <p className="text-sm text-gray-400 mt-1.5">
            We sent a code to <span className="text-gray-700 font-medium">{forgotEmail}</span>
          </p>

          <div className="flex justify-center gap-2.5 mt-6">
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
                  forgotError
                    ? 'border-red-300 bg-red-50/50'
                    : digit
                    ? 'border-gray-900 bg-white'
                    : 'border-gray-200 bg-gray-50 focus:border-gray-900 focus:bg-white'
                }`}
              />
            ))}
          </div>

          {forgotError && <p className="text-red-500 text-xs mt-3">{forgotError}</p>}

          <button
            onClick={handleVerifyOtp}
            disabled={forgotLoading}
            className="w-full h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all mt-6"
          >
            {forgotLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          <p className="text-sm text-gray-400 mt-4">
            Didn&apos;t receive it?{' '}
            <button onClick={handleSendOtp} className="text-gray-900 font-medium hover:underline">
              Resend
            </button>
          </p>
        </div>
      );
    }

    // forgotStep === 'email'
    return (
      <div>
        <button onClick={resetForgotFlow} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6">
          <ArrowBack sx={{ fontSize: 16 }} /> Back to Sign In
        </button>
        <h2 className="text-xl font-bold text-gray-900">Forgot password?</h2>
        <p className="text-sm text-gray-400 mt-1.5 mb-6">
          Enter your email and we&apos;ll send you a verification code to reset your password.
        </p>

        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                <EmailOutlined sx={{ fontSize: 18 }} />
              </div>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => { setForgotEmail(e.target.value); setForgotError(''); }}
                placeholder="you@example.com"
                required
                className="w-full h-12 pl-10 pr-4 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
              />
            </div>
          </div>
          {forgotError && <p className="text-red-500 text-xs">{forgotError}</p>}
          <button
            type="submit"
            disabled={forgotLoading}
            className="w-full h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-all"
          >
            {forgotLoading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </form>
      </div>
    );
  };

  // ─── Main Login View ─────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-70px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] relative overflow-hidden items-center justify-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #00e5ff40 0%, transparent 70%)' }}
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
            <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
            <span className="text-xs text-white/50 uppercase tracking-widest font-medium">Welcome Back</span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight tracking-tight">
            Your sound,<br />
            <span className="text-[#00e5ff]">your way.</span>
          </h1>
          <p className="text-white/40 mt-6 text-base leading-relaxed">
            Sign in to access your wishlist, track orders, and get personalized recommendations.
          </p>
          <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/10">
            <div>
              <p className="text-2xl font-bold text-white">50K+</p>
              <p className="text-xs text-white/30 mt-0.5">Happy Customers</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">200+</p>
              <p className="text-xs text-white/30 mt-0.5">Products</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div>
              <p className="text-2xl font-bold text-white">4.8</p>
              <p className="text-xs text-white/30 mt-0.5">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-[400px]">
          {forgotStep ? (
            renderForgotPassword()
          ) : (
            <>
              <div className="mb-8">
                <img
                  src="https://soundhub.io/wp-content/uploads/2023/08/SoundHub-Logo-2048x410.png"
                  alt="SoundHub"
                  className="h-7 mb-8 cursor-pointer"
                  onClick={() => router.push('/')}
                />
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign in to your account</h2>
                <p className="text-sm text-gray-400 mt-1.5">Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300">
                      <EmailOutlined sx={{ fontSize: 18 }} />
                    </div>
                    <input
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      name="username"
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full h-12 pl-10 pr-4 border rounded-xl text-sm transition-all placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 ${
                        errors.username && touched.username ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.username && touched.username && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.username}</p>
                  )}
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
                      placeholder="Enter your password"
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
                  {errors.password && touched.password && (
                    <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 accent-gray-900" />
                    <span className="text-xs text-gray-500">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="text-xs text-gray-900 font-medium hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#0a0a0a] text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
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
                onClick={() => router.push('/signup')}
                className="w-full h-12 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 mt-3"
              >
                Create a new account
              </button>

              <p className="text-center text-[11px] text-gray-300 mt-8">
                By continuing, you agree to SoundHub&apos;s Terms of Service and Privacy Policy.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
