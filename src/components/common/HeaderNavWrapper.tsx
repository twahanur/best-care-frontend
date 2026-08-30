'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { AuthModal } from '../auth/AuthModal';
import { MyBookingsModal } from '../customer/MyBookingsModal';
import { ReviewModal } from '../customer/ReviewModal';
import { User, Booking } from '@/types';
import { api } from '@/services/api';

export function HeaderNavWrapper() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [myTripsOpen, setMyTripsOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);

  const syncUserSession = () => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('best_car_user');
      if (!cached) {
        setCurrentUser(null);
        return;
      }
      try {
        const parsed = JSON.parse(cached);
        setCurrentUser(parsed);
        // Verify with API in background
        api.getProfile(parsed.id)
          .then((profile) => {
            if (profile) {
              setCurrentUser(profile);
            }
          })
          .catch(() => {});
      } catch {
        setCurrentUser(null);
      }
    }
  };

  useEffect(() => {
    syncUserSession();

    const handleAuthChange = () => {
      syncUserSession();
    };

    window.addEventListener('best_car_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('best_car_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  return (
    <>
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenMyTrips={() => setMyTripsOpen(true)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChange={(u) => {
          setCurrentUser(u);
        }}
      />

      <MyBookingsModal
        isOpen={myTripsOpen}
        onClose={() => setMyTripsOpen(false)}
        currentUser={currentUser}
        onWriteReview={(b) => setReviewBooking(b)}
      />

      <ReviewModal
        booking={reviewBooking}
        currentUser={currentUser}
        onClose={() => setReviewBooking(null)}
        onReviewSubmitted={() => {
          alert('Review updated successfully.');
        }}
      />
    </>
  );
}
