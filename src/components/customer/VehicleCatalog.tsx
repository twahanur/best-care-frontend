'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Vehicle } from '@/types';
import { Heart, Info, ArrowRight } from 'lucide-react';

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  onSelectVehicleForBooking: (vehicle: Vehicle) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function VehicleCatalog({
  vehicles,
  onSelectVehicleForBooking,
  selectedCategory,
  onCategoryChange,
}: VehicleCatalogProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedVehicleForSpecs, setSelectedVehicleForSpecs] = useState<Vehicle | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'Popular', label: 'Popular' },
    { id: 'Large Car', label: 'Large Car' },
    { id: 'Small Car', label: 'Small Car' },
    { id: 'Exclusive Car', label: 'Exclusive Car' },
  ];

  // Map categories or show list
  const activeTabId = selectedCategory === 'All' ? 'Popular' : selectedCategory;

  const displayVehicles = vehicles.length > 0 ? vehicles.slice(0, 8) : [
    {
      id: '1',
      name: 'All New Rush',
      brand: 'Toyota',
      category: 'SUV',
      dailyRate: 72,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      available: true,
      features: ['GPS', 'Air Conditioning', 'Bluetooth'],
      rating: 4.8,
      reviewsCount: 120
    }
  ];

  return (
    <section id="fleet" className="py-20 md:py-28 bg-white border-t border-[#F3F4F6]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Exact Figma Copy) */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#111827] font-['Plus_Jakarta_Sans'] tracking-tight">
            Most popular car rental deals
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280]">
            A high-performing web-based car rental system for any rent-a-car company and website
          </p>
        </div>

        {/* Category Tabs matching Figma Wireframe */}
        <div className="flex items-center justify-center gap-8 md:gap-16 border-b border-[#E5E7EB] mb-12 overflow-x-auto pb-4">
          {categories.map((cat) => {
            const isActive = activeTabId.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id === 'Popular' ? 'All' : cat.id)}
                className={`text-sm md:text-base font-semibold pb-3 relative transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-[#111827] font-bold'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {cat.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#111827] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* 8-Card Grid (4 cols x 2 rows) matching Figma layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(displayVehicles.length >= 8 ? displayVehicles : Array.from({ length: 8 }).map((_, i) => ({
            ...displayVehicles[i % displayVehicles.length],
            id: `v-${i}`,
            name: i % 2 === 0 ? 'All New Rush' : displayVehicles[i % displayVehicles.length]?.name || 'All New Rush'
          }))).map((vehicle, idx) => {
            const isFav = !!favorites[vehicle.id];
            return (
              <div
                key={`${vehicle.id}-${idx}`}
                className="bg-[#D1D5DB]/40 rounded-2xl p-5 flex flex-col justify-between border border-[#E5E7EB] relative group hover:shadow-md transition-all duration-200"
              >
                {/* Top Row: Title & Heart Icon */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm sm:text-base text-[#111827] font-['Plus_Jakarta_Sans'] truncate">
                    {vehicle.name || 'All New Rush'}
                  </h3>

                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(vehicle.id, e)}
                    className="p-1 rounded-lg text-[#6B7280] hover:text-rose-500 transition-colors shrink-0"
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Car Showcase Image (Centered in subtle card) */}
                <div className="relative h-36 w-full my-3 rounded-xl overflow-hidden flex items-center justify-center">
                  <Image
                    src={vehicle.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                    alt={vehicle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg"
                  />
                </div>

                {/* Bottom Row: Price & Rent Now Button */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-[#111827] font-bold">
                    ${vehicle.dailyRate || 72}.00 <span className="text-[#6B7280] font-normal">/ day</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedVehicleForSpecs(vehicle as any)}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#4B5563] text-xs transition-colors"
                      title="View Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectVehicleForBooking(vehicle as any)}
                      className="px-3.5 py-1.5 rounded-lg bg-white border border-[#D1D5DB] hover:bg-[#111827] hover:text-white hover:border-[#111827] text-[#111827] text-xs font-bold transition-all shadow-sm"
                    >
                      Rent Now
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Show More Car Button & Counter Footer */}
        <div className="mt-12 relative flex items-center justify-center">
          <button
            onClick={() => onCategoryChange('All')}
            className="px-6 py-2.5 rounded-xl bg-white hover:bg-[#111827] hover:text-white border border-[#E5E7EB] text-[#111827] font-bold text-xs shadow-sm transition-all"
          >
            Show more car
          </button>

          <div className="absolute right-0 text-xs font-medium text-[#6B7280] hidden sm:block">
            120 Car
          </div>
        </div>

      </div>

      {/* Specifications Modal */}
      {selectedVehicleForSpecs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">{selectedVehicleForSpecs.category}</span>
                <h3 className="text-xl font-bold text-slate-900">{selectedVehicleForSpecs.name}</h3>
              </div>
              <button
                onClick={() => setSelectedVehicleForSpecs(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div><span className="text-slate-500 text-xs">Category:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.category}</p></div>
                <div><span className="text-slate-500 text-xs">Seats:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.seats} Seats</p></div>
                <div><span className="text-slate-500 text-xs">Transmission:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.transmission}</p></div>
                <div><span className="text-slate-500 text-xs">Fuel:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.fuelType}</p></div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-500">Rate</span>
                  <p className="text-xl font-extrabold text-slate-900">${selectedVehicleForSpecs.dailyRate}.00 <span className="text-xs text-slate-500 font-normal">/ day</span></p>
                </div>

                <button
                  onClick={() => {
                    const v = selectedVehicleForSpecs;
                    setSelectedVehicleForSpecs(null);
                    onSelectVehicleForBooking(v);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#111827] hover:bg-black text-white font-bold text-xs shadow-md"
                >
                  Proceed to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
