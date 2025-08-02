import { NextRequest, NextResponse } from 'next/server';
import SunCalc from 'suncalc';
import { findAirportByIata } from '@/lib/airports';

interface RequestBody {
  departureIata: string;
  arrivalIata: string;
  departureTimestamp: number;
}

interface FlightPathPoint {
  lat: number;
  lon: number;
  time: number;
}

interface RecommendationResponse {
  recommendation: 'Left Side' | 'Right Side';
  reason: string;
  flightPath: FlightPathPoint[];
  sunPosition: {
    azimuth: number;
    altitude: number;
  };
  flightDuration: number; // in minutes
  departureTime: string;
  arrivalTime: string;
  departureAirport: {
    iata: string;
    city: string;
  };
  arrivalAirport: {
    iata: string;
    city: string;
  };
}

// Calculate great circle distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate bearing between two points
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

// Generate intermediate points along the great circle path
function generateFlightPath(lat1: number, lon1: number, lat2: number, lon2: number, departureTime: number): FlightPathPoint[] {
  const points: FlightPathPoint[] = [];
  const numPoints = 8;
  
  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints;
    
    // Interpolate along great circle
    const A = Math.sin((1 - fraction) * Math.PI / 2) / Math.sin(Math.PI / 2);
    const B = Math.sin(fraction * Math.PI / 2) / Math.sin(Math.PI / 2);
    
    const x = A * Math.cos(lat1 * Math.PI / 180) * Math.cos(lon1 * Math.PI / 180) + 
              B * Math.cos(lat2 * Math.PI / 180) * Math.cos(lon2 * Math.PI / 180);
    const y = A * Math.cos(lat1 * Math.PI / 180) * Math.sin(lon1 * Math.PI / 180) + 
              B * Math.cos(lat2 * Math.PI / 180) * Math.sin(lon2 * Math.PI / 180);
    const z = A * Math.sin(lat1 * Math.PI / 180) + B * Math.sin(lat2 * Math.PI / 180);
    
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
    const lon = Math.atan2(y, x) * 180 / Math.PI;
    
    // Estimate time at this point (assuming constant speed)
    const totalDistance = calculateDistance(lat1, lon1, lat2, lon2);
    const distanceToPoint = calculateDistance(lat1, lon1, lat, lon);
    const timeAtPoint = departureTime + (distanceToPoint / totalDistance) * 8 * 60 * 60 * 1000; // 8 hour flight estimate
    
    points.push({
      lat,
      lon,
      time: timeAtPoint
    });
  }
  
  return points;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { departureIata, arrivalIata, departureTimestamp } = body;

    // Find airports
    const departureAirport = findAirportByIata(departureIata);
    const arrivalAirport = findAirportByIata(arrivalIata);

    if (!departureAirport || !arrivalAirport) {
      return NextResponse.json(
        { error: 'Invalid airport codes' },
        { status: 400 }
      );
    }

    // Generate flight path
    const flightPath = generateFlightPath(
      departureAirport.coordinates.lat,
      departureAirport.coordinates.lon,
      arrivalAirport.coordinates.lat,
      arrivalAirport.coordinates.lon,
      departureTimestamp
    );

    // Calculate midpoint for sun position analysis
    const midpoint = flightPath[Math.floor(flightPath.length / 2)];
    const midpointTime = new Date(midpoint.time);
    
    // Get sun position at midpoint
    const sunPosition = SunCalc.getPosition(midpointTime, midpoint.lat, midpoint.lon);
    
    // Calculate flight bearing
    const flightBearing = calculateBearing(
      departureAirport.coordinates.lat,
      departureAirport.coordinates.lon,
      arrivalAirport.coordinates.lat,
      arrivalAirport.coordinates.lon
    );

    // Determine which side of the plane has the better view
    const sunAzimuth = (sunPosition.azimuth * 180 / Math.PI + 360) % 360;
    const relativeSunPosition = (sunAzimuth - flightBearing + 360) % 360;
    
    let recommendation: 'Left Side' | 'Right Side';
    let reason: string;
    
    if (relativeSunPosition > 180) {
      recommendation = 'Left Side';
    } else {
      recommendation = 'Right Side';
    }

    // Determine if it's sunrise or sunset
    const sunAltitude = sunPosition.altitude * 180 / Math.PI;
    const timeOfDay = midpointTime.getHours();
    
    if (sunAltitude > 0 && sunAltitude < 15) {
      if (timeOfDay >= 6 && timeOfDay <= 10) {
        reason = `You will have a beautiful view of the sunrise.`;
      } else if (timeOfDay >= 16 && timeOfDay <= 20) {
        reason = `You will have a beautiful view of the sunset.`;
      } else {
        reason = `You will have a great view of the sun.`;
      }
    } 
    else if (sunAltitude < 0) {
      reason = `You will have a great view of the night sky.`;
    } 
    else {
      reason = `You will have a good view of the landscape below.`;
    }

    // Calculate flight duration and times
    const departureTime = new Date(departureTimestamp);
    const arrivalTime = new Date(departureTimestamp + 8 * 60 * 60 * 1000); // 8 hour estimate
    const flightDuration = 8 * 60; // 8 hours in minutes

    const response: RecommendationResponse = {
      recommendation,
      reason,
      flightPath,
      sunPosition: {
        azimuth: sunAzimuth,
        altitude: sunAltitude
      },
      flightDuration,
      departureTime: departureTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      arrivalTime: arrivalTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      departureAirport: {
        iata: departureAirport.iata,
        city: departureAirport.city
      },
      arrivalAirport: {
        iata: arrivalAirport.iata,
        city: arrivalAirport.city
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing recommendation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 