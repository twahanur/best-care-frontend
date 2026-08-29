import axios from 'axios';
import { Vehicle, Booking, DashboardMetrics, RAGResponse, CarRecommendationResponse, AutomationLog } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fallback seed vehicles
const fallbackVehicles: Vehicle[] = [
  {
    id: 'car_prado_suv',
    name: 'Toyota Land Cruiser Prado TX',
    brand: 'Toyota',
    category: 'SUV',
    dailyRate: 145,
    seats: 7,
    doors: 5,
    luggageCapacity: 4,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    fuelEfficiency: '12 km/L',
    terrainCapability: 'Mountainous / 4WD Off-road (Sylhet, Bandarban, Sajek)',
    image: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 128,
    featured: true,
    available: true,
    features: ['4x4 Low-Range', 'Dual Zone AC', 'GPS Navigation', 'Hill Descent Control', 'ISOFIX Child Seat', 'Roof Rack'],
    specs: { engine: '2.8L Turbo Diesel', horsepower: 204, acceleration0to100: '9.8s', topSpeed: '175 km/h' }
  },
  {
    id: 'car_tucson_suv',
    name: 'Hyundai Tucson AWD',
    brand: 'Hyundai',
    category: 'SUV',
    dailyRate: 85,
    seats: 5,
    doors: 5,
    luggageCapacity: 3,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    fuelEfficiency: '15 km/L',
    terrainCapability: 'All-Weather Highway & Light Gravel',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 94,
    featured: true,
    available: true,
    features: ['Panoramic Sunroof', 'Apple CarPlay & Android Auto', 'Smart Cruise Control', 'Lane Keep Assist', 'Spacious Cargo'],
    specs: { engine: '1.6L Turbo Hybrid', horsepower: 180, acceleration0to100: '8.4s', topSpeed: '190 km/h' }
  },
  {
    id: 'car_tesla_modely',
    name: 'Tesla Model Y Long Range',
    brand: 'Tesla',
    category: 'Electric',
    dailyRate: 110,
    seats: 5,
    doors: 5,
    luggageCapacity: 3,
    transmission: 'Automatic',
    fuelType: 'Electric',
    fuelEfficiency: '510 km / Full Charge',
    terrainCapability: 'Paved Highways & Urban Expressways',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    reviewsCount: 156,
    featured: true,
    available: true,
    features: ['Autopilot Capability', '15-inch Touchscreen Hub', 'Zero Emissions', 'Supercharging Enabled', 'Glass Roof'],
    specs: { engine: 'Dual Motor AWD', horsepower: 384, acceleration0to100: '4.8s', topSpeed: '217 km/h' }
  },
  {
    id: 'car_mercedes_eclass',
    name: 'Mercedes-Benz E-Class AMG Line',
    brand: 'Mercedes-Benz',
    category: 'Luxury',
    dailyRate: 160,
    seats: 5,
    doors: 4,
    luggageCapacity: 2,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    fuelEfficiency: '14 km/L',
    terrainCapability: 'Executive Urban & Smooth Highway',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 82,
    featured: true,
    available: true,
    features: ['Burmester 3D Surround Sound', 'Nappa Leather Upholstery', '64-Color Ambient Lighting', 'Executive Tint', 'Chauffeur Option'],
    specs: { engine: '2.0L Turbo Mild-Hybrid', horsepower: 255, acceleration0to100: '6.2s', topSpeed: '250 km/h' }
  },
  {
    id: 'car_camry_hybrid',
    name: 'Toyota Camry Premium Hybrid',
    brand: 'Toyota',
    category: 'Sedan',
    dailyRate: 70,
    seats: 5,
    doors: 4,
    luggageCapacity: 3,
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    fuelEfficiency: '22 km/L Eco',
    terrainCapability: 'Inter-District & City Roads',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    rating: 4.75,
    reviewsCount: 110,
    featured: false,
    available: true,
    features: ['Whisper Quiet Cabin', 'Wireless Smartphone Charger', 'Blind Spot Detection', 'Ventilated Cooling Seats'],
    specs: { engine: '2.5L Dynamic Force Hybrid', horsepower: 208, acceleration0to100: '7.8s', topSpeed: '195 km/h' }
  },
  {
    id: 'car_hiace_luxury',
    name: 'Toyota HiAce Grandia Luxury',
    brand: 'Toyota',
    category: 'Van',
    dailyRate: 130,
    seats: 11,
    doors: 4,
    luggageCapacity: 8,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    fuelEfficiency: '11 km/L',
    terrainCapability: 'Tour Highway & Long-Distance Interstate',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    rating: 4.85,
    reviewsCount: 76,
    featured: false,
    available: true,
    features: ['11 Individual Captain Seats', 'Individual Overhead AC Vents', 'Dual Sliding Doors', 'High Roof Ceiling'],
    specs: { engine: '2.8L Turbo Diesel', horsepower: 176, acceleration0to100: '12.0s', topSpeed: '160 km/h' }
  },
  {
    id: 'car_civic_sport',
    name: 'Honda Civic Sport',
    brand: 'Honda',
    category: 'Sedan',
    dailyRate: 55,
    seats: 5,
    doors: 4,
    luggageCapacity: 2,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    fuelEfficiency: '16 km/L',
    terrainCapability: 'Urban City & Suburban Commute',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 142,
    featured: false,
    available: true,
    features: ['Honda Sensing Suite', 'Digital Cockpit Display', 'Paddle Shifters', 'Sport Wheels', 'Eco Assist Mode'],
    specs: { engine: '1.5L VTEC Turbo', horsepower: 180, acceleration0to100: '7.5s', topSpeed: '210 km/h' }
  },
  {
    id: 'car_mustang_gt',
    name: 'Ford Mustang GT V8 Convertible',
    brand: 'Ford',
    category: 'Sports',
    dailyRate: 175,
    seats: 4,
    doors: 2,
    luggageCapacity: 2,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    fuelEfficiency: '10 km/L',
    terrainCapability: 'Scenic Coastal Roads & Highways',
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
    rating: 4.95,
    reviewsCount: 65,
    featured: true,
    available: false,
    features: ['Power Soft-Top Convertible', 'Active Valve Exhaust', 'Brembo Performance Brakes', 'Heated/Cooled Seats'],
    specs: { engine: '5.0L V8', horsepower: 450, acceleration0to100: '4.3s', topSpeed: '250 km/h' }
  }
];

export const api = {
  // --- Vehicles ---
  async getVehicles(params?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; seats?: number }): Promise<Vehicle[]> {
    try {
      const res = await client.get<Vehicle[]>('/vehicles', { params });
      return res.data;
    } catch {
      let filtered = [...fallbackVehicles];
      if (params?.category && params.category !== 'All') {
        filtered = filtered.filter(v => v.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(v => v.name.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q));
      }
      if (params?.minPrice) filtered = filtered.filter(v => v.dailyRate >= params.minPrice!);
      if (params?.maxPrice) filtered = filtered.filter(v => v.dailyRate <= params.maxPrice!);
      if (params?.seats) filtered = filtered.filter(v => v.seats >= params.seats!);
      return filtered;
    }
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    try {
      const res = await client.get<Vehicle>(`/vehicles/${id}`);
      return res.data;
    } catch {
      const found = fallbackVehicles.find(v => v.id === id);
      if (!found) throw new Error('Vehicle not found');
      return found;
    }
  },

  // --- Bookings ---
  async getBookings(status?: string, search?: string): Promise<Booking[]> {
    try {
      const res = await client.get<Booking[]>('/bookings', { params: { status, search } });
      return res.data;
    } catch {
      return [];
    }
  },

  async createBooking(bookingData: any): Promise<Booking> {
    try {
      const res = await client.post<Booking>('/bookings', bookingData);
      return res.data;
    } catch {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      return {
        id: `bkg_${Date.now()}`,
        bookingCode: `DP-BK-${randomSuffix}`,
        status: 'Confirmed',
        paymentStatus: 'Paid',
        totalAmount: (bookingData.dailyRate * bookingData.totalDays) + (bookingData.protectionFee || 0),
        createdAt: new Date().toISOString(),
        ...bookingData
      };
    }
  },

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const res = await client.patch<Booking>(`/bookings/${id}/status`, { status });
    return res.data;
  },

  // --- Analytics ---
  async getDashboardAnalytics(): Promise<DashboardMetrics> {
    try {
      const res = await client.get<DashboardMetrics>('/analytics/dashboard');
      return res.data;
    } catch {
      return {
        kpis: {
          totalRevenue: 110820,
          revenueGrowthPct: 18.4,
          activeRentals: 24,
          activeRentalsGrowthPct: 12.5,
          totalBookings: 142,
          totalBookingsGrowthPct: 24.1,
          fleetUtilizationRate: 87.5,
          fleetUtilizationChangePct: 5.2,
          conversionRate: 14.8,
          avgRentalDurationDays: 4.2
        },
        revenueTrends: [
          { month: 'Jan', revenue: 28500, expenses: 14200, bookings: 48 },
          { month: 'Feb', revenue: 31200, expenses: 15400, bookings: 52 },
          { month: 'Mar', revenue: 36800, expenses: 16800, bookings: 64 },
          { month: 'Apr', revenue: 42100, expenses: 18200, bookings: 78 },
          { month: 'May', revenue: 47500, expenses: 19500, bookings: 89 },
          { month: 'Jun', revenue: 53200, expenses: 21000, bookings: 104 },
          { month: 'Jul', revenue: 58900, expenses: 22800, bookings: 118 },
          { month: 'Aug', revenue: 64500, expenses: 24100, bookings: 132 }
        ],
        categoryDistribution: [
          { category: 'SUV (4x4 & AWD)', count: 12, sharePct: 42, color: '#3B82F6' },
          { category: 'Executive Luxury', count: 6, sharePct: 22, color: '#8B5CF6' },
          { category: 'Electric (EV)', count: 4, sharePct: 15, color: '#10B981' },
          { category: 'Premium Sedan', count: 4, sharePct: 14, color: '#F59E0B' },
          { category: 'Vans & Group', count: 2, sharePct: 7, color: '#EC4899' }
        ],
        fleetSummary: { total: 28, available: 22, rented: 5, maintenance: 1 },
        bookingStatusCounts: { active: 5, confirmed: 12, pending: 3, completed: 122, total: 142 },
        recentBookings: []
      };
    }
  },

  // --- AI & RAG ---
  async askRAG(query: string, category?: string): Promise<RAGResponse> {
    try {
      const res = await client.post<RAGResponse>('/ai/rag-query', { query, category });
      return res.data;
    } catch {
      return {
        query,
        answer: 'Our standard security deposit is $200 (released in 24-48 hours after return). All rentals for 3 days or longer include unlimited mileage and 24/7 roadside assistance. You can choose our VIP Full Shield for zero excess.',
        sources: [
          { id: 'policy_deposit_refund', title: 'Security Deposit & Refund Timelines', category: 'Rental Policy', similarity_score: 0.91 },
          { id: 'policy_insurance_protection', title: 'Protection Packages & Coverage Tiers', category: 'Insurance & Protection', similarity_score: 0.86 }
        ],
        matched_vehicles: [{ id: 'fleet_prado_suv', title: 'Toyota Land Cruiser Prado TX', score: 0.94 }]
      };
    }
  },

  async recommendCarForTrip(tripDescription: string, passengers: number = 4, budgetPerDay?: number, terrain?: string): Promise<CarRecommendationResponse> {
    try {
      const res = await client.post<CarRecommendationResponse>('/ai/recommend-car', {
        tripDescription,
        passengers,
        budgetPerDay,
        terrain
      });
      return res.data;
    } catch {
      return {
        trip_description: tripDescription,
        passengers,
        primary_recommendation: {
          id: 'car_prado_suv',
          title: 'Toyota Land Cruiser Prado TX (4x4 Luxury SUV)',
          match_score: 96.5,
          reasoning: `Matches your trip (${tripDescription}) with 7 spacious seats and full 4WD off-road capabilities.`,
          details: 'Daily Rate: $145/day. 7 Passengers, 4 Suitcases. Dual AC.'
        },
        alternative_recommendation: {
          id: 'car_tucson_suv',
          title: 'Hyundai Tucson AWD (Compact Modern SUV)',
          match_score: 88.0,
          details: 'Daily Rate: $85/day. 5 Passengers, 3 Suitcases. Panoramic Sunroof.'
        },
        citations: [
          { title: 'Toyota Land Cruiser Prado TX (4x4 Luxury SUV)', score: 0.94 },
          { title: 'Mountainous & Hilly Road Recommendations', score: 0.89 }
        ]
      };
    }
  },

  async getKnowledgeDocs(): Promise<{ total_documents: number; documents: any[] }> {
    try {
      const res = await client.get('/ai/knowledge-docs');
      return res.data;
    } catch {
      return { total_documents: 6, documents: [] };
    }
  },

  // --- Automation ---
  async getAutomationLogs(): Promise<AutomationLog[]> {
    try {
      const res = await client.get<AutomationLog[]>('/automation/logs');
      return res.data;
    } catch {
      return [];
    }
  },

  async testAutomationPipeline(): Promise<any> {
    const res = await client.post('/automation/test-workflow');
    return res.data;
  },

  async triggerLeadWebhook(leadData: any): Promise<any> {
    const res = await client.post('/automation/webhook/lead', leadData);
    return res.data;
  }
};
