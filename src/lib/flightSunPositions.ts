import { getSubsolarPoint } from './getSubsolarPoint';

interface FlightPathPoint {
  lat: number;
  lon: number;
  time: number;
}

interface SunPosition {
  lat: number;
  lon: number;
  time: Date;
  label: string;
}

export function getFlightSunPositions(flightPath: FlightPathPoint[]): SunPosition[] {
  if (flightPath.length === 0) return [];

  const departureTime = new Date(flightPath[0].time);
  const arrivalTime = new Date(flightPath[flightPath.length - 1].time);
  
  // Calculate midpoint time
  const midpointTime = new Date((departureTime.getTime() + arrivalTime.getTime()) / 2);
  
  return [
    {
      ...getSubsolarPoint(departureTime),
      time: departureTime,
      label: 'Departure'
    },
    {
      ...getSubsolarPoint(midpointTime),
      time: midpointTime,
      label: 'Mid-flight'
    },
    {
      ...getSubsolarPoint(arrivalTime),
      time: arrivalTime,
      label: 'Arrival'
    }
  ];
} 