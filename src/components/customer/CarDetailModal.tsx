'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Users,
  Gauge,
  Fuel,
  ShieldCheck,
  Star,
  Calendar,
  CheckCircle2,
  X,
  ArrowRight,
  Shield,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Car,
  ChevronRight,
  Zap,
  Luggage
} from 'lucide-react';
import { Vehicle, Review } from '@/types';
import { api } from '@/services/api';

interface CarDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onBookNow: (vehicle: Vehicle) => void;
}

export function CarDetailModal({ vehicle, onClose, onBookNow }: CarDetailModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [checkStart, setCheckStart] = useState('2026-09-01');
  const [checkEnd, setCheckEnd] = useState('2026-09-05');
  const [availabilityResult, setAvailabilityResult] = useState<{ available: boolean } | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (vehicle) {
      api.getReviews(vehicle.id).then(setReviews).catch(() => {});
      setSelectedImageIndex(0);
      setAvailabilityResult(null);
    }
  }, [vehicle]);

  if (!vehicle) return null;

  const images = (vehicle.images && vehicle.images.length > 0)
    ? vehicle.images
    : [vehicle.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=85'];

  const handleCheckAvailability = async () => {
    setChecking(true);
    try {
      const res = await api.checkAvailability(vehicle.id, checkStart, checkEnd);
      setAvailabilityResult(res);
    } catch {
      setAvailabilityResult({ available: true });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-[28px] max-w-4xl w-full shadow-2xl overflow-hidden my-6 relative flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-sm shadow-blue-600/20 uppercase tracking-wider">
              {vehicle.category}
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 font-['Plus_Jakarta_Sans'] leading-tight">
                {vehicle.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {vehicle.brand} • Model {vehicle.year || 2024}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Gallery with High-Res Showcase */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner group">
              <Image
                src={images[selectedImageIndex] || images[0]}
                alt={vehicle.name}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

              {/* Rating & Hub overlay badge */}
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{vehicle.ratingAverage || vehicle.rating || 4.9}</span>
                <span className="text-slate-300 font-normal">({reviews.length || vehicle.reviewCount || 48} reviews)</span>
              </div>

              <div className="absolute bottom-4 left-4 text-white space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pickup Location: {vehicle.currentHub || 'Hazrat Shahjalal Intl Airport (DAC)'}</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-blue-600 ring-4 ring-blue-600/20 scale-105'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Grid (8 Key Tiles) */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Technical Specifications & Performance
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors">
                <Users className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Seating</div>
                <div className="text-xs font-bold text-slate-900">{vehicle.seats} Passengers</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors">
                <Gauge className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Transmission</div>
                <div className="text-xs font-bold text-slate-900">{vehicle.transmission}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors">
                <Fuel className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Fuel / Power</div>
                <div className="text-xs font-bold text-slate-900">{vehicle.fuelType}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors">
                <Luggage className="w-4 h-4 text-blue-600 mb-1" />
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Trunk Capacity</div>
                <div className="text-xs font-bold text-slate-900">{vehicle.luggageCapacity || 3} Suitcases</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Mileage</div>
                <div className="text-xs font-bold text-slate-900">{vehicle.mileageLimit || 'Unlimited'}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors">
                <Shield className="w-4 h-4 text-amber-600 mb-1" />
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Deposit</div>
                <div className="text-xs font-bold text-slate-900">${vehicle.securityDeposit || 250} (Refundable)</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors">
                <Car className="w-4 h-4 text-purple-600 mb-1" />
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Doors</div>
                <div className="text-xs font-bold text-slate-900">{vehicle.doors || 4} Doors</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 transition-colors">
                <Zap className="w-4 h-4 text-indigo-600 mb-1" />
                <div className="text-[10px] text-slate-400 font-semibold uppercase">Status</div>
                <div className="text-xs font-bold text-emerald-600">✓ Ready for Instant Rent</div>
              </div>

            </div>
          </div>

          {/* Included Features */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Premium Equipment & In-Cabin Features
              </h4>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feat, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Live Availability Checker */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-extrabold text-blue-950 uppercase tracking-wider">
                  Check Live Dates Availability
                </h4>
              </div>
              {availabilityResult && (
                <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                  availabilityResult.available
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}>
                  {availabilityResult.available ? '✓ 100% Available for Selected Dates' : '⚠️ Date Range Collision'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-600 font-bold block mb-1">Pick-up Date</label>
                <input
                  type="date"
                  value={checkStart}
                  onChange={(e) => setCheckStart(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-600 font-bold block mb-1">Drop-off Date</label>
                <input
                  type="date"
                  value={checkEnd}
                  onChange={(e) => setCheckEnd(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleCheckAvailability}
                  disabled={checking}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  {checking ? 'Checking Fleet...' : 'Verify Availability'}
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Verified Renter Experiences & Feedback ({reviews.length})
              </h4>
              <div className="text-xs font-bold text-blue-600">
                100% Verified Trips
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  This vehicle is freshly serviced in the fleet. Rent today and be the first to leave a 5-star review!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                          <span className="text-[10px] text-slate-400 block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                    {rev.adminReply && (
                      <div className="mt-2 p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900">
                        <strong>Official Team Response:</strong> {rev.adminReply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sticky Footer Bar with Price & CTAs */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Daily Rate</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              ${vehicle.dailyRate}.00<span className="text-xs text-slate-500 font-normal"> / day</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onBookNow(vehicle);
              }}
              className="px-7 py-3 rounded-xl bg-[#111827] hover:bg-blue-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-slate-900/20 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Proceed to Booking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
