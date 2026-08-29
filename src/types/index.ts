export type UserRole = 'CUSTOMER' | 'ADMIN' | 'FLEET_MANAGER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  drivingLicenseNumber?: string;
  drivingLicenseImage?: string;
  address?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type CarCategory = 'Sedan' | 'SUV' | 'Electric' | 'Luxury' | 'Passenger Van' | 'Sports';
export type VehicleCategory = CarCategory;
export type Transmission = 'Automatic' | 'Manual';
export type TransmissionType = Transmission;
export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
export type CarStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DECOMMISSIONED';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year?: number;
  category: CarCategory;
  transmission: Transmission;
  fuelType: FuelType;
  seats: number;
  doors?: number;
  luggageCapacity?: number;
  mileageLimit?: string;
  dailyRate: number;
  securityDeposit?: number;
  licensePlate?: string;
  image: string; // primary
  images?: string[];
  features: string[];
  specs?: {
    engine?: string;
    horsepower?: number;
    acceleration0to100?: string;
    topSpeed?: string;
  };
  currentHub?: string;

  status?: CarStatus;
  available: boolean;
  ratingAverage?: number;
  rating?: number;
  reviewCount?: number;
  reviewsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ProtectionPlan = 'Basic CDW' | 'Comprehensive Plus' | 'VIP Full Shield';
export type BookingStatus = 'Pending' | 'Confirmed' | 'Active' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

export interface Booking {
  id: string;
  bookingCode: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId?: string;
  vehicleId?: string;
  vehicleName: string;
  vehicleImage?: string;
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalDays: number;
  dailyRate: number;
  baseAmount?: number;
  protectionPlan: ProtectionPlan;
  protectionFee: number;
  securityDeposit?: number;
  discountAmount?: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  notes?: string;
  aiLeadScore?: {
    score: number;
    classification: 'Hot' | 'Warm' | 'Cold';
    priority: string;
    suggestedAction: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'bKash' | 'Nagad' | 'Cash on Delivery';

export interface Payment {
  id: string;
  transactionCode: string;
  bookingId: string;
  bookingCode: string;
  userId: string;
  customerName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paidAt?: string;
  refundedAt?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  carId: string;
  carName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  adminReply?: string;
  createdAt: string;
}

export type AvailabilityBlockType = 'BOOKING' | 'MAINTENANCE' | 'ADMIN_HOLD' | 'INSPECTION';

export interface AvailabilityBlock {
  id: string;
  carId: string;
  carName: string;
  bookingId?: string;
  startDate: string;
  endDate: string;
  type: AvailabilityBlockType;
  notes?: string;
  createdAt: string;
}

export interface PricingRule {
  id: string;
  name: string;
  category?: string;
  multiplier: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
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
    fleetUtilizationChangePct?: number;
    conversionRate?: number;
    avgRentalDurationDays?: number;
  };
  fleetSummary: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
  };
  bookingStatusCounts?: {
    active: number;
    confirmed: number;
    pending: number;
    completed: number;
    total: number;
  };
  revenueTrends: Array<{ month: string; revenue: number; expenses: number; bookings?: number }>;
  categoryDistribution: Array<{ category: string; count: number; sharePct: number; color: string }>;
  recentBookings: Booking[];
}

export interface AutomationLog {
  id: string;
  workflowName: string;
  triggerEvent: string;
  leadName: string;
  leadScore?: number;
  classification?: string;
  actionTaken: string;
  webhookStatus: string;
  timestamp: string;
  details?: any;
}

export interface AgentChatResponse {
  query?: string;
  session_id?: string;
  answer: string;
  language: string;
  intent: string;
  confidence_score: number;
  sources: Array<{ title: string; category?: string; score?: number; similarity_score?: number; rrf_score?: number }>;
  matched_vehicles: Vehicle[];
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
