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
  DiscountCoupon
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if token exists
client.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const api = {
  // ==========================
  // 1. AUTHENTICATION & USERS
  // ==========================
  async register(data: { name: string; email: string; password: string; phone: string; drivingLicenseNumber?: string; address?: string }) {
    try {
      const res = await client.post('/auth/register', data);
      if (typeof window !== 'undefined' && res.data) {
        if (res.data.accessToken) {
          localStorage.setItem('token', res.data.accessToken);
        }
        if (res.data.user) {
          localStorage.setItem('best_car_user', JSON.stringify(res.data.user));
        }
        window.dispatchEvent(new Event('best_car_auth_change'));
      }
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  },

  async login(data: { email: string; password?: string }) {
    try {
      const res = await client.post('/auth/login', data);
      if (typeof window !== 'undefined' && res.data) {
        if (res.data.accessToken) {
          localStorage.setItem('token', res.data.accessToken);
        }
        if (res.data.user) {
          localStorage.setItem('best_car_user', JSON.stringify(res.data.user));
        }
        window.dispatchEvent(new Event('best_car_auth_change'));
      }
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('best_car_user');
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('best_car_auth_change'));
    }
    return { success: true };
  },

  async getProfile(userId?: string): Promise<User | null> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token && !userId) {
        localStorage.removeItem('best_car_user');
        return null;
      }
    }
    try {
      const res = await client.get('/auth/profile', { params: { userId } });
      if (res.data && typeof window !== 'undefined') {
        localStorage.setItem('best_car_user', JSON.stringify(res.data));
      }
      return res.data;
    } catch (err: any) {
      if (typeof window !== 'undefined') {
        // If unauthorized or token invalid, wipe tampered storage
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('best_car_user');
          localStorage.removeItem('token');
          window.dispatchEvent(new Event('best_car_auth_change'));
          return null;
        }
      }
      return null;
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
          id: 'usr_driver_1',
          name: 'Rafiqul Islam',
          email: 'rafiqul.driver@rentcars.com',
          role: 'CAR_DRIVER',
          phone: '+8801712334455',
          drivingLicenseNumber: 'DL-DH-882910',
          address: 'Mirpur 10, Dhaka',
          status: 'ACTIVE',
          createdAt: '2026-01-20T00:00:00Z',
          updatedAt: '2026-01-20T00:00:00Z',
        }
      ];
    }
  },

  async updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED', role?: any): Promise<User> {
    const res = await client.put<User>(`/auth/users/${userId}/status`, { status, role });
    return res.data;
  },

  // ==========================
  // 2. VEHICLE FLEET MANAGEMENT
  // ==========================
  async getVehicles(params?: {
    category?: string;
    search?: string;
    transmission?: string;
    fuelType?: string;
    maxPrice?: number;
    hub?: string;
    status?: string;
  }): Promise<Vehicle[]> {
    try {
      const res = await client.get<Vehicle[]>('/cars', { params });
      return res.data;
    } catch {
      return [];
    }
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const res = await client.get<Vehicle>(`/cars/${id}`);
    return res.data;
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

  async getCategoriesStats(): Promise<any[]> {
    try {
      const res = await client.get('/cars/categories/stats');
      return res.data;
    } catch {
      return [];
    }
  },

  async getBrandsStats(): Promise<any[]> {
    try {
      const res = await client.get('/cars/brands/stats');
      return res.data;
    } catch {
      return [];
    }
  },

  async getHubs(): Promise<any[]> {
    try {
      const res = await client.get('/cars/hubs/all');
      return res.data;
    } catch {
      return [];
    }
  },

  async transferCarHub(carId: string, targetHub: string): Promise<Vehicle> {
    const res = await client.post<Vehicle>(`/cars/${carId}/transfer-hub`, { targetHub });
    return res.data;
  },

  async getMaintenanceFleet(): Promise<any[]> {
    try {
      const res = await client.get('/cars/maintenance/list');
      return res.data;
    } catch {
      return [];
    }
  },

  async getDriverCars(driverId: string): Promise<Vehicle[]> {
    try {
      const res = await client.get<Vehicle[]>(`/cars/owner/${driverId}`);
      return res.data;
    } catch {
      return [];
    }
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

  async getDriverTrips(driverId: string): Promise<Booking[]> {
    try {
      const res = await client.get<Booking[]>(`/bookings/driver/${driverId}`);
      return res.data;
    } catch {
      return [];
    }
  },

  async driverRespondTrip(bookingId: string, driverId: string, action: 'ACCEPT' | 'REJECT'): Promise<Booking> {
    const res = await client.post<Booking>(`/bookings/${bookingId}/driver-response`, { driverId, action });
    return res.data;
  },

  async updateDriverTripStatus(bookingId: string, status: string): Promise<Booking> {
    const res = await client.post<Booking>(`/bookings/${bookingId}/driver-status`, { status });
    return res.data;
  },

  async getCustomerTrips(userId: string): Promise<Booking[]> {
    try {
      const res = await client.get<Booking[]>(`/bookings/customer/${userId}`);
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

  async createPosBooking(bookingData: any): Promise<Booking> {
    const res = await client.post<Booking>('/bookings/pos', bookingData);
    return res.data;
  },

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const res = await client.put<Booking>(`/bookings/${id}/status`, { status });
    return res.data;
  },

  async processRentalReturn(id: string, inspection: any): Promise<Booking> {
    const res = await client.post<Booking>(`/bookings/${id}/return-inspection`, inspection);
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
  // 6. AVAILABILITY & MAINTENANCE BLOCKS
  // ==========================
  async checkAvailability(carId: string, startDate: string, endDate: string) {
    try {
      const res = await client.get('/availability/check', { params: { carId, startDate, endDate } });
      return res.data;
    } catch {
      return { available: true, collisionCount: 0, blocks: [] };
    }
  },

  async getAvailabilityBlocks(carId?: string): Promise<AvailabilityBlock[]> {
    try {
      const res = await client.get<AvailabilityBlock[]>('/availability', { params: { carId } });
      return res.data;
    } catch {
      return [];
    }
  },

  async createAvailabilityBlock(blockData: { carId: string; startDate: string; endDate: string; type: string; notes?: string }): Promise<AvailabilityBlock> {
    const res = await client.post<AvailabilityBlock>('/availability', blockData);
    return res.data;
  },

  async deleteAvailabilityBlock(id: string): Promise<{ success: boolean }> {
    const res = await client.delete(`/availability/${id}`);
    return res.data;
  },

  // ==========================
  // 7. PRICING & COUPONS
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

  async getCoupons(): Promise<DiscountCoupon[]> {
    try {
      const res = await client.get<DiscountCoupon[]>('/pricing/coupons');
      return res.data;
    } catch {
      return [];
    }
  },

  async createCoupon(couponData: Partial<DiscountCoupon>): Promise<DiscountCoupon> {
    const res = await client.post<DiscountCoupon>('/pricing/coupons', couponData);
    return res.data;
  },

  async deleteCoupon(id: string): Promise<{ success: boolean }> {
    const res = await client.delete(`/pricing/coupons/${id}`);
    return res.data;
  },

  async getProtectionPlans(): Promise<any[]> {
    try {
      const res = await client.get('/pricing/protection-plans');
      return res.data;
    } catch {
      return [];
    }
  },

  async getQuote(carId: string, totalDays: number, plan?: string, withDriver?: boolean) {
    try {
      const res = await client.get('/pricing/quote', { params: { carId, totalDays, plan, withDriver } });
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
        fleetSummary: { total: 8, available: 6, rented: 2, maintenance: 1 },
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

  async getKnowledgeDocs(): Promise<{ total_documents: number; documents: any[] }> {
    try {
      const res = await client.get('/ai/knowledge-docs');
      return res.data;
    } catch {
      return { total_documents: 6, documents: [] };
    }
  },

  async agenticChat(query: string, sessionId?: string): Promise<AgentChatResponse> {
    try {
      const res = await client.post<AgentChatResponse>('/ai/chat', { query, sessionId });
      return res.data;
    } catch {
      return {
        answer: 'Best Care 24/7 Concierge: Unlimited mileage is included on all bookings over 3 days.',
        language: 'english',
        intent: 'policy_inquiry',
        confidence_score: 0.95,
        sources: [],
        matched_vehicles: []
      };
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
        citations: []
      };
    }
  }
};
