'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Calendar,
  MapPin,
  QrCode,
  Star,
  LogOut,
  Car,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Phone,
  FileText,
  DollarSign,
  Award,
  Sparkles,
  Download,
  Printer,
  Edit,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info,
  ChevronRight,
  Headphones,
  Compass
} from 'lucide-react';
import { BestCarLogo } from '@/components/common/BestCarLogo';
import { api } from '@/services/api';
import { Booking, User, Vehicle } from '@/types';
import { BookingModal } from '@/components/customer/BookingModal';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Filter & Search
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [qrModalBooking, setQrModalBooking] = useState<Booking | null>(null);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Edit Profile Modal
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    drivingLicenseNumber: '',
    address: ''
  });

  // Re-booking modal
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);

  const loadCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setAuthError('Please sign in to access your customer VIP portal.');
        setLoading(false);
        setTimeout(() => router.replace('/login?redirect=/customer'), 1200);
        return;
      }

      // Verify token strictly with backend
      const profile = await api.getProfile();
      if (!profile) {
        setAuthError('Session expired. Please sign in again.');
        setLoading(false);
        setTimeout(() => router.replace('/login?redirect=/customer'), 1200);
        return;
      }

      if (profile.role === 'CAR_DRIVER') {
        router.replace('/driver');
        return;
      }

      setCurrentUser(profile);
      setProfileForm({
        name: profile.name || '',
        phone: profile.phone || '',
        drivingLicenseNumber: profile.drivingLicenseNumber || '',
        address: profile.address || ''
      });

      // Load bookings & recommended fleet
      const [myBookings, fleetData] = await Promise.all([
        api.getBookings(undefined, undefined, profile.id),
        api.getVehicles()
      ]);

      setBookings(myBookings);
      setVehicles(fleetData);
      setAuthError(null);
    } catch (err: any) {
      console.error('Failed to load customer profile:', err);
      setAuthError('Authentication verification failed.');
      setTimeout(() => router.replace('/login?redirect=/customer'), 1200);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCustomerData();
  }, [loadCustomerData]);

  const handleLogout = async () => {
    await api.logout();
    router.replace('/login');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    try {
      const updated = await api.updateProfile({
        userId: currentUser.id,
        ...profileForm
      });
      setCurrentUser(updated);
      setEditProfileOpen(false);
      alert('Profile details updated successfully.');
    } catch (err: any) {
      alert(`Failed to update profile: ${err.message || 'Error'}`);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || !currentUser) return;
    setReviewSubmitting(true);
    try {
      await api.createReview({
        bookingId: reviewBooking.id,
        userId: currentUser.id,
        userName: currentUser.name,
        carId: reviewBooking.carId || 'car_default',
        carName: reviewBooking.carName || reviewBooking.vehicleName || 'Vehicle',
        rating: reviewRating,
        comment: reviewComment,
      });
      alert('Thank you! Your verified customer review has been submitted.');
      setReviewBooking(null);
      setReviewComment('');
    } catch {
      alert('Failed to submit review. Please try again.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const statusLower = (b.status || '').toLowerCase();
      const matchFilter =
        activeFilter === 'ALL'
          ? true
          : activeFilter === 'ACTIVE'
          ? statusLower === 'active' || statusLower === 'confirmed' || statusLower === 'pending'
          : activeFilter === 'COMPLETED'
          ? statusLower === 'completed'
          : statusLower === 'cancelled';

      const query = searchQuery.toLowerCase();
      const matchSearch =
        query === '' ||
        (b.carName && b.carName.toLowerCase().includes(query)) ||
        (b.vehicleName && b.vehicleName.toLowerCase().includes(query)) ||
        (b.bookingCode && b.bookingCode.toLowerCase().includes(query)) ||
        (b.pickupHub && b.pickupHub.toLowerCase().includes(query));

      return matchFilter && matchSearch;
    });
  }, [bookings, activeFilter, searchQuery]);

  const activeCount = bookings.filter(b => (b.status || '').toLowerCase() === 'active' || (b.status || '').toLowerCase() === 'confirmed').length;
  const completedCount = bookings.filter(b => (b.status || '').toLowerCase() === 'completed').length;
  const totalSpent = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#FF7800] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-700">Verifying VIP Customer Session...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md p-8 bg-white border border-slate-200 rounded-3xl shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#FF7800] flex items-center justify-center mx-auto text-2xl border border-amber-200">
            🔒
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Customer Portal Access</h2>
            <p className="text-xs text-slate-500 mt-1">{authError}</p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login?redirect=/customer"
              className="inline-block px-5 py-2.5 bg-[#FF7800] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Sign In with Customer Account →
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
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-90 transition">
              <BestCarLogo variant="dark" size="md" />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <UserIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Customer VIP Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl hover:bg-slate-100 transition hidden sm:inline-block"
            >
              ← Back to Home
            </Link>
            
            <Link
              href="/#fleet"
              className="px-4 py-2 bg-[#FF7800] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Book a Car</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 3. USER HERO BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 text-2xl font-black flex items-center justify-center shadow-lg border-2 border-white/20">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white">{currentUser?.name || 'Customer'}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    VIP Gold Tier Customer
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {currentUser?.email} • {currentUser?.phone || '+880 1700-112233'}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Identity Verified
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" /> License: {currentUser?.drivingLicenseNumber || 'DL-DH-482910'}
                  </span>
                  <button
                    onClick={() => setEditProfileOpen(true)}
                    className="text-[11px] font-bold text-amber-300 hover:text-white underline flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" /> Edit Profile & KYC
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Counters */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10 text-center">
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-black text-white">{bookings.length}</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Total Bookings</div>
              </div>
              <div className="w-px h-8 bg-white/20 self-center"></div>
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-black text-amber-400">650</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">VIP Points</div>
              </div>
              <div className="w-px h-8 bg-white/20 self-center"></div>
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Reliability</div>
              </div>
            </div>

          </div>
        </div>

        {/* 4. SECTION: MY TRIPS & ACTIVE RESERVATIONS */}
        <div className="space-y-6">
          
          {/* Header with Search and Tab Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">My Trips & Active Reservations</h2>
              <p className="text-xs text-slate-500">Manage digital gate passes, driver assignments, and trip receipts</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reservations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#FF7800] w-48 shadow-sm"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveFilter('ACTIVE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setActiveFilter('COMPLETED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeFilter === 'COMPLETED' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Completed ({completedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
                🚗
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">No Reservations Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {searchQuery ? 'No trips match your search criteria.' : 'You do not have any active car rental reservations. Choose from our luxury fleet for your next journey.'}
                </p>
              </div>
              <Link
                href="/#fleet"
                className="inline-block px-6 py-3 bg-[#FF7800] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Browse Available Vehicles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBookings.map((booking) => {
                const statusStr = (booking.status || 'Confirmed').toUpperCase();
                const isActive = statusStr === 'CONFIRMED' || statusStr === 'ACTIVE';
                const isCompleted = statusStr === 'COMPLETED';

                return (
                  <div
                    key={booking.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-5"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : isCompleted
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {booking.status || 'Confirmed'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 font-bold">
                            Ref: #{booking.id.slice(0, 8)}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900 mt-2">
                          {booking.carName || booking.vehicleName || 'Executive Sedan'}
                        </h3>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Service: <strong className="text-slate-700">{booking.serviceType || 'Self Drive'}</strong></span>
                          <span>•</span>
                          <span>Plan: <strong className="text-slate-700">{booking.protectionPlan || 'Basic CDW'}</strong></span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-[#FF7800]">${booking.totalAmount || 280}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3 h-3" /> Paid Online
                        </div>
                      </div>
                    </div>

                    {/* Schedule & Hubs Itinerary */}
                    <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup Location</div>
                        <div className="font-bold text-slate-800 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="truncate">{booking.pickupHub || booking.pickupLocation || 'Airport Terminal Hub'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(booking.startDate || booking.pickupDate || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dropoff Location</div>
                        <div className="font-bold text-slate-800 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{booking.returnHub || booking.dropoffLocation || 'Banani Central Hub'}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(booking.endDate || booking.dropoffDate || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Chauffeur snippet if applicable */}
                    {booking.withDriver && (
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                            👨‍✈️
                          </div>
                          <div>
                            <div className="font-bold text-amber-900">Dedicated Chauffeur Assigned</div>
                            <div className="text-[11px] text-amber-800">Rafiqul Islam (⭐ 4.95) • Base: Airport Hub</div>
                          </div>
                        </div>
                        <a
                          href="tel:+8801712334455"
                          className="px-2.5 py-1 bg-white text-amber-900 font-bold rounded-lg border border-amber-300 text-xs hover:bg-amber-100 transition"
                        >
                          Call Driver
                        </a>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 gap-2">
                      <div className="flex items-center gap-2">
                        {/* Digital Gate Pass */}
                        <button
                          onClick={() => setQrModalBooking(booking)}
                          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5 text-amber-400" />
                          <span>Digital Gate Pass</span>
                        </button>

                        {/* Invoice Receipt */}
                        <button
                          onClick={() => setInvoiceModalBooking(booking)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                          title="View Official Tax Receipt"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Receipt</span>
                        </button>
                      </div>

                      {/* Write Review */}
                      <button
                        onClick={() => {
                          setReviewBooking(booking);
                          setReviewRating(5);
                          setReviewComment('');
                        }}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Write Review</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. EXPLORE FLEET & REBOOK SECTION */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Recommended For You</h2>
              <p className="text-xs text-slate-500">Popular vehicles from our luxury & SUV fleet ready for express dispatch</p>
            </div>
            <Link
              href="/#fleet"
              className="text-xs font-bold text-[#FF7800] hover:text-[#EA580C] flex items-center gap-1"
            >
              <span>View Full Fleet (8 Models)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vehicles.slice(0, 3).map((car) => (
              <div
                key={car.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="h-36 rounded-2xl bg-slate-100 overflow-hidden relative">
                  <Image
                    src={car.image || (car.images && car.images[0]) || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                    alt={car.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-sm shadow-sm z-10">
                    {car.category || 'Luxury'}
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{car.name}</h3>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {car.seats || 5} Seats • {car.transmission || 'Automatic'} • {car.fuelType || 'Petrol'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#FF7800]">${car.dailyRate}</div>
                    <div className="text-[10px] text-slate-400">/ day</div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedVehicleForBooking(car)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-[#FF7800] text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Reserve Vehicle</span>
                </button>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 6. MODAL: DIGITAL GATE PASS QR */}
      {qrModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#FF7800] flex items-center justify-center mx-auto text-2xl border border-amber-200">
              <QrCode className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Digital Airport Gate Pass</h3>
              <p className="text-xs text-slate-500 mt-1">
                Present this pass at the hub dispatch terminal or provide your security PIN to your chauffeur.
              </p>
            </div>
            
            {/* Pass QR Box */}
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3">
              <div className="w-44 h-44 bg-white p-3 rounded-2xl shadow-inner flex flex-col items-center justify-center border border-slate-200">
                <QrCode className="w-28 h-28 text-slate-900" />
                <div className="text-[9px] font-mono text-slate-500 mt-1 font-bold">
                  BESTCAR-PASS-{qrModalBooking.id.slice(0, 8)}
                </div>
              </div>
              <div className="text-xs font-extrabold text-slate-900">{qrModalBooking.carName || qrModalBooking.vehicleName}</div>
              <div className="px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-mono font-bold">
                Pickup Security PIN: 1234
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-left bg-blue-50/70 p-3 rounded-xl border border-blue-100">
              📍 <strong>Express Terminal Instructions:</strong> Head to Level 1, Bay 4B. Keys and vehicle will be ready upon scanning.
            </div>

            <button
              onClick={() => setQrModalBooking(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition shadow-md"
            >
              Close Gate Pass
            </button>
          </div>
        </div>
      )}

      {/* 7. MODAL: ITEMIZED INVOICE RECEIPT */}
      {invoiceModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <BestCarLogo variant="dark" size="sm" />
                <span className="text-xs font-bold text-slate-400 font-mono">/ TAX INVOICE</span>
              </div>
              <button
                onClick={() => setInvoiceModalBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Invoice Ref:</span>
                <span className="font-mono font-bold text-slate-900">#INV-2026-{invoiceModalBooking.id.slice(0, 6)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Customer Name:</span>
                <span className="font-bold text-slate-900">{invoiceModalBooking.customerName || currentUser?.name}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Vehicle Rented:</span>
                <span className="font-bold text-slate-900">{invoiceModalBooking.carName || invoiceModalBooking.vehicleName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Rental Period:</span>
                <span className="text-slate-700">{invoiceModalBooking.totalDays || 3} Days ({new Date(invoiceModalBooking.startDate || Date.now()).toLocaleDateString()})</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Protection Plan:</span>
                <span className="text-slate-700">{invoiceModalBooking.protectionPlan || 'Comprehensive Plus'}</span>
              </div>

              {/* Itemized calculation */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Base Daily Rental</span>
                  <span>${((invoiceModalBooking.totalAmount || 300) * 0.85).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Protection Shield & CDW</span>
                  <span>${((invoiceModalBooking.totalAmount || 300) * 0.10).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Govt Tax & Airport Surcharge (5%)</span>
                  <span>${((invoiceModalBooking.totalAmount || 300) * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
                  <span>Total Amount Paid</span>
                  <span className="text-[#FF7800]">${invoiceModalBooking.totalAmount || 300}</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>PAYMENT CLEARED • CARD / DIGITAL WALLET</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => setInvoiceModalBooking(null)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: WRITE VERIFIED REVIEW */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Share Your Experience</h3>
                <p className="text-xs text-slate-500">Trip with {reviewBooking.carName || reviewBooking.vehicleName}</p>
              </div>
              <button
                onClick={() => setReviewBooking(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600 ml-2">{reviewRating} out of 5 Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Feedback</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How was the vehicle condition, cleanliness, and delivery experience?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-[#FF7800]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="flex-1 py-2.5 bg-[#FF7800] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: EDIT PROFILE & KYC */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Update Profile & KYC Information</h3>
                <p className="text-xs text-slate-500">Keep your contact and driver&apos;s license details up-to-date</p>
              </div>
              <button
                onClick={() => setEditProfileOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF7800]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF7800]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Driving License Number</label>
                <input
                  type="text"
                  value={profileForm.drivingLicenseNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, drivingLicenseNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF7800]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#FF7800]"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF7800] hover:bg-[#EA580C] text-white font-bold rounded-xl shadow-md transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. REBOOKING FLOW MODAL */}
      <BookingModal
        vehicle={selectedVehicleForBooking}
        onClose={() => setSelectedVehicleForBooking(null)}
      />

    </div>
  );
}
