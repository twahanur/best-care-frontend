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

  useEffect(() => {
    // Load default or cached profile
    api.getProfile().then(setCurrentUser).catch(() => {});
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
