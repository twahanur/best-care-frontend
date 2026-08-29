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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="glass-panel bg-slate-900/95 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-['Plus_Jakarta_Sans']">
                Complete Rental Reservation
              </h3>
              <p className="text-xs text-slate-400">Guaranteed instant vehicle reservation & AI lead qualification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmed Success State */}
        {confirmedBooking ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Reservation Confirmed
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-3">
                Booking Reference: {confirmedBooking.bookingCode}
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                Thank you, <strong className="text-white">{confirmedBooking.customerName}</strong>. A confirmation email and vehicle check-in pass has been dispatched to <strong className="text-white">{confirmedBooking.customerEmail}</strong>.
              </p>
            </div>

            {/* Summary Details Card */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Vehicle:</span>
                <span className="font-semibold text-white">{confirmedBooking.vehicleName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Duration:</span>
                <span className="font-semibold text-white">{confirmedBooking.totalDays} Days ({pickupDate} to {dropoffDate})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Pick-up Location:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{confirmedBooking.pickupLocation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Protection:</span>
                <span className="font-semibold text-indigo-300">{confirmedBooking.protectionPlan}</span>
              </div>
              <div className="flex justify-between py-1 pt-2 font-bold text-sm">
                <span className="text-slate-200">Total Paid Amount:</span>
                <span className="text-emerald-400">${confirmedBooking.totalAmount}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all"
              >
                Close & Return to Home
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Top Vehicle Summary Card */}
            <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{vehicle.category}</span>
                  <span className="text-xs text-slate-400">{vehicle.transmission} • {vehicle.seats} Seats</span>
                </div>
                <h4 className="font-bold text-sm text-white mt-0.5">{vehicle.name}</h4>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Rate</div>
                <div className="text-base font-extrabold text-white">${vehicle.dailyRate}<span className="text-xs text-slate-400 font-normal">/d</span></div>
              </div>
            </div>

            {/* Itinerary Dates & Location */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Itinerary & Dates</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    Return Date ({calculatedDays} Days Total)
                  </label>
                  <input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                    Pick-up Hub
                  </label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Hazrat Shahjalal Intl Airport (DAC)">Hazrat Shahjalal Intl Airport (DAC)</option>
                    <option value="Gulshan Diplomatic Zone, Dhaka">Gulshan Diplomatic Zone, Dhaka</option>
                    <option value="Banani Central Hub">Banani Central Hub</option>
                    <option value="Sylhet Osmani Airport (ZYL)">Sylhet Osmani Airport (ZYL)</option>
                    <option value="Chittagong Patenga Airport (CGP)">Chittagong Patenga Airport (CGP)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    Drop-off Hub
                  </label>
                  <select
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
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
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Guaranteed Peace of Mind
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                
                {/* Basic CDW */}
                <div
                  onClick={() => setProtectionPlan('Basic CDW')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    protectionPlan === 'Basic CDW'
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-600/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">Basic CDW</span>
                    <span className="text-xs font-semibold text-slate-400">$0</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">Standard $1,000 excess deductible. Base coverage.</p>
                </div>

                {/* Comprehensive Plus */}
                <div
                  onClick={() => setProtectionPlan('Comprehensive Plus')}
                  className={`p-3.5 rounded-xl border cursor-pointer relative transition-all ${
                    protectionPlan === 'Comprehensive Plus'
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-600/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="absolute -top-2 right-2 bg-gradient-to-r from-indigo-500 to-cyan-400 text-slate-950 font-extrabold text-[9px] uppercase px-1.5 py-0.5 rounded shadow">
                    Most Popular
                  </div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">Comprehensive Plus</span>
                    <span className="text-xs font-semibold text-indigo-300">+$18/day</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">Zero Excess, Glass & Tire Cover, 24/7 Roadside Assist.</p>
                </div>

                {/* VIP Full Shield */}
                <div
                  onClick={() => setProtectionPlan('VIP Full Shield')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    protectionPlan === 'VIP Full Shield'
                      ? 'bg-indigo-600/15 border-indigo-500 shadow-md shadow-indigo-600/10'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-white">VIP Full Shield</span>
                    <span className="text-xs font-semibold text-cyan-300">+$30/day</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">Zero Deposit hold, Zero Excess, Free Replacement Car dispatch.</p>
                </div>

              </div>
            </div>

            {/* Customer Details Form */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Primary Driver Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Ahmed"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tanvir@enterprise.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1712 345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-xs font-medium text-slate-300">Special Requirements & Remarks (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Airport flight number DAC-204, child seat needed, corporate billing"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                />
              </div>
            </div>

            {/* Price Summary & Submit Bar */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-xs text-slate-400 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <span>Base Rate: ${vehicle.dailyRate} × {calculatedDays}d = <strong className="text-white">${baseTotal}</strong></span>
                  {protectionTotal > 0 && (
                    <span>Protection: +<strong className="text-indigo-300">${protectionTotal}</strong></span>
                  )}
                </div>
                <div className="text-base font-extrabold text-white flex items-center gap-1.5">
                  <span>Total Amount:</span>
                  <span className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">${grandTotal}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-grow sm:flex-grow-0 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? (
                    <span>Confirming Reservation...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                      <span>Confirm & Reserve Vehicle</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
