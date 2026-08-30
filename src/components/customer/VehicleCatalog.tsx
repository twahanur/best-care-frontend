'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Vehicle } from '@/types';
import { Heart, Info, Users, Fuel, Gauge, Sparkles, ChevronDown } from 'lucide-react';

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  onSelectVehicleForBooking: (vehicle: Vehicle) => void;
  onViewVehicleDetails?: (vehicle: Vehicle) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function VehicleCatalog({
  vehicles,
  onSelectVehicleForBooking,
  onViewVehicleDetails,
  selectedCategory,
  onCategoryChange,
}: VehicleCatalogProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState<number>(8);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const categories = [
    { id: 'Popular', label: 'Popular' },
    { id: 'Large Car', label: 'Large Car' },
    { id: 'Small Car', label: 'Small Car' },
    { id: 'Exclusive Car', label: 'Exclusive Car' },
  ];

  const activeTabId = selectedCategory === 'All' ? 'Popular' : selectedCategory;

  // Filter vehicles based on active tab / category
  const filteredVehicles = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return [];

    if (activeTabId === 'Popular' || activeTabId === 'All') {
      return vehicles;
    }

    return vehicles.filter((v) => {
      const cat = (v.category || '').toLowerCase();
      const seats = v.seats || 0;

      if (activeTabId === 'Large Car') {
        return cat.includes('suv') || cat.includes('van') || seats >= 6;
      }
      if (activeTabId === 'Small Car') {
        return cat.includes('sedan') || cat.includes('compact') || cat.includes('hatchback') || (seats <= 5 && !cat.includes('luxury') && !cat.includes('sports'));
      }
      if (activeTabId === 'Exclusive Car') {
        return cat.includes('luxury') || cat.includes('electric') || cat.includes('sports');
      }

      return cat.includes(activeTabId.toLowerCase());
    });
  }, [vehicles, activeTabId]);

  const displayedVehicles = filteredVehicles.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVehicles.length;

  const handleShowMore = () => {
    if (hasMore) {
      setVisibleCount((prev) => prev + 4);
    } else {
      // If all are shown, reset or load all
      setVisibleCount(8);
    }
  };

  return (
    <section id="fleet" className="py-20 md:py-28 bg-white border-t border-[#F3F4F6]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Rental Fleet
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#111827] font-['Plus_Jakarta_Sans'] tracking-tight">
            Most popular car rental deals
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280]">
            Explore our diverse collection of premium SUVs, luxury sedans, electric vehicles, and executive passenger vans.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-8 md:gap-14 border-b border-[#E5E7EB] mb-12 overflow-x-auto pb-4">
          {categories.map((cat) => {
            const isActive = activeTabId.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => {
                  onCategoryChange(cat.id === 'Popular' ? 'All' : cat.id);
                  setVisibleCount(8);
                }}
                className={`text-sm md:text-base font-semibold pb-3 relative transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#111827] font-bold scale-105'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {cat.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#111827] rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredVehicles.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200/80 max-w-md mx-auto my-8 space-y-3">
            <p className="text-slate-700 font-bold text-base">No vehicles found in this category</p>
            <p className="text-slate-500 text-xs">Try selecting another category or view all vehicles.</p>
            <button
              type="button"
              onClick={() => onCategoryChange('All')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
            >
              View All Fleet
            </button>
          </div>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedVehicles.map((vehicle) => {
            const isFav = !!favorites[vehicle.id];
            const carImg =
              (vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : null) ||
              vehicle.image ||
              'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={vehicle.id}
                className="bg-[#F3F4F6]/80 hover:bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#E5E7EB] hover:border-slate-300 relative group hover:shadow-xl transition-all duration-300"
              >
                {/* Top Row: Title & Heart Icon */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {vehicle.category}
                    </span>
                    <h3
                      onClick={() => onViewVehicleDetails?.(vehicle)}
                      className="font-bold text-sm sm:text-base text-[#111827] font-['Plus_Jakarta_Sans'] truncate hover:text-blue-600 transition-colors cursor-pointer"
                      title={vehicle.name}
                    >
                      {vehicle.name}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(vehicle.id, e)}
                    className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-[#6B7280] hover:text-rose-500 shadow-sm transition-colors shrink-0 cursor-pointer"
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Car Showcase Image */}
                <div
                  onClick={() => onViewVehicleDetails?.(vehicle)}
                  className="relative h-40 w-full my-3 rounded-xl overflow-hidden bg-slate-200/50 flex items-center justify-center cursor-pointer"
                >
                  <Image
                    src={carImg}
                    alt={vehicle.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-semibold text-white flex items-center gap-1">
                    <span>⭐ {vehicle.ratingAverage || vehicle.rating || 4.8}</span>
                  </div>
                </div>

                {/* Quick Specs Pill Row */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 py-1 border-b border-slate-200/70 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{vehicle.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-slate-400" />
                    <span>{vehicle.fuelType}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-slate-400" />
                    <span>{vehicle.transmission}</span>
                  </div>
                </div>

                {/* Bottom Row: Price & Rent Now Button */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#111827] font-extrabold">
                    ${vehicle.dailyRate}.00 <span className="text-[#6B7280] font-normal text-[11px]">/ day</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onViewVehicleDetails?.(vehicle)}
                      className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#4B5563] text-xs transition-colors cursor-pointer"
                      title="View Full Specifications & Reviews"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectVehicleForBooking(vehicle)}
                      className="px-4 py-2 rounded-xl bg-[#111827] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
                    >
                      Rent Now
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Load More Button & Accurate Counter Footer */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <div className="text-xs font-semibold text-[#6B7280]">
            Showing <strong className="text-slate-900">{displayedVehicles.length}</strong> of <strong className="text-slate-900">{filteredVehicles.length}</strong> available fleet vehicles
          </div>

          <div className="flex items-center gap-3">
            {hasMore ? (
              <button
                type="button"
                onClick={handleShowMore}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Show More Cars</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                ✓ All {filteredVehicles.length} Vehicles Loaded
              </span>
            )}
          </div>
        </div>

      </div>

    </section>
  );
}
