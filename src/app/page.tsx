'use client';

import React, { useState, useEffect } from 'react';
import { Vehicle } from '@/types';
import { api } from '@/services/api';
import { HeroSection } from '@/components/customer/HeroSection';
import { VehicleCatalog } from '@/components/customer/VehicleCatalog';
import { WhyChooseUs } from '@/components/customer/WhyChooseUs';
import { Testimonials } from '@/components/customer/Testimonials';
import { FaqSection } from '@/components/customer/FaqSection';
import { BookingModal } from '@/components/customer/BookingModal';

export default function CustomerHomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);

  useEffect(() => {
    async function loadVehicles() {
      const data = await api.getVehicles();
      setVehicles(data);
    }
    loadVehicles();
  }, []);

  const handleHeroSearch = (filters: { pickupLocation: string; returnLocation: string; category: string; pickupDate: string; returnDate: string }) => {
    if (filters.category && filters.category !== 'All') {
      setSelectedCategory(filters.category);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero with Dynamic Search Bar */}
      <HeroSection onSearch={handleHeroSearch} />

      {/* 2. Interactive Vehicle Fleet Catalog */}
      <VehicleCatalog
        vehicles={vehicles}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSelectVehicleForBooking={(v) => setSelectedVehicleForBooking(v)}
      />

      {/* 3. Why Choose Us / Guarantees */}
      <WhyChooseUs />

      {/* 4. Customer Testimonials */}
      <Testimonials />

      {/* 5. FAQs & Policies */}
      <FaqSection />

      {/* 6. Interactive Booking Flow Modal */}
      <BookingModal
        vehicle={selectedVehicleForBooking}
        onClose={() => setSelectedVehicleForBooking(null)}
      />
    </div>
  );
}
