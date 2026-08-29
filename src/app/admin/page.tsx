'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Car,
  Calendar,
  Users,
  CreditCard,
  Star,
  Wrench,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Bell,
  Maximize2,
  Calendar as CalendarIcon,
  ChevronDown,
  ArrowUpRight,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Ban,
  X,
  MapPin,
  Globe,
  SlidersHorizontal,
  ChevronRight,
  Check,
  DollarSign,
  Activity,
  Layers,
  ShoppingBag,
  FileText,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
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
  PricingRule
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
  const [refreshing, setRefreshing] = useState(false);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('01 Jan 2026 - 31 Dec 2026');
  const [analyticsYear, setAnalyticsYear] = useState('2026');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [addCarModalOpen, setAddCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Vehicle | null>(null);
  const [scheduleMaintenanceModalOpen, setScheduleMaintenanceModalOpen] = useState(false);
  const [replyingReview, setReplyingReview] = useState<Review | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

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

  // Load telemetry
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
        rulesData
      ] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getBookings(),
        api.getVehicles(),
        api.getUsers(),
        api.getPayments(),
        api.getReviews(),
        api.getAvailabilityBlocks(),
        api.getPricingRules()
      ]);

      setMetrics(analyticsData);
      setBookings(bookingsData);
      setVehicles(vehiclesData);
      setUsers(usersData);
      setPayments(paymentsData);
      setReviews(reviewsData);
      setAvailabilityBlocks(blocksData);
      setPricingRules(rulesData);
    } catch (err) {
      console.error('Failed to load admin telemetry', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // CRUD Handlers
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
    if (!confirm('Are you sure you want to delete this car from fleet?')) return;
    try {
      await api.deleteVehicle(carId);
      setVehicles(prev => prev.filter(c => c.id !== carId));
    } catch (err: any) {
      alert(`Delete error: ${err.message || 'Failed'}`);
    }
  };

  const handleBookingStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
    } catch {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
    }
  };

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

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      const updated = await api.updateUserStatus(userId, nextStatus);
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
    } catch (err: any) {
      alert(`Status update error: ${err.message || 'Failed'}`);
    }
  };

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
      alert('Maintenance block created.');
    } catch (err: any) {
      alert(`Maintenance error: ${err.message || 'Failed'}`);
    }
  };

  const handleDeleteMaintenance = async (blockId: string) => {
    try {
      await api.deleteAvailabilityBlock(blockId);
      setAvailabilityBlocks(prev => prev.filter(b => b.id !== blockId));
    } catch (err: any) {
      alert(`Error: ${err.message || 'Failed'}`);
    }
  };

  // Best seller list
  const bestSellerCars = [
    { id: '1', name: 'Range Rover Velar', category: 'Luxury SUV', sales: '5,147', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80' },
    { id: '2', name: 'Audi S5 Sportback', category: 'Executive Sedan', sales: '4,768', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=300&q=80' },
    { id: '3', name: 'BMW M5 Competition', category: 'Sports Luxury', sales: '3,175', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80' },
    { id: '4', name: 'Tesla Model X Plaid', category: 'Electric SUV', sales: '2,845', image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=300&q=80' },
    { id: '5', name: 'Porsche Cayenne GT', category: 'Super SUV', sales: '1,178', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80' }
  ];

  // Recent transactions table
  const recentTransactions = [
    {
      id: '1',
      name: 'Range Rover Velar',
      date: '10 Nov',
      payment: 'PayPal',
      status: 'Success',
      amount: '$2,450.00',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '2',
      name: 'Audi S5 Sportback',
      date: '09 Nov',
      payment: 'Apple Pay',
      status: 'Pending',
      amount: '$850.00',
      image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '3',
      name: 'BMW M5 Competition',
      date: '08 Nov',
      payment: 'Stripe Card',
      status: 'Success',
      amount: '$240.10',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '4',
      name: 'Tesla Model X Plaid',
      date: '07 Nov',
      payment: 'Mastercard',
      status: 'Success',
      amount: '$2,680.00',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '5',
      name: 'Porsche Cayenne GT',
      date: '06 Nov',
      payment: 'Visa Direct',
      status: 'Success',
      amount: '$175.50',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F5F8] flex text-[#333843] font-['Plus_Jakarta_Sans',sans-serif] antialiased">
      
      {/* 1. LEFT SIDEBAR (EXACT FIGMA LAYOUT) */}
      <aside className="w-[260px] bg-white border-r border-[#E9EAF0] hidden lg:flex flex-col justify-between shrink-0 shadow-sm">
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#FF7A00] flex items-center justify-center shadow-md shadow-orange-500/20 text-white font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#111827]">
                RENT<span className="text-[#FF7A00]">CARS</span>
              </span>
            </div>
          </Link>

          {/* MAIN MENU */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] px-3 mb-2">
              Main
            </div>
            
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-[#FFF4EC] text-[#FF7A00]'
                  : 'text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-[18px] h-[18px]" />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('fleet')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                activeNav === 'fleet'
                  ? 'bg-[#FFF4EC] text-[#FF7A00]'
                  : 'text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Car className="w-[18px] h-[18px]" />
                <span>Car Fleet</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">{vehicles.length}</span>
            </button>

            <button
              onClick={() => setActiveNav('bookings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                activeNav === 'bookings'
                  ? 'bg-[#FFF4EC] text-[#FF7A00]'
                  : 'text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-[18px] h-[18px]" />
                <span>Bookings</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">{bookings.length}</span>
            </button>

            <button
              onClick={() => setActiveNav('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                activeNav === 'users'
                  ? 'bg-[#FFF4EC] text-[#FF7A00]'
                  : 'text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-[18px] h-[18px]" />
                <span>Customers</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">{users.length}</span>
            </button>

            <button
              onClick={() => setActiveNav('payments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                activeNav === 'payments'
                  ? 'bg-[#FFF4EC] text-[#FF7A00]'
                  : 'text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-[18px] h-[18px]" />
                <span>Payments</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('reviews')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                activeNav === 'reviews'
                  ? 'bg-[#FFF4EC] text-[#FF7A00]'
                  : 'text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className="w-[18px] h-[18px]" />
                <span>Reviews</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('availability')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                activeNav === 'availability'
                  ? 'bg-[#FFF4EC] text-[#FF7A00]'
                  : 'text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-[18px] h-[18px]" />
                <span>Availability Holds</span>
              </div>
            </button>

            <button
              onClick={() => setActiveNav('reports')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                activeNav === 'reports'
                  ? 'bg-[#FFF4EC] text-[#FF7A00]'
                  : 'text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB]'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-[18px] h-[18px]" />
                <span>Reports</span>
              </div>
            </button>
          </div>

          {/* PREFERENCES */}
          <div className="space-y-1 pt-3 border-t border-[#F1F2F4]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] px-3 mb-2">
              Settings & Preferences
            </div>

            <button
              onClick={() => alert('Settings configured.')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB] transition-colors"
            >
              <Settings className="w-[18px] h-[18px]" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => alert('Help Center: support@rentcars.com')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium text-[#667085] hover:text-[#FF7A00] hover:bg-[#F9FAFB] transition-colors"
            >
              <HelpCircle className="w-[18px] h-[18px]" />
              <span>Help Center</span>
            </button>
          </div>

        </div>

        {/* Exit & Logout CTA */}
        <div className="p-6 border-t border-[#E9EAF0]">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit to Main Site</span>
          </Link>
        </div>
      </aside>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP HEADER BAR (EXACT FIGMA DESIGN) */}
        <header className="h-[74px] bg-white border-b border-[#E9EAF0] px-8 flex items-center justify-between gap-6 sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search something here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#111827] focus:outline-none focus:border-[#FF7A00] placeholder-[#9CA3AF] transition-all"
            />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3.5">
            
            {/* Refresh Button */}
            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              className="p-2 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[#667085] transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#FF7A00]' : ''}`} />
            </button>

            {/* Date Range Selector Pill */}
            <div className="hidden md:flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] px-3.5 py-2 rounded-xl text-xs font-semibold text-[#374151]">
              <CalendarIcon className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>01 Jan 2026 - 31 Dec 2026</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </div>

            {/* Orange + Add New Button */}
            <button
              onClick={() => {
                setEditingCar(null);
                setAddCarModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold text-xs shadow-sm shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Car</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button className="p-2.5 rounded-xl bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] text-[#667085] relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white"></span>
              </button>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-2 border-l border-[#E5E7EB]">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Mike Willcox Admin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-[#111827] leading-tight">Mike Willcox</div>
                <div className="text-[10px] text-[#9CA3AF] font-medium">Super Admin</div>
              </div>
            </div>

          </div>
        </header>

        {/* 3. DYNAMIC MAIN BODY */}
        <main className="p-8 space-y-7 max-w-[1400px] w-full mx-auto">
          
          {/* ========================================================= */}
          {/* TAB 1: EXACT FIGMA DASHBOARD VIEW */}
          {/* ========================================================= */}
          {activeNav === 'dashboard' && (
            <div className="space-y-7">
              
              {/* TOP 3 CARDS ROW (GREETING + TOTAL SALES + TOTAL ORDERS) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* 1. Greeting & Weekly Earning Card (White Card with Cash Illustration) */}
                <div className="md:col-span-6 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex items-center justify-between relative overflow-hidden">
                  <div className="space-y-3 z-10">
                    <div className="flex items-center gap-1.5 text-xs text-[#374151] font-semibold">
                      <span>👋 Hi Mike Willcox,</span>
                      <span className="text-[#9CA3AF] font-normal">here's what's happening with your fleet today.</span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-[#6B7280] font-semibold">Weekly Earning</div>
                      <div className="text-3xl font-extrabold text-[#111827] tracking-tight">
                        ${(metrics?.kpis?.totalRevenue || 95000.45).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#10B981]">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+18.50% compare to last week</span>
                    </div>
                  </div>

                  {/* Cash Money Illustration Graphic on Right */}
                  <div className="relative w-32 h-28 shrink-0 z-10 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <DollarSign className="w-12 h-12 stroke-[2.5]" />
                    </div>
                  </div>
                </div>

                {/* 2. Orange Gradient Card: Total Customers / Sales */}
                <div className="md:col-span-3 bg-gradient-to-br from-[#FF7A00] to-[#FF9E00] text-white rounded-2xl p-6 shadow-md shadow-orange-500/15 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="text-3xl font-extrabold tracking-tight">10,000+</div>
                    <div className="text-xs text-orange-100 font-semibold">Total Fleet Bookings</div>
                  </div>
                </div>

                {/* 3. Deep Navy Card: Total Orders / Payment Cards */}
                <div className="md:col-span-3 bg-[#0B1A3D] text-white rounded-2xl p-6 shadow-md shadow-slate-900/15 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 backdrop-blur-sm flex items-center justify-center text-blue-400">
                    <Activity className="w-5 h-5" />
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="text-3xl font-extrabold tracking-tight">800+</div>
                    <div className="text-xs text-blue-200 font-semibold">Active Dispatch Trips</div>
                  </div>
                </div>

              </div>

              {/* MIDDLE ROW: Best Seller (Left) + Recent Transactions (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Best Seller Card (Left ~38% width) */}
                <div className="lg:col-span-5 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
                    <h3 className="font-bold text-base text-[#111827]">Best Seller</h3>
                    <button onClick={() => setActiveNav('fleet')} className="text-xs text-[#FF7A00] font-bold hover:underline">
                      View All
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {bestSellerCars.map((car) => (
                      <div key={car.id} className="flex items-center justify-between gap-3 hover:bg-slate-50/70 p-1.5 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <Image src={car.image} alt={car.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-[#111827]">{car.name}</h4>
                            <div className="text-[11px] text-[#6B7280]">{car.category}</div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-[#9CA3AF] uppercase font-semibold">Sales</div>
                          <div className="text-xs font-extrabold text-[#111827]">{car.sales}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions Table (Right ~62% width) */}
                <div className="lg:col-span-7 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
                    <h3 className="font-bold text-base text-[#111827]">Recent Transactions</h3>
                    <button onClick={() => setActiveNav('payments')} className="text-xs text-[#FF7A00] font-bold hover:underline">
                      See All
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[#9CA3AF] uppercase text-[10px] tracking-wider border-b border-[#F3F4F6]">
                        <tr>
                          <th className="pb-3 font-bold">#</th>
                          <th className="pb-3 font-bold">Order Details</th>
                          <th className="pb-3 font-bold">Payment</th>
                          <th className="pb-3 font-bold">Status</th>
                          <th className="pb-3 font-bold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F3F4F6] text-[#374151]">
                        {recentTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 font-bold text-[#9CA3AF]">{tx.id}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="relative w-9 h-7 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                  <Image src={tx.image} alt={tx.name} fill className="object-cover" />
                                </div>
                                <div>
                                  <div className="font-bold text-[#111827]">{tx.name}</div>
                                  <div className="text-[10px] text-[#9CA3AF]">{tx.date}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-medium text-[#4B5563]">{tx.payment}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tx.status === 'Success'
                                  ? 'bg-[#DEF7EC] text-[#03543F]'
                                  : tx.status === 'Pending'
                                  ? 'bg-[#FEF08A] text-[#854D0E]'
                                  : 'bg-[#FDE8E8] text-[#9B1C1C]'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-3 text-right font-extrabold text-[#111827]">{tx.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* BOTTOM ROW: Sales Analytics Chart (Left) + Sales by Countries (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Sales Analytics Chart (Left ~65% width) */}
                <div className="lg:col-span-8 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
                    <h3 className="font-bold text-base text-[#111827]">Sales Analytics</h3>
                    
                    <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#E5E7EB] px-3 py-1 rounded-xl text-xs font-semibold text-[#4B5563]">
                      <span>{analyticsYear}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    </div>
                  </div>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metrics?.revenueTrends || []}>
                        <defs>
                          <linearGradient id="figmaOrangeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#FF7A00" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            borderColor: '#E5E7EB',
                            borderRadius: '12px',
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Sales Volume']}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#FF7A00"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#figmaOrangeGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sales by Countries Widget (Right ~35% width) */}
                <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F3F4F6]">
                    <h3 className="font-bold text-base text-[#111827]">Sales by Countries</h3>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#6B7280]">
                      <span>This Week</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    </div>
                  </div>

                  {/* Stylized Region Share Display */}
                  <div className="space-y-4 pt-1">
                    <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#FF7A00]" />
                          <span>United States Hub</span>
                        </div>
                        <span className="text-[#FF7A00]">40%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF7A00] rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#3B82F6]" />
                          <span>Bangladesh / Regional</span>
                        </div>
                        <span className="text-[#3B82F6]">35%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#F3F4F6] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#111827]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#10B981]" />
                          <span>European & GCC Hubs</span>
                        </div>
                        <span className="text-[#10B981]">25%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#10B981] rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-[#10B981] flex items-center gap-1 pt-1">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+40% increase compare to last week</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* FOOTER */}
              <div className="pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF] gap-2">
                <div>© 2026 All Rights Reserved</div>
                <div>Designed &amp; Developed with ❤️ by RentCars Team</div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CAR FLEET MANAGEMENT (CRUD) */}
          {/* ========================================================= */}
          {activeNav === 'fleet' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3F4F6]">
                <div>
                  <h3 className="font-bold text-lg text-[#111827]">Car Fleet Catalog & Management</h3>
                  <p className="text-xs text-[#6B7280]">Add new vehicles, update rental rates, and manage availability status</p>
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
                  className="px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold text-xs shadow-md flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Car</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[#9CA3AF] uppercase text-[10px] tracking-wider border-b border-[#F3F4F6]">
                    <tr>
                      <th className="pb-3 font-bold">Vehicle</th>
                      <th className="pb-3 font-bold">Specs</th>
                      <th className="pb-3 font-bold">Hub</th>
                      <th className="pb-3 font-bold">Rate</th>
                      <th className="pb-3 font-bold">Rating</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] text-[#374151]">
                    {vehicles.map((car) => (
                      <tr key={car.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <Image src={car.image} alt={car.name} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-[#111827]">{car.name}</div>
                              <div className="text-[10px] text-[#9CA3AF] font-mono">{car.licensePlate || 'RC-001'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 font-medium">{car.category} • {car.transmission} • {car.seats} Seats</td>
                        <td className="py-3.5 text-[#6B7280]">{car.currentHub}</td>
                        <td className="py-3.5 font-extrabold text-[#111827]">${car.dailyRate}/d</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{car.ratingAverage || 5.0}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            car.status === 'AVAILABLE' ? 'bg-[#DEF7EC] text-[#03543F]' : 'bg-[#E1EFFE] text-[#1E429F]'
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
                              className="p-1.5 rounded-lg border border-[#E5E7EB] hover:bg-slate-100 text-[#4B5563]"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
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
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3F4F6]">
                <div>
                  <h3 className="font-bold text-lg text-[#111827]">Bookings Management</h3>
                  <p className="text-xs text-[#6B7280]">Confirm reservations, start trips, and manage cancellations</p>
                </div>
                <div className="flex items-center gap-1 bg-[#F9FAFB] p-1 rounded-xl text-xs">
                  {['All', 'Active', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                        statusFilter === st ? 'bg-white text-[#FF7A00] shadow-sm' : 'text-[#6B7280]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[#9CA3AF] uppercase text-[10px] tracking-wider border-b border-[#F3F4F6]">
                    <tr>
                      <th className="pb-3 font-bold">Code</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Car</th>
                      <th className="pb-3 font-bold">Duration</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Amount</th>
                      <th className="pb-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] text-[#374151]">
                    {bookings
                      .filter(b => statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase())
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/80">
                          <td className="py-3 font-mono font-bold text-[#111827]">{b.bookingCode}</td>
                          <td className="py-3">
                            <div className="font-bold text-[#111827]">{b.customerName}</div>
                            <div className="text-[10px] text-[#9CA3AF]">{b.customerEmail}</div>
                          </td>
                          <td className="py-3 font-semibold text-[#111827]">{b.vehicleName}</td>
                          <td className="py-3 text-[#6B7280]">{b.totalDays} Days</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E1EFFE] text-[#1E429F]">
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-extrabold text-[#111827]">${b.totalAmount}</td>
                          <td className="py-3 text-right">
                            {b.status === 'Pending' && (
                              <button
                                onClick={() => handleBookingStatusChange(b.id, 'Confirmed')}
                                className="px-3 py-1 rounded-lg bg-[#FF7A00] text-white font-bold text-[10px]"
                              >
                                Confirm
                              </button>
                            )}
                            {b.status === 'Confirmed' && (
                              <button
                                onClick={() => handleBookingStatusChange(b.id, 'Active')}
                                className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px]"
                              >
                                Start Trip
                              </button>
                            )}
                            {b.status === 'Active' && (
                              <button
                                onClick={() => handleBookingStatusChange(b.id, 'Completed')}
                                className="px-3 py-1 rounded-lg bg-slate-800 text-white font-bold text-[10px]"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: USERS MANAGEMENT */}
          {/* ========================================================= */}
          {activeNav === 'users' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-[#111827]">Customer Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[#9CA3AF] uppercase text-[10px] tracking-wider border-b border-[#F3F4F6]">
                    <tr>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Phone</th>
                      <th className="pb-3 font-bold">License</th>
                      <th className="pb-3 font-bold">Role</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] text-[#374151]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        <td className="py-3">
                          <div className="font-bold text-[#111827]">{u.name}</div>
                          <div className="text-[10px] text-[#9CA3AF]">{u.email}</div>
                        </td>
                        <td className="py-3 text-[#4B5563]">{u.phone}</td>
                        <td className="py-3 font-mono font-semibold">{u.drivingLicenseNumber || 'DL-PENDING'}</td>
                        <td className="py-3 font-semibold">{u.role}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'ACTIVE' ? 'bg-[#DEF7EC] text-[#03543F]' : 'bg-[#FDE8E8] text-[#9B1C1C]'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className="px-3 py-1 rounded-lg border border-[#E5E7EB] font-bold text-[10px]"
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
          {/* TAB 5: PAYMENTS */}
          {/* ========================================================= */}
          {activeNav === 'payments' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-[#111827]">Payment Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[#9CA3AF] uppercase text-[10px] tracking-wider border-b border-[#F3F4F6]">
                    <tr>
                      <th className="pb-3 font-bold">Transaction</th>
                      <th className="pb-3 font-bold">Booking</th>
                      <th className="pb-3 font-bold">Customer</th>
                      <th className="pb-3 font-bold">Method</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] text-[#374151]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="py-3 font-mono font-bold text-[#111827]">{p.transactionCode}</td>
                        <td className="py-3 font-mono text-[#6B7280]">{p.bookingCode}</td>
                        <td className="py-3 font-semibold text-[#111827]">{p.customerName}</td>
                        <td className="py-3">{p.paymentMethod}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DEF7EC] text-[#03543F]">
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-extrabold text-[#111827]">${p.amount}</td>
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
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-[#111827]">Customer Reviews</h3>
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-[#111827]">{rev.userName} ({rev.carName})</div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                    {rev.adminReply && (
                      <div className="p-2.5 rounded-lg bg-blue-50 text-xs text-blue-900">
                        <strong>Official Reply:</strong> {rev.adminReply}
                      </div>
                    )}
                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setReplyingReview(rev);
                          setAdminReplyText(rev.adminReply || '');
                        }}
                        className="px-3 py-1 rounded-lg bg-[#FF7A00] text-white font-bold text-[10px]"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleModerateReview(rev.id, !rev.isApproved)}
                        className="px-3 py-1 rounded-lg border border-slate-300 font-bold text-[10px]"
                      >
                        {rev.isApproved ? 'Hide' : 'Approve'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: AVAILABILITY & HOLDS */}
          {/* ========================================================= */}
          {activeNav === 'availability' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-[#F3F4F6]">
                <h3 className="font-bold text-lg text-[#111827]">Availability & Maintenance Holds</h3>
                <button
                  onClick={() => setScheduleMaintenanceModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#FF7A00] text-white font-bold text-xs"
                >
                  + Schedule Hold
                </button>
              </div>

              <div className="space-y-3">
                {availabilityBlocks.map((blk) => (
                  <div key={blk.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{blk.carName} ({blk.type})</div>
                      <div className="text-slate-500">{new Date(blk.startDate).toLocaleDateString()} to {new Date(blk.endDate).toLocaleDateString()}</div>
                      <div className="text-slate-400 italic">{blk.notes}</div>
                    </div>
                    <button
                      onClick={() => handleDeleteMaintenance(blk.id)}
                      className="px-3 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 font-bold"
                    >
                      Release
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: REPORTS */}
          {/* ========================================================= */}
          {activeNav === 'reports' && (
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-[#111827]">Business Performance Reports</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Total Revenue</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">${metrics?.kpis.totalRevenue.toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Utilization Rate</div>
                  <div className="text-2xl font-extrabold text-[#FF7A00] mt-1">{metrics?.kpis.fleetUtilizationRate}%</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Total Bookings</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{metrics?.kpis.totalBookings}</div>
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
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                {editingCar ? 'Edit Vehicle' : 'Add New Car to Fleet'}
              </h4>
              <button onClick={() => setAddCarModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Range Rover Velar"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Deposit ($)</label>
                  <input
                    type="number"
                    value={carForm.securityDeposit}
                    onChange={(e) => setCarForm({ ...carForm, securityDeposit: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Seats</label>
                  <input
                    type="number"
                    value={carForm.seats}
                    onChange={(e) => setCarForm({ ...carForm, seats: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Photo URL</label>
                <input
                  type="url"
                  value={carForm.image}
                  onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Features (comma separated)</label>
                <input
                  type="text"
                  value={carForm.features}
                  onChange={(e) => setCarForm({ ...carForm, features: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
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
                  className="px-6 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#E66E00] text-white font-bold shadow-md"
                >
                  Save Car
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
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900"
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
                  className="px-6 py-2 rounded-xl bg-[#FF7A00] text-white font-bold shadow-md"
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
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
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
                className="px-6 py-2 rounded-xl bg-[#FF7A00] text-white text-xs font-bold shadow-md"
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
