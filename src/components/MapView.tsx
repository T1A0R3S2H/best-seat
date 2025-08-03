'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';

interface FlightPathPoint {
  lat: number;
  lon: number;
  time: number;
}

interface MapViewProps {
  flightPath: FlightPathPoint[];
}

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

export function MapView({ flightPath }: MapViewProps) {
  if (!flightPath || flightPath.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Flight Path</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Departure</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Arrival</span>
          </div>
          <div className="flex items-center space-x-1">
            <Image src="/sun.svg" alt="Sun" width={16} height={16} />
            <span>Sun Positions</span>
          </div>
        </div>
      </div>
      <div className="w-full h-96 rounded-lg overflow-hidden border">
        <MapComponent flightPath={flightPath} />
      </div>
    </div>
  );
} 