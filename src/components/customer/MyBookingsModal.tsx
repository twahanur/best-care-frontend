'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  FileText,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
  Star,
  Download,
  CreditCard,
  Ban,
  Clock
} from 'lucide-react';
import { Booking, User } from '@/types';
import { api } from '@/services/api';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onWriteReview: (booking: Booking) => void;
}

export function MyBookingsModal({ isOpen, onClose, currentUser, onWriteReview }: MyBookingsModalProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);

  const loadUserBookings = React.useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await api.getBookings(undefined, undefined, currentUser.id);
      setBookings(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (isOpen) {
      loadUserBookings();
    }
  }, [isOpen, loadUserBookings]);

  if (!isOpen) return null;

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? You will receive a 100% full refund.')) return;
    try {
      const updated = await api.cancelBooking(bookingId, cancelReason || 'Customer requested free cancellation.');
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
      setCancellingId(null);
      alert(`Booking ${updated.bookingCode} successfully cancelled. $${updated.refundAmount} refunded.`);
    } catch (err: any) {
      alert(`Cancellation error: ${err.message || 'Failed'}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Active Trip</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Confirmed</span>;
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Cancelled & Refunded</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                My Trips & Booking History
              </h3>
              <p className="text-xs text-slate-500">Manage reservations, digital vouchers & post-trip reviews</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading your reservations...</div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">No Reservations Found</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                You have not booked any rental cars yet. Browse our verified fleet to plan your next journey!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{b.bookingCode}</span>
                        {getStatusBadge(b.status)}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Booked on {new Date(b.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase font-semibold">Total Paid</div>
                      <div className="text-base font-extrabold text-blue-600">${b.totalAmount}</div>
                    </div>
                  </div>

                  {/* Vehicle & Trip Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Vehicle & Plan</span>
                      <div className="font-bold text-slate-900">{b.vehicleName}</div>
                      <div className="text-blue-600 font-medium">{b.protectionPlan}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Duration & Dates</span>
                      <div className="font-bold text-slate-900">{b.totalDays} Days</div>
                      <div className="text-slate-500">{new Date(b.pickupDate).toLocaleDateString()} ➔ {new Date(b.dropoffDate).toLocaleDateString()}</div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">Pick-up Station</span>
                      <div className="font-bold text-slate-900 truncate max-w-[200px]">{b.pickupLocation}</div>
                      <div className="text-slate-500 truncate max-w-[200px]">Return: {b.dropoffLocation}</div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500">
                      Payment Status: <strong className="text-slate-800">{b.paymentStatus}</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* View Pass */}
                      <button
                        onClick={() => setSelectedBookingForPass(b)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
                      >
                        View Voucher Pass
                      </button>

                      {/* Write Review for Completed trip */}
                      {b.status === 'Completed' && (
                        <button
                          onClick={() => {
                            onClose();
                            onWriteReview(b);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800 flex items-center gap-1.5 transition-colors"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Write Review</span>
                        </button>
                      )}

                      {/* Cancel Booking if Pending or Confirmed */}
                      {(b.status === 'Pending' || b.status === 'Confirmed') && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-600 flex items-center gap-1.5 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel & Full Refund</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Digital Voucher Modal Drawer */}
        {selectedBookingForPass && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-sm text-slate-900">Vehicle Check-in Voucher</h4>
                </div>
                <button onClick={() => setSelectedBookingForPass(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Digital Reservation Code</div>
                <div className="font-mono text-xl font-extrabold text-blue-600 tracking-wider">
                  {selectedBookingForPass.bookingCode}
                </div>
                <div className="text-xs font-bold text-slate-800">{selectedBookingForPass.vehicleName}</div>
                <div className="text-[11px] text-slate-500">
                  {selectedBookingForPass.totalDays} Days ({new Date(selectedBookingForPass.pickupDate).toLocaleDateString()})
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Driver Name:</span>
                  <span className="font-bold text-slate-900">{selectedBookingForPass.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pick-up Hub:</span>
                  <span className="font-semibold text-slate-900">{selectedBookingForPass.pickupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Protection Tier:</span>
                  <span className="font-bold text-blue-600">{selectedBookingForPass.protectionPlan}</span>
                </div>
                <div className="flex justify-between font-bold pt-1 border-t border-slate-100">
                  <span>Amount Paid:</span>
                  <span className="text-emerald-600">${selectedBookingForPass.totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  alert('Voucher PDF generated. Present this QR / Booking reference at pickup terminal.');
                  setSelectedBookingForPass(null);
                }}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Download / Print Pass
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
