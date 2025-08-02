'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

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
      <h3 className="text-lg font-semibold mb-4">Flight Path</h3>
      <div className="w-full h-96 rounded-lg overflow-hidden border">
        <MapComponent flightPath={flightPath} />
      </div>
    </div>
  );
} 