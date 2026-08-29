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
  FileSpreadsheet
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

  // Modals for CRUD
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
    features: 'GPS, Air Conditioning, Bluetooth',
  });

  // Maintenance Form State
  const [maintForm, setMaintForm] = useState({
    carId: '',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    type: 'MAINTENANCE',
    notes: 'Periodic maintenance & brake overhaul',
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

  // Handlers for Bookings
  const handleBookingStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await api.updateBookingStatus(id, newStatus);
      setBookings(prev => prev.map(b => b.id === id ? updated : b));
    } catch {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
    }
  };

  // Handlers for Users
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
    <div className="min-h-screen bg-[#F4F5F8] flex">
      
      {/* 1. Left Sidebar Navigation (Exact Figma Style) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-5 shrink-0">
        <div className="space-y-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Plus_Jakarta_Sans']">
                RENT<span className="text-blue-600">CARS</span>
              </span>
            </div>
          </Link>

          {/* Main Menu */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Fleet Operations</div>
            
            <button
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
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
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeNav === 'fleet'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Car Fleet CRUD ({vehicles.length})</span>
            </button>

            <button
              onClick={() => setActiveNav('bookings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
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
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeNav === 'users'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Management ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveNav('payments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
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
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeNav === 'reviews'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews Moderation ({reviews.length})</span>
            </button>

            <button
              onClick={() => setActiveNav('availability')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeNav === 'availability'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Availability / Maintenance</span>
            </button>

            <button
              onClick={() => setActiveNav('reports')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeNav === 'reports'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Business Reports</span>
            </button>
          </div>

        </div>

        {/* Exit CTA */}
        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit to Customer Portal</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
          
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vehicles, bookings, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-slate-200 border border-slate-300">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Admin User"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">Admin Executive</div>
                <div className="text-[10px] text-slate-500">Fleet Operations</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Body based on activeNav */}
        <main className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* ========================================================= */}
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {/* ========================================================= */}
          {activeNav === 'dashboard' && (
            <div className="space-y-8">
              {/* Top 3 KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="figma-card rounded-2xl p-6 border border-slate-200/80 bg-white flex flex-col justify-between space-y-4 shadow-sm">
                  <div className="space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Fleet Overview</div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                      Welcome back, Admin 👋
                    </h2>
                    <p className="text-xs text-slate-500">
                      You have <strong className="text-blue-600">{metrics?.fleetSummary?.rented || 2} active car rentals</strong> dispatched across airport terminals today.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setActiveNav('fleet')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                    >
                      <span>Manage Fleet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <CarFront className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white flex flex-col justify-between shadow-lg shadow-orange-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-100">Total Revenue</span>
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
                      ${(metrics?.kpis?.totalRevenue || 48250).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-orange-100 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+{metrics?.kpis?.revenueGrowthPct || 15.8}% compared to last month</span>
                    </div>
                  </div>
                </div>

                {/* Total Bookings */}
                <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white flex flex-col justify-between shadow-lg shadow-slate-900/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Total Bookings</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-extrabold font-['Plus_Jakarta_Sans']">
                      {(metrics?.kpis?.totalBookings || 1420).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{metrics?.kpis?.fleetUtilizationRate || 88}% Fleet Utilization Rate</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Middle Section: Car Availability (Left) + Recent Bookings (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Car Availability */}
                <div className="lg:col-span-5 figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">Car Availability</h3>
                    <button onClick={() => setActiveNav('fleet')} className="text-xs text-blue-600 font-bold hover:underline">View Fleet</button>
                  </div>

                  <div className="space-y-3">
                    {vehicles.slice(0, 5).map((car) => (
                      <div key={car.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200">
                            <Image src={car.image} alt={car.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{car.name}</h4>
                            <div className="text-[11px] text-slate-500">{car.category} • {car.transmission}</div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-extrabold text-slate-900">${car.dailyRate}<span className="text-[10px] text-slate-400 font-normal">/d</span></div>
                          <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold ${
                            car.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {car.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="lg:col-span-7 figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">Recent Bookings</h3>
                      <p className="text-xs text-slate-500">Live reservation transactions and telemetry</p>
                    </div>
                    <button onClick={() => setActiveNav('bookings')} className="text-xs text-blue-600 font-bold hover:underline">All Bookings</button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                        <tr>
                          <th className="pb-3 font-bold">Code</th>
                          <th className="pb-3 font-bold">Customer</th>
                          <th className="pb-3 font-bold">Vehicle</th>
                          <th className="pb-3 font-bold">Status</th>
                          <th className="pb-3 font-bold text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/80">
                            <td className="py-3 font-mono font-bold text-slate-900">{b.bookingCode}</td>
                            <td className="py-3">
                              <div className="font-bold text-slate-900">{b.customerName}</div>
                              <div className="text-[10px] text-slate-400">{b.customerEmail}</div>
                            </td>
                            <td className="py-3 font-semibold text-slate-900">{b.vehicleName}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">{b.status}</span>
                            </td>
                            <td className="py-3 text-right font-extrabold text-slate-900">${b.totalAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Bottom Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-8 figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">Earning Summary</h3>
                      <p className="text-xs text-slate-500">Monthly revenue trends and performance metrics ($ USD)</p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">2026 YTD</span>
                  </div>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metrics?.revenueTrends || []}>
                        <defs>
                          <linearGradient id="figmaOrangeArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F97316" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px' }}
                          formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Gross Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#figmaOrangeArea)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="lg:col-span-4 figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-4 shadow-sm">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">Rental Hub Locations</h3>
                    <p className="text-xs text-slate-500">Fleet dispatch share by airport and central city terminals</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /><span className="font-bold text-slate-800">Hazrat Shahjalal DAC</span></div>
                      <span className="font-extrabold text-blue-600">58% Share</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /><span className="font-bold text-slate-800">Sylhet Osmani ZYL</span></div>
                      <span className="font-extrabold text-orange-500">24% Share</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-600" /><span className="font-bold text-slate-800">Chittagong Patenga CGP</span></div>
                      <span className="font-extrabold text-emerald-600">18% Share</span>
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
            <div className="figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-['Plus_Jakarta_Sans']">Car Fleet Management</h3>
                  <p className="text-xs text-slate-500">Add, edit rates, configure specs, or decommission fleet vehicles</p>
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
                      features: 'GPS, Air Conditioning, Bluetooth',
                    });
                    setAddCarModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
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
                      <th className="pb-3 font-bold">Hub Location</th>
                      <th className="pb-3 font-bold">Daily Rate</th>
                      <th className="pb-3 font-bold">Rating</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {vehicles.map((car) => (
                      <tr key={car.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                              <Image src={car.image} alt={car.name} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{car.name}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{car.licensePlate}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <div className="font-semibold text-slate-800">{car.category}</div>
                          <div className="text-[10px] text-slate-500">{car.transmission} • {car.seats} Seats • {car.fuelType}</div>
                        </td>
                        <td className="py-3.5 text-slate-600 truncate max-w-[150px]">{car.currentHub}</td>
                        <td className="py-3.5 font-extrabold text-slate-900">${car.dailyRate}/d</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{car.ratingAverage || 5.0}</span>
                          </div>
                        </td>
                        <td className="py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            car.status === 'AVAILABLE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
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
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                              title="Edit Vehicle"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
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
          {/* TAB 3: BOOKINGS MANAGEMENT */}
          {/* ========================================================= */}
          {activeNav === 'bookings' && (
            <div className="figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-['Plus_Jakarta_Sans']">Bookings Operations</h3>
                  <p className="text-xs text-slate-500">Manage workflow lifecycle, rental check-ins, and refunds</p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  {['All', 'Active', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
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
                      <th className="pb-3 font-bold">Duration</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Total Amount</th>
                      <th className="pb-3 font-bold text-right">Workflow Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {bookings
                      .filter(b => statusFilter === 'All' || b.status.toLowerCase() === statusFilter.toLowerCase())
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 font-mono font-bold text-slate-900">{b.bookingCode}</td>
                          <td className="py-3">
                            <div className="font-bold text-slate-900">{b.customerName}</div>
                            <div className="text-[10px] text-slate-400">{b.customerEmail}</div>
                          </td>
                          <td className="py-3">
                            <div className="font-semibold text-slate-900">{b.vehicleName}</div>
                            <div className="text-[10px] text-blue-600">{b.protectionPlan}</div>
                          </td>
                          <td className="py-3 text-slate-600">{b.totalDays} Days</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 text-right font-extrabold text-slate-900">${b.totalAmount}</td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status === 'Pending' && (
                                <button
                                  onClick={() => handleBookingStatusChange(b.id, 'Confirmed')}
                                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px]"
                                >
                                  Confirm
                                </button>
                              )}
                              {b.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleBookingStatusChange(b.id, 'Active')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px]"
                                >
                                  Start Trip
                                </button>
                              )}
                              {b.status === 'Active' && (
                                <button
                                  onClick={() => handleBookingStatusChange(b.id, 'Completed')}
                                  className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[10px]"
                                >
                                  Complete
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
            <div className="figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-['Plus_Jakarta_Sans']">User Management</h3>
                  <p className="text-xs text-slate-500">Manage registered driver accounts, verify licenses, and assign permissions</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="pb-3 font-bold">User</th>
                      <th className="pb-3 font-bold">Phone & Address</th>
                      <th className="pb-3 font-bold">Driving License</th>
                      <th className="pb-3 font-bold">Role</th>
                      <th className="pb-3 font-bold">Account Status</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-xs">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{u.name}</div>
                              <div className="text-[10px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="text-slate-900">{u.phone}</div>
                          <div className="text-[10px] text-slate-400">{u.address || 'Dhaka, Bangladesh'}</div>
                        </td>
                        <td className="py-3 font-mono font-semibold text-slate-800">
                          {u.drivingLicenseNumber || 'DL-PENDING'}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${
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
          {/* TAB 5: PAYMENTS & TRANSACTIONS */}
          {/* ========================================================= */}
          {activeNav === 'payments' && (
            <div className="figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-['Plus_Jakarta_Sans']">Payments & Invoices</h3>
                  <p className="text-xs text-slate-500">Transaction logs, merchant methods, and refund processing</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="pb-3 font-bold">Transaction</th>
                      <th className="pb-3 font-bold">Booking Code</th>
                      <th className="pb-3 font-bold">Payer</th>
                      <th className="pb-3 font-bold">Payment Method</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-900">{p.transactionCode}</td>
                        <td className="py-3 font-mono text-slate-600">{p.bookingCode}</td>
                        <td className="py-3 font-semibold text-slate-900">{p.customerName}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-extrabold text-slate-900">${p.amount}</td>
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
            <div className="figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-['Plus_Jakarta_Sans']">Customer Reviews Moderation</h3>
                  <p className="text-xs text-slate-500">Moderate customer ratings, approve comments, and post official responses</p>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{rev.userName}</div>
                          <div className="text-[10px] text-slate-400">Rented: {rev.carName}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rev.isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {rev.isApproved ? 'Approved' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>

                    {rev.adminReply && (
                      <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-950">
                        <strong className="text-blue-700">Admin Response:</strong> {rev.adminReply}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200/60">
                      <button
                        onClick={() => {
                          setReplyingReview(rev);
                          setAdminReplyText(rev.adminReply || '');
                        }}
                        className="px-3 py-1 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px]"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleModerateReview(rev.id, !rev.isApproved)}
                        className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
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
            <div className="figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-['Plus_Jakarta_Sans']">Car Availability & Maintenance</h3>
                  <p className="text-xs text-slate-500">Schedule maintenance downtime, vehicle inspection holds, and manage calendar</p>
                </div>
                <button
                  onClick={() => setScheduleMaintenanceModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">{blk.type}</span>
                      </div>
                      <div className="text-slate-500">
                        Hold Dates: <strong className="text-slate-700">{new Date(blk.startDate).toLocaleDateString()}</strong> to <strong className="text-slate-700">{new Date(blk.endDate).toLocaleDateString()}</strong>
                      </div>
                      <div className="text-slate-400 italic">{blk.notes}</div>
                    </div>

                    <button
                      onClick={() => handleDeleteMaintenance(blk.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 font-bold hover:bg-rose-100"
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
              <div className="figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-4 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 font-['Plus_Jakarta_Sans']">Executive Performance Reports</h3>
                <p className="text-xs text-slate-500">Consolidated analytics and vehicle utilization metrics</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Total Revenue Generated</div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">${metrics?.kpis.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-emerald-600 font-semibold mt-1">✓ Verified Gross Inflow</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Fleet Utilization Rate</div>
                    <div className="text-2xl font-extrabold text-blue-600 mt-1">{metrics?.kpis.fleetUtilizationRate}%</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">High Peak Demand</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Total Bookings Completed</div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-1">{metrics?.kpis.totalBookings}</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">Customer Trips</div>
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
              <h4 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                {editingCar ? 'Edit Fleet Vehicle' : 'Add New Fleet Vehicle'}
              </h4>
              <button onClick={() => setAddCarModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Car Display Name *</label>
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
                <label className="font-medium text-slate-700 block mb-1">Photo Image URL</label>
                <input
                  type="url"
                  value={carForm.image}
                  onChange={(e) => setCarForm({ ...carForm, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Features (comma separated)</label>
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
