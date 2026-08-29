'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Car,
  LayoutDashboard,
  Calendar,
  Users,
  TrendingUp,
  Settings,
  HelpCircle,
  Headphones,
  LogOut,
  Search,
  Bell,
  Sparkles,
  Zap,
  RefreshCw,
  DollarSign,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  FileCheck,
  ChevronRight,
  Filter,
  CarFront,
  Plus,
  Trash2,
  Edit,
  ShieldCheck,
  CreditCard,
  Star,
  Wrench,
  AlertTriangle,
  Ban,
  X,
  FileSpreadsheet,
  Check,
  SlidersHorizontal,
  Globe2,
  Navigation
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { api } from '@/services/api';
import {
  DashboardMetrics,
  Booking,
  Vehicle,
  User,
  Payment,
  Review,
  AvailabilityBlock,
  PricingRule,
  AutomationLog
} from '@/types';

export default function AdminDashboardPage() {
  const [activeNav, setActiveNav] = useState<
    'dashboard' | 'fleet' | 'bookings' | 'users' | 'payments' | 'reviews' | 'availability' | 'reports'
  >('dashboard');

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availabilityBlocks, setAvailabilityBlocks] = useState<AvailabilityBlock[]>([]);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals for CRUD & Operations
  const [addCarModalOpen, setAddCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Vehicle | null>(null);
  const [scheduleMaintenanceModalOpen, setScheduleMaintenanceModalOpen] = useState(false);
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);

  // New Car Form State
  const [carForm, setCarForm] = useState({
    name: '',
    brand: 'Toyota',
    category: 'Sedan' as any,
    year: 2024,
    transmission: 'Automatic' as any,
    fuelType: 'Petrol' as any,
    dailyRate: 85,
    securityDeposit: 200,
    seats: 5,
    licensePlate: '',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    currentHub: 'Hazrat Shahjalal Intl Airport (DAC)',
    features: 'GPS Navigation, Dual Zone AC, Bluetooth, ISOFIX Child Seat',
  });

  // Maintenance Form State
  const [maintForm, setMaintForm] = useState({
    carId: '',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    type: 'MAINTENANCE',
    notes: 'Scheduled 20,000 km engine inspection & brake overhaul',
  });

  // Load all telemetry
  const loadDashboardData = async () => {
    setRefreshing(true);
    try {
      const [
        analyticsData,
        bookingsData,
        vehiclesData,
        usersData,
        paymentsData,
        reviewsData,
        blocksData,
        rulesData,
        logsData
      ] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getBookings(),
        api.getVehicles(),
        api.getUsers(),
        api.getPayments(),
        api.getReviews(),
        api.getAvailabilityBlocks(),
        api.getPricingRules(),
        api.getAutomationLogs()
      ]);

      setMetrics(analyticsData);
      setBookings(bookingsData);
      setVehicles(vehiclesData);
      setUsers(usersData);
      setPayments(paymentsData);
      setReviews(reviewsData);
      setAvailabilityBlocks(blocksData);
      setPricingRules(rulesData);
      setAutomationLogs(logsData);
    } catch (err) {
      console.error('Failed to load admin telemetry', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handlers for Cars CRUD
  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...carForm,
      features: carForm.features.split(',').map(s => s.trim()),
      images: [carForm.image]
    };

    try {
      if (editingCar) {
        const updated = await api.updateVehicle(editingCar.id, payload);
        setVehicles(prev => prev.map(c => c.id === editingCar.id ? updated : c));
        setEditingCar(null);
      } else {
        const created = await api.createVehicle(payload);
        setVehicles(prev => [created, ...prev]);
        setAddCarModalOpen(false);
      }
      alert('Vehicle successfully saved to fleet catalog.');
    } catch (err: any) {
      alert(`Failed to save vehicle: ${err.message || 'Error'}`);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to decommission/delete this car from fleet?')) return;
    try {
      await api.deleteVehicle(carId);
      setVehicles(prev => prev.filter(c => c.id !== carId));
    } catch (err: any) {
      alert(`Delete error: ${err.message || 'Failed'}`);
    }
  };

  // Handlers for Bookings Lifecycle
  const handleBookingStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
      if (selectedBookingDetail?.id === id) {
        setSelectedBookingDetail(updated);
      }
    } catch {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Cancel this booking and issue 100% full refund?')) return;
    try {
      const updated = await api.cancelBooking(bookingId, 'Admin cancelled reservation');
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
      alert(`Booking ${updated.bookingCode} cancelled and $${updated.refundAmount} refunded.`);
    } catch (err: any) {
      alert(`Cancellation failed: ${err.message || 'Error'}`);
    }
  };

  // Handlers for Users Status
  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const updated = await api.updateUserStatus(userId, nextStatus);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (err: any) {
      alert(`Status update error: ${err.message || 'Failed'}`);
    }
  };

  // Handlers for Reviews Moderation
  const handleModerateReview = async (reviewId: string, isApproved: boolean) => {
    try {
      const updated = await api.moderateReview(reviewId, isApproved);
      setReviews(prev => prev.map(r => r.id === reviewId ? updated : r));
    } catch (err: any) {
      alert(`Moderation error: ${err.message || 'Failed'}`);
    }
  };

  const handleReplyReview = async () => {
    if (!replyingReview) return;
    try {
      const updated = await api.moderateReview(replyingReview.id, true, adminReplyText);
      setReviews(prev => prev.map(r => r.id === replyingReview.id ? updated : r));
      setReplyingReview(null);
      setAdminReplyText('');
    } catch (err: any) {
      alert(`Reply error: ${err.message || 'Failed'}`);
    }
  };

  // Handlers for Maintenance Scheduling
  const handleSaveMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintForm.carId) {
      alert('Please select a target vehicle.');
      return;
    }
    try {
      const targetCar = vehicles.find(v => v.id === maintForm.carId);
      const created = await api.createAvailabilityBlock({
        ...maintForm,
        carName: targetCar?.name
      });
      setAvailabilityBlocks(prev => [created, ...prev]);
      setScheduleMaintenanceModalOpen(false);
      alert('Maintenance block created. Vehicle locked from booking calendar.');
    } catch (err: any) {
      alert(`Maintenance error: ${err.message || 'Failed'}`);
    }
  };

  const handleDeleteMaintenance = async (blockId: string) => {
    try {
      await api.deleteAvailabilityBlock(blockId);
      setAvailabilityBlocks(prev => prev.filter(b => b.id !== blockId));
    } catch (err: any) {
      alert(`Error releasing block: ${err.message || 'Failed'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex text-slate-900 font-['Plus_Jakarta_Sans'] antialiased">
      
      {/* 1. Left Sidebar Navigation (Exact Figma Style) */}
      <aside className="w-64 bg-white border-r border-slate-200/80 hidden lg:flex flex-col justify-between p-6 shrink-0 shadow-sm">
        <div className="space-y-7">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                RENT<span className="text-blue-600">CARS</span>
              </span>
            </div>
          </Link>

          {/* MAIN MENU */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Main Menu
            </div>
            
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveNav('fleet')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'fleet'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Car Fleet ({vehicles.length})</span>
            </button>

            <button
              onClick={() => setActiveNav('bookings')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'bookings'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Bookings ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveNav('users')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'users'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveNav('payments')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'payments'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payments ({payments.length})</span>
            </button>

            <button
              onClick={() => setActiveNav('reviews')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'reviews'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveNav('availability')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'availability'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Availability / Holds</span>
            </button>

            <button
              onClick={() => setActiveNav('reports')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                activeNav === 'reports'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Reports</span>
            </button>
          </div>

          {/* PREFERENCES */}
          <div className="space-y-1.5 pt-2">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Preferences
            </div>

            <button
              onClick={() => alert('Settings & Gateway configurations are active.')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => alert('Support concierge 24/7 hotline: +880 1700 112233')}
              className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help Center</span>
            </button>
          </div>

        </div>

        {/* Exit & Logout CTA */}
        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit to Main Site</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-400 transition-colors"
            />
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-4">
            
            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
              title="Refresh Live Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Admin User Profile */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Admin User"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">Shahriar Admin</div>
                <div className="text-[11px] text-slate-500 font-medium">Fleet Executive</div>
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* ========================================================= */}
          {/* TAB 1: EXACT FIGMA DASHBOARD */}
          {/* ========================================================= */}
          {activeNav === 'dashboard' && (
            <div className="space-y-8">
              
              {/* TOP 3 HIGHLIGHT BANNERS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* 1. Welcome Card (White Card with Graphic) */}
                <div className="md:col-span-5 rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-1.5 z-10">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Operations Control</div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Welcome back, Admin 👋
                    </h2>
                    <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed">
                      You have <strong className="text-blue-600">{metrics?.fleetSummary?.rented || 2} active car rentals</strong> and {metrics?.fleetSummary?.available || 6} vehicles ready for airport terminal dispatch today.
                    </p>
                  </div>

                  <div className="pt-5 flex items-center justify-between z-10">
                    <button
                      onClick={() => setActiveNav('fleet')}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-transform hover:scale-[1.02]"
                    >
                      <span>Manage Fleet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Decorative Car Floating Icon */}
                  <div className="absolute right-4 bottom-4 w-28 h-28 opacity-10 pointer-events-none text-blue-900">
                    <Car className="w-full h-full" />
                  </div>
                </div>

                {/* 2. Total Revenue (Orange Gradient Banner) */}
                <div className="md:col-span-4 rounded-3xl p-6 bg-gradient-to-br from-[#FF7A00] to-[#FF9E00] text-white flex flex-col justify-between shadow-lg shadow-orange-500/20 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-100">Total Revenue</span>
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
                      ${(metrics?.kpis?.totalRevenue || 48250).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-orange-100 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{metrics?.kpis?.revenueGrowthPct || 15.8}% compared to last month</span>
                    </div>
                  </div>
                </div>

                {/* 3. Total Bookings (Deep Navy Banner) */}
                <div className="md:col-span-3 rounded-3xl p-6 bg-[#0B1B3D] text-white flex flex-col justify-between shadow-lg shadow-slate-900/20 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Total Bookings</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 backdrop-blur-sm flex items-center justify-center text-blue-400">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
                      {(metrics?.kpis?.totalBookings || 1420).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{metrics?.kpis?.fleetUtilizationRate || 88}% Fleet Utilization</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* MIDDLE SECTION: Car Availability (Left) + Recent Bookings (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Card: Car Availability */}
                <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-base text-slate-900">Car Availability</h3>
                    <button
                      onClick={() => setActiveNav('fleet')}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {vehicles.slice(0, 5).map((car) => (
                      <div
                        key={car.id}
                        className="p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-11 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200/80">
                            <Image src={car.image} alt={car.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{car.name}</h4>
                            <div className="text-[11px] text-slate-500">{car.category} • {car.transmission}</div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-extrabold text-slate-900">
                            ${car.dailyRate}<span className="text-[10px] text-slate-400 font-normal">/d</span>
                          </div>
                          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold ${
                            car.status === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : car.status === 'RENTED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {car.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Card: Recent Bookings Table */}
                <div className="lg:col-span-7 rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">Recent Bookings</h3>
                      <p className="text-xs text-slate-500">Live dispatch and customer reservations</p>
                    </div>
                    <button
                      onClick={() => setActiveNav('bookings')}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      See All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                        <tr>
                          <th className="pb-3 font-bold">Booking Code</th>
                          <th className="pb-3 font-bold">Customer</th>
                          <th className="pb-3 font-bold">Vehicle</th>
                          <th className="pb-3 font-bold">Status</th>
                          <th className="pb-3 font-bold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 font-mono font-bold text-slate-900">{b.bookingCode}</td>
                            <td className="py-3">
                              <div className="font-bold text-slate-900">{b.customerName}</div>
                              <div className="text-[10px] text-slate-400">{b.customerEmail}</div>
                            </td>
                            <td className="py-3 font-semibold text-slate-900">{b.vehicleName}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                b.status === 'Active'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : b.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : b.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : b.status === 'Completed'
                                  ? 'bg-slate-100 text-slate-700'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 text-right font-extrabold text-slate-900">${b.totalAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* BOTTOM SECTION: Earning Summary Chart (Left) + Rental Locations Map (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Card: Earning Summary (Area Chart) */}
                <div className="lg:col-span-8 rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">Earning Summary</h3>
                      <p className="text-xs text-slate-500">Monthly revenue spline curve & analytics ($ USD)</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                      2026 YTD
                    </span>
                  </div>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metrics?.revenueTrends || []}>
                        <defs>
                          <linearGradient id="figmaOrangeArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#FF7A00" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderColor: '#e2e8f0',
                            borderRadius: '16px',
                            fontSize: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Gross Inflow']}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#FF7A00"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#figmaOrangeArea)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right Card: Rental Hub Locations Map */}
                <div className="lg:col-span-4 rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Rental Hub Locations</h3>
                    <p className="text-xs text-slate-500">Fleet dispatch density across active airport terminals</p>
                  </div>

                  {/* Visual Regional Hub Share */}
                  <div className="space-y-4 pt-2">
                    
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2 text-slate-900">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span>Hazrat Shahjalal DAC</span>
                        </div>
                        <span className="text-blue-600">58% Share</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '58%' }}></div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2 text-slate-900">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span>Sylhet Osmani ZYL</span>
                        </div>
                        <span className="text-orange-500">24% Share</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: '24%' }}></div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2 text-slate-900">
                          <MapPin className="w-4 h-4 text-emerald-600" />
                          <span>Chittagong Patenga CGP</span>
                        </div>
                        <span className="text-emerald-600">18% Share</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CAR FLEET MANAGEMENT (CRUD) */}
          {/* ========================================================= */}
          {activeNav === 'fleet' && (
            <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Car Fleet Catalog & Management</h3>
                  <p className="text-xs text-slate-500">Create new vehicles, edit specifications, rates, and availability status</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCar(null);
                    setCarForm({
                      name: '',
                      brand: 'Toyota',
                      category: 'Sedan',
                      year: 2024,
                      transmission: 'Automatic',
                      fuelType: 'Petrol',
                      dailyRate: 85,
                      securityDeposit: 200,
                      seats: 5,
                      licensePlate: '',
                      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
                      currentHub: 'Hazrat Shahjalal Intl Airport (DAC)',
                      features: 'GPS Navigation, Dual Zone AC, Bluetooth, ISOFIX Child Seat',
                    });
                    setAddCarModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Vehicle</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="pb-3 font-bold">Vehicle</th>
                      <th className="pb-3 font-bold">Category & Specs</th>
                      <th className="pb-3 font-bold">Hub Station</th>
                      <th className="pb-3 font-bold">Daily Rate</th>
                      <th className="pb-3 font-bold">Driver Rating</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {vehicles.map((car) => (
                      <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <Image src={car.image} alt={car.name} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{car.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{car.licensePlate || 'RC-FL-001'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="font-semibold text-slate-800">{car.category}</div>
                          <div className="text-[10px] text-slate-500">{car.transmission} • {car.seats} Seats • {car.fuelType}</div>
                        </td>
                        <td className="py-3.5 text-slate-600 truncate max-w-[160px]">{car.currentHub}</td>
                        <td className="py-3.5 font-extrabold text-slate-900">${car.dailyRate}/d</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{car.ratingAverage || 5.0}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            car.status === 'AVAILABLE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : car.status === 'RENTED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {car.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingCar(car);
                                setCarForm({
                                  name: car.name,
                                  brand: car.brand,
                                  category: car.category,
                                  year: car.year || 2024,
                                  transmission: car.transmission,
                                  fuelType: car.fuelType,
                                  dailyRate: car.dailyRate,
                                  securityDeposit: car.securityDeposit || 200,
                                  seats: car.seats,
                                  licensePlate: car.licensePlate || '',
                                  image: car.image,
                                  currentHub: car.currentHub || 'Hazrat Shahjalal Intl Airport (DAC)',
                                  features: car.features.join(', '),
                                });
                                setAddCarModalOpen(true);
                              }}
                              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                              title="Edit Vehicle"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="p-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: BOOKINGS OPERATIONS */}
          {/* ========================================================= */}
          {activeNav === 'bookings' && (
            <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Bookings & Reservations Lifecycle</h3>
                  <p className="text-xs text-slate-500">Confirm reservations, trigger vehicle handovers, complete trips, or refund</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs">
                  {['All', 'Active', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                        statusFilter === st ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="pb-3 font-bold">Booking Code</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Vehicle & Plan</th>
                      <th className="pb-3 font-bold">Dates & Duration</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Total Amount</th>
                      <th className="pb-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bookings
                      .filter(b => statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase())
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 font-mono font-bold text-slate-900">{b.bookingCode}</td>
                          <td className="py-3.5">
                            <div className="font-bold text-slate-900">{b.customerName}</div>
                            <div className="text-[10px] text-slate-400">{b.customerEmail}</div>
                          </td>
                          <td className="py-3.5">
                            <div className="font-semibold text-slate-900">{b.vehicleName}</div>
                            <div className="text-[10px] text-blue-600 font-medium">{b.protectionPlan}</div>
                          </td>
                          <td className="py-3.5 text-slate-600">
                            <div>{b.totalDays} Days</div>
                            <div className="text-[10px] text-slate-400">{new Date(b.pickupDate).toLocaleDateString()} ➔ {new Date(b.dropoffDate).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === 'Active'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : b.status === 'Confirmed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : b.status === 'Pending'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : b.status === 'Completed'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right font-extrabold text-slate-900">${b.totalAmount}</td>
                          <td className="py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status === 'Pending' && (
                                <button
                                  onClick={() => handleBookingStatusChange(b.id, 'Confirmed')}
                                  className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] shadow-sm"
                                >
                                  Confirm
                                </button>
                              )}
                              {b.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleBookingStatusChange(b.id, 'Active')}
                                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm"
                                >
                                  Start Trip
                                </button>
                              )}
                              {b.status === 'Active' && (
                                <button
                                  onClick={() => handleBookingStatusChange(b.id, 'Completed')}
                                  className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] shadow-sm"
                                >
                                  Complete Trip
                                </button>
                              )}
                              {(b.status === 'Pending' || b.status === 'Confirmed') && (
                                <button
                                  onClick={() => handleCancelBooking(b.id)}
                                  className="px-2.5 py-1 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[10px]"
                                >
                                  Cancel & Refund
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: USER MANAGEMENT */}
          {/* ========================================================= */}
          {activeNav === 'users' && (
            <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Registered Driver Accounts & Roles</h3>
                  <p className="text-xs text-slate-500">Manage user profiles, verify driving credentials, and toggle account access</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="pb-3 font-bold">User</th>
                      <th className="pb-3 font-bold">Phone & City</th>
                      <th className="pb-3 font-bold">Driving License</th>
                      <th className="pb-3 font-bold">Role</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="text-slate-900 font-medium">{u.phone}</div>
                          <div className="text-[10px] text-slate-400">{u.address || 'Dhaka, Bangladesh'}</div>
                        </td>
                        <td className="py-3.5 font-mono font-semibold text-slate-800">
                          {u.drivingLicenseNumber || 'DL-PENDING'}
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600'
                                : 'border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: PAYMENTS & INVOICES */}
          {/* ========================================================= */}
          {activeNav === 'payments' && (
            <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Payment Transactions & Merchant Logs</h3>
                  <p className="text-xs text-slate-500">View customer receipts, transaction statuses, and refund records</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="pb-3 font-bold">Transaction</th>
                      <th className="pb-3 font-bold">Booking Code</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Payment Method</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-slate-900">{p.transactionCode}</td>
                        <td className="py-3.5 font-mono text-slate-600">{p.bookingCode}</td>
                        <td className="py-3.5 font-semibold text-slate-900">{p.customerName}</td>
                        <td className="py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-extrabold text-slate-900">${p.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: REVIEWS MODERATION */}
          {/* ========================================================= */}
          {activeNav === 'reviews' && (
            <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Customer Ratings & Moderation</h3>
                  <p className="text-xs text-slate-500">Approve authentic driver reviews and publish official management replies</p>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{rev.userName}</div>
                          <div className="text-[10px] text-slate-400">Rented Vehicle: {rev.carName}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rev.isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {rev.isApproved ? 'Approved' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>

                    {rev.adminReply && (
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-950">
                        <strong className="text-blue-700">Official Reply:</strong> {rev.adminReply}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/60">
                      <button
                        onClick={() => {
                          setReplyingReview(rev);
                          setAdminReplyText(rev.adminReply || '');
                        }}
                        className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleModerateReview(rev.id, !rev.isApproved)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                      >
                        {rev.isApproved ? 'Hide Review' : 'Approve Review'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: AVAILABILITY & MAINTENANCE */}
          {/* ========================================================= */}
          {activeNav === 'availability' && (
            <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Vehicle Availability & Scheduled Maintenance</h3>
                  <p className="text-xs text-slate-500">Lock vehicles for periodic engine inspections, showroom holds, and body repairs</p>
                </div>
                <button
                  onClick={() => setScheduleMaintenanceModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Maintenance Hold</span>
                </button>
              </div>

              <div className="space-y-3">
                {availabilityBlocks.map((blk) => (
                  <div key={blk.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{blk.carName}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{blk.type}</span>
                      </div>
                      <div className="text-slate-500">
                        Hold Dates: <strong className="text-slate-700">{new Date(blk.startDate).toLocaleDateString()}</strong> to <strong className="text-slate-700">{new Date(blk.endDate).toLocaleDateString()}</strong>
                      </div>
                      <div className="text-slate-400 italic">{blk.notes}</div>
                    </div>

                    <button
                      onClick={() => handleDeleteMaintenance(blk.id)}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-colors"
                    >
                      Release Hold
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: BUSINESS REPORTS */}
          {/* ========================================================= */}
          {activeNav === 'reports' && (
            <div className="space-y-6">
              <div className="rounded-3xl p-6 bg-white border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-lg text-slate-900">Executive Performance & Utilization Reports</h3>
                <p className="text-xs text-slate-500">Consolidated analytics and vehicle utilization metrics across 2026</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Total Revenue Generated</div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">${metrics?.kpis.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-emerald-600 font-semibold mt-2">✓ Verified Gross Inflow</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Fleet Utilization Rate</div>
                    <div className="text-3xl font-extrabold text-blue-600 mt-2">{metrics?.kpis.fleetUtilizationRate}%</div>
                    <div className="text-xs text-slate-500 font-medium mt-2">High Peak Demand Season</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Total Bookings Completed</div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-2">{metrics?.kpis.totalBookings}</div>
                    <div className="text-xs text-slate-500 font-medium mt-2">Verified Customer Trips</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT CAR MODAL */}
      {/* ========================================================= */}
      {addCarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">
                {editingCar ? 'Edit Fleet Vehicle' : 'Add New Fleet Vehicle'}
              </h4>
              <button onClick={() => setAddCarModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Car Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaguar XE L Prestige"
                  value={carForm.name}
                  onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Brand</label>
                  <input
                    type="text"
                    value={carForm.brand}
                    onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Category</label>
                  <select
                    value={carForm.category}
                    onChange={(e) => setCarForm({ ...carForm, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Electric">Electric</option>
                    <option value="Passenger Van">Passenger Van</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Daily Rate ($)</label>
                  <input
                    type="number"
                    value={carForm.dailyRate}
                    onChange={(e) => setCarForm({ ...carForm, dailyRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Deposit ($)</label>
                  <input
                    type="number"
                    value={carForm.securityDeposit}
                    onChange={(e) => setCarForm({ ...carForm, securityDeposit: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Seats</label>
                  <input
                    type="number"
                    value={carForm.seats}
                    onChange={(e) => setCarForm({ ...carForm, seats: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Photo URL</label>
                <input
                  type="url"
                  value={carForm.image}
                  onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Features</label>
                <input
                  type="text"
                  value={carForm.features}
                  onChange={(e) => setCarForm({ ...carForm, features: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddCarModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCHEDULE MAINTENANCE MODAL */}
      {/* ========================================================= */}
      {scheduleMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">Schedule Maintenance Downtime</h4>
              <button onClick={() => setScheduleMaintenanceModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMaintenance} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Select Vehicle</label>
                <select
                  value={maintForm.carId}
                  onChange={(e) => setMaintForm({ ...maintForm, carId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                >
                  <option value="">-- Choose Car --</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={maintForm.startDate}
                    onChange={(e) => setMaintForm({ ...maintForm, startDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={maintForm.endDate}
                    onChange={(e) => setMaintForm({ ...maintForm, endDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Reason / Notes</label>
                <input
                  type="text"
                  value={maintForm.notes}
                  onChange={(e) => setMaintForm({ ...maintForm, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setScheduleMaintenanceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md"
                >
                  Lock Dates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REVIEW REPLY MODAL */}
      {/* ========================================================= */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">Reply to Review from {replyingReview.userName}</h4>
              <button onClick={() => setReplyingReview(null)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl">"{replyingReview.comment}"</p>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Official Response</label>
              <textarea
                rows={3}
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                placeholder="Thank you for your valuable feedback..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setReplyingReview(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleReplyReview}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md"
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
