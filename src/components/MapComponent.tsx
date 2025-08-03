'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getFlightSunPositions } from '@/lib/flightSunPositions';

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
  const [sunPositions, setSunPositions] = useState<Array<{
    lat: number;
    lon: number;
    time: Date;
    label: string;
  }>>([]);

  // Calculate sun positions based on flight times
  useEffect(() => {
    if (!flightPath || flightPath.length === 0) return;

    const positions = getFlightSunPositions(flightPath);
    setSunPositions(positions);
  }, [flightPath]);

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
      
      L.polyline(pathCoordinates, {
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

      // Add flight icon along the path (after departure point)
      if (flightPath.length > 1) {
        // Calculate position for flight icon (about 1/8th of the way along the path)
        const flightIconIndex = Math.floor(flightPath.length * 0.125);
        const flightIconPoint = flightPath[flightIconIndex];
        
        // Calculate bearing to determine icon rotation
        const nextPoint = flightPath[Math.min(flightIconIndex + 1, flightPath.length - 1)];
        const bearing = Math.atan2(
          nextPoint.lon - flightIconPoint.lon,
          nextPoint.lat - flightIconPoint.lat
        ) * 180 / Math.PI;
        
        // Create flight icon with rotation
        const flightIcon = L.divIcon({
          className: 'flight-icon-div',
          html: `<div style="
            width: 24px;
            height: 24px;
            background-image: url('/flight.svg');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            transform: rotate(${bearing}deg);
            filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
          "></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        L.marker([flightIconPoint.lat, flightIconPoint.lon], {
          icon: flightIcon
        }).addTo(map);
      }
    }
  }, [flightPath]);

  // Add sun markers when sun positions are available
  useEffect(() => {
    if (!mapInstanceRef.current || sunPositions.length === 0) return;

    const map = mapInstanceRef.current;

    // Remove existing sun markers and labels
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && (layer as L.Marker & { _sunMarker?: boolean })._sunMarker) {
        map.removeLayer(layer);
      }
    });

    // Create sun icon
    const sunIcon = L.icon({
      iconUrl: '/sun.svg',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
      className: 'sun-icon'
    });

    // Add sun markers for each position
    sunPositions.forEach((sunPos) => {
      const sunMarker = L.marker([sunPos.lat, sunPos.lon], {
        icon: sunIcon,
        title: `Sun Position at ${sunPos.label}`
      }).addTo(map);

      // Add popup with sun position info
      const timeString = sunPos.time.toLocaleTimeString();
      const dateString = sunPos.time.toLocaleDateString();
      
      sunMarker.bindPopup(`
        <div style="text-align: center;">
          <strong>☀️ Sun Position at ${sunPos.label}</strong><br/>
          <small>${dateString} ${timeString}</small><br/>
          <small>Lat: ${sunPos.lat.toFixed(2)}°</small><br/>
          <small>Lon: ${sunPos.lon.toFixed(2)}°</small>
        </div>
      `);

      // Mark this as a sun marker for easy removal
      (sunMarker as L.Marker & { _sunMarker?: boolean })._sunMarker = true;

      // Add text label below the sun marker
      const labelIcon = L.divIcon({
        className: 'sun-label-icon',
        html: `<div style="
          /* Changes are here 👇 */
          display: inline-block;
          transform: translateX(-50%);
          
          /* Original Styles */
          background: #000000;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          white-space: nowrap;
          text-align: center;
          margin-top: 8px; /* Adjust as needed for vertical spacing */
        ">${sunPos.label}</div>`,
        iconSize: [0, 0],
        
        // Anchor the icon at the top-center of where it's being placed
        // This works with the translateX(-50%) to achieve true centering.
        iconAnchor: [0, 0] 
    });

      const labelMarker = L.marker([sunPos.lat - 2, sunPos.lon], {
        icon: labelIcon
      }).addTo(map);

      // Mark this as a sun label for easy removal
      (labelMarker as L.Marker & { _sunMarker?: boolean })._sunMarker = true;
    });

  }, [sunPositions]);

  return <div ref={mapRef} className="w-full h-full" />;
} 