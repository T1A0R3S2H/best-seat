'use client';

import { ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';

interface RecommendationResultProps {
  recommendation: 'Left Side' | 'Right Side' | 'Either Side';
  reason: string;
  sunPosition: {
    azimuth: number;
    altitude: number;
  };
  flightDuration?: number;
  departureTime?: string;
  arrivalTime?: string;
  departureAirport?: {
    iata: string;
    city: string;
  };
  arrivalAirport?: {
    iata: string;
    city: string;
  };
  visibleLandmarks?: Array<{
    name: string;
    type: string;
    side: 'Left' | 'Right';
  }>;
}

export function RecommendationResult({ 
  recommendation, 
  reason, 
  sunPosition, 
  flightDuration, 
  departureTime, 
  arrivalTime, 
  departureAirport, 
  arrivalAirport
}: RecommendationResultProps) {
  const isLeftSide = recommendation === 'Left Side';
  const isEitherSide = recommendation === 'Either Side';
  const isNight = sunPosition.altitude < 0;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Boarding Pass Section */}
      <div className="bg-blue-600 text-white rounded-lg p-4 mb-3 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Flight Route */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="text-left">
            <div className="text-xs opacity-80">FROM</div>
            <div className="font-bold text-lg">{departureAirport?.iata || 'JFK'}</div>
            <div className="text-sm opacity-90">{departureAirport?.city || 'NEW YORK'}</div>
            <div className="text-xs opacity-80">{departureTime || '11:30 AM'}</div>
          </div>
          
          {/* Airplane and Arrow */}
          <div className="flex flex-col items-center">
            <div className="text-white text-2xl mb-1">✈️</div>
            <div className="text-white text-xl">→</div>
          </div>
          
          <div className="text-right">
            <div className="text-xs opacity-80">TO</div>
            <div className="font-bold text-lg">{arrivalAirport?.iata || 'LHR'}</div>
            <div className="text-sm opacity-90">{arrivalAirport?.city || 'LONDON'}</div>
            <div className="text-xs opacity-80">{arrivalTime || '06:35 PM'}</div>
          </div>
        </div>
        
        {/* Flight Details */}
        <div className="relative z-10 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="opacity-80">Flight:</span>
            <span className="ml-1 font-medium">A 0123</span>
          </div>
          <div>
            <span className="opacity-80">Duration:</span>
            <span className="ml-1 font-medium">
              {flightDuration ? `${Math.floor(flightDuration / 60)}h ${flightDuration % 60}m` : '8h 5m'}
            </span>
          </div>
          <div>
            <span className="opacity-80">Seat:</span>
            <span className="ml-1 font-medium">17F</span>
          </div>
          <div>
            <span className="opacity-80">Gate:</span>
            <span className="ml-1 font-medium">15</span>
          </div>
        </div>
      </div>

      {/* Recommendation Section */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-4 flex-1">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Recommended Seat
          </h3>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-3xl font-bold text-blue-600">
              {isEitherSide ? (
                <div className="flex space-x-2">
                  <ArrowLeft className="h-8 w-8" />
                  <ArrowRight className="h-8 w-8" />
                </div>
              ) : isLeftSide ? (
                <ArrowLeft className="h-10 w-10" />
              ) : (
                <ArrowRight className="h-10 w-10" />
              )}
            </div>
            <div className="text-xl font-bold text-gray-900">
              {recommendation}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-700">
            {isNight ? (
              <Moon className="h-4 w-4 text-blue-500" />
            ) : (
              <Sun className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-xs">{reason}</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-xs font-medium mb-2 text-gray-700">
              Sun Position Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-500">Azimuth:</span>
                <span className="ml-1 font-medium">
                  {sunPosition.azimuth.toFixed(1)}°
                </span>
              </div>
              <div>
                <span className="text-gray-500">Altitude:</span>
                <span className="ml-1 font-medium">
                  {sunPosition.altitude.toFixed(1)}°
                </span>
              </div>
            </div>
          </div>

          

          <div className="text-xs text-center text-gray-500">
            <p>
              💡 Based on sun&apos;s position during your flight
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 