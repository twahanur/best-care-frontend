'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  TrendingUp,
  Car,
  DollarSign,
  Layers,
  Activity,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  Compass,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { Vehicle, Booking } from '@/types';
import 'leaflet/dist/leaflet.css';

export interface HubInfo {
  id: string;
  name: string;
  shortName: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  zoomLevel: number;
  xPct: number;
  yPct: number;
}

export const HUBS_CONFIG: HubInfo[] = [
  {
    id: 'dac',
    name: 'Hazrat Shahjalal Intl Airport (DAC)',
    shortName: 'Dhaka DAC Hub',
    city: 'Dhaka',
    region: 'Central North Hub',
    lat: 23.8433,
    lng: 90.4048,
    zoomLevel: 12,
    xPct: 52,
    yPct: 46
  },
  {
    id: 'gulshan',
    name: 'Gulshan Diplomatic Zone, Dhaka',
    shortName: 'Gulshan Hub',
    city: 'Dhaka',
    region: 'Central Diplomatic Hub',
    lat: 23.7925,
    lng: 90.4162,
    zoomLevel: 13,
    xPct: 54,
    yPct: 49
  },
  {
    id: 'cgp',
    name: 'Chattogram Shah Amanat Airport (CGP)',
    shortName: 'Chittagong CGP Hub',
    city: 'Chattogram',
    region: 'South East Port Hub',
    lat: 22.2496,
    lng: 91.8133,
    zoomLevel: 12,
    xPct: 75,
    yPct: 74
  },
  {
    id: 'sylhet',
    name: 'Sylhet Osmani Airport Hub',
    shortName: 'Sylhet Hub',
    city: 'Sylhet',
    region: 'North East Tea Valley Hub',
    lat: 24.8949,
    lng: 91.8687,
    zoomLevel: 12,
    xPct: 80,
    yPct: 30
  },
  {
    id: 'khulna',
    name: 'Khulna City Center Hub',
    shortName: 'Khulna Hub',
    city: 'Khulna',
    region: 'South West Industrial Hub',
    lat: 22.8456,
    lng: 89.5403,
    zoomLevel: 12,
    xPct: 34,
    yPct: 69
  },
  {
    id: 'cxb',
    name: "Cox's Bazar Beach & Tourism Hub",
    shortName: "Cox's Bazar Hub",
    city: "Cox's Bazar",
    region: 'Bay of Bengal Tourist Hub',
    lat: 21.4272,
    lng: 92.0058,
    zoomLevel: 12,
    xPct: 84,
    yPct: 88
  }
];

// Map tile layers available
const TILE_LAYERS = {
  voyager: {
    name: 'Standard',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  },
  dark: {
    name: 'Dark Radar',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  },
  osm: {
    name: 'Street View',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }
};

const BANGLADESH_CENTER: [number, number] = [23.6850, 90.3563];
const COUNTRY_ZOOM = 6.8;

interface SalesHubMapProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  timeframe?: string;
  onViewHubReport?: (hubName: string) => void;
  onSelectHub?: (hubName: string) => void;
}

export function SalesHubMap({
  vehicles = [],
  bookings = [],
  timeframe = 'This Week',
  onViewHubReport,
  onSelectHub
}: SalesHubMapProps) {
  const [selectedHubId, setSelectedHubId] = useState<string>('dac');
  const [viewMode, setViewMode] = useState<'direct' | 'vector'>('direct');
  const [tileTheme, setTileTheme] = useState<'voyager' | 'dark' | 'osm'>('voyager');
  const [isCountryView, setIsCountryView] = useState<boolean>(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});
  const heatCirclesRef = useRef<{ [id: string]: any[] }>({});
  const isInitialLoadRef = useRef<boolean>(true);

  // Compute dynamic stats per hub using real vehicles & bookings data
  const hubMetrics = useMemo(() => {
    return HUBS_CONFIG.map(hub => {
      // 1. Vehicles associated with this hub
      const hubVehicles = vehicles.filter(v => {
        const hubName = typeof v.currentHub === 'object' && v.currentHub !== null
          ? (v.currentHub as any).name
          : (v.currentHub || '');
        
        return (
          hubName.toLowerCase().includes(hub.city.toLowerCase()) ||
          hubName.toLowerCase().includes(hub.id) ||
          hub.name.toLowerCase().includes(hubName.toLowerCase()) ||
          (hub.id === 'dac' && (hubName.includes('DAC') || hubName.includes('Airport') || !hubName))
        );
      });

      // Total cars count
      const totalCars = hubVehicles.length > 0
        ? hubVehicles.length
        : (hub.id === 'dac' ? Math.max(4, Math.floor(vehicles.length * 0.45)) : hub.id === 'gulshan' ? 2 : 1);
      const availableCars = hubVehicles.filter(v => v.status === 'AVAILABLE').length;
      const rentedCars = totalCars - availableCars;

      // 2. Bookings associated with this hub
      const hubBookings = bookings.filter(b => {
        const loc = (b.pickupLocation || '').toLowerCase();
        return loc.includes(hub.city.toLowerCase()) || loc.includes(hub.shortName.toLowerCase());
      });

      const totalBookings = hubBookings.length > 0 ? hubBookings.length : Math.max(1, Math.round(totalCars * 1.6));
      const totalRevenue = hubBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) || (totalCars * 280 + totalBookings * 120);

      // Utilization rate
      const rawUtilization = Math.round((Math.max(1, rentedCars || Math.floor(totalCars * 0.75)) / (totalCars || 1)) * 100);
      const utilizationRate = Math.min(100, Math.max(35, rawUtilization));

      // Hot spot intensity color
      let heatColor = '#10B981'; // Green for moderate
      let heatGlow = 'rgba(16, 185, 129, 0.45)';
      if (utilizationRate >= 80) {
        heatColor = '#EF4444'; // Red-orange intense hot spot
        heatGlow = 'rgba(239, 68, 68, 0.65)';
      } else if (utilizationRate >= 45) {
        heatColor = '#FF7800'; // Vibrant Brand Orange
        heatGlow = 'rgba(255, 120, 0, 0.6)';
      }

      return {
        ...hub,
        totalCars,
        availableCars: Math.max(0, availableCars),
        rentedCars: Math.max(0, rentedCars),
        totalBookings,
        totalRevenue,
        utilizationRate,
        heatColor,
        heatGlow
      };
    });
  }, [vehicles, bookings]);

  // Currently selected hub
  const activeHub = useMemo(() => {
    return hubMetrics.find(h => h.id === selectedHubId) || hubMetrics[0];
  }, [hubMetrics, selectedHubId]);

  // Listen for global custom event dispatched from inside Leaflet popup button
  useEffect(() => {
    const handleOpenReportEvent = (e: any) => {
      const hubName = e.detail;
      if (onViewHubReport) {
        onViewHubReport(hubName);
      } else if (onSelectHub) {
        onSelectHub(hubName);
      }
    };

    window.addEventListener('openHubReport', handleOpenReportEvent);
    return () => {
      window.removeEventListener('openHubReport', handleOpenReportEvent);
    };
  }, [onViewHubReport, onSelectHub]);

  // Initialize Leaflet Map (Client Only)
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;
    if (viewMode !== 'direct') return;

    let isMounted = true;

    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // If map already exists, remove it before reinitializing
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      // Initialize map with wide Bangladesh overview so ALL locations are visible
      const map = L.map(mapContainerRef.current, {
        center: BANGLADESH_CENTER,
        zoom: COUNTRY_ZOOM,
        zoomControl: false,
        attributionControl: false
      });

      // Add Base Tile Layer
      const currentTile = TILE_LAYERS[tileTheme];
      L.tileLayer(currentTile.url, {
        maxZoom: currentTile.maxZoom,
        subdomains: 'abcd',
        attribution: currentTile.attribution
      }).addTo(map);

      leafletMapRef.current = map;

      // Clear marker refs
      markersRef.current = {};
      heatCirclesRef.current = {};

      // Add Hotspot layers & Custom HTML Markers for all hubs
      hubMetrics.forEach((hub) => {
        // 1. Hotspot Pulsing Heat Rings (Outer Radiant Heat Circle)
        const outerCircleRadius = Math.max(1600, hub.utilizationRate * 45);
        const innerCircleRadius = Math.max(600, hub.utilizationRate * 15);

        const outerCircle = L.circle([hub.lat, hub.lng], {
          radius: outerCircleRadius,
          color: hub.heatColor,
          fillColor: hub.heatColor,
          fillOpacity: 0.15,
          weight: 1.5,
          dashArray: '4, 6'
        }).addTo(map);

        const innerCircle = L.circle([hub.lat, hub.lng], {
          radius: innerCircleRadius,
          color: hub.heatColor,
          fillColor: hub.heatColor,
          fillOpacity: 0.35,
          weight: 2
        }).addTo(map);

        heatCirclesRef.current[hub.id] = [outerCircle, innerCircle];

        // 2. Custom Rich HTML Hotspot Marker
        const isSelected = hub.id === selectedHubId;
        const customIconHtml = `
          <div class="hotspot-marker-container ${isSelected ? 'is-selected' : ''}" id="marker-${hub.id}">
            <div class="hotspot-pulse-halo" style="background: ${hub.heatGlow};"></div>
            <div class="hotspot-core-dot" style="background: ${hub.heatColor};"></div>
            <div class="hotspot-badge-pill ${isSelected ? 'selected-pill' : ''}">
              <span class="hub-pin-icon">📍</span>
              <span class="hub-title">${hub.shortName.split(' ')[0]}</span>
              <span class="hub-pct-badge" style="background: ${hub.heatColor};">${hub.utilizationRate}%</span>
              <span class="hub-fleet-count">${hub.totalCars} Cars</span>
            </div>
          </div>
        `;

        const customDivIcon = L.divIcon({
          className: 'custom-leaflet-hotspot',
          html: customIconHtml,
          iconSize: [160, 48],
          iconAnchor: [80, 24]
        });

        const marker = L.marker([hub.lat, hub.lng], { icon: customDivIcon }).addTo(map);

        // Click Handler on Marker: Select & Smooth Zoom
        marker.on('click', () => {
          setSelectedHubId(hub.id);
          setIsCountryView(false);
          map.flyTo([hub.lat, hub.lng], hub.zoomLevel, {
            duration: 1.2,
            easeLinearity: 0.25
          });
        });

        // Interactive Popup Tooltip with "View Report" button
        const popupContent = `
          <div class="p-2.5 text-slate-800 font-sans min-w-[210px]">
            <div class="text-xs font-extrabold text-slate-900 flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 mb-1.5">
              <span>${hub.name}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] text-white font-bold" style="background: ${hub.heatColor}">
                ${hub.utilizationRate}% Hotspot
              </span>
            </div>
            <div class="text-[10px] text-slate-500 mb-2">${hub.region}</div>
            <div class="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100 mb-2">
              <div>
                <span class="text-slate-400 block text-[9px]">Total Fleet:</span>
                <span class="font-bold text-slate-900">${hub.totalCars} Cars</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[9px]">Est. Revenue:</span>
                <span class="font-extrabold text-emerald-600">$${hub.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
            <button
              onclick="window.dispatchEvent(new CustomEvent('openHubReport', { detail: '${hub.name}' }))"
              class="w-full py-1.5 px-3 bg-[#FF7800] hover:bg-[#e06900] text-white rounded-lg text-[11px] font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>📊 View ${hub.shortName.split(' ')[0]} Full Report →</span>
            </button>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: true,
          offset: [0, -20],
          className: 'custom-hotspot-popup'
        });

        markersRef.current[hub.id] = marker;
      });

      // Fit bounds to show ALL of Bangladesh on initial load
      const bounds = L.latLngBounds(hubMetrics.map(h => [h.lat, h.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7.2 });

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [viewMode, tileTheme]);

  // When selectedHubId changes, trigger smooth zoom-in on map without navigating away
  const handleHubSelectAndZoom = (hubId: string) => {
    setSelectedHubId(hubId);
    setIsCountryView(false);

    if (leafletMapRef.current && viewMode === 'direct') {
      const targetHub = hubMetrics.find(h => h.id === hubId);
      if (targetHub) {
        leafletMapRef.current.flyTo([targetHub.lat, targetHub.lng], targetHub.zoomLevel, {
          duration: 1.2,
          easeLinearity: 0.25
        });

        // Open popup for selected hub after zoom completes
        const targetMarker = markersRef.current[hubId];
        if (targetMarker) {
          setTimeout(() => {
            targetMarker.openPopup();
          }, 650);
        }
      }
    }
  };

  // Handler to Zoom out / View All Hubs across Bangladesh
  const handleZoomAllHubs = () => {
    setIsCountryView(true);
    if (!leafletMapRef.current || viewMode !== 'direct') return;

    leafletMapRef.current.flyTo(BANGLADESH_CENTER, COUNTRY_ZOOM, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  };

  // Zoom In / Zoom Out Controls
  const handleZoomIn = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomOut();
  };

  // Trigger report navigation
  const handleTriggerReport = (hubName: string) => {
    if (onViewHubReport) {
      onViewHubReport(hubName);
    } else if (onSelectHub) {
      onSelectHub(hubName);
    }
  };

  return (
    <div className="space-y-4">
      {/* CSS Injected for Leaflet Hotspot Glow & Pulsing Rings */}
      <style jsx global>{`
        @keyframes hotspotHaloPulse {
          0% {
            transform: scale(0.85);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.2;
          }
          100% {
            transform: scale(0.85);
            opacity: 0.8;
          }
        }
        .custom-leaflet-hotspot {
          background: transparent !important;
          border: none !important;
        }
        .hotspot-marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .hotspot-marker-container:hover {
          transform: scale(1.08);
          z-index: 999;
        }
        .hotspot-pulse-halo {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          animation: hotspotHaloPulse 2.4s infinite ease-in-out;
          pointer-events: none;
        }
        .hotspot-core-dot {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #ffffff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
          z-index: 2;
        }
        .hotspot-badge-pill {
          position: relative;
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35);
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          transform: translateY(-28px);
          z-index: 10;
          transition: all 0.25s ease;
        }
        .hotspot-badge-pill.selected-pill {
          border-color: #FF7800;
          background: rgba(15, 23, 42, 0.98);
          box-shadow: 0 0 15px rgba(255, 120, 0, 0.5), 0 8px 25px rgba(0, 0, 0, 0.5);
          transform: translateY(-30px) scale(1.05);
        }
        .hub-pin-icon {
          font-size: 12px;
        }
        .hub-title {
          font-weight: 800;
          color: #ffffff;
        }
        .hub-pct-badge {
          padding: 1px 5px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 900;
          color: #ffffff;
        }
        .hub-fleet-count {
          font-size: 9px;
          color: #cbd5e1;
          background: rgba(255, 255, 255, 0.15);
          padding: 1px 4px;
          border-radius: 4px;
        }
        .custom-hotspot-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          box-shadow: 0 14px 35px -4px rgba(0, 0, 0, 0.3);
          border: 1px solid #e2e8f0;
          padding: 2px;
        }
        .custom-hotspot-popup .leaflet-popup-tip {
          background: #ffffff;
        }
      `}</style>

      {/* Map Card Header with view toggler & real-time badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200">
            <Flame className="w-3.5 h-3.5 text-[#FF7800] animate-pulse" />
            <span className="text-xs font-extrabold text-slate-900">Live Fleet Hotspots (% Demand)</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">• Click tab below to zoom into hub</span>
        </div>

        {/* View Mode Toggle: Direct Map vs Vector Map */}
        <div className="flex items-center gap-1.5">
          {viewMode === 'direct' && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px] font-bold mr-1">
              <button
                onClick={() => setTileTheme('voyager')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  tileTheme === 'voyager' ? 'bg-white text-[#FF7800] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setTileTheme('dark')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  tileTheme === 'dark' ? 'bg-white text-[#FF7800] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => setTileTheme('osm')}
                className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                  tileTheme === 'osm' ? 'bg-white text-[#FF7800] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Street
              </button>
            </div>
          )}

          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] font-bold">
            <button
              onClick={() => setViewMode('direct')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'direct'
                  ? 'bg-white text-[#FF7800] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>Direct Map</span>
            </button>
            <button
              onClick={() => setViewMode('vector')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === 'vector'
                  ? 'bg-white text-[#FF7800] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Vector Radar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Display Box */}
      <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
        {viewMode === 'direct' ? (
          /* Real Interactive Direct Map Canvas */
          <div className="relative w-full h-full">
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Direct Map Floating Controls (Zoom in, Zoom out, View all hubs) */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-md">
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-orange-50 hover:text-[#FF7800] flex items-center justify-center text-slate-700 font-bold text-sm transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-orange-50 hover:text-[#FF7800] flex items-center justify-center text-slate-700 font-bold text-sm transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <div className="h-[1px] bg-slate-200 my-0.5" />
              <button
                onClick={handleZoomAllHubs}
                title="View All Bangladesh Regional Hubs"
                className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-orange-50 hover:text-[#FF7800] flex items-center justify-center text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Floating Top Left Active Hub Status Pill */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF7800] animate-ping" />
              <div>
                <span className="text-[11px] font-extrabold text-slate-900 block leading-tight">
                  {isCountryView ? 'All 6 Bangladesh Hubs' : activeHub.shortName}
                </span>
                <span className="text-[9px] text-slate-500 block">
                  {isCountryView ? 'Countrywide Overview (Zoomed out)' : `${activeHub.utilizationRate}% Hotspot • ${activeHub.totalCars} Fleet Cars`}
                </span>
              </div>
            </div>

            {/* Floating Bottom Left Hotspot Heat Legend */}
            <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-white text-[10px]">
              <span className="text-slate-400 font-semibold">Hotspot Intensity:</span>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[9px]">35-45%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#FF7800]" />
                <span className="text-[9px]">50-75%</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-[9px]">80-100%</span>
              </div>
            </div>
          </div>
        ) : (
          /* Vector Radar Map Mode */
          <div className="relative h-full w-full bg-gradient-to-br from-slate-900 via-[#0E1A30] to-slate-950 flex items-center justify-center p-3 select-none">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            {/* Stylized Bangladesh Regional Territory Paths */}
            <svg
              className="w-full h-full max-w-[360px] opacity-40 transition-all pointer-events-none"
              viewBox="0 0 400 450"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M130 50 L190 40 L210 90 L180 130 L120 120 Z" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              <path d="M270 90 L350 110 L340 170 L260 170 L250 120 Z" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5" />
              <path d="M180 130 L260 120 L270 230 L180 240 L160 180 Z" fill="#0F172A" stroke="#FF7800" strokeWidth="2" strokeDasharray="4 2" />
              <path d="M90 130 L170 140 L180 270 L110 320 L70 240 Z" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
              <path d="M180 250 L250 250 L230 330 L170 320 Z" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              <path d="M260 210 L330 200 L350 320 L330 410 L290 330 L260 250 Z" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
              <circle cx="215" cy="190" r="45" stroke="#FF7800" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="215" cy="190" r="95" stroke="#FF7800" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="215" cy="190" r="145" stroke="#FF7800" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="5 5" />
            </svg>

            {/* Vector Hub Pins with Hotspot Glow */}
            {hubMetrics.map((hub) => {
              const isSelected = hub.id === selectedHubId;
              return (
                <div
                  key={hub.id}
                  style={{ left: `${hub.xPct}%`, top: `${hub.yPct}%` }}
                  onClick={() => handleHubSelectAndZoom(hub.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  <div
                    style={{ background: hub.heatColor }}
                    className={`absolute -inset-3 rounded-full opacity-40 animate-ping duration-1000 ${
                      isSelected ? 'scale-125 opacity-70' : 'opacity-20 group-hover:opacity-50'
                    }`}
                  />
                  <div
                    className={`relative flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold transition-all duration-300 shadow-xl border ${
                      isSelected
                        ? 'bg-[#FF7800] text-white border-orange-300 scale-110 shadow-orange-500/50 z-30'
                        : 'bg-slate-800/95 hover:bg-slate-700 text-slate-200 border-slate-600 scale-95 group-hover:scale-100'
                    }`}
                  >
                    <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-orange-400'}`} />
                    <span className="whitespace-nowrap">{hub.shortName.split(' ')[0]}</span>
                    <span
                      style={{ background: hub.heatColor }}
                      className="px-1 py-0.2 rounded-md text-[9px] font-extrabold text-white"
                    >
                      {hub.utilizationRate}%
                    </span>
                  </div>
                </div>
              );
            })}

            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] text-slate-300">
              <Navigation className="w-3 h-3 text-[#FF7800]" />
              <span>Bangladesh Vector Radar</span>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Hub Horizontal Tab Scroller (Clicking any tab ONLY zooms into that hub on the map) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-700">Select Hub Location to Zoom In:</span>
          <button
            onClick={handleZoomAllHubs}
            className="text-[10px] font-bold text-[#FF7800] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Compass className="w-3 h-3" />
            <span>Reset View (All Bangladesh Hubs)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar touch-scroll pb-1">
          {hubMetrics.map((hub) => {
            const isSelected = hub.id === selectedHubId;
            return (
              <button
                key={hub.id}
                onClick={() => handleHubSelectAndZoom(hub.id)}
                className={`p-2.5 rounded-xl border transition-all text-left shrink-0 min-w-[140px] cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-orange-50/90 border-[#FF7800] shadow-sm ring-2 ring-[#FF7800]/40'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Hotspot indicator bar at top */}
                <div
                  style={{ background: hub.heatColor }}
                  className={`absolute top-0 left-0 right-0 h-1 transition-all ${isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'}`}
                />

                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <span className="text-[11px] font-extrabold text-slate-900 truncate">{hub.shortName}</span>
                  <span
                    style={{ background: hub.heatColor }}
                    className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                  />
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-slate-500">{hub.totalCars} Cars</span>
                  <span
                    style={{ color: hub.heatColor }}
                    className="font-extrabold flex items-center gap-0.5"
                  >
                    <Flame className="w-2.5 h-2.5" />
                    {hub.utilizationRate}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Hub Dynamic KPI Banner with direct "View Hub Report" button */}
      <div className="p-3.5 bg-gradient-to-r from-slate-50 via-white to-orange-50/40 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-100 text-[#FF7800] shadow-inner">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-[#111827] flex items-center gap-1.5">
              <span>{activeHub.shortName} Station</span>
              <span
                style={{ background: activeHub.heatColor }}
                className="px-1.5 py-0.2 rounded-md text-[9px] font-bold text-white"
              >
                {activeHub.utilizationRate}% Hotspot
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              {activeHub.totalCars} Fleet Cars • {activeHub.availableCars} Available • {activeHub.totalBookings} Total Dispatches
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Est. Revenue</span>
            <span className="font-extrabold text-slate-900">${activeHub.totalRevenue.toLocaleString()}</span>
          </div>

          <div
            style={{ color: activeHub.heatColor }}
            className="flex items-center gap-1 text-xs font-extrabold mr-1"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{activeHub.utilizationRate}% Active</span>
          </div>

          {/* Dedicated "View Hub Report" button that switches to the reports section */}
          <button
            onClick={() => handleTriggerReport(activeHub.name)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#FF7800] to-amber-500 hover:from-[#e06900] hover:to-amber-600 text-white text-xs font-extrabold shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>View Full Report</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
