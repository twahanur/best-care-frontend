import axios from 'axios';
import {
  Vehicle,
  Booking,
  DashboardMetrics,
  AgentChatResponse,
  CarRecommendationResponse,
  AutomationLog,
  User,
  Payment,
  Review,
  AvailabilityBlock,
  PricingRule,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // ==========================
  // 1. AUTHENTICATION & USERS
  // ==========================
  async register(data: { name: string; email: string; password: string; phone: string; drivingLicenseNumber?: string; address?: string }) {
    try {
      const res = await client.post('/auth/register', data);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  async login(data: { email: string; password?: string }) {
    try {
      const res = await client.post('/auth/login', data);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  async getProfile(userId?: string): Promise<User> {
    try {
      const res = await client.get('/auth/profile', { params: { userId } });
      return res.data;
    } catch {
      return {
        id: 'usr_cust_1',
        name: 'Shahriar Khan',
        email: 'shahriar@example.com',
        role: 'CUSTOMER',
        phone: '+8801700112233',
        drivingLicenseNumber: 'DL-DH-482910',
        address: 'Banani DOHS, Dhaka',
        status: 'ACTIVE',
        createdAt: '2026-02-10T00:00:00Z',
        updatedAt: '2026-02-10T00:00:00Z',
      };
    }
  },

  async updateProfile(data: { userId: string; name?: string; phone?: string; drivingLicenseNumber?: string; address?: string; avatar?: string }): Promise<User> {
    const res = await client.put('/auth/profile', data);
    return res.data;
  },

  async getUsers(): Promise<User[]> {
    try {
      const res = await client.get<User[]>('/auth/users');
      return res.data;
    } catch {
      return [
        {
          id: 'usr_admin_1',
          name: 'Shahriar Admin',
          email: 'admin@rentcars.com',
          role: 'ADMIN',
          phone: '+8801819000001',
          drivingLicenseNumber: 'DL-DH-994821',
          address: 'Gulshan 2, Dhaka',
          status: 'ACTIVE',
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-01-01T00:00:00Z',
        },
        {
          id: 'usr_cust_1',
          name: 'Shahriar Khan',
          email: 'shahriar@example.com',
          role: 'CUSTOMER',
          phone: '+8801700112233',
          drivingLicenseNumber: 'DL-DH-482910',
          address: 'Banani DOHS, Dhaka',
          status: 'ACTIVE',
          createdAt: '2026-02-10T00:00:00Z',
          updatedAt: '2026-02-10T00:00:00Z',
        },
        {
          id: 'usr_cust_2',
          name: 'Nusrat Jahan',
          email: 'nusrat@example.com',
          role: 'CUSTOMER',
          phone: '+8801711987654',
          drivingLicenseNumber: 'DL-DH-738291',
          address: 'Dhanmondi Road 27, Dhaka',
          status: 'ACTIVE',
          createdAt: '2026-02-15T00:00:00Z',
          updatedAt: '2026-02-15T00:00:00Z',
        }
      ];
    }
  },

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED', role?: string): Promise<User> {
    const res = await client.put('/auth/users/status', { userId, status, role });
    return res.data;
  },

  // ==========================
  // 2. CARS & FLEET MANAGEMENT
  // ==========================
  async getVehicles(params?: { category?: string; search?: string; transmission?: string; fuelType?: string; maxPrice?: number; hub?: string; status?: string }): Promise<Vehicle[]> {
    try {
      const res = await client.get<Vehicle[]>('/cars', { params });
      return res.data.map(c => ({
        ...c,
        image: c.images && c.images.length > 0 ? c.images[0] : (c.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'),
        available: c.status === 'AVAILABLE'
      }));
    } catch {
      return [];
    }
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const res = await client.get<Vehicle>(`/cars/${id}`);
    const c = res.data;
    return {
      ...c,
      image: c.images && c.images.length > 0 ? c.images[0] : (c.image || ''),
      available: c.status === 'AVAILABLE'
    };
  },

  async createVehicle(carData: Partial<Vehicle>): Promise<Vehicle> {
    const res = await client.post<Vehicle>('/cars', carData);
    return res.data;
  },

  async updateVehicle(id: string, carData: Partial<Vehicle>): Promise<Vehicle> {
    const res = await client.put<Vehicle>(`/cars/${id}`, carData);
    return res.data;
  },

  async deleteVehicle(id: string): Promise<{ success: boolean }> {
    const res = await client.delete(`/cars/${id}`);
    return res.data;
  },

  // ==========================
  // 3. BOOKINGS MANAGEMENT
  // ==========================
  async getBookings(status?: string, search?: string, userId?: string): Promise<Booking[]> {
    try {
      const res = await client.get<Booking[]>('/bookings', { params: { status, search, userId } });
      return res.data;
    } catch {
      return [];
    }
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await client.get<Booking>(`/bookings/${id}`);
    return res.data;
  },

  async createBooking(bookingData: any): Promise<Booking> {
    try {
      const res = await client.post<Booking>('/bookings', bookingData);
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Booking submission failed');
    }
  },

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const res = await client.put<Booking>(`/bookings/${id}/status`, { status });
    return res.data;
  },

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const res = await client.post<Booking>(`/bookings/${id}/cancel`, { reason });
    return res.data;
  },

  // ==========================
  // 4. PAYMENTS & TRANSACTIONS
  // ==========================
  async getPayments(status?: string, search?: string, userId?: string): Promise<Payment[]> {
    try {
      const res = await client.get<Payment[]>('/payments', { params: { status, search, userId } });
      return res.data;
    } catch {
      return [];
    }
  },

  async checkoutPayment(paymentData: any): Promise<Payment> {
    const res = await client.post<Payment>('/payments/checkout', paymentData);
    return res.data;
  },

  async refundPayment(paymentId: string, reason?: string): Promise<Payment> {
    const res = await client.post<Payment>(`/payments/${paymentId}/refund`, { reason });
    return res.data;
  },

  async getPaymentStats(): Promise<any> {
    try {
      const res = await client.get('/payments/stats');
      return res.data;
    } catch {
      return { totalCollected: 48250, refundedTotal: 0, transactionCount: 142 };
    }
  },

  // ==========================
  // 5. REVIEWS & RATINGS
  // ==========================
  async getReviews(carId?: string, userId?: string, isApproved?: boolean): Promise<Review[]> {
    try {
      const res = await client.get<Review[]>('/reviews', { params: { carId, userId, isApproved } });
      return res.data;
    } catch {
      return [];
    }
  },

  async createReview(reviewData: { bookingId: string; userId: string; userName: string; carId: string; carName: string; rating: number; comment: string }): Promise<Review> {
    const res = await client.post<Review>('/reviews', reviewData);
    return res.data;
  },

  async moderateReview(reviewId: string, isApproved: boolean, adminReply?: string): Promise<Review> {
    const res = await client.put<Review>(`/reviews/${reviewId}/moderate`, { isApproved, adminReply });
    return res.data;
  },

  // ==========================
  // 6. AVAILABILITY & MAINTENANCE
  // ==========================
  async getAvailabilityBlocks(carId?: string): Promise<AvailabilityBlock[]> {
    try {
      const res = await client.get<AvailabilityBlock[]>('/availability', { params: { carId } });
      return res.data;
    } catch {
      return [];
    }
  },

  async createAvailabilityBlock(blockData: { carId: string; carName?: string; startDate: string; endDate: string; type: string; notes?: string }): Promise<AvailabilityBlock> {
    const res = await client.post<AvailabilityBlock>('/availability', blockData);
    return res.data;
  },

  async deleteAvailabilityBlock(id: string): Promise<{ success: boolean }> {
    const res = await client.delete(`/availability/${id}`);
    return res.data;
  },

  async checkAvailability(carId: string, startDate: string, endDate: string): Promise<{ available: boolean; conflictingBlock?: AvailabilityBlock }> {
    try {
      const res = await client.get('/availability/check', { params: { carId, startDate, endDate } });
      return res.data;
    } catch {
      return { available: true };
    }
  },

  // ==========================
  // 7. PRICING & QUOTES
  // ==========================
  async getPricingRules(): Promise<PricingRule[]> {
    try {
      const res = await client.get<PricingRule[]>('/pricing/rules');
      return res.data;
    } catch {
      return [];
    }
  },

  async createPricingRule(ruleData: any): Promise<PricingRule> {
    const res = await client.post<PricingRule>('/pricing/rules', ruleData);
    return res.data;
  },

  async deletePricingRule(id: string): Promise<{ success: boolean }> {
    const res = await client.delete(`/pricing/rules/${id}`);
    return res.data;
  },

  async getQuote(carId: string, totalDays: number, plan?: string) {
    try {
      const res = await client.get('/pricing/quote', { params: { carId, totalDays, plan } });
      return res.data;
    } catch {
      return { baseTotal: 100 * totalDays, protectionFee: 18 * totalDays, grandTotal: 118 * totalDays };
    }
  },

  // ==========================
  // 8. EXECUTIVE ANALYTICS & REPORTS
  // ==========================
  async getDashboardAnalytics(): Promise<DashboardMetrics> {
    try {
      const res = await client.get<DashboardMetrics>('/analytics/dashboard');
      return res.data;
    } catch {
      return {
        kpis: {
          totalRevenue: 48250,
          revenueGrowthPct: 15.8,
          activeRentals: 8,
          activeRentalsGrowthPct: 12.4,
          totalBookings: 1420,
          totalBookingsGrowthPct: 22.1,
          fleetUtilizationRate: 88,
        },
        fleetSummary: { total: 8, available: 6, rented: 2, maintenance: 0 },
        revenueTrends: [
          { month: 'Jan', revenue: 18500, expenses: 7200 },
          { month: 'Feb', revenue: 24200, expenses: 8400 },
          { month: 'Mar', revenue: 29800, expenses: 9100 },
          { month: 'Apr', revenue: 34500, expenses: 10200 },
          { month: 'May', revenue: 38900, expenses: 11400 },
          { month: 'Jun', revenue: 42100, expenses: 12000 },
          { month: 'Jul', revenue: 45800, expenses: 13500 },
          { month: 'Aug', revenue: 48250, expenses: 14200 },
        ],
        categoryDistribution: [
          { category: 'SUV', count: 3, sharePct: 42, color: '#3B82F6' },
          { category: 'Sedan', count: 2, sharePct: 28, color: '#F97316' },
          { category: 'Luxury', count: 2, sharePct: 18, color: '#10B981' },
          { category: 'Electric', count: 1, sharePct: 12, color: '#8B5CF6' },
        ],
        recentBookings: []
      };
    }
  },

  async getTopCars() {
    try {
      const res = await client.get('/analytics/top-cars');
      return res.data;
    } catch {
      return [];
    }
  },

  // ==========================
  // 9. AI CONCIERGE & AUTOMATION
  // ==========================
  async agenticChat(query: string, sessionId?: string): Promise<AgentChatResponse> {
    try {
      const res = await client.post<AgentChatResponse>('/ai/chat', { query, sessionId });
      return res.data;
    } catch {
      return {
        answer: 'Our standard security deposit is $200 (released in 24-48 hours after return). All rentals for 3 days or longer include unlimited mileage and 24/7 roadside assistance.',
        language: 'english',
        intent: 'policy_inquiry',
        confidence_score: 0.94,
        sources: [{ title: 'Security Deposit & Refund Timelines', category: 'Rental Policy', score: 0.92 }],
        matched_vehicles: []
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

  async recommendCarForTrip(tripDescription: string, passengers: number = 4, budgetPerDay?: number, terrain?: string): Promise<CarRecommendationResponse> {

    try {
      const res = await client.post<CarRecommendationResponse>('/ai/recommend-car', { tripDescription, passengers, budgetPerDay, terrain });
      return res.data;
    } catch {
      return {
        trip_description: tripDescription,
        passengers,
        primary_recommendation: {
          id: 'car_prado_suv',
          title: 'Toyota Land Cruiser Prado TX (4x4 Luxury SUV)',
          match_score: 96.5,
          reasoning: '7 spacious seats and full 4WD off-road capabilities.',
          details: 'Daily Rate: $145/day. 7 Passengers, 4 Suitcases. Dual AC.'
        },
        citations: [{ title: 'Toyota Land Cruiser Prado TX (4x4 Luxury SUV)', score: 0.94 }]
      };
    }
  },

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
  }
};
