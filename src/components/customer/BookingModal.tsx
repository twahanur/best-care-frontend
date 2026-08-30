'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Vehicle, ProtectionPlan, Booking } from '@/types';
import { api } from '@/services/api';
import { Calendar, MapPin, ShieldCheck, CheckCircle2, User, Mail, Phone, Sparkles, X, Shield, Clock, FileText } from 'lucide-react';

interface BookingModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onBookingComplete?: (newBooking: Booking) => void;
}

export function BookingModal({ vehicle, onClose, onBookingComplete }: BookingModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupDate, setPickupDate] = useState('2026-09-01');
  const [dropoffDate, setDropoffDate] = useState('2026-09-05');
  const [pickupLocation, setPickupLocation] = useState('Hazrat Shahjalal Intl Airport (DAC)');
  const [dropoffLocation, setDropoffLocation] = useState('Hazrat Shahjalal Intl Airport (DAC)');
  const [protectionPlan, setProtectionPlan] = useState<ProtectionPlan>('Comprehensive Plus');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && vehicle) {
      const cached = localStorage.getItem('best_car_user');
      if (cached) {
        try {
          const user = JSON.parse(cached);
          setCustomerName((prev) => prev || user.name || '');
          setCustomerEmail((prev) => prev || user.email || '');
          setCustomerPhone((prev) => prev || user.phone || '');
        } catch {
          // ignore
        }
      }
    }
  }, [vehicle]);

  if (!vehicle) return null;

  // Calculate rental duration in days
  const start = new Date(pickupDate);
  const end = new Date(dropoffDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Protection fees
  let dailyProtectionFee = 0;
  if (protectionPlan === 'Comprehensive Plus') dailyProtectionFee = 18;
  if (protectionPlan === 'VIP Full Shield') dailyProtectionFee = 30;

  const baseTotal = vehicle.dailyRate * calculatedDays;
  const protectionTotal = dailyProtectionFee * calculatedDays;
  const grandTotal = baseTotal + protectionTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) {
      alert('Please fill out all required customer contact details.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        customerName,
        customerEmail,
        customerPhone,
        pickupDate: new Date(pickupDate).toISOString(),
        dropoffDate: new Date(dropoffDate).toISOString(),
        pickupLocation,
        dropoffLocation,
        totalDays: calculatedDays,
        dailyRate: vehicle.dailyRate,
        protectionPlan,
        protectionFee: protectionTotal,
        totalAmount: grandTotal,
        notes,
      };

      const result = await api.createBooking(payload);
      setConfirmedBooking(result);
      if (onBookingComplete) {
        onBookingComplete(result);
      }
    } catch (err: any) {
      alert(`Booking failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                Complete Rental Reservation
              </h3>
              <p className="text-xs text-slate-500">Instant reservation & guaranteed best price</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed Success State */}
        {confirmedBooking ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                Reservation Confirmed
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-3 font-['Plus_Jakarta_Sans']">
                Booking Reference: {confirmedBooking.bookingCode}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Thank you, <strong className="text-slate-900">{confirmedBooking.customerName}</strong>. A confirmation email and vehicle check-in pass has been dispatched to <strong className="text-slate-900">{confirmedBooking.customerEmail}</strong>.
              </p>
            </div>

            {/* Summary Details Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-semibold text-slate-900">{confirmedBooking.vehicleName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Duration:</span>
                <span className="font-semibold text-slate-900">{confirmedBooking.totalDays} Days ({pickupDate} to {dropoffDate})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Pick-up Location:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">{confirmedBooking.pickupLocation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Protection:</span>
                <span className="font-semibold text-blue-600">{confirmedBooking.protectionPlan}</span>
              </div>
              <div className="flex justify-between py-1 pt-2 font-bold text-sm">
                <span className="text-slate-700">Total Paid Amount:</span>
                <span className="text-emerald-600 font-extrabold">${confirmedBooking.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all"
              >
                Close & Return to Home
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Top Vehicle Summary Card */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{vehicle.category}</span>
                  <span className="text-xs text-slate-500">{vehicle.transmission} • {vehicle.seats} Seats</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-0.5">{vehicle.name}</h4>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Rate</div>
                <div className="text-base font-extrabold text-slate-900">${vehicle.dailyRate}<span className="text-xs text-slate-400 font-normal">/d</span></div>
              </div>
            </div>

            {/* Itinerary Dates & Location */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Itinerary & Dates</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    Return Date ({calculatedDays} Days Total)
                  </label>
                  <input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Pick-up Hub
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Hazrat Shahjalal Intl Airport (DAC)">Hazrat Shahjalal Intl Airport (DAC)</option>
                    <option value="Gulshan Diplomatic Zone, Dhaka">Gulshan Diplomatic Zone, Dhaka</option>
                    <option value="Banani Central Hub">Banani Central Hub</option>
                    <option value="Sylhet Osmani Airport (ZYL)">Sylhet Osmani Airport (ZYL)</option>
                    <option value="Chittagong Patenga Airport (CGP)">Chittagong Patenga Airport (CGP)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Drop-off Hub
                  </label>
                  <select
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Hazrat Shahjalal Intl Airport (DAC)">Hazrat Shahjalal Intl Airport (DAC)</option>
                    <option value="Gulshan Diplomatic Zone, Dhaka">Gulshan Diplomatic Zone, Dhaka</option>
                    <option value="Banani Central Hub">Banani Central Hub</option>
                    <option value="Sylhet Osmani Airport (ZYL)">Sylhet Osmani Airport (ZYL)</option>
                    <option value="Chittagong Patenga Airport (CGP)">Chittagong Patenga Airport (CGP)</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Protection Plans Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Select Protection Package</h4>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed Peace of Mind
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    name: 'Basic CDW' as ProtectionPlan,
                    price: 'Included ($0)',
                    desc: 'Third party liability with standard deductible.',
                  },
                  {
                    name: 'Comprehensive Plus' as ProtectionPlan,
                    price: '+$18/day',
                    desc: 'Zero tire/glass excess with roadside rescue.',
                  },
                  {
                    name: 'VIP Full Shield' as ProtectionPlan,
                    price: '+$30/day',
                    desc: 'Zero deductible + $0 deposit + free cancellation.',
                  },
                ].map((plan) => {
                  const isSelected = protectionPlan === plan.name;
                  return (
                    <div
                      key={plan.name}
                      onClick={() => setProtectionPlan(plan.name)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{plan.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div className="text-[11px] font-extrabold text-blue-600 mt-1">{plan.price}</div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-snug">{plan.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Primary Driver Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Shahriar Khan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="shahriar@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1700-112233"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 placeholder-slate-400"
                  />
                </div>

              </div>
            </div>

            {/* Special Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">Flight Number / Special Delivery Instructions (Optional)</label>
              <textarea
                rows={2}
                placeholder="e.g., Flight BG-084 arriving at DAC Terminal 2 at 14:30. Need child safety booster seat."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 placeholder-slate-400"
              />
            </div>

            {/* Pricing Summary & Checkout Button */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs text-slate-500">
                  ${vehicle.dailyRate} × {calculatedDays} days + ${protectionTotal} protection
                </div>
                <div className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
                  Total: <span className="text-blue-600">${grandTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{loading ? 'Securing Car...' : 'Confirm & Reserve'}</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
