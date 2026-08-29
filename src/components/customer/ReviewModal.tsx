'use client';

import React, { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare } from 'lucide-react';
import { Booking, User } from '@/types';
import { api } from '@/services/api';

interface ReviewModalProps {
  booking: Booking | null;
  currentUser: User | null;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export function ReviewModal({ booking, currentUser, onClose, onReviewSubmitted }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert('Please enter your review feedback comments.');
      return;
    }

    setLoading(true);
    try {
      await api.createReview({
        bookingId: booking.id,
        userId: currentUser?.id || booking.userId || 'usr_cust_1',
        userName: currentUser?.name || booking.customerName || 'Verified Driver',
        carId: booking.carId || booking.vehicleId || 'car_jaguar_xe',
        carName: booking.vehicleName,
        rating,
        comment,
      });

      alert('Thank you! Your verified trip review and rating have been published.');
      onReviewSubmitted();
      onClose();
    } catch (err: any) {
      alert(`Review submission error: ${err.message || 'Failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
                Rate Your Trip Experience
              </h3>
              <p className="text-[11px] text-slate-500">{booking.vehicleName}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Selector */}
          <div className="text-center space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Overall Rating</label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-amber-600">
              {rating === 5 ? '5.0 - Outstanding!' : rating === 4 ? '4.0 - Very Good' : rating === 3 ? '3.0 - Average' : 'Needs Improvement'}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Your Experience Comments *</label>
            <textarea
              rows={3}
              required
              placeholder="How was the vehicle condition, delivery speed, and driving comfort?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 placeholder-slate-400"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
