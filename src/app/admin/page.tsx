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
  CarFront
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
import { DashboardMetrics, Booking, AutomationLog, Vehicle } from '@/types';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);
  
  const [activeNav, setActiveNav] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [testWorkflowLoading, setTestWorkflowLoading] = useState(false);

  // Load dashboard data
  const loadDashboardData = async () => {
    setRefreshing(true);
    try {
      const [analyticsData, bookingsData, vehiclesData, logsData] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getBookings(),
        api.getVehicles(),
        api.getAutomationLogs(),
      ]);
      setMetrics(analyticsData);
      setBookings(bookingsData.length > 0 ? bookingsData : analyticsData.recentBookings || []);
      setVehicles(vehiclesData);
      setAutomationLogs(logsData);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update status handler
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await api.updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as any } : b))
      );
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus as any } : b))
      );
    }
  };

  // Trigger test automation workflow
  const handleTriggerTestWorkflow = async () => {
    setTestWorkflowLoading(true);
    try {
      const result = await api.testAutomationPipeline();
      if (result?.workflowLog) {
        setAutomationLogs((prev) => [result.workflowLog, ...prev]);
        alert(`⚡ AI Automation Workflow Executed!\nLead Score: ${result.aiAnalysis.lead_score} (${result.aiAnalysis.classification})\nAction: ${result.workflowLog.actionTaken}`);
      }
    } catch (err: any) {
      alert(`Workflow triggered: ${err.message || 'Success'}`);
    } finally {
      setTestWorkflowLoading(false);
    }
  };

  // Filter bookings for table
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'All' && b.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      return (
        b.bookingCode.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q) ||
        b.vehicleName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Active</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit">Confirmed</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 w-fit">Pending</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 w-fit">Completed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 w-fit">{status}</span>;
    }
  };

  const getLeadBadge = (leadScore?: any) => {
    if (!leadScore) return <span className="text-[10px] text-slate-400">Standard</span>;
    const score = typeof leadScore === 'number' ? leadScore : leadScore.score;
    const classification = leadScore.classification || (score >= 80 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold');

    if (classification === 'Hot') {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1 w-fit">🔥 Hot ({score})</span>;
    } else if (classification === 'Warm') {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-fit">⚡ Warm ({score})</span>;
    }
    return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 w-fit">❄️ Cold ({score})</span>;
  };

  return (
    <div className="min-h-screen bg-[#F4F5F8] flex">
      
      {/* 1. Left Sidebar Navigation (Exact Figma Style) */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-5 shrink-0">
        <div className="space-y-8">
          
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
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Main Menu</div>
            
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
              <span>Car Fleet ({vehicles.length})</span>
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
              onClick={() => setActiveNav('customers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeNav === 'customers'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Customers</span>
            </button>

            <button
              onClick={() => setActiveNav('analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                activeNav === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Analytics & Reports</span>
            </button>
          </div>

          {/* Other Menu */}
          <div className="space-y-1 pt-4 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Other</div>
            
            <button
              onClick={() => setActiveNav('settings')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveNav('support')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            >
              <Headphones className="w-4 h-4" />
              <span>Help & Support</span>
            </button>
          </div>

        </div>

        {/* Log Out CTA */}
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

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar (Figma Style) */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything here..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-400"
            />
          </div>

          {/* Right Header Icons & Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerTestWorkflow}
              disabled={testWorkflowLoading}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>{testWorkflowLoading ? 'Running...' : 'Test AI Automation'}</span>
            </button>

            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Admin Profile */}
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
                <div className="text-xs font-bold text-slate-900 leading-tight">Admin User</div>
                <div className="text-[10px] text-slate-500">Fleet Manager</div>
              </div>
            </div>

          </div>

        </header>

        {/* Dashboard Body Content */}
        <main className="p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Top 3 KPI Banners (Figma Exact Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Welcome Banner Card */}
            <div className="figma-card rounded-2xl p-6 border border-slate-200/80 bg-white relative overflow-hidden flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Fleet Overview</div>
                <h2 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Welcome back, Admin 👋
                </h2>
                <p className="text-xs text-slate-500">
                  You have <strong className="text-blue-600">{metrics?.fleetSummary?.rented || 8} active car rentals</strong> dispatched across airport hubs today.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setActiveNav('fleet')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
                >
                  <span>View Full Fleet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <CarFront className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Card 2: Orange Metric Card (Total Revenue) */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white relative overflow-hidden flex flex-col justify-between shadow-lg shadow-orange-500/20">
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

            {/* Card 3: Deep Navy Metric Card (Active Bookings) */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white relative overflow-hidden flex flex-col justify-between shadow-lg shadow-slate-900/20">
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

          {/* Middle Section (2 Columns: Car Availability Left, Recent Bookings Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (5 Cols): Car Availability */}
            <div className="lg:col-span-5 figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                  Car Availability
                </h3>
                <span className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer">View All</span>
              </div>

              <div className="space-y-3">
                {vehicles.slice(0, 5).map((car) => (
                  <div
                    key={car.id}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                  >
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
                      {car.available ? (
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Available</span>
                      ) : (
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-200">In Rent</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (7 Cols): Recent Bookings Table */}
            <div className="lg:col-span-7 figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                    Recent Bookings
                  </h3>
                  <p className="text-xs text-slate-500">Real-time reservation transactions and telemetry</p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  {['All', 'Active', 'Confirmed', 'Pending'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
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
                      <th className="pb-3 font-bold">Vehicle</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Amount</th>
                      <th className="pb-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredBookings.slice(0, 5).map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-mono font-bold text-slate-900">
                          {b.bookingCode}
                        </td>
                        <td className="py-3">
                          <div className="font-bold text-slate-900">{b.customerName}</div>
                          <div className="text-[10px] text-slate-400">{b.customerEmail}</div>
                        </td>
                        <td className="py-3">
                          <div className="font-semibold text-slate-900 line-clamp-1">{b.vehicleName}</div>
                          <div className="text-[10px] text-slate-500">{b.totalDays} Days</div>
                        </td>
                        <td className="py-3">
                          {getStatusBadge(b.status)}
                        </td>
                        <td className="py-3 text-right font-extrabold text-slate-900">
                          ${b.totalAmount}
                        </td>
                        <td className="py-3 text-right">
                          {b.status === 'Pending' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'Confirmed')}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-sm"
                            >
                              Confirm
                            </button>
                          )}
                          {b.status === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'Active')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-sm"
                            >
                              Start Trip
                            </button>
                          )}
                          {b.status === 'Active' && (
                            <button
                              onClick={() => handleStatusChange(b.id, 'Completed')}
                              className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold"
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

          </div>

          {/* Bottom Analytics Section (Earning Summary Area Chart Left, Rental Locations Map Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left (8 Cols): Earning Summary Area Chart (Figma Style) */}
            <div className="lg:col-span-8 figma-card rounded-2xl p-6 border border-slate-200/80 bg-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                    Earning Summary
                  </h3>
                  <p className="text-xs text-slate-500">Monthly revenue trends and performance metrics ($ USD)</p>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  2026 YTD
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics?.revenueTrends || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Gross Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#figmaOrangeArea)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right (4 Cols): Rental Locations Hubs Card */}
            <div className="lg:col-span-4 figma-card rounded-2xl p-6 border border-slate-200/80 bg-white flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                  Rental Hub Locations
                </h3>
                <p className="text-xs text-slate-500">Fleet dispatch share by airport and central city terminals</p>
              </div>

              {/* Geographic Hubs List */}
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-800">Hazrat Shahjalal DAC</span>
                  </div>
                  <span className="font-extrabold text-blue-600">58% Share</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-slate-800">Sylhet Osmani ZYL</span>
                  </div>
                  <span className="font-extrabold text-orange-500">24% Share</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-800">Chittagong Patenga CGP</span>
                  </div>
                  <span className="font-extrabold text-emerald-600">18% Share</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/"
                  className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore live map hubs</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

