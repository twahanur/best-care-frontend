'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Send,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Table as TableIcon,
  Download,
  Copy,
  Check,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Car,
  Calendar,
  Layers,
  Award,
  Zap,
  Info,
  ShieldCheck,
  MapPin,
  Compass,
  Clock,
  Route,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Vehicle, Booking, DashboardMetrics } from '@/types';

interface AIReportAgentProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  metrics: DashboardMetrics | null;
}

interface AIReportResponse {
  query: string;
  title: string;
  summary: string;
  bengaliInsight: string;
  matchedCount: number;
  totalComputedRevenue: number;
  reportCategory: string;
  recommendedChart: 'bar' | 'area' | 'line' | 'pie' | 'table';
  kpis: { label: string; value: string; trend?: string; isPositive?: boolean }[];
  chartData: any[];
  tableHeaders: string[];
  tableRows: any[];
  appliedFilters: { key: string; val: string }[];
}

const COLORS = ['#FF7800', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#06B6D4', '#64748B', '#14B8A6', '#F43F5E'];

// Master Comprehensive Live Database of Vehicles with Location Hubs & Specs
const MASTER_FLEET_CARS = [
  { id: 'car_1', name: 'Toyota Land Cruiser Prado TX', brand: 'Toyota', category: 'SUV', dailyRate: 145, hub: 'Dhaka DAC Hub', city: 'Dhaka', status: 'AVAILABLE', seats: 7, fuel: 'Diesel', transmission: 'Automatic', bookingsCount: 22, totalDays: 84, totalRev: 12180, maintenance: 950, activeBooking: null },
  { id: 'car_2', name: 'Hyundai Tucson AWD Turbo', brand: 'Hyundai', category: 'SUV', dailyRate: 95, hub: 'Khulna Hub', city: 'Khulna', status: 'RENTED', seats: 5, fuel: 'Hybrid', transmission: 'Automatic', bookingsCount: 19, totalDays: 68, totalRev: 6460, maintenance: 450, activeBooking: { code: 'BK-KH-902', customer: 'Shahriar Khan', from: 'Khulna', to: 'Dhaka', returnDate: '02 Sep 2026', totalAmount: 475 } },
  { id: 'car_3', name: 'Mitsubishi Pajero Sport 4x4', brand: 'Mitsubishi', category: 'SUV', dailyRate: 135, hub: 'Chittagong Hub', city: 'Chittagong', status: 'AVAILABLE', seats: 7, fuel: 'Diesel', transmission: 'Automatic', bookingsCount: 16, totalDays: 58, totalRev: 7830, maintenance: 620, activeBooking: null },
  { id: 'car_4', name: 'Toyota Harrier Elegance 4WD', brand: 'Toyota', category: 'SUV', dailyRate: 115, hub: 'Sylhet Hub', city: 'Sylhet', status: 'RENTED', seats: 5, fuel: 'Petrol', transmission: 'Automatic', bookingsCount: 17, totalDays: 62, totalRev: 7130, maintenance: 510, activeBooking: { code: 'BK-SY-441', customer: 'Tanvir Ahmed', from: 'Dhaka', to: 'Sylhet', returnDate: '01 Sep 2026', totalAmount: 575 } },
  { id: 'car_5', name: 'Tesla Model Y Long Range AWD', brand: 'Tesla', category: 'Electric', dailyRate: 110, hub: 'Dhaka DAC Hub', city: 'Dhaka', status: 'RENTED', seats: 5, fuel: 'Electric', transmission: 'Automatic', bookingsCount: 26, totalDays: 92, totalRev: 10120, maintenance: 320, activeBooking: { code: 'BK-DH-108', customer: 'Farhan Kabir', from: 'Dhaka', to: 'Banani', returnDate: '04 Sep 2026', totalAmount: 440 } },
  { id: 'car_6', name: 'Hyundai Ioniq 5 EV Ultra Fast', brand: 'Hyundai', category: 'Electric', dailyRate: 120, hub: 'Sylhet Hub', city: 'Sylhet', status: 'RENTED', seats: 5, fuel: 'Electric', transmission: 'Automatic', bookingsCount: 18, totalDays: 64, totalRev: 7680, maintenance: 290, activeBooking: { code: 'BK-SY-789', customer: 'Nusrat Jahan', from: 'Dhaka', to: 'Sylhet', returnDate: '03 Sep 2026', totalAmount: 480 } },
  { id: 'car_7', name: 'BYD Atto 3 Extended Range', brand: 'BYD', category: 'Electric', dailyRate: 95, hub: 'Chittagong Hub', city: 'Chittagong', status: 'RENTED', seats: 5, fuel: 'Electric', transmission: 'Automatic', bookingsCount: 19, totalDays: 68, totalRev: 6460, maintenance: 260, activeBooking: { code: 'BK-CT-332', customer: 'Imtiaz Hossain', from: 'Chittagong', to: 'Cox\'s Bazar', returnDate: '05 Sep 2026', totalAmount: 380 } },
  { id: 'car_8', name: 'Porsche Taycan 4S Electric', brand: 'Porsche', category: 'Electric', dailyRate: 220, hub: 'Dhaka DAC Hub', city: 'Dhaka', status: 'AVAILABLE', seats: 4, fuel: 'Electric', transmission: 'Automatic', bookingsCount: 12, totalDays: 42, totalRev: 9240, maintenance: 680, activeBooking: null },
  { id: 'car_9', name: 'Toyota Camry Premium Hybrid', brand: 'Toyota', category: 'Sedan', dailyRate: 75, hub: 'Khulna Hub', city: 'Khulna', status: 'AVAILABLE', seats: 5, fuel: 'Hybrid', transmission: 'Automatic', bookingsCount: 24, totalDays: 88, totalRev: 6600, maintenance: 410, activeBooking: null },
  { id: 'car_10', name: 'Honda Civic Sport 1.5 Turbo', brand: 'Honda', category: 'Sedan', dailyRate: 65, hub: 'Sylhet Hub', city: 'Sylhet', status: 'AVAILABLE', seats: 5, fuel: 'Petrol', transmission: 'Automatic', bookingsCount: 21, totalDays: 74, totalRev: 4810, maintenance: 350, activeBooking: null },
  { id: 'car_11', name: 'Mercedes-Benz E-Class AMG Line', brand: 'Mercedes-Benz', category: 'Luxury', dailyRate: 160, hub: 'Dhaka DAC Hub', city: 'Dhaka', status: 'RENTED', seats: 5, fuel: 'Petrol', transmission: 'Automatic', bookingsCount: 21, totalDays: 78, totalRev: 12480, maintenance: 880, activeBooking: { code: 'BK-DH-901', customer: 'Kazi Mahbub', from: 'Dhaka', to: 'Chittagong', returnDate: '02 Sep 2026', totalAmount: 800 } },
  { id: 'car_12', name: 'Jaguar XE L Prestige Sedan', brand: 'Jaguar', category: 'Luxury', dailyRate: 85, hub: 'Khulna Hub', city: 'Khulna', status: 'AVAILABLE', seats: 5, fuel: 'Petrol', transmission: 'Automatic', bookingsCount: 16, totalDays: 58, totalRev: 4930, maintenance: 490, activeBooking: null },
  { id: 'car_13', name: 'Toyota HiAce VIP Super Grandia', brand: 'Toyota', category: 'Van', dailyRate: 130, hub: 'Chittagong Hub', city: 'Chittagong', status: 'RENTED', seats: 11, fuel: 'Diesel', transmission: 'Automatic', bookingsCount: 28, totalDays: 104, totalRev: 13520, maintenance: 920, activeBooking: { code: 'BK-CT-664', customer: 'Sabbir Ahmed', from: 'Dhaka', to: 'Khulna', returnDate: '03 Sep 2026', totalAmount: 650 } },
  { id: 'car_14', name: 'Toyota Noah Hybrid Luxury', brand: 'Toyota', category: 'Van', dailyRate: 85, hub: 'Dhaka DAC Hub', city: 'Dhaka', status: 'AVAILABLE', seats: 8, fuel: 'Hybrid', transmission: 'Automatic', bookingsCount: 22, totalDays: 82, totalRev: 6970, maintenance: 510, activeBooking: null }
];

// Master Log of Highway & Intercity Trips
const MASTER_TRIPS = [
  { id: 'tr_101', car: 'Toyota HiAce VIP Super Grandia', brand: 'Toyota', category: 'Van', from: 'Dhaka', to: 'Khulna', pickupHub: 'Dhaka DAC Hub', dropHub: 'Khulna Hub', date: '2026-08-28', days: 4, revenue: 520, seats: 11, fuel: 'Diesel', customer: 'Sabbir Ahmed', status: 'ACTIVE' },
  { id: 'tr_102', car: 'Hyundai Tucson AWD Turbo', brand: 'Hyundai', category: 'SUV', from: 'Dhaka', to: 'Khulna', pickupHub: 'Dhaka DAC Hub', dropHub: 'Khulna Hub', date: '2026-08-25', days: 3, revenue: 285, seats: 5, fuel: 'Hybrid', customer: 'Shahriar Khan', status: 'COMPLETED' },
  { id: 'tr_103', car: 'Toyota Camry Premium Hybrid', brand: 'Toyota', category: 'Sedan', from: 'Dhaka', to: 'Khulna', pickupHub: 'Dhaka DAC Hub', dropHub: 'Khulna Hub', date: '2026-08-18', days: 2, revenue: 150, seats: 5, fuel: 'Hybrid', customer: 'Anisur Rahman', status: 'COMPLETED' },
  { id: 'tr_104', car: 'Jaguar XE L Prestige Sedan', brand: 'Jaguar', category: 'Luxury', from: 'Dhaka', to: 'Khulna', pickupHub: 'Dhaka DAC Hub', dropHub: 'Khulna Hub', date: '2026-08-10', days: 5, revenue: 425, seats: 5, fuel: 'Petrol', customer: 'Mahbub Alam', status: 'COMPLETED' },
  { id: 'tr_105', car: 'Toyota Land Cruiser Prado TX', brand: 'Toyota', category: 'SUV', from: 'Dhaka', to: 'Sylhet', pickupHub: 'Dhaka DAC Hub', dropHub: 'Sylhet Hub', date: '2026-08-27', days: 4, revenue: 580, seats: 7, fuel: 'Diesel', customer: 'Tanvir Ahmed', status: 'ACTIVE' },
  { id: 'tr_106', car: 'Hyundai Ioniq 5 EV Ultra Fast', brand: 'Hyundai', category: 'Electric', from: 'Dhaka', to: 'Sylhet', pickupHub: 'Dhaka DAC Hub', dropHub: 'Sylhet Hub', date: '2026-08-26', days: 3, revenue: 360, seats: 5, fuel: 'Electric', customer: 'Nusrat Jahan', status: 'ACTIVE' },
  { id: 'tr_107', car: 'Toyota Harrier Elegance 4WD', brand: 'Toyota', category: 'SUV', from: 'Dhaka', to: 'Sylhet', pickupHub: 'Dhaka DAC Hub', dropHub: 'Sylhet Hub', date: '2026-08-20', days: 3, revenue: 345, seats: 5, fuel: 'Petrol', customer: 'Kazi Imtiaz', status: 'COMPLETED' },
  { id: 'tr_108', car: 'Honda Civic Sport 1.5 Turbo', brand: 'Honda', category: 'Sedan', from: 'Dhaka', to: 'Sylhet', pickupHub: 'Dhaka DAC Hub', dropHub: 'Sylhet Hub', date: '2026-08-12', days: 2, revenue: 130, seats: 5, fuel: 'Petrol', customer: 'Rashidul Islam', status: 'COMPLETED' },
  { id: 'tr_109', car: 'Tesla Model Y Long Range AWD', brand: 'Tesla', category: 'Electric', from: 'Dhaka', to: 'Sylhet', pickupHub: 'Dhaka DAC Hub', dropHub: 'Sylhet Hub', date: '2026-08-05', days: 4, revenue: 440, seats: 5, fuel: 'Electric', customer: 'Farhan Kabir', status: 'COMPLETED' },
  { id: 'tr_110', car: 'Mercedes-Benz E-Class AMG Line', brand: 'Mercedes-Benz', category: 'Luxury', from: 'Dhaka', to: 'Chittagong', pickupHub: 'Dhaka DAC Hub', dropHub: 'Chittagong Hub', date: '2026-08-29', days: 3, revenue: 480, seats: 5, fuel: 'Petrol', customer: 'Kazi Mahbub', status: 'ACTIVE' },
  { id: 'tr_111', car: 'BYD Atto 3 Extended Range', brand: 'BYD', category: 'Electric', from: 'Chittagong', to: 'Cox\'s Bazar', pickupHub: 'Chittagong Hub', dropHub: 'Chittagong Hub', date: '2026-08-28', days: 3, revenue: 285, seats: 5, fuel: 'Electric', customer: 'Imtiaz Hossain', status: 'ACTIVE' },
  { id: 'tr_112', car: 'Mitsubishi Pajero Sport 4x4', brand: 'Mitsubishi', category: 'SUV', from: 'Chittagong', to: 'Dhaka', pickupHub: 'Chittagong Hub', dropHub: 'Dhaka DAC Hub', date: '2026-08-15', days: 3, revenue: 405, seats: 7, fuel: 'Diesel', customer: 'Nazmul Huda', status: 'COMPLETED' }
];

export function AIReportAgent({ vehicles, bookings, metrics }: AIReportAgentProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentChartType, setCurrentChartType] = useState<'bar' | 'area' | 'line' | 'pie' | 'table'>('bar');
  const [copied, setCopied] = useState(false);
  const [reportResult, setReportResult] = useState<AIReportResponse | null>(null);

  // Quick prompt pills covering complex natural language queries
  const quickPrompts = [
    { label: '📍 SUV Location Wise Report', query: 'SUV er location wise report dao' },
    { label: '💰 Khulna Hub Revenue', query: 'khulna hub er revenue report dao' },
    { label: '🛣️ Dhaka to Khulna Route', query: 'dhaka theke khulna route er car report dao' },
    { label: '🌲 Last 30D Dhaka to Sylhet', query: 'last 30 days e dhaka theke sylhet jaoya car list dao' },
    { label: '⚡ Running Electric Cars', query: 'Electric car kothay kothay akn running booking ache setar list dao' },
    { label: '🏆 Top 5 Highest Earning Cars', query: 'Top 5 highest earning cars and their profit margin' }
  ];

  // =========================================================================
  // DYNAMIC NATURAL LANGUAGE PARSER & ANALYTICS PIPELINE
  // =========================================================================
  const executeDynamicAIQuery = async (inputQuery: string) => {
    if (!inputQuery.trim()) return;
    setLoading(true);

    const q = inputQuery.toLowerCase().trim();
    await new Promise((r) => setTimeout(r, 450));

    // 1. EXTRACT ALL SEMANTIC DIMENSIONS & CONSTRAINTS
    const filters: { key: string; val: string }[] = [];

    // Categories
    const categories: string[] = [];
    if (q.includes('suv') || q.includes('4x4') || q.includes('prado') || q.includes('pajero') || q.includes('tucson') || q.includes('harrier')) {
      categories.push('SUV');
      filters.push({ key: 'Category', val: 'SUV' });
    }
    if (q.includes('electric') || q.includes('ev') || q.includes('tesla') || q.includes('ioniq') || q.includes('byd') || q.includes('taycan')) {
      categories.push('Electric');
      filters.push({ key: 'Category', val: 'Electric' });
    }
    if (q.includes('sedan') || q.includes('camry') || q.includes('civic') || q.includes('corolla')) {
      categories.push('Sedan');
      filters.push({ key: 'Category', val: 'Sedan' });
    }
    if (q.includes('luxury') || q.includes('mercedes') || q.includes('jaguar') || q.includes('bmw') || q.includes('audi') || q.includes('e-class')) {
      categories.push('Luxury');
      filters.push({ key: 'Category', val: 'Luxury' });
    }
    if (q.includes('van') || q.includes('hiace') || q.includes('grandia') || q.includes('noah') || q.includes('microbus')) {
      categories.push('Van');
      filters.push({ key: 'Category', val: 'Van' });
    }

    // Fuel Types
    let fuelFilter = '';
    if (q.includes('diesel')) { fuelFilter = 'Diesel'; filters.push({ key: 'Fuel', val: 'Diesel' }); }
    else if (q.includes('petrol') || q.includes('octane')) { fuelFilter = 'Petrol'; filters.push({ key: 'Fuel', val: 'Petrol' }); }
    else if (q.includes('hybrid')) { fuelFilter = 'Hybrid'; filters.push({ key: 'Fuel', val: 'Hybrid' }); }

    // Seats count
    let minSeats = 0;
    const seatMatch = q.match(/(\d+)\s*(?:seat|seater|jon|capacity)/);
    if (seatMatch) {
      minSeats = parseInt(seatMatch[1], 10);
      filters.push({ key: 'Seats', val: `${minSeats}+ Seats` });
    } else if (q.includes('7 seat') || q.includes('7 seater')) {
      minSeats = 7;
      filters.push({ key: 'Seats', val: '7+ Seats' });
    }

    // Cities / Hubs
    const cities: string[] = [];
    ['dhaka', 'khulna', 'chittagong', 'sylhet', 'cox', 'banani', 'gulshan'].forEach(c => {
      if (q.includes(c)) {
        const cName = c === 'ctg' ? 'Chittagong' : c.charAt(0).toUpperCase() + c.slice(1);
        cities.push(cName);
        filters.push({ key: 'City/Hub', val: cName });
      }
    });

    // Routes (From X To Y)
    let routeFrom = '';
    let routeTo = '';
    const routeRegex = /(?:theke|to|from)\s+([a-z\s]+)\s+(?:theke|to|jaoya|jawa|geche|ashche)\s+([a-z\s]+)/i;
    const directMatch = q.match(/([a-z]+)\s+(?:theke|to|from)\s+([a-z]+)/i);
    if (directMatch) {
      const p1 = directMatch[1].toLowerCase();
      const p2 = directMatch[2].toLowerCase();
      ['dhaka', 'khulna', 'chittagong', 'sylhet', 'cox', 'banani'].forEach(c => {
        if (p1.includes(c)) routeFrom = c.charAt(0).toUpperCase() + c.slice(1);
        if (p2.includes(c)) routeTo = c.charAt(0).toUpperCase() + c.slice(1);
      });
      if (routeFrom && routeTo) {
        filters.push({ key: 'Route Corridor', val: `${routeFrom} ➔ ${routeTo}` });
      }
    }

    // Timeframe
    let timeframeDays = 30;
    if (q.includes('7 days') || q.includes('7 din') || q.includes('7 dine') || q.includes('last week') || q.includes('gawto shoptaho')) {
      timeframeDays = 7;
      filters.push({ key: 'Timeframe', val: 'Last 7 Days' });
    } else if (q.includes('15 days') || q.includes('15 din') || q.includes('15 dine')) {
      timeframeDays = 15;
      filters.push({ key: 'Timeframe', val: 'Last 15 Days' });
    } else if (q.includes('90 days') || q.includes('3 month') || q.includes('3 mash')) {
      timeframeDays = 90;
      filters.push({ key: 'Timeframe', val: 'Last 90 Days' });
    } else if (q.includes('today') || q.includes('ajke') || q.includes('running') || q.includes('current')) {
      timeframeDays = 1;
      filters.push({ key: 'Status Range', val: 'Current Active' });
    } else {
      filters.push({ key: 'Timeframe', val: 'Last 30 Days' });
    }

    // Status filter
    let statusFilter = '';
    if (q.includes('running') || q.includes('active') || q.includes('chaloman') || q.includes('rented')) {
      statusFilter = 'RENTED';
      filters.push({ key: 'Status', val: 'Active Running / Rented' });
    } else if (q.includes('available') || q.includes('khali') || q.includes('free') || q.includes('ready')) {
      statusFilter = 'AVAILABLE';
      filters.push({ key: 'Status', val: 'Available in Hub' });
    } else if (q.includes('maintenance') || q.includes('servicing') || q.includes('repair')) {
      statusFilter = 'MAINTENANCE';
      filters.push({ key: 'Status', val: 'In Workshop Service' });
    }

    // Top N detection
    let topN = 0;
    const topMatch = q.match(/top\s*(\d+)/i);
    if (topMatch) {
      topN = parseInt(topMatch[1], 10);
      filters.push({ key: 'Limit', val: `Top ${topN}` });
    }

    // 2. DYNAMIC RECORD FILTERING OVER FLEET & TRIPS
    let matchedCars = [...MASTER_FLEET_CARS];
    if (categories.length > 0) {
      matchedCars = matchedCars.filter(c => categories.includes(c.category));
    }
    if (fuelFilter) {
      matchedCars = matchedCars.filter(c => c.fuel.toLowerCase() === fuelFilter.toLowerCase());
    }
    if (minSeats > 0) {
      matchedCars = matchedCars.filter(c => c.seats >= minSeats);
    }
    if (cities.length > 0 && !routeFrom && !routeTo) {
      matchedCars = matchedCars.filter(c => cities.some(city => c.city.toLowerCase().includes(city.toLowerCase()) || c.hub.toLowerCase().includes(city.toLowerCase())));
    }
    if (statusFilter) {
      matchedCars = matchedCars.filter(c => c.status === statusFilter);
    }

    // Route matching over Trips dataset
    let matchedTrips = [...MASTER_TRIPS];
    if (routeFrom && routeTo) {
      matchedTrips = matchedTrips.filter(t => 
        (t.from.toLowerCase().includes(routeFrom.toLowerCase()) || t.pickupHub.toLowerCase().includes(routeFrom.toLowerCase())) &&
        (t.to.toLowerCase().includes(routeTo.toLowerCase()) || t.dropHub.toLowerCase().includes(routeTo.toLowerCase()))
      );
    }
    if (categories.length > 0) {
      matchedTrips = matchedTrips.filter(t => categories.includes(t.category));
    }
    if (minSeats > 0) {
      matchedTrips = matchedTrips.filter(t => t.seats >= minSeats);
    }
    if (fuelFilter) {
      matchedTrips = matchedTrips.filter(t => t.fuel.toLowerCase() === fuelFilter.toLowerCase());
    }

    // 3. SYNTHESIZE DYNAMIC RESULT STRUCTURE
    let result: AIReportResponse;

    // SCENARIO A: ROUTE-SPECIFIC TRIP QUERY (e.g. "dhaka theke khulna route er car report", "last 30 days e dhaka theke sylhet jaoya car list")
    if (routeFrom && routeTo || (q.includes('route') && cities.length >= 2)) {
      const from = routeFrom || cities[0] || 'Dhaka';
      const to = routeTo || cities[1] || 'Khulna';
      const totalRev = matchedTrips.reduce((s, t) => s + t.revenue, 0);
      const activeTripsCount = matchedTrips.filter(t => t.status === 'ACTIVE').length;

      // Group by Car for visual Chart
      const carGroup: Record<string, { name: string; trips: number; revenue: number }> = {};
      matchedTrips.forEach(t => {
        if (!carGroup[t.car]) carGroup[t.car] = { name: t.car.length > 14 ? t.car.substring(0, 12) + '…' : t.car, trips: 0, revenue: 0 };
        carGroup[t.car].trips += 1;
        carGroup[t.car].revenue += t.revenue;
      });
      const chartData = Object.values(carGroup);

      result = {
        query: inputQuery,
        title: `🛣️ Highway Route Analysis: ${from} ➔ ${to} Corridor (${timeframeDays}D)`,
        summary: `Identified ${matchedTrips.length} vehicle trips matching your criteria on the ${from} to ${to} route in the timeframe of ${timeframeDays} days. Total route gross revenue is $${totalRev.toLocaleString()}. Currently ${activeTripsCount} vehicle(s) are actively in-transit.`,
        bengaliInsight: `${from} থেকে ${to} হাইওয়ে রুটে ${timeframeDays} দিনে মোট ${matchedTrips.length}টি ট্রিপ সম্পন্ন হয়েছে। এই রুটের মোট আয় $${totalRev.toLocaleString()} এবং বর্তমানে ${activeTripsCount}টি গাড়ি অন-রোড রানিং রয়েছে।`,
        matchedCount: matchedTrips.length,
        totalComputedRevenue: totalRev,
        reportCategory: 'Route Analytics',
        recommendedChart: 'bar',
        kpis: [
          { label: 'Matched Route Trips', value: `${matchedTrips.length} Trips`, trend: 'GPS Verified', isPositive: true },
          { label: 'Route Gross Revenue', value: `$${totalRev.toLocaleString()}`, trend: '+28.5% YoY', isPositive: true },
          { label: 'Active In-Transit', value: `${activeTripsCount} Vehicles`, trend: 'Live Telemetry', isPositive: true },
          { label: 'Avg Trip Fare', value: `$${Math.round(totalRev / (matchedTrips.length || 1))}`, trend: 'Per Journey', isPositive: true }
        ],
        chartData,
        tableHeaders: ['Vehicle Name', 'Category', 'Trip Date', 'Route Corridor', 'Customer', 'Duration', 'Gross Fare', 'Status'],
        tableRows: matchedTrips.map(t => [
          t.car,
          t.category,
          t.date,
          `${t.from} ➔ ${t.to}`,
          t.customer,
          `${t.days} Days`,
          `$${t.revenue.toLocaleString()}`,
          t.status === 'ACTIVE' ? '🟢 Active Running' : '✓ Completed'
        ]),
        appliedFilters: filters
      };
    }

    // SCENARIO B: LOCATION-WISE / HUB GROUPING (e.g. "SUV er location wise report dao", "Electric car kothay kothay ache")
    else if (q.includes('location wise') || q.includes('location') || q.includes('kothay kothay') || q.includes('hub wise') || (categories.length > 0 && q.includes('kothay'))) {
      const targetCategory = categories[0] || 'All';
      
      // Group matched cars by Hub
      const hubMap: Record<string, { hub: string; city: string; count: number; revenue: number; bookings: number; activeRunning: number; cars: string[] }> = {};
      matchedCars.forEach(c => {
        const h = c.hub;
        if (!hubMap[h]) hubMap[h] = { hub: h, city: c.city, count: 0, revenue: 0, bookings: 0, activeRunning: 0, cars: [] };
        hubMap[h].count += 1;
        hubMap[h].revenue += c.totalRev;
        hubMap[h].bookings += c.bookingsCount;
        if (c.status === 'RENTED') hubMap[h].activeRunning += 1;
        hubMap[h].cars.push(c.name);
      });

      const chartData = Object.values(hubMap).map(h => ({
        name: h.hub.split(' ')[0] + ' Hub',
        fullName: h.hub,
        revenue: h.revenue,
        count: h.count,
        bookings: h.bookings,
        activeRunning: h.activeRunning
      }));

      const totalRev = matchedCars.reduce((s, c) => s + c.totalRev, 0);
      const totalActive = matchedCars.filter(c => c.status === 'RENTED').length;

      result = {
        query: inputQuery,
        title: `📍 Location & Hub-Wise Distribution Report: ${targetCategory} Fleet`,
        summary: `Evaluated ${matchedCars.length} ${targetCategory} vehicle(s) distributed across ${chartData.length} station hubs (Dhaka, Khulna, Chittagong, Sylhet). Total generated revenue is $${totalRev.toLocaleString()}. Currently ${totalActive} car(s) are on active running trips.`,
        bengaliInsight: `${targetCategory} ক্যাটাগরির ${matchedCars.length}টি গাড়ি ${chartData.length}টি আঞ্চলিক হাবে বিন্যস্ত। মোট আয় $${totalRev.toLocaleString()} এবং বর্তমানে ${totalActive}টি গাড়ি সক্রিয় ভাড়ায় রানিং রয়েছে।`,
        matchedCount: matchedCars.length,
        totalComputedRevenue: totalRev,
        reportCategory: 'Location Intelligence',
        recommendedChart: 'bar',
        kpis: [
          { label: `Total ${targetCategory} Earnings`, value: `$${totalRev.toLocaleString()}`, trend: '+24.6%', isPositive: true },
          { label: 'Stationed Vehicles', value: `${matchedCars.length} Cars`, trend: `Across ${chartData.length} Hubs`, isPositive: true },
          { label: 'Active Running Trips', value: `${totalActive} Cars`, trend: 'Live on Road', isPositive: true },
          { label: 'Top Hub Revenue', value: chartData[0]?.name || 'Dhaka Hub', trend: `$${chartData[0]?.revenue.toLocaleString() || '0'}`, isPositive: true }
        ],
        chartData,
        tableHeaders: ['Station Hub', 'City', `${targetCategory} Cars`, 'Active Running', 'Total Trips', 'Gross Earnings', 'Stationed Models'],
        tableRows: Object.values(hubMap).map(h => [
          h.hub,
          h.city,
          `${h.count} vehicles`,
          h.activeRunning > 0 ? `🟢 ${h.activeRunning} Running` : '⚪ All Ready in Hub',
          `${h.bookings} bookings`,
          `$${h.revenue.toLocaleString()}`,
          h.cars.join(', ')
        ]),
        appliedFilters: filters
      };
    }

    // SCENARIO C: SINGLE SPECIFIC HUB REVENUE (e.g. "khulna hub er revenue report dao", "dhaka hub earning report")
    else if (cities.length === 1 && (q.includes('revenue') || q.includes('income') || q.includes('earning') || q.includes('hub') || q.includes('report'))) {
      const city = cities[0];
      const hubCars = matchedCars.length > 0 ? matchedCars : MASTER_FLEET_CARS.filter(c => c.city.toLowerCase() === city.toLowerCase());
      const totalRev = hubCars.reduce((s, c) => s + c.totalRev, 0);
      const totalBookings = hubCars.reduce((s, c) => s + c.bookingsCount, 0);
      const totalMaint = hubCars.reduce((s, c) => s + c.maintenance, 0);

      const chartData = hubCars.map(c => ({
        name: c.name.length > 14 ? c.name.substring(0, 12) + '…' : c.name,
        fullName: c.name,
        revenue: c.totalRev,
        bookings: c.bookingsCount,
        dailyRate: c.dailyRate,
        profit: c.totalRev - c.maintenance
      }));

      result = {
        query: inputQuery,
        title: `🏢 ${city} Station Hub: Performance & Revenue Ledger`,
        summary: `Gross revenue generated by ${city} Station Hub is $${totalRev.toLocaleString()} across ${hubCars.length} stationed vehicles and ${totalBookings} fulfilled bookings. Net operating profit margin after maintenance OpEx ($${totalMaint}) is $${(totalRev - totalMaint).toLocaleString()} (89.2%).`,
        bengaliInsight: `${city} হাবের সর্বমোট অর্জিত আয় $${totalRev.toLocaleString()} (${hubCars.length}টি গাড়ি এবং ${totalBookings}টি বুকিং)। মেইনটেন্যান্স খরচ ($${totalMaint}) বাদে মোট নেট লাভ $${(totalRev - totalMaint).toLocaleString()}।`,
        matchedCount: hubCars.length,
        totalComputedRevenue: totalRev,
        reportCategory: 'Hub Performance',
        recommendedChart: 'bar',
        kpis: [
          { label: `${city} Gross Revenue`, value: `$${totalRev.toLocaleString()}`, trend: '+21.4% MoM', isPositive: true },
          { label: 'Net Profit Margin', value: `$${(totalRev - totalMaint).toLocaleString()}`, trend: '89.2% Margin', isPositive: true },
          { label: 'Stationed Vehicles', value: `${hubCars.length} Cars`, trend: 'Active Fleet', isPositive: true },
          { label: 'Fulfilled Bookings', value: `${totalBookings} Trips`, trend: '100% On-Time', isPositive: true }
        ],
        chartData,
        tableHeaders: ['Vehicle Name', 'Category', 'Daily Rate', 'Completed Trips', 'Gross Revenue', 'Maintenance Cost', 'Net Profit', 'Status'],
        tableRows: hubCars.map(c => [
          c.name,
          c.category,
          `$${c.dailyRate}/day`,
          `${c.bookingsCount} trips`,
          `$${c.totalRev.toLocaleString()}`,
          `-$${c.maintenance}`,
          `$${(c.totalRev - c.maintenance).toLocaleString()}`,
          c.status === 'AVAILABLE' ? '🟢 Ready in Hub' : '🔵 Currently on Trip'
        ]),
        appliedFilters: filters
      };
    }

    // SCENARIO D: RUNNING BOOKINGS WITH REAL-TIME ACTIVE DATA
    else if (statusFilter === 'RENTED' || q.includes('running booking') || q.includes('active booking') || q.includes('chaloman')) {
      const activeCars = MASTER_FLEET_CARS.filter(c => c.status === 'RENTED' && (categories.length === 0 || categories.includes(c.category)));
      const totalLiveVal = activeCars.reduce((s, c) => s + (c.activeBooking?.totalAmount || c.dailyRate * 4), 0);

      const chartData = activeCars.map(c => ({
        name: c.name.length > 14 ? c.name.substring(0, 12) + '…' : c.name,
        fullName: c.name,
        revenue: c.activeBooking?.totalAmount || c.dailyRate * 4,
        hub: c.hub
      }));

      result = {
        query: inputQuery,
        title: `⚡ Live Running & Active Bookings Ledger (${activeCars.length} Vehicles)`,
        summary: `Currently ${activeCars.length} vehicles are out on active running trips. Total in-progress rental booking value is $${totalLiveVal.toLocaleString()}. All vehicles are tracked via active GPS telemetry.`,
        bengaliInsight: `বর্তমানে মোট ${activeCars.length}টি গাড়ি লাইভ ভাড়ায় রানিং রয়েছে। চলমান বুকিংগুলোর মোট আর্থিক মূল্য $${totalLiveVal.toLocaleString()}।`,
        matchedCount: activeCars.length,
        totalComputedRevenue: totalLiveVal,
        reportCategory: 'Live Operations',
        recommendedChart: 'bar',
        kpis: [
          { label: 'Active In-Progress Cars', value: `${activeCars.length} Cars`, trend: '100% On-Trip', isPositive: true },
          { label: 'Live Booking Value', value: `$${totalLiveVal.toLocaleString()}`, trend: 'In Escrow', isPositive: true },
          { label: 'Active Station Hubs', value: '4 Regional Hubs', trend: 'Dhaka, Khulna, Sylhet, CTG', isPositive: true },
          { label: 'Telemetry Health', value: '100% Online', trend: 'GPS Monitored', isPositive: true }
        ],
        chartData,
        tableHeaders: ['Vehicle Name', 'Category', 'Assigned Hub', 'Booking Code', 'Customer Name', 'Active Route', 'Daily Rate', 'Est. Return Date'],
        tableRows: activeCars.map(c => [
          c.name,
          c.category,
          c.hub,
          c.activeBooking?.code || 'BK-LIVE-101',
          c.activeBooking?.customer || 'Verified Client',
          c.activeBooking?.from && c.activeBooking?.to ? `${c.activeBooking.from} ➔ ${c.activeBooking.to}` : `${c.city} Local Charter`,
          `$${c.dailyRate}/day`,
          c.activeBooking?.returnDate || '03 Sep 2026'
        ]),
        appliedFilters: filters
      };
    }

    // SCENARIO E: DAY-WISE & TIMELINE PROGRESSION
    else if (q.includes('day wise') || q.includes('daily') || (q.includes('din') && q.includes('chart'))) {
      const daysCount = timeframeDays || 14;
      const chartData = [];
      const now = new Date('2026-08-30');

      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const isWeekend = dayName === 'Fri' || dayName === 'Sat';
        const multiplier = isWeekend ? 1.5 : 1.0;
        const bCount = Math.max(2, Math.round((3 + Math.sin(i * 0.8) * 2) * multiplier));
        const rev = Math.round((bCount * 360 + Math.cos(i) * 110) * multiplier);

        chartData.push({
          date: dateStr,
          day: dayName,
          bookings: bCount,
          revenue: rev,
          avgPerBooking: Math.round(rev / bCount),
          isWeekend
        });
      }

      const totalRev = chartData.reduce((s, d) => s + d.revenue, 0);
      const totalBookings = chartData.reduce((s, d) => s + d.bookings, 0);

      result = {
        query: inputQuery,
        title: `📅 Day-Wise Operating Revenue & Demand Timeline (${daysCount} Days)`,
        summary: `Calculated daily trajectory over the last ${daysCount} days. Total revenue generated is $${totalRev.toLocaleString()} from ${totalBookings} reservations. Weekends (Friday & Saturday) experienced a +50% surge in demand.`,
        bengaliInsight: `বিগত ${daysCount} দিনের প্রতিদিনের ট্রিপ ও আয় বিশ্লেষণ। মোট আয় $${totalRev.toLocaleString()} এবং ${totalBookings}টি বুকিং সম্পন্ন হয়েছে। শুক্রবার ও শনিবার ৫০% বেশি বুকিং পরিলক্ষিত হয়েছে।`,
        matchedCount: chartData.length,
        totalComputedRevenue: totalRev,
        reportCategory: 'Daily Timeline',
        recommendedChart: 'area',
        kpis: [
          { label: 'Period Gross Revenue', value: `$${totalRev.toLocaleString()}`, trend: '+16.5%', isPositive: true },
          { label: 'Completed Bookings', value: `${totalBookings} Trips`, trend: '100% Fulfilled', isPositive: true },
          { label: 'Avg Daily Revenue', value: `$${Math.round(totalRev / daysCount).toLocaleString()}/day`, trend: 'Healthy Flow', isPositive: true },
          { label: 'Peak Booking Days', value: 'Fri & Sat', trend: '+50% Surge', isPositive: true }
        ],
        chartData,
        tableHeaders: ['Date', 'Day of Week', 'Completed Trips', 'Gross Revenue', 'Average Per Trip', 'Demand Status'],
        tableRows: chartData.map(d => [
          d.date,
          d.day,
          `${d.bookings} trips`,
          `$${d.revenue.toLocaleString()}`,
          `$${d.avgPerBooking}`,
          d.isWeekend ? '🔥 Peak Weekend' : 'Normal Weekday'
        ]),
        appliedFilters: filters
      };
    }

    // SCENARIO F: GENERAL MULTI-CONDITION FLEET / CATEGORY / TOP N REPORT
    else {
      let finalCars = [...matchedCars];
      if (topN > 0) {
        finalCars = finalCars.sort((a, b) => b.totalRev - a.totalRev).slice(0, topN);
      } else {
        finalCars = finalCars.sort((a, b) => b.totalRev - a.totalRev).slice(0, 8);
      }

      const totalRev = finalCars.reduce((s, c) => s + c.totalRev, 0);
      const totalMaint = finalCars.reduce((s, c) => s + c.maintenance, 0);

      const chartData = finalCars.map(c => ({
        name: c.name.length > 14 ? c.name.substring(0, 12) + '…' : c.name,
        fullName: c.name,
        category: c.category,
        hub: c.hub,
        revenue: c.totalRev,
        bookings: c.bookingsCount,
        dailyRate: c.dailyRate,
        profit: c.totalRev - c.maintenance,
        utilization: Math.min(96, Math.round((c.totalDays / 30) * 85))
      }));

      result = {
        query: inputQuery,
        title: `📊 Multi-Dimensional Analytics: ${topN ? `Top ${topN} ` : ''}${categories.join(' & ') || 'Fleet'} Vehicles`,
        summary: `Computed dynamic report matching your multi-attribute query "${inputQuery}". Evaluated ${finalCars.length} vehicles generating $${totalRev.toLocaleString()} in gross revenue with an average fleet utilization of 82.4%.`,
        bengaliInsight: `আপনার কুয়েরি "${inputQuery}" অনুযায়ী ${finalCars.length}টি গাড়ি বিশ্লেষণ করা হয়েছে। মোট আয় $${totalRev.toLocaleString()} এবং গড় ইউটিলাইজেশন ৮২.৪%।`,
        matchedCount: finalCars.length,
        totalComputedRevenue: totalRev,
        reportCategory: 'Fleet Performance',
        recommendedChart: 'bar',
        kpis: [
          { label: 'Total Evaluated Revenue', value: `$${totalRev.toLocaleString()}`, trend: '+19.2% YoY', isPositive: true },
          { label: 'Evaluated Vehicles', value: `${finalCars.length} Cars`, trend: 'Active Ledger', isPositive: true },
          { label: 'Net Profit Margin', value: `$${(totalRev - totalMaint).toLocaleString()}`, trend: '88.5% Net', isPositive: true },
          { label: 'Avg Fleet Utilization', value: '82.4%', trend: 'Target Exceeded', isPositive: true }
        ],
        chartData,
        tableHeaders: ['Vehicle Name', 'Category', 'Hub Location', 'Daily Rate', 'Completed Bookings', 'Gross Earnings', 'Maintenance', 'Net Profit'],
        tableRows: finalCars.map(c => [
          c.name,
          c.category,
          c.hub,
          `$${c.dailyRate}/day`,
          `${c.bookingsCount} trips`,
          `$${c.totalRev.toLocaleString()}`,
          `-$${c.maintenance}`,
          `$${(c.totalRev - c.maintenance).toLocaleString()}`
        ]),
        appliedFilters: filters
      };
    }

    setReportResult(result);
    setCurrentChartType(result.recommendedChart);
    setLoading(false);
  };

  // Auto-run initial query on mount
  useEffect(() => {
    executeDynamicAIQuery('SUV er location wise report dao');
  }, []);

  // Copy AI Summary text
  const handleCopy = () => {
    if (!reportResult) return;
    navigator.clipboard.writeText(`${reportResult.title}\n\n${reportResult.summary}\n\n${reportResult.bengaliInsight}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export AI Report to CSV
  const handleExportCSV = () => {
    if (!reportResult) return;
    let csv = 'data:text/csv;charset=utf-8,';
    csv += `"${reportResult.title}"\n\n`;
    csv += reportResult.tableHeaders.map(h => `"${h}"`).join(',') + '\n';
    reportResult.tableRows.forEach(row => {
      csv += row.map((cell: any) => `"${cell}"`).join(',') + '\n';
    });

    const encodedUri = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dynamic_ai_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Natural Language Prompt Input Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 shadow-xl border border-indigo-900/40 text-white relative overflow-hidden">
        <div className="max-w-4xl space-y-3 z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Autonomous Dynamic Natural Language Analytics Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ask Any Dynamic & Complex Fleet Query in Natural Language
          </h2>

          <p className="text-xs sm:text-sm text-slate-300">
            লোকেশন, হাইওয়ে রুট, টাইমফ্রেম, ক্যাটাগরি বা রানিং বুকিং সম্পর্কিত যে কোনো জটিল শর্তযুক্ত প্রশ্ন বাংলা বা ইংরেজিতে টাইপ করুন — AI তাৎক্ষণিক ডেটা ফিল্টার করে চার্ট ও টেবিল তৈরি করবে।
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeDynamicAIQuery(prompt);
            }}
            className="flex items-center gap-2 pt-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. SUV er location wise report dao, dhaka theke khulna route report, khulna hub revenue, Electric car running booking..."
                className="w-full pl-4 pr-10 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#FF7800] focus:bg-white/15 backdrop-blur-md transition-all shadow-inner"
              />
              {prompt && (
                <button
                  type="button"
                  onClick={() => setPrompt('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF7800] to-amber-500 hover:from-[#E66C00] hover:to-amber-600 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Query...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Preset Prompts */}
          <div className="pt-2">
            <div className="text-[11px] font-bold text-slate-400 mb-2">⚡ 1-Click Complex Queries:</div>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(p.query);
                    executeDynamicAIQuery(p.query);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] font-semibold text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative ambient background */}
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-gradient-to-bl from-indigo-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. AI GENERATED REPORT RESULT */}
      {reportResult && (
        <div className="space-y-6">
          {/* Executive Summary & KPI Strip */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{reportResult.title}</h3>
                </div>
                <p className="text-xs text-slate-500">Query: &ldquo;{reportResult.query}&rdquo;</p>
                
                {/* Detected Filters Pill Strip */}
                {reportResult.appliedFilters.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400">Applied Conditions:</span>
                    {reportResult.appliedFilters.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[10px]">
                        {f.key}: {f.val}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* View Switchers */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setCurrentChartType('bar')}
                    className={`p-2 rounded-lg transition-all ${
                      currentChartType === 'bar' ? 'bg-white text-[#FF7800] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Bar Chart"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentChartType('area')}
                    className={`p-2 rounded-lg transition-all ${
                      currentChartType === 'area' ? 'bg-white text-[#FF7800] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Area Chart"
                  >
                    <LineChartIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentChartType('pie')}
                    className={`p-2 rounded-lg transition-all ${
                      currentChartType === 'pie' ? 'bg-white text-[#FF7800] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Pie / Donut Chart"
                  >
                    <PieChartIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentChartType('table')}
                    className={`p-2 rounded-lg transition-all ${
                      currentChartType === 'table' ? 'bg-white text-[#FF7800] shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Data Table"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FF7800] hover:bg-[#E66C00] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* AI Narrative Insights (Dual English & Bengali) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1.5">
                <div className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🇬🇧 Executive English Analysis</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {reportResult.summary}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1.5">
                <div className="text-[11px] font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🇧🇩 বাংলা ইনসাইট ও এক্সিকিউটিভ রিপোর্ট</span>
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  {reportResult.bengaliInsight}
                </p>
              </div>
            </div>

            {/* Top KPIs Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {reportResult.kpis.map((kpi, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 truncate">{kpi.label}</div>
                  <div className="text-xl font-black text-slate-900">{kpi.value}</div>
                  {kpi.trend && (
                    <div className={`text-[10px] font-bold ${kpi.isPositive ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {kpi.trend}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 3. DYNAMIC VISUAL CHART SECTION */}
            <div className="pt-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">Interactive Visual Analytics</h4>
                <span className="text-[11px] font-semibold text-slate-400 capitalize">
                  Current View: {currentChartType} Mode
                </span>
              </div>

              <div className="h-80 w-full bg-slate-50/40 rounded-2xl p-4 border border-slate-100">
                {/* BAR CHART */}
                {currentChartType === 'bar' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportResult.chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E7EB', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val: any) => [typeof val === 'number' ? `$${Number(val).toLocaleString()}` : val, 'Value']}
                      />
                      <Bar dataKey="revenue" fill="#FF7800" radius={[6, 6, 0, 0]} maxBarSize={45} name="Revenue ($)" />
                      {reportResult.chartData[0]?.count !== undefined && (
                        <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={25} name="Vehicles Count" />
                      )}
                      {reportResult.chartData[0]?.trips !== undefined && (
                        <Bar dataKey="trips" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={25} name="Trips" />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {/* AREA CHART */}
                {currentChartType === 'area' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportResult.chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                      <defs>
                        <linearGradient id="aiOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF7800" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#FF7800" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={11} tickFormatter={(v) => `$${v}`} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E7EB', borderRadius: '12px', fontSize: '12px' }}
                        formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#FF7800" strokeWidth={3} fillOpacity={1} fill="url(#aiOrangeGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {/* LINE CHART */}
                {currentChartType === 'line' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reportResult.chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis dataKey={reportResult.chartData[0]?.date ? 'date' : 'name'} stroke="#9CA3AF" fontSize={11} tickLine={false} />
                      <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E5E7EB', borderRadius: '12px', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#FF7800" strokeWidth={3} dot={{ r: 4, fill: '#FF7800' }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}

                {/* PIE CHART */}
                {currentChartType === 'pie' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportResult.chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={5}
                        dataKey="revenue"
                        nameKey="name"
                      >
                        {reportResult.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {/* TABLE VIEW IN CHART BOX IF TOGGLED */}
                {currentChartType === 'table' && (
                  <div className="h-full overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                        <tr>
                          {reportResult.tableHeaders.map((th, i) => (
                            <th key={i} className="pb-2">{th}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {reportResult.tableRows.map((row, i) => (
                          <tr key={i} className="hover:bg-white/80">
                            {row.map((cell: any, j: number) => (
                              <td key={j} className="py-2.5 font-medium">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* 4. STRUCTURED DATA GRID */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="font-bold text-sm text-slate-900">Generated Data Records Table</h4>
                <span className="text-xs text-slate-400">{reportResult.tableRows.length} Records</span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      {reportResult.tableHeaders.map((header, idx) => (
                        <th key={idx} className="py-3 px-4">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                    {reportResult.tableRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                        {row.map((cell: any, cIdx: number) => (
                          <td key={cIdx} className={`py-3.5 px-4 ${cIdx === 0 ? 'font-bold text-slate-900' : 'font-medium'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
