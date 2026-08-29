'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Car,
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
  Sparkles
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

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.image];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
              {vehicle.category}
            </span>
            <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
              {vehicle.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Gallery Showcase */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={images[selectedImageIndex] || vehicle.image}
                alt={vehicle.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{vehicle.ratingAverage || vehicle.rating || 5.0} ({reviews.length || vehicle.reviewCount || 0} reviews)</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200 opacity-70'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Capacity</div>
              <div className="text-xs font-bold text-slate-800">{vehicle.seats} Passengers</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <Gauge className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Transmission</div>
              <div className="text-xs font-bold text-slate-800">{vehicle.transmission}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <Fuel className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Fuel / Power</div>
              <div className="text-xs font-bold text-slate-800">{vehicle.fuelType}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Mileage Policy</div>
              <div className="text-xs font-bold text-slate-800">{vehicle.mileageLimit || 'Unlimited'}</div>
            </div>
          </div>

          {/* Features Tag Pills */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Included Features</h4>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Live Date Collision & Availability Checker */}
          <div className="p-4.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">Check Live Dates Availability</h4>
              </div>
              {availabilityResult && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  availabilityResult.available
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}>
                  {availabilityResult.available ? '✓ 100% Available' : '⚠️ Date Range Collision'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Start Date</label>
                <input
                  type="date"
                  value={checkStart}
                  onChange={(e) => setCheckStart(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">Return Date</label>
                <input
                  type="date"
                  value={checkEnd}
                  onChange={(e) => setCheckEnd(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCheckAvailability}
                  disabled={checking}
                  className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  {checking ? 'Checking...' : 'Verify Dates'}
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Driver Reviews ({reviews.length})
            </h4>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No reviews yet for this vehicle. Be the first to rent and review!</p>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <span className="font-bold text-xs text-slate-900">{rev.userName}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                    {rev.adminReply && (
                      <div className="mt-1.5 p-2 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] text-blue-900">
                        <strong>Official Reply:</strong> {rev.adminReply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="p-4.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Standard Daily Rate</div>
            <div className="text-2xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              ${vehicle.dailyRate}<span className="text-xs text-slate-400 font-normal"> / day</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(vehicle);
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Rent This Car</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
