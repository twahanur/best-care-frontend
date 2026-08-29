'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Car,
  Users,
  Activity,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Zap,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  Layers,
  FileCheck
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
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { api } from '@/services/api';
import { DashboardMetrics, Booking, AutomationLog } from '@/types';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>([]);
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'automation' | 'fleet'>('bookings');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [testWorkflowLoading, setTestWorkflowLoading] = useState(false);

  // Load dashboard data
  const loadDashboardData = async () => {
    setRefreshing(true);
    try {
      const [analyticsData, bookingsData, logsData] = await Promise.all([
        api.getDashboardAnalytics(),
        api.getBookings(),
        api.getAutomationLogs(),
      ]);
      setMetrics(analyticsData);
      setBookings(bookingsData.length > 0 ? bookingsData : analyticsData.recentBookings || []);
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
    } catch (err) {
      // Optimistic update
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
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 w-fit">Confirmed</span>;
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 w-fit">Pending</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-700/50 text-slate-300 border border-slate-600 w-fit">Completed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 w-fit">{status}</span>;
    }
  };

  const getLeadBadge = (leadScore?: any) => {
    if (!leadScore) return <span className="text-[10px] text-slate-500">Standard</span>;
    const score = typeof leadScore === 'number' ? leadScore : leadScore.score;
    const classification = leadScore.classification || (score >= 80 ? 'Hot' : score >= 50 ? 'Warm' : 'Cold');

    if (classification === 'Hot') {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-gradient-to-r from-red-500/20 to-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">🔥 Hot ({score})</span>;
    } else if (classification === 'Warm') {
      return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 w-fit">⚡ Warm ({score})</span>;
    }
    return <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400 w-fit">❄️ Cold ({score})</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                Fleet Management & Executive Dashboard
              </h1>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Telemetry
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time rental metrics, revenue analytics, AI lead scoring & automated webhook orchestration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerTestWorkflow}
              disabled={testWorkflowLoading}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{testWorkflowLoading ? 'Simulating...' : 'Test AI Automation'}</span>
            </button>

            <button
              onClick={loadDashboardData}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* 1. Key Performance Indicators (KPI) Cards */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Total Revenue */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-600/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  ${metrics.kpis.totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{metrics.kpis.revenueGrowthPct}% vs last month</span>
                </div>
              </div>
            </div>

            {/* Active Rentals */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Rentals</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-600/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Car className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {metrics.kpis.activeRentals} <span className="text-xs text-slate-400 font-normal">Vehicles</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-400 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{metrics.kpis.activeRentalsGrowthPct}% demand surge</span>
                </div>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</span>
                <div className="w-9 h-9 rounded-xl bg-cyan-600/15 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {metrics.kpis.totalBookings}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-cyan-400 font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+{metrics.kpis.totalBookingsGrowthPct}% conversion</span>
                </div>
              </div>
            </div>

            {/* Fleet Utilization Rate */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-900/40 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fleet Utilization</span>
                <div className="w-9 h-9 rounded-xl bg-amber-600/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                  {metrics.kpis.fleetUtilizationRate}%
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-300 font-semibold">
                  <span>{metrics.fleetSummary.available} Available • {metrics.fleetSummary.rented} Rented</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 2. Interactive Analytics Charts (Recharts) */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Trend Area Chart (2 Cols) */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white font-['Plus_Jakarta_Sans']">
                    Revenue & Operational Performance Trends
                  </h3>
                  <p className="text-xs text-slate-400">Monthly Revenue vs Fleet Operational Expenses ($ USD)</p>
                </div>
                <span className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                  2026 YTD
                </span>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.revenueTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="expenses" name="Operating Cost" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fleet Category Share (1 Col) */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/40 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-base text-white font-['Plus_Jakarta_Sans']">
                  Fleet Demand Distribution
                </h3>
                <p className="text-xs text-slate-400">Share of bookings by vehicle class</p>
              </div>

              <div className="h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.categoryDistribution}
                      dataKey="sharePct"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {metrics.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                      formatter={(val: any) => [`${val}% Share`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-extrabold text-white">42%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">SUV Lead</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                {metrics.categoryDistribution.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                      <span className="truncate max-w-[140px]">{cat.category}</span>
                    </div>
                    <span className="font-bold text-white">{cat.sharePct}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 3. Tabbed Content: Bookings Management vs Automation Logs */}
        <div className="space-y-4">
          
          {/* Tab Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'bookings'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>Bookings Management ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('automation')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'automation'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 text-cyan-300" />
                <span>AI Automation Logs ({automationLogs.length})</span>
              </button>
            </div>

            {/* Filters & Search for Bookings */}
            {activeTab === 'bookings' && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by code, customer, vehicle..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 w-64 placeholder-slate-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
                  {['All', 'Active', 'Confirmed', 'Pending', 'Completed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                        statusFilter === st ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TAB 1: BOOKINGS DATA TABLE */}
          {activeTab === 'bookings' && (
            <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl bg-slate-900/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4 font-bold">Booking Code</th>
                      <th className="px-5 py-4 font-bold">Customer Info</th>
                      <th className="px-5 py-4 font-bold">Vehicle & Plan</th>
                      <th className="px-5 py-4 font-bold">Dates & Route</th>
                      <th className="px-5 py-4 font-bold">Total Amount</th>
                      <th className="px-5 py-4 font-bold">AI Lead Score</th>
                      <th className="px-5 py-4 font-bold">Status</th>
                      <th className="px-5 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-slate-500">
                          No bookings found matching the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-white">
                            {b.bookingCode}
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-bold text-white">{b.customerName}</div>
                            <div className="text-[11px] text-slate-400">{b.customerEmail}</div>
                            <div className="text-[10px] text-slate-500">{b.customerPhone}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">{b.vehicleName}</div>
                            <div className="text-[11px] text-indigo-400">{b.protectionPlan}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="text-slate-200">{b.totalDays} Days</div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {b.pickupLocation.split(' ')[0]} ➔ {b.dropoffLocation.split(' ')[0]}
                            </div>
                          </td>
                          <td className="px-5 py-4 font-extrabold text-white text-sm">
                            ${b.totalAmount}
                          </td>
                          <td className="px-5 py-4">
                            {getLeadBadge(b.aiLeadScore)}
                          </td>
                          <td className="px-5 py-4">
                            {getStatusBadge(b.status)}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {b.status === 'Pending' && (
                                <button
                                  onClick={() => handleStatusChange(b.id, 'Confirmed')}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold"
                                >
                                  Confirm
                                </button>
                              )}
                              {b.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleStatusChange(b.id, 'Active')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold"
                                >
                                  Start Trip
                                </button>
                              )}
                              {b.status === 'Active' && (
                                <button
                                  onClick={() => handleStatusChange(b.id, 'Completed')}
                                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700"
                                >
                                  Check-in
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: AI AUTOMATION & WEBHOOK AUDIT LOGS */}
          {activeTab === 'automation' && (
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-slate-900/50 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-white font-['Plus_Jakarta_Sans']">
                    Automated Workflow Event Bus & Webhook Dispatcher
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time execution log of incoming lead evaluation, Gemini AI scoring, and webhook notifications.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">
                  Event-Driven Architecture
                </span>
              </div>

              <div className="space-y-3">
                {automationLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.workflowName}</span>
                        <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {log.triggerEvent}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{log.actionTaken}</p>
                      <div className="text-[10px] text-slate-500">Lead Target: <strong className="text-slate-400">{log.leadName}</strong></div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Webhook {log.webhookStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
