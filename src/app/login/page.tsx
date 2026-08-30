'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  FileText,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { BestCarLogo } from '@/components/common/BestCarLogo';
import { api } from '@/services/api';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [drivingLicense, setDrivingLicense] = useState('');

  // Status States
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const err = params.get('error');
      if (err === 'admin_required') {
        setError('Administrator access required. Please sign in with an Admin account.');
      } else if (err === 'driver_required') {
        setError('Chauffeur / Driver authorization required. Please sign in with a Driver account.');
      } else if (err === 'auth_required') {
        setError('Please sign in to access this portal.');
      }
    }
  }, []);

  const demoAccounts = [
    {
      role: 'ADMIN',
      label: 'Admin',
      icon: '👑',
      email: 'admin@rentcars.com',
      password: 'admin123',
      redirect: '/admin',
      badgeClass: 'bg-purple-50 hover:bg-purple-100/80 text-purple-700 border-purple-200 hover:border-purple-300'
    },
    {
      role: 'CAR_DRIVER',
      label: 'Driver',
      icon: '🚗',
      email: 'rafiqul.driver@rentcars.com',
      password: 'driver123',
      redirect: '/driver',
      badgeClass: 'bg-amber-50 hover:bg-amber-100/80 text-amber-800 border-amber-200 hover:border-amber-300'
    },
    {
      role: 'CUSTOMER',
      label: 'Customer',
      icon: '👤',
      email: 'shahriar@example.com',
      password: 'user123',
      redirect: '/customer',
      badgeClass: 'bg-blue-50 hover:bg-blue-100/80 text-blue-700 border-blue-200 hover:border-blue-300'
    }
  ];

  const getTargetRedirect = (defaultPath: string) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect');
      if (redirect && redirect.startsWith('/')) {
        return redirect;
      }
    }
    return defaultPath;
  };

  const handleDemoLogin = async (demo: typeof demoAccounts[0]) => {
    setLoadingAction(demo.role);
    setError(null);
    try {
      try {
        const res = await api.login({ email: demo.email, password: demo.password });
        const userRole = res?.user?.role || demo.role;
        let defaultPath = demo.redirect;
        if (userRole === 'ADMIN') defaultPath = '/admin';
        else if (userRole === 'CAR_DRIVER') defaultPath = '/driver';
        else defaultPath = '/customer';

        const targetUrl = getTargetRedirect(defaultPath);
        router.push(targetUrl);
        return;
      } catch {
        // Fallback for offline demo session
        if (typeof window !== 'undefined') {
          const userId = demo.role === 'ADMIN' ? 'usr_admin_1' : demo.role === 'CAR_DRIVER' ? 'usr_driver_1' : 'usr_cust_1';
          localStorage.setItem('token', `jwt_token_${userId}_${Date.now()}`);
          localStorage.setItem(
            'best_car_user',
            JSON.stringify({
              id: userId,
              role: demo.role,
              name: demo.label + ' Demo User',
              email: demo.email,
            })
          );
          window.dispatchEvent(new Event('best_car_auth_change'));
        }
        const targetUrl = getTargetRedirect(demo.redirect);
        router.push(targetUrl);
      }
    } catch (err: any) {
      setError(err?.message || 'Demo sign-in failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('manual_login');
    setError(null);
    try {
      const res = await api.login({ email, password });
      const userRole = res?.user?.role || 'CUSTOMER';
      let defaultPath = '/customer';
      if (userRole === 'ADMIN') defaultPath = '/admin';
      else if (userRole === 'CAR_DRIVER') defaultPath = '/driver';

      const targetUrl = getTargetRedirect(defaultPath);
      router.push(targetUrl);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials or use Demo Login below.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction('manual_register');
    setError(null);
    try {
      const res = await api.register({
        name,
        email,
        password,
        phone,
        drivingLicenseNumber: drivingLicense,
      });
      const userRole = res?.user?.role || 'CUSTOMER';
      let defaultPath = '/customer';
      if (userRole === 'ADMIN') defaultPath = '/admin';
      else if (userRole === 'CAR_DRIVER') defaultPath = '/driver';

      const targetUrl = getTargetRedirect(defaultPath);
      router.push(targetUrl);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#F8F9FB] flex flex-col justify-center items-center py-10 sm:py-16 px-4 sm:px-6 font-['Plus_Jakarta_Sans',sans-serif]">

      {/* Centered Main Auth Box */}
      <div className="max-w-[460px] w-full bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 sm:p-8 space-y-6 relative">

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <BestCarLogo size="md" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            {tab === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs text-[#6B7280]">
            {tab === 'login'
              ? 'Enter your credentials to access your vehicle rentals'
              : 'Register in seconds for seamless car bookings and rentals'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-[#F3F4F6] rounded-2xl text-xs font-bold border border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${tab === 'login'
                ? 'bg-white text-[#111827] shadow-sm font-extrabold'
                : 'text-[#6B7280] hover:text-[#111827]'
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${tab === 'register'
                ? 'bg-white text-[#111827] shadow-sm font-extrabold'
                : 'text-[#6B7280] hover:text-[#111827]'
              }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#374151]">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#374151]">Password</label>
                <button
                  type="button"
                  onClick={() => alert('Please use the 1-Click Demo Login buttons below for testing passwords.')}
                  className="text-[11px] font-semibold text-[#0284C7] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAction !== null}
              className="w-full py-3 bg-[#111827] hover:bg-[#1F2937] text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingAction === 'manual_login' ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. Registration Form */}
        {tab === 'register' && (
          <form onSubmit={handleManualRegister} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#374151]">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Shahriar Khan"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#374151]">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shahriar@example.com"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#374151]">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801700..."
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#374151]">License (Optional)</label>
                <div className="relative">
                  <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={drivingLicense}
                    onChange={(e) => setDrivingLicense(e.target.value)}
                    placeholder="DL-DH-..."
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#374151]">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#0284C7] focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAction !== null}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loadingAction === 'manual_register' ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {/* --- DEMO LOGIN SECTION WITH 3 SMALL BUTTONS --- */}
        <div className="pt-4 border-t border-[#F3F4F6] space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px bg-[#E5E7EB] flex-1"></span>
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
              <span>Demo 1-Click Login</span>
            </span>
            <span className="h-px bg-[#E5E7EB] flex-1"></span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {demoAccounts.map((demo) => (
              <button
                key={demo.role}
                type="button"
                onClick={() => handleDemoLogin(demo)}
                disabled={loadingAction !== null}
                className={`py-2.5 px-2 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-95 disabled:opacity-50 ${demo.badgeClass}`}
                title={`Click to instantly login as ${demo.label}`}
              >
                <span className="text-base leading-none">{demo.icon}</span>
                <span className="text-[11px] font-extrabold">{demo.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Subtle Bottom Link */}
      <div className="text-center text-xs text-[#9CA3AF] mt-6">
        <Link href="/" className="hover:text-[#111827] transition">
          ← Return to Home Page
        </Link>
      </div>

    </div>
  );
}
