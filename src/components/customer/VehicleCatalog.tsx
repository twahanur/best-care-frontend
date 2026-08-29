'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Vehicle } from '@/types';
import { Users, Fuel, Settings2, Briefcase, Star, Sparkles, Check, ArrowRight, Shield, Zap, Info } from 'lucide-react';

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
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [minSeats, setMinSeats] = useState<number>(1);
  const [selectedVehicleForSpecs, setSelectedVehicleForSpecs] = useState<Vehicle | null>(null);

  // Filter vehicles locally
  const filteredVehicles = vehicles.filter((v) => {
    if (selectedCategory !== 'All' && v.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (v.dailyRate > maxPrice) {
      return false;
    }
    if (v.seats < minSeats) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.terrainCapability.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const categories = [
    { id: 'All', label: 'All Fleet' },
    { id: 'SUV', label: '4x4 & SUVs' },
    { id: 'Luxury', label: 'Executive Luxury' },
    { id: 'Electric', label: 'Tesla / EV' },
    { id: 'Sedan', label: 'Premium Sedans' },
    { id: 'Van', label: 'Passenger Vans' },
    { id: 'Sports', label: 'Sports & Open Top' },
  ];

  return (
    <section id="fleet" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Curated Fleet Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Explore Vehicles by Category
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Fully inspected, sanitized, and insured vehicles ready for immediate dispatch across all major hubs.
          </p>
        </div>

        {/* Search Filter Box */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search make, model, terrain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Category Pills & Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory.toLowerCase() === cat.id.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Price Slider & Min Seats */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
          <div className="flex items-center gap-3">
            <span>Max Price: <strong className="text-indigo-400 font-bold">${maxPrice}/day</strong></span>
            <input
              type="range"
              min="50"
              max="200"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span>Min Seats:</span>
            <select
              value={minSeats}
              onChange={(e) => setMinSeats(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              <option value="1">Any</option>
              <option value="4">4+ Seats</option>
              <option value="5">5+ Seats</option>
              <option value="7">7+ Seats</option>
              <option value="11">11+ Seats</option>
            </select>
          </div>
        </div>

      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-base font-medium">No vehicles found matching your specific filter criteria.</p>
          <button
            onClick={() => {
              onCategoryChange('All');
              setSearchQuery('');
              setMaxPrice(200);
              setMinSeats(1);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col border border-slate-800 bg-slate-900/40 relative group"
            >
              {/* Image Container */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-bold text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  {vehicle.category}
                </div>

                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  {vehicle.available ? (
                    <span className="bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                      Available
                    </span>
                  ) : (
                    <span className="bg-amber-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                      Reserved
                    </span>
                  )}
                </div>

                {/* Rating Overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 text-xs font-semibold text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{vehicle.rating}</span>
                  <span className="text-[10px] text-slate-400">({vehicle.reviewsCount})</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-white font-['Plus_Jakarta_Sans'] line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {vehicle.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {vehicle.terrainCapability}
                  </p>
                </div>

                {/* Key Specs Icons */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{vehicle.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Settings2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{vehicle.transmission}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{vehicle.fuelType}</span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Daily Rate</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-extrabold text-white">${vehicle.dailyRate}</span>
                      <span className="text-xs text-slate-400">/day</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedVehicleForSpecs(vehicle)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                      title="Quick Specs"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectVehicleForBooking(vehicle)}
                      disabled={!vehicle.available}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all ${
                        vehicle.available
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Specs Modal */}
      {selectedVehicleForSpecs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel bg-slate-900 p-6 rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{selectedVehicleForSpecs.category}</span>
                <h3 className="text-xl font-bold text-white">{selectedVehicleForSpecs.name}</h3>
              </div>
              <button
                onClick={() => setSelectedVehicleForSpecs(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div><span className="text-slate-400 text-xs">Engine:</span> <p className="font-semibold text-white">{selectedVehicleForSpecs.specs.engine}</p></div>
                <div><span className="text-slate-400 text-xs">Horsepower:</span> <p className="font-semibold text-white">{selectedVehicleForSpecs.specs.horsepower} HP</p></div>
                <div><span className="text-slate-400 text-xs">0-100 km/h:</span> <p className="font-semibold text-white">{selectedVehicleForSpecs.specs.acceleration0to100}</p></div>
                <div><span className="text-slate-400 text-xs">Top Speed:</span> <p className="font-semibold text-white">{selectedVehicleForSpecs.specs.topSpeed}</p></div>
                <div><span className="text-slate-400 text-xs">Fuel Economy:</span> <p className="font-semibold text-white">{selectedVehicleForSpecs.fuelEfficiency}</p></div>
                <div><span className="text-slate-400 text-xs">Luggage Space:</span> <p className="font-semibold text-white">{selectedVehicleForSpecs.luggageCapacity} Large Bags</p></div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Included Amenities & Highlights:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVehicleForSpecs.features.map((feat, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                      <Check className="w-3 h-3 text-emerald-400" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">Total Rate</span>
                  <p className="text-xl font-extrabold text-white">${selectedVehicleForSpecs.dailyRate} <span className="text-xs text-slate-400">/ day</span></p>
                </div>

                <button
                  onClick={() => {
                    const v = selectedVehicleForSpecs;
                    setSelectedVehicleForSpecs(null);
                    onSelectVehicleForBooking(v);
                  }}
                  disabled={!selectedVehicleForSpecs.available}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30"
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
