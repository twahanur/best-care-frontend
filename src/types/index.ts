export type UserRole = 'CUSTOMER' | 'ADMIN' | 'CAR_DRIVER' | 'FLEET_MANAGER';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  drivingLicenseNumber?: string;
  drivingLicenseNo?: string;
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

export type RentalServiceType =
  | 'SELF_DRIVE'
  | 'CHAUFFEUR_DRIVEN'
  | 'AIRPORT_TRANSFER'
  | 'INTERCITY_TOUR'
  | 'HOURLY_CHARTER'
  | 'WEDDING_VIP_EVENT';

export type RentalAddon =
  | 'CHILD_BABY_SEAT'
  | 'PORTABLE_WIFI_HOTSPOT'
  | 'DASHCAM_RECORDER'
  | 'ROOF_LUGGAGE_BOX'
  | 'ADDITIONAL_DRIVER_PERMIT'
  | 'PET_PROTECTION_COVER';

export type MaintenanceType =
  | 'ROUTINE_OIL_FILTER_SERVICE'
  | 'BRAKE_PAD_REPLACEMENT'
  | 'TIRE_ALIGNMENT_ROTATION'
  | 'BATTERY_HEALTH_CHECK'
  | 'CERAMIC_DETAILING'
  | 'BODY_PAINT_REPAIR'
  | 'AC_DEEP_CLEAN';

export type DriverTripStatus =
  | 'NOT_ASSIGNED'
  | 'ASSIGNED_PENDING'
  | 'ACCEPTED'
  | 'EN_ROUTE_TO_PICKUP'
  | 'ARRIVED_AT_HUB'
  | 'TRIP_IN_PROGRESS'
  | 'DROPOFF_COMPLETED';

export interface BookingAddonItem {
  id?: string;
  addon: RentalAddon;
  dailyPrice: number;
  totalPrice: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId?: string;
  driverId?: string;
  serviceType?: RentalServiceType;
  driverTripStatus?: DriverTripStatus;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carId?: string;
  vehicleId?: string;
  vehicleName: string;
  carName?: string;
  vehicleImage?: string;
  pickupDate: string;
  dropoffDate: string;
  startDate?: string;
  endDate?: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupHub?: string;
  returnHub?: string;
  totalDays: number;
  dailyRate: number;
  baseAmount?: number;
  protectionPlan: ProtectionPlan;
  protectionFee: number;
  securityDeposit?: number;
  discountAmount?: number;
  totalAmount: number;
  withDriver?: boolean;
  addons?: BookingAddonItem[];
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
  updatedAt: string;
}

export interface Payment {
  id: string;
  transactionCode: string;
  transactionId?: string;
  bookingId: string;
  bookingCode: string;
  userId: string;
  customerName: string;
  amount: number;
  currency: string;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'bKash' | 'Nagad' | 'Cash on Delivery' | 'Paypal' | 'Apple Pay' | 'Stripe' | 'PayU' | 'Paytm' | string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | string;
  paymentStatus?: string;
  paidAt?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId?: string;
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

export interface AvailabilityBlock {
  id: string;
  carId: string;
  carName: string;
  startDate: string;
  endDate: string;
  type: 'Maintenance' | 'Booking' | 'Reserved' | 'ADMIN_HOLD';
  notes: string;
  createdAt: string;
}

export interface PricingRule {
  id: string;
  name: string;
  code?: string;
  category?: CarCategory;
  multiplier: number;
  driverDailyRate?: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export interface DiscountCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minBookingAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive: boolean;
  createdAt?: string;
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
  };
  fleetSummary: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
  };
  paymentSummary?: {
    totalCollected: number;
    totalRefunded: number;
    pendingPayouts: number;
    byMethod: {
      creditCard: number;
      bKash: number;
      cash: number;
    };
  };
  revenueTrends: Array<{ month: string; revenue: number; expenses?: number; bookings?: number }>;
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
