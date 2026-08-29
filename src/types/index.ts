export type VehicleCategory = 'SUV' | 'Sedan' | 'Luxury' | 'Electric' | 'Van' | 'Sports';
export type TransmissionType = 'Automatic' | 'Manual';
export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  category: VehicleCategory;
  dailyRate: number;
  seats: number;
  doors: number;
  luggageCapacity: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  fuelEfficiency: string;
  terrainCapability: string;
  image: string;
  rating: number;
  reviewsCount: number;
  featured: boolean;
  available: boolean;
  features: string[];
  specs: {
    engine: string;
    horsepower: number;
    acceleration0to100: string;
    topSpeed: string;
  };
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded';
export type ProtectionPlan = 'Basic CDW' | 'Comprehensive Plus' | 'VIP Full Shield';

export interface Booking {
  id: string;
  bookingCode: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalDays: number;
  dailyRate: number;
  protectionPlan: ProtectionPlan;
  protectionFee: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  aiLeadScore?: {
    score: number;
    classification: 'Hot' | 'Warm' | 'Cold';
    priority: string;
    suggestedAction: string;
  };
  createdAt: string;
}

export interface DashboardMetrics {
  kpis: {
    totalRevenue: number;
    revenueGrowthPct: number;
    activeRentals: number;
    activeRentalsGrowthPct: number;
    totalBookings: number;
    totalBookingsGrowthPct: number;
    fleetUtilizationRate: number;
    fleetUtilizationChangePct: number;
    conversionRate: number;
    avgRentalDurationDays: number;
  };
  revenueTrends: Array<{
    month: string;
    revenue: number;
    expenses: number;
    bookings: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    sharePct: number;
    color: string;
  }>;
  fleetSummary: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
  };
  bookingStatusCounts: {
    active: number;
    confirmed: number;
    pending: number;
    completed: number;
    total: number;
  };
  recentBookings: Booking[];
}

export interface RAGSource {
  id: string;
  title: string;
  category: string;
  similarity_score: number;
}

export interface RAGResponse {
  query: string;
  answer: string;
  sources: RAGSource[];
  matched_vehicles: Array<{
    id: string;
    title: string;
    score: number;
  }>;
}

export interface AgentChatResponse {
  session_id: string;
  query: string;
  answer: string;
  language: string;
  intent?: string;
  sources: RAGSource[];
  matched_vehicles: Array<{
    id: string;
    title: string;
    score: number;
  }>;
  confidence_score: number;
}

export interface CarRecommendationResponse {
  trip_description: string;
  passengers: number;
  primary_recommendation: {
    id: string;
    title: string;
    match_score: number;
    reasoning: string;
    details: string;
  };
  alternative_recommendation?: {
    id: string;
    title: string;
    match_score: number;
    details: string;
  };
  citations: Array<{ title: string; score: number }>;
}

export interface AutomationLog {
  id: string;
  workflowName: string;
  triggerEvent: string;
  leadName: string;
  leadScore: number;
  classification: string;
  actionTaken: string;
  webhookStatus: 'SUCCESS' | 'DISPATCHED' | 'QUEUED';
  timestamp: string;
  details: any;
}
