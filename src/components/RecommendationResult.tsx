'use client';

import { ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';

interface RecommendationResultProps {
  recommendation: 'Left Side' | 'Right Side';
  reason: string;
  sunPosition: {
    azimuth: number;
    altitude: number;
  };
}

export function RecommendationResult({ recommendation, reason, sunPosition }: RecommendationResultProps) {
  const isLeftSide = recommendation === 'Left Side';
  const isNight = sunPosition.altitude < 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Recommended Seat
        </h3>
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="text-3xl font-bold text-blue-600">
            {isLeftSide ? <ArrowLeft className="h-10 w-10" /> : <ArrowRight className="h-10 w-10" />}
          </div>
          <div className="text-xl font-bold text-gray-900">
            {recommendation}
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-3">
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
            💡 Based on sun's position during your flight
          </p>
        </div>
      </div>
    </div>
  );
} 