'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface FlightPathPoint {
  lat: number;
  lon: number;
  time: number;
}

interface MapComponentProps {
  flightPath: FlightPathPoint[];
}

export default function MapComponent({ flightPath }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView([0, 0], 2);
    mapInstanceRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Fit bounds to flight path
    if (flightPath.length > 0) {
      const bounds = L.latLngBounds(
        flightPath.map(point => [point.lat, point.lon])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [flightPath]);

  useEffect(() => {
    if (!mapInstanceRef.current || !flightPath.length) return;

    const map = mapInstanceRef.current;
    
    // Clear existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Draw flight path
    if (flightPath.length > 1) {
      const pathCoordinates = flightPath.map(point => [point.lat, point.lon] as [number, number]);
      
      const polyline = L.polyline(pathCoordinates, {
        color: '#3b82f6',
        weight: 3,
        opacity: 0.8
      }).addTo(map);

      // Add markers for departure and arrival
      const departure = flightPath[0];
      const arrival = flightPath[flightPath.length - 1];

      L.marker([departure.lat, departure.lon], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: '<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      }).addTo(map);

      L.marker([arrival.lat, arrival.lon], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: '<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      }).addTo(map);
    }
  }, [flightPath]);

  return <div ref={mapRef} className="w-full h-full" />;
} 