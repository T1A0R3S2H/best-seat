import { NextRequest, NextResponse } from 'next/server';
import SunCalc from 'suncalc';
import { findAirportByIata } from '@/lib/airports';
import { landmarks } from '@/lib/landmarks';
// import * as turf from '@turf/turf'; // Uncomment after installing @turf/turf

interface RequestBody {
  departureIata: string;
  arrivalIata: string;
  departureTimestamp: number;
  flightDurationMinutes: number;
}

interface FlightPathPoint {
  lat: number;
  lon: number;
  time: number;
}

interface RecommendationResponse {
  recommendation: 'Left Side' | 'Right Side' | 'Either Side';
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
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  arrivalAirport: {
    iata: string;
    city: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  visibleLandmarks: Array<{
    name: string;
    type: string;
    side: 'Left' | 'Right';
  }>;
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
  
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
}

// Calculate perpendicular distance from a point to a line segment
function calculatePerpendicularDistance(
  pointLat: number, 
  pointLon: number, 
  lineStartLat: number, 
  lineStartLon: number, 
  lineEndLat: number, 
  lineEndLon: number
): number {
  // Convert to radians
  const lat1 = lineStartLat * Math.PI / 180;
  const lon1 = lineStartLon * Math.PI / 180;
  const lat2 = lineEndLat * Math.PI / 180;
  const lon2 = lineEndLon * Math.PI / 180;
  const latP = pointLat * Math.PI / 180;
  const lonP = pointLon * Math.PI / 180;
  
  // Calculate the perpendicular distance using spherical geometry
  const R = 6371; // Earth's radius in km
  
  // Calculate the great circle distance from point to line start
  const d1 = Math.acos(
    Math.sin(latP) * Math.sin(lat1) + 
    Math.cos(latP) * Math.cos(lat1) * Math.cos(lonP - lon1)
  ) * R;
  
  // Calculate the great circle distance from point to line end
  const d2 = Math.acos(
    Math.sin(latP) * Math.sin(lat2) + 
    Math.cos(latP) * Math.cos(lat2) * Math.cos(lonP - lon2)
  ) * R;
  
  // Calculate the great circle distance of the line segment
  const lineLength = Math.acos(
    Math.sin(lat1) * Math.sin(lat2) + 
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
  ) * R;
  
  // Calculate the perpendicular distance using the formula:
  // perpendicular distance = 2 * area / base
  // where area = sqrt(s * (s - a) * (s - b) * (s - c))
  // and s = (a + b + c) / 2
  const s = (d1 + d2 + lineLength) / 2;
  const area = Math.sqrt(s * (s - d1) * (s - d2) * (s - lineLength));
  const perpendicularDistance = (2 * area) / lineLength;
  
  return perpendicularDistance;
}

// Determine if a landmark is visible based on time of day and landmark type
function isLandmarkVisible(landmark: { type: string }, sunAltitude: number, timeOfDay: number): boolean {
  const isNight = sunAltitude < 0;
  const isDaytime = sunAltitude > 0;
  const isSunset = timeOfDay >= 16 && timeOfDay <= 20;
  const isSunrise = timeOfDay >= 6 && timeOfDay <= 10;
  
  // Landmark types that are visible at night (illuminated or naturally visible)
  const nightVisibleTypes = ['City', 'Architecture', 'Monument'];
  
  if (isNight) {
    // At night, only illuminated landmarks are visible
    return nightVisibleTypes.includes(landmark.type);
  } else if (isDaytime) {
    // During daytime, all landmarks are visible
    return true;
  } else if (isSunrise || isSunset) {
    // During sunrise/sunset, most landmarks are visible with good lighting
    return true;
  }
  
  return false;
}

// Generate intermediate points along the great circle path using provided duration
function generateFlightPathWithDuration(lat1: number, lon1: number, lat2: number, lon2: number, departureTime: number, flightDurationMs: number): { flightPath: FlightPathPoint[] } {
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
    
    // Calculate time at this point using provided duration
    const timeAtPoint = departureTime + (fraction * flightDurationMs);
    
    points.push({
      lat,
      lon,
      time: timeAtPoint
    });
  }
  
  return { flightPath: points };
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { departureIata, arrivalIata, departureTimestamp, flightDurationMinutes } = body;

    // Find airports
    const departureAirport = findAirportByIata(departureIata);
    const arrivalAirport = findAirportByIata(arrivalIata);

    if (!departureAirport || !arrivalAirport) {
      return NextResponse.json(
        { error: 'Invalid airport codes' },
        { status: 400 }
      );
    }

    // Generate flight path using provided duration
    const flightDurationMs = flightDurationMinutes * 60 * 1000; // Convert minutes to milliseconds
    const { flightPath } = generateFlightPathWithDuration(
      departureAirport.coordinates.lat,
      departureAirport.coordinates.lon,
      arrivalAirport.coordinates.lat,
      arrivalAirport.coordinates.lon,
      departureTimestamp,
      flightDurationMs
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
    
    let recommendation: 'Left Side' | 'Right Side' | 'Either Side';
    let reason: string;
    
    // Determine if it's sunrise or sunset
    const sunAltitude = sunPosition.altitude * 180 / Math.PI;
    const timeOfDay = midpointTime.getHours();
    const isSunset = timeOfDay >= 16 && timeOfDay <= 20;
    const isSunrise = timeOfDay >= 6 && timeOfDay <= 10;
    const isDaytime = sunAltitude > 0;
    
    // For sunset/sunrise viewing, we want to face the sun
    // For daytime flights, we want to avoid direct sun glare
    // For nighttime flights, we want to face away from the sun for better night sky viewing
    if (isSunset || isSunrise) {
      // For sunset/sunrise, recommend the side that faces the sun
      if (relativeSunPosition > 180) {
        recommendation = 'Left Side';
      } else {
        recommendation = 'Right Side';
      }
      
      if (isSunrise) {
        reason = `You will have a beautiful view of the sunrise.`;
      } else {
        reason = `You will have a beautiful view of the sunset.`;
      }
    } else if (isDaytime) {
      // For daytime flights, avoid direct sun glare by facing away from the sun
      if (relativeSunPosition > 180) {
        recommendation = 'Left Side';
      } else {
        recommendation = 'Right Side';
      }
      reason = `You will have a good view of the landscape below without direct sun glare.`;
    } else {
      // For nighttime flights, both sides offer similar views
      recommendation = 'Either Side';
      reason = `This is a night flight, so there won't be a sunrise or sunset. Both sides of the aircraft will offer a similar view of the night sky.`;
    }

    // Landmark Detection Logic
    const VISIBILITY_RADIUS_KM = 50; // More realistic radius for landmark visibility
    
    // Filter landmarks that are within visibility range of the flight path AND visible at current time
    const nearbyLandmarks = landmarks.filter(landmark => {
      // Calculate perpendicular distance from landmark to flight path
      let minPerpendicularDistance = Infinity;
      
      for (let i = 0; i < flightPath.length - 1; i++) {
        const segmentStart = flightPath[i];
        const segmentEnd = flightPath[i + 1];
        
        // Calculate perpendicular distance from landmark to this flight segment
        const perpendicularDistance = calculatePerpendicularDistance(
          landmark.coordinates.lat,
          landmark.coordinates.lon,
          segmentStart.lat,
          segmentStart.lon,
          segmentEnd.lat,
          segmentEnd.lon
        );
        
        minPerpendicularDistance = Math.min(minPerpendicularDistance, perpendicularDistance);
      }
      
      // Check if landmark is within visibility range AND visible at current time
      const isWithinRange = minPerpendicularDistance <= VISIBILITY_RADIUS_KM;
      const isVisibleAtTime = isLandmarkVisible(landmark, sunAltitude, timeOfDay);
      
      return isWithinRange && isVisibleAtTime;
    });
    
    // Determine which side of the plane each landmark is on
    const visibleLandmarks = nearbyLandmarks.map(landmark => {
      // Calculate bearing from flight midpoint to landmark
      const landmarkBearing = calculateBearing(
        midpoint.lat,
        midpoint.lon,
        landmark.coordinates.lat,
        landmark.coordinates.lon
      );
      
      // Calculate relative angle
      const relativeAngle = (landmarkBearing - flightBearing + 360) % 360;
      
      // Determine side based on relative angle
      let side: 'Left' | 'Right';
      if (relativeAngle >= 1 && relativeAngle <= 179) {
        side = 'Right';
      } else {
        side = 'Left';
      }
      
      return {
        name: landmark.name,
        type: landmark.type,
        side
      };
    });

    // Calculate flight times using provided duration
    const departureTime = new Date(departureTimestamp);
    const arrivalTime = new Date(departureTimestamp + flightDurationMs);

    const response: RecommendationResponse = {
      recommendation,
      reason,
      flightPath,
      sunPosition: {
        azimuth: sunAzimuth,
        altitude: sunAltitude
      },
      flightDuration: flightDurationMinutes,
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
        city: departureAirport.city,
        coordinates: departureAirport.coordinates
      },
      arrivalAirport: {
        iata: arrivalAirport.iata,
        city: arrivalAirport.city,
        coordinates: arrivalAirport.coordinates
      },
      visibleLandmarks
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