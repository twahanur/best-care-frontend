'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Vehicle } from '@/types';
import { Users, Fuel, Settings2, Star, Heart, ArrowRight, Check, Info, SlidersHorizontal, Sparkles } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selectedVehicleForSpecs, setSelectedVehicleForSpecs] = useState<Vehicle | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    if (selectedCategory !== 'All' && v.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const categories = [
    { id: 'All', label: 'All Deals' },
    { id: 'Sedan', label: 'Sedan' },
    { id: 'SUV', label: 'SUV' },
    { id: 'Electric', label: 'Electric' },
    { id: 'Luxury', label: 'Luxury' },
  ];

  return (
    <section id="fleet" className="py-16 md:py-24 bg-[#F8F9FB] border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Popular Deals
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
            Most Popular Car Rental Deals
          </h2>
          <p className="text-sm sm:text-base text-slate-500">
            Explore our top-rated vehicles selected for superior comfort, performance, and safety.
          </p>
        </div>

        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search car make or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-400 shadow-sm"
            />
          </div>

        </div>

        {/* 8-Card Grid (4 cols x 2 rows) */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">No vehicles found matching the selected filter.</p>
            <button
              onClick={() => {
                onCategoryChange('All');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => {
              const isFav = !!favorites[vehicle.id];
              return (
                <div
                  key={vehicle.id}
                  className="figma-card figma-card-hover rounded-2xl p-4 flex flex-col justify-between border border-slate-200/70 bg-white relative group"
                >
                  
                  {/* Top Header: Title & Wishlist Button */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {vehicle.category}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 font-['Plus_Jakarta_Sans'] mt-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {vehicle.name}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(vehicle.id, e)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isFav
                            ? 'bg-rose-50 border-rose-200 text-rose-500'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-slate-800">{vehicle.rating}</span>
                      <span className="text-slate-400 text-[11px]">({vehicle.reviewsCount} reviews)</span>
                    </div>

                    {/* Image Showcase */}
                    <div className="relative h-40 w-full my-3 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center border border-slate-100">
                      <Image
                        src={vehicle.image}
                        alt={vehicle.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Specifications Row */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{vehicle.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Settings2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{vehicle.fuelType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Price & Rent Action */}
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400">Price</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-extrabold text-slate-900">${vehicle.dailyRate}</span>
                        <span className="text-xs text-slate-500">/ day</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedVehicleForSpecs(vehicle)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                        title="View Specifications"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onSelectVehicleForBooking(vehicle)}
                        disabled={!vehicle.available}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                          vehicle.available
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:scale-[1.02]'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <span>Rent Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Show All Vehicles CTA Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              onCategoryChange('All');
              setSearchQuery('');
            }}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-sm hover:border-slate-300 transition-all inline-flex items-center gap-2"
          >
            <span>Show all vehicles ({vehicles.length})</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </button>
        </div>

      </div>

      {/* Specifications Detail Modal */}
      {selectedVehicleForSpecs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedVehicleForSpecs.category}</span>
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
                <div><span className="text-slate-500 text-xs">Engine:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.specs.engine}</p></div>
                <div><span className="text-slate-500 text-xs">Horsepower:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.specs.horsepower} HP</p></div>
                <div><span className="text-slate-500 text-xs">0-100 km/h:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.specs.acceleration0to100}</p></div>
                <div><span className="text-slate-500 text-xs">Top Speed:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.specs.topSpeed}</p></div>
                <div><span className="text-slate-500 text-xs">Fuel Efficiency:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.fuelEfficiency}</p></div>
                <div><span className="text-slate-500 text-xs">Luggage:</span> <p className="font-bold text-slate-900">{selectedVehicleForSpecs.luggageCapacity} Large Bags</p></div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">Features & Amenities:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVehicleForSpecs.features.map((feat, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-lg font-medium">
                      <Check className="w-3 h-3 text-blue-600" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-500">Rate</span>
                  <p className="text-xl font-extrabold text-slate-900">${selectedVehicleForSpecs.dailyRate} <span className="text-xs text-slate-500 font-normal">/ day</span></p>
                </div>

                <button
                  onClick={() => {
                    const v = selectedVehicleForSpecs;
                    setSelectedVehicleForSpecs(null);
                    onSelectVehicleForBooking(v);
                  }}
                  disabled={!selectedVehicleForSpecs.available}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
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

