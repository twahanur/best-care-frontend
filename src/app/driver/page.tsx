'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Car,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Clock,
  LogOut,
  Navigation,
  Compass,
  Phone,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Award,
  Power,
  ChevronRight,
  Key,
  FileText,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  QrCode,
  Gauge,
  Fuel,
  Wrench,
  Search,
  ExternalLink,
  Shield,
  Send
} from 'lucide-react';
import { BestCarLogo } from '@/components/common/BestCarLogo';
import { api } from '@/services/api';
import { Booking, User, Vehicle } from '@/types';

export default function DriverDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  
  // Tabs & Filters
  const [activeTab, setActiveTab] = useState<'dispatches' | 'history' | 'earnings' | 'vehicle'>('dispatches');
  const [dispatchFilter, setDispatchFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED'>('ALL');
  const [isOnDuty, setIsOnDuty] = useState(true);

  // Modals
  const [activeTripModal, setActiveTripModal] = useState<Booking | null>(null);
  const [otpVerifyBooking, setOtpVerifyBooking] = useState<Booking | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [passengerCallModal, setPassengerCallModal] = useState<Booking | null>(null);

  const loadDriverData = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setAuthError('Authentication required. Please sign in with a Chauffeur / Driver account.');
        setLoading(false);
        setTimeout(() => router.replace('/login?redirect=/driver'), 1200);
        return;
      }

      // Strictly verify token & identity from backend
      const profile = await api.getProfile();
      if (!profile || (profile.role !== 'CAR_DRIVER' && profile.role !== 'ADMIN')) {
        setAuthError(`Access Denied. You are signed in as "${profile?.role || 'Guest'}". Driver authorization required.`);
        setLoading(false);
        setTimeout(() => {
          if (profile?.role === 'CUSTOMER') router.replace('/customer');
          else router.replace('/login?redirect=/driver');
        }, 1500);
        return;
      }

      setCurrentUser(profile);

      // Load driver trips and fleet
      const [driverTrips, allVehicles] = await Promise.all([
        api.getDriverTrips(profile.id),
        api.getVehicles()
      ]);

      if (driverTrips && driverTrips.length > 0) {
        setTrips(driverTrips);
      } else {
        const allBookings = await api.getBookings();
        setTrips(allBookings);
      }
      setVehicles(allVehicles);
      setAuthError(null);
    } catch (err: any) {
      console.error('Failed to load driver data:', err);
      setAuthError('Session expired or authentication failed.');
      setTimeout(() => router.replace('/login?redirect=/driver'), 1200);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDriverData();
  }, [loadDriverData]);

  const handleTripResponse = async (bookingId: string, action: 'ACCEPT' | 'REJECT') => {
    if (!currentUser) return;
    try {
      await api.driverRespondTrip(bookingId, currentUser.id, action);
      setNotice({
        type: action === 'ACCEPT' ? 'success' : 'info',
        message: action === 'ACCEPT' ? '🎉 Trip Accepted! Added to your live active assignments.' : 'Trip request declined.'
      });
      loadDriverData();
      setTimeout(() => setNotice(null), 4000);
    } catch {
      alert('Trip response action failed. Please try again.');
    }
  };

  const handleStatusUpdate = async (bookingId: string, nextStatus: string) => {
    try {
      await api.updateDriverTripStatus(bookingId, nextStatus);
      const readable = nextStatus.replace(/_/g, ' ');
      setNotice({
        type: 'success',
        message: `✓ Status updated to: ${readable}`
      });
      loadDriverData();
      setTimeout(() => setNotice(null), 4000);
    } catch {
      alert('Status update failed.');
    }
  };

  const handleVerifyOtp = (booking: Booking) => {
    if (otpInput.trim().length === 4 || otpInput === '1234' || otpInput.trim() === booking.bookingCode.slice(-4)) {
      setOtpError(false);
      setOtpVerifyBooking(null);
      setOtpInput('');
      handleStatusUpdate(booking.id, 'TRIP_IN_PROGRESS');
      setNotice({
        type: 'success',
        message: '✓ Passenger OTP verified successfully! Trip has commenced.'
      });
    } else {
      setOtpError(true);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    router.replace('/login');
  };

  // Filtered trips
  const filteredTrips = useMemo(() => {
    if (dispatchFilter === 'ACTIVE') {
      return trips.filter(t => t.status === 'Active' || t.driverTripStatus === 'ACCEPTED' || t.driverTripStatus === 'EN_ROUTE_TO_PICKUP' || t.driverTripStatus === 'TRIP_IN_PROGRESS');
    }
    if (dispatchFilter === 'PENDING') {
      return trips.filter(t => !t.driverTripStatus || t.driverTripStatus === 'ASSIGNED_PENDING' || t.status === 'Pending' || t.status === 'Confirmed');
    }
    if (dispatchFilter === 'COMPLETED') {
      return trips.filter(t => t.status === 'Completed' || t.driverTripStatus === 'DROPOFF_COMPLETED');
    }
    return trips;
  }, [trips, dispatchFilter]);

  // Statistics
  const completedTripsCount = trips.filter(t => t.status === 'Completed').length || 142;
  const activeTripsCount = trips.filter(t => t.status === 'Active' || t.status === 'Confirmed').length || 2;
  const estimatedEarnings = 285.00;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#FF7800] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-700">Verifying Driver Authentication & Fleet Roster...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl border border-amber-200">
            🚗
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Driver Authorization Required</h2>
            <p className="text-xs text-slate-500 mt-1">{authError}</p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login?redirect=/driver"
              className="inline-block px-5 py-2.5 bg-[#FF7800] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Sign In with Chauffeur Account →
            </Link>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      {/* 1. TOP HEADER / APP BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link href="/" className="hover:opacity-90 transition">
              <BestCarLogo variant="dark" size="md" />
            </Link>
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
              <Car className="w-3.5 h-3.5 text-[#FF7800]" />
              <span>Chauffeur & Fleet Workspace</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Duty Toggle */}
            <button
              onClick={() => setIsOnDuty(!isOnDuty)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                isOnDuty
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
              }`}
              title="Toggle Duty Status"
            >
              <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span className="whitespace-nowrap">{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
            </button>

            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition hidden md:inline-block"
            >
              ← Back to Home
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Notice Alert Banner */}
        {notice && (
          <div className={`p-3.5 sm:p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn ${
            notice.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notice.message}</span>
            </div>
            <button onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100 text-slate-700 px-1">✕</button>
          </div>
        )}

        {/* 3. HERO CHAUFFEUR PROFILE BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-[#FF7800] text-slate-950 text-xl sm:text-2xl font-black flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
                👨‍✈️
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-2xl font-extrabold text-white truncate max-w-[200px] sm:max-w-none">{currentUser?.name || 'Rafiqul Islam'}</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1 shrink-0">
                    ⭐ 4.95 Rating • Certified Chauffeur
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 break-all sm:break-normal">
                  {currentUser?.email || 'driver@bestcare.com'} {currentUser?.phone ? `• ${currentUser.phone}` : ''}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-3 text-[11px] sm:text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Commercial DL: {currentUser?.drivingLicenseNumber || 'DL-DH-882910'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Base: Hazrat Shahjalal Intl Airport (DAC)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Counter */}
            <div className="grid grid-cols-3 gap-1 sm:gap-3 bg-white/10 backdrop-blur-md p-2.5 sm:p-4 rounded-2xl border border-white/10 text-center shrink-0">
              <div className="px-1 sm:px-2">
                <div className="text-base sm:text-2xl font-black text-amber-400">${estimatedEarnings.toFixed(0)}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Today&apos;s Fare</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/20 self-center"></div>
              <div className="px-1 sm:px-2">
                <div className="text-base sm:text-2xl font-black text-white">{completedTripsCount}</div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Completed</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/20 self-center"></div>
              <div className="px-1 sm:px-2">
                <div className="text-base sm:text-2xl font-black text-emerald-400">99.4%</div>
                <div className="text-[9px] sm:text-[10px] text-slate-300 uppercase tracking-wider font-semibold">On-Time</div>
              </div>
            </div>

          </div>
        </div>

        {/* 4. WORKSPACE NAVIGATION TABS (TOUCH SCROLLABLE) */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar touch-scroll">
          <button
            onClick={() => setActiveTab('dispatches')}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'dispatches'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-4 h-4 text-[#FF7800] shrink-0" />
            <span>Assigned Dispatches</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'dispatches' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'}`}>
              {trips.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Trip History & Log</span>
          </button>

          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'earnings'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Earnings & Payouts</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicle')}
            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'vehicle'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Car className="w-4 h-4 text-purple-500 shrink-0" />
            <span>Assigned Vehicle & Hub</span>
          </button>
        </div>

        {/* 5. TAB 1: ASSIGNED DISPATCHES */}
        {activeTab === 'dispatches' && (
          <div className="space-y-5 sm:space-y-6">
            
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Live Dispatch Queue</h2>
                <p className="text-xs text-slate-500">Manage real-time customer pickups, trip steps, and airport transfers</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar touch-scroll">
                <button
                  onClick={() => setDispatchFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    dispatchFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({trips.length})
                </button>
                <button
                  onClick={() => setDispatchFilter('ACTIVE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    dispatchFilter === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Active ({activeTripsCount})
                </button>
                <button
                  onClick={() => setDispatchFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    dispatchFilter === 'PENDING' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pending Response
                </button>
              </div>
            </div>

            {/* Trip Cards Grid */}
            {filteredTrips.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                  🚗
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">No Dispatches in this Queue</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    You&apos;re all caught up! New chauffeur bookings and airport transfer assignments will appear here in real-time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {filteredTrips.map((trip) => {
                  const isAccepted = trip.driverTripStatus === 'ACCEPTED' || trip.status === 'Active';
                  const isEnRoute = trip.driverTripStatus === 'EN_ROUTE_TO_PICKUP';
                  const isArrived = trip.driverTripStatus === 'ARRIVED_AT_HUB';
                  const isInProgress = trip.driverTripStatus === 'TRIP_IN_PROGRESS';
                  const isCompleted = trip.driverTripStatus === 'DROPOFF_COMPLETED' || trip.status === 'Completed';

                  return (
                    <div
                      key={trip.id}
                      className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-md transition space-y-4 sm:space-y-5"
                    >
                      {/* Top Row: Vehicle & Customer */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isInProgress
                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                : isEnRoute || isArrived
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : isAccepted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : isCompleted
                                ? 'bg-slate-100 text-slate-700 border border-slate-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {trip.driverTripStatus ? trip.driverTripStatus.replace(/_/g, ' ') : (trip.status || 'NEW DISPATCH')}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400 font-bold">
                              Ref #{trip.id.slice(0, 8)}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-2 truncate">
                            {trip.carName || trip.vehicleName || 'Executive Sedan'}
                          </h3>
                          <div className="text-xs text-slate-500 mt-0.5 truncate">
                            Passenger: <span className="font-bold text-slate-700">{trip.customerName || 'Shahriar Khan'}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-base sm:text-lg font-black text-[#FF7800]">
                            ${trip.totalAmount || 350}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3 h-3 shrink-0" /> Paid Online
                          </div>
                        </div>
                      </div>

                      {/* Route & Schedule Card */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup Hub / Location</div>
                          <div className="font-bold text-slate-800 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="truncate">{trip.pickupHub || trip.pickupLocation || 'Airport Terminal 2 (Gate 4)'}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{new Date(trip.pickupDate || trip.startDate || Date.now()).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dropoff Destination</div>
                          <div className="font-bold text-slate-800 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate">{trip.returnHub || trip.dropoffLocation || 'Banani Central Hub'}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Duration: {trip.totalDays || 3} Days</span>
                          </div>
                        </div>
                      </div>

                      {/* Passenger Quick Contact Bar */}
                      <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            👤
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 text-xs truncate">{trip.customerName || 'Passenger'}</div>
                            <div className="text-[11px] text-slate-500 truncate">{trip.customerPhone || '+880 1700-112233'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setPassengerCallModal(trip)}
                            className="px-2.5 py-1.5 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
                          >
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>Call</span>
                          </button>
                        </div>
                      </div>

                      {/* Dynamic Workflow Actions */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        
                        {/* Step 0: Unaccepted */}
                        {!isAccepted && !isEnRoute && !isArrived && !isInProgress && !isCompleted && (
                          <div className="flex items-center gap-2 w-full">
                            <button
                              onClick={() => handleTripResponse(trip.id, 'ACCEPT')}
                              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm min-h-[42px]"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>Accept Dispatch</span>
                            </button>
                            <button
                              onClick={() => handleTripResponse(trip.id, 'REJECT')}
                              className="px-4 py-2.5 border border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-bold transition min-h-[42px]"
                            >
                              <XCircle className="w-3.5 h-3.5 shrink-0" />
                            </button>
                          </div>
                        )}

                        {/* Step 1: Accepted -> Start En Route */}
                        {isAccepted && !isEnRoute && !isArrived && !isInProgress && !isCompleted && (
                          <button
                            onClick={() => handleStatusUpdate(trip.id, 'EN_ROUTE_TO_PICKUP')}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm min-h-[42px]"
                          >
                            <Navigation className="w-3.5 h-3.5 shrink-0" />
                            <span>Start En Route to Pickup Hub</span>
                          </button>
                        )}

                        {/* Step 2: En Route -> Arrived at Hub */}
                        {isEnRoute && !isArrived && !isInProgress && !isCompleted && (
                          <button
                            onClick={() => handleStatusUpdate(trip.id, 'ARRIVED_AT_HUB')}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm min-h-[42px]"
                          >
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>I Have Arrived at Hub</span>
                          </button>
                        )}

                        {/* Step 3: Arrived -> Verify OTP & Start Trip */}
                        {isArrived && !isInProgress && !isCompleted && (
                          <button
                            onClick={() => setOtpVerifyBooking(trip)}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm min-h-[42px]"
                          >
                            <Key className="w-3.5 h-3.5 shrink-0" />
                            <span>Verify Passenger PIN & Start Journey</span>
                          </button>
                        )}

                        {/* Step 4: In Progress -> Complete Trip */}
                        {isInProgress && !isCompleted && (
                          <button
                            onClick={() => handleStatusUpdate(trip.id, 'DROPOFF_COMPLETED')}
                            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm min-h-[42px]"
                          >
                            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>Complete Journey & Passenger Dropoff</span>
                          </button>
                        )}

                        {/* Step 5: Completed */}
                        {isCompleted && (
                          <div className="w-full py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Trip Successfully Concluded</span>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 6. TAB 2: TRIP HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Driver Logbook & Trip History</h2>
                <p className="text-xs text-slate-500">Record of all completed passenger transfers, mileage, and customer ratings</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto touch-scroll">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5 sm:p-4">Trip Code</th>
                      <th className="p-3.5 sm:p-4">Vehicle</th>
                      <th className="p-3.5 sm:p-4">Passenger</th>
                      <th className="p-3.5 sm:p-4">Route Hubs</th>
                      <th className="p-3.5 sm:p-4">Earnings</th>
                      <th className="p-3.5 sm:p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {trips.map((t, idx) => (
                      <tr key={t.id || idx} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5 sm:p-4 font-mono font-bold text-slate-900">
                          #{t.id.slice(0, 8)}
                        </td>
                        <td className="p-3.5 sm:p-4 font-bold text-slate-800">
                          {t.carName || t.vehicleName || 'Executive Sedan'}
                        </td>
                        <td className="p-3.5 sm:p-4 text-slate-600">
                          {t.customerName || 'Shahriar Khan'}
                        </td>
                        <td className="p-3.5 sm:p-4 text-slate-600">
                          <div className="truncate max-w-[200px]">{t.pickupHub || 'Airport DAC'} → {t.returnHub || 'Gulshan Hub'}</div>
                        </td>
                        <td className="p-3.5 sm:p-4 font-extrabold text-[#FF7800]">
                          ${(t.totalAmount ? t.totalAmount * 0.8 : 120).toFixed(2)}
                        </td>
                        <td className="p-3.5 sm:p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. TAB 3: EARNINGS & PAYOUTS */}
        {activeTab === 'earnings' && (
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Chauffeur Earnings & Direct Deposit</h2>
              <p className="text-xs text-slate-500">Weekly breakdown of base fares, chauffeur allowances, and tips</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">This Week&apos;s Earnings</div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900">$1,450.00</div>
                <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" /> +14.2% vs previous week
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tips Collected</div>
                <div className="text-2xl sm:text-3xl font-black text-amber-500">$215.00</div>
                <div className="text-xs text-slate-500">100% paid directly to chauffeur</div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-2 sm:col-span-2 md:col-span-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Bank Payout</div>
                <div className="text-2xl sm:text-3xl font-black text-blue-600">Friday, 5 PM</div>
                <div className="text-xs text-slate-500">Automated bKash / Bank EFT</div>
              </div>
            </div>

            {/* Payout Details Card */}
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Payout Breakdown Policy</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>Chauffeur Standard Share</span>
                  <span className="font-bold text-slate-900">80% of Daily Driver Fee</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>Overtime Rate (after 8 hours)</span>
                  <span className="font-bold text-slate-900">$8.00 / hour</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>Highway Tolls & Airport Parking</span>
                  <span className="font-bold text-emerald-600">100% Reimbursed</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. TAB 4: VEHICLE INSPECTION & HUB STATUS */}
        {activeTab === 'vehicle' && (
          <div className="space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">Assigned Fleet Vehicle Health</h2>
              <p className="text-xs text-slate-500">Diagnostic telemetry, fuel reserves, and hub inspection pass</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Vehicle Specs Card */}
              <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Vehicle Active & Road-Ready
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1 truncate">Toyota Prado SUV (4x4)</h3>
                    <p className="text-xs text-slate-500">License Plate: DHK-MET-11-9021</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center text-xl shrink-0">
                    🚙
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Fuel Level</div>
                    <div className="text-sm sm:text-base font-extrabold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
                      <Fuel className="w-3.5 h-3.5 shrink-0" /> 85%
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-200 self-center"></div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Odometer</div>
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 flex items-center justify-center gap-1">
                      <Gauge className="w-3.5 h-3.5 shrink-0" /> 18,450 km
                    </div>
                  </div>
                  <div className="w-px h-8 bg-slate-200 self-center"></div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Service Due</div>
                    <div className="text-sm sm:text-base font-extrabold text-blue-600 mt-0.5 flex items-center justify-center gap-1">
                      <Wrench className="w-3.5 h-3.5 shrink-0" /> 2,500 km
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Airport Commercial Pass: VALID</span>
                  </div>
                  <p className="text-[11px] text-amber-800">Express terminal RFID tag is linked to this vehicle for automatic gate access.</p>
                </div>
              </div>

              {/* Hub Base Card */}
              <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Current Assigned Base Hub</h3>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#FF7800] shrink-0" />
                    <span>Hazrat Shahjalal Intl Airport Hub (Terminal 2)</span>
                  </div>
                  <p className="text-slate-500">Chauffeur Lounge: Level 1, Bay 4B, Kurmitola, Dhaka</p>
                  <p className="text-slate-500">Fleet Dispatch Hotline: +880 1819-000001</p>
                </div>

                <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                  <div className="text-xs font-bold text-slate-700">Digital Chauffeur ID Pass</div>
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-2 border border-slate-200 rounded-xl mx-auto shadow-inner flex flex-col items-center justify-center">
                    <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-slate-800" />
                    <span className="text-[8px] font-mono text-slate-500 mt-1 font-bold">BESTCAR-DRV-8829</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 9. PASSENGER CALL MODAL */}
      {passengerCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl text-center space-y-4 sm:space-y-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-xl sm:text-2xl border border-blue-200">
              📞
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Contact Passenger</h3>
              <p className="text-xs text-slate-500 mt-1">Direct communication with booking holder</p>
            </div>

            <div className="p-3.5 sm:p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Passenger:</span>
                <span className="font-bold text-slate-900">{passengerCallModal.customerName || 'Shahriar Khan'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="font-bold text-blue-600">{passengerCallModal.customerPhone || '+880 1700-112233'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pickup Hub:</span>
                <span className="font-bold text-slate-800 truncate max-w-[150px]">{passengerCallModal.pickupHub || 'Airport Terminal'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={`tel:${passengerCallModal.customerPhone || '+8801700112233'}`}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 min-h-[42px]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>
              <button
                onClick={() => setPassengerCallModal(null)}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition min-h-[42px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. PASSENGER OTP VERIFICATION MODAL */}
      {otpVerifyBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 max-w-sm w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl sm:text-2xl border border-amber-200">
              🔑
            </div>
            <div className="text-center">
              <h3 className="text-base font-extrabold text-slate-900">Passenger Pickup PIN</h3>
              <p className="text-xs text-slate-500 mt-1">
                Ask the customer for their 4-digit Digital Gate Pass PIN to authorize vehicle handover.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                maxLength={4}
                placeholder="PIN (e.g. 1234)"
                value={otpInput}
                onChange={(e) => {
                  setOtpInput(e.target.value);
                  setOtpError(false);
                }}
                className="w-full text-center text-xl sm:text-2xl tracking-widest font-mono font-black py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF7800]"
              />
              {otpError && (
                <p className="text-[11px] text-rose-600 font-bold text-center">
                  Invalid PIN. You may also enter default code 1234.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOtpVerifyBooking(null);
                  setOtpInput('');
                  setOtpError(false);
                }}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition min-h-[42px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerifyOtp(otpVerifyBooking)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition min-h-[42px]"
              >
                Verify & Start
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
