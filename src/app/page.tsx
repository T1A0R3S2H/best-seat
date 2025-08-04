'use client';

import { useState } from 'react';
import { FlightForm } from '@/components/FlightForm';
import { RecommendationResult } from '@/components/RecommendationResult';
import { MapView } from '@/components/MapView';
import { VisibleLandmarks } from '@/components/VisibleLandmarks';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { Plane, MapPin } from 'lucide-react';

interface RecommendationData {
  recommendation: 'Left Side' | 'Right Side';
  reason: string;
  flightPath: Array<{
    lat: number;
    lon: number;
    time: number;
  }>;
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
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  arrivalAirport?: {
    iata: string;
    city: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  visibleLandmarks?: Array<{
    name: string;
    type: string;
    side: 'Left' | 'Right';
  }>;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    departureIata: string;
    arrivalIata: string;
    departureTimestamp: number;
    flightDurationMinutes: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const response = await fetch('/api/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get recommendation');
      }

      const result = await response.json();
      setRecommendation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="text-center pt-8 pb-6 relative">
          <div className="absolute top-8 right-6">
            <ThemeToggleButton />
          </div>
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Plane className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Scenic View Finder
            </h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Find the best seat for breathtaking views during your flight
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 pb-6">
          <div className="min-h-full grid grid-cols-12 gap-4">
            {/* Flight Form - Takes 5 columns on desktop, full width on mobile */}
            <div className="col-span-12 lg:col-span-5">
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                <div className="text-center mb-6">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Flight Details
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enter your departure and arrival information
                  </p>
                </div>
                
                <FlightForm onSubmit={handleSubmit} isLoading={isLoading} />
              </div>
            </div>

            {/* Results Section - Takes 7 columns on desktop, full width on mobile */}
            <div className="col-span-12 lg:col-span-7">
              {recommendation ? (
                /* Mobile Layout: Stacked cards */
                <div className="lg:hidden space-y-4">
                  {/* 1. Recommended Seat - Top priority on mobile */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <RecommendationResult
                      recommendation={recommendation.recommendation}
                      reason={recommendation.reason}
                      sunPosition={recommendation.sunPosition}
                      flightDuration={recommendation.flightDuration}
                      departureTime={recommendation.departureTime}
                      arrivalTime={recommendation.arrivalTime}
                      departureAirport={recommendation.departureAirport}
                      arrivalAirport={recommendation.arrivalAirport}
                    />
                  </div>

                  {/* 2. Flight Path - Second priority on mobile */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <MapView 
                      flightPath={recommendation.flightPath} 
                      departureAirport={recommendation.departureAirport}
                      arrivalAirport={recommendation.arrivalAirport}
                    />
                  </div>

                  {/* 3. Visible Landmarks - Additional feature on mobile */}
                  <VisibleLandmarks landmarks={recommendation.visibleLandmarks} />
                </div>
              ) : (
                /* Empty state for mobile */
                <div className="lg:hidden space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Plane className="h-8 w-8 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enter flight details to get your seat recommendation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Layout: Side by side */}
              <div className="hidden lg:grid h-full grid-rows-2 gap-4">
                {/* Recommendation Card - Top half */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  {recommendation ? (
                    <RecommendationResult
                      recommendation={recommendation.recommendation}
                      reason={recommendation.reason}
                      sunPosition={recommendation.sunPosition}
                      flightDuration={recommendation.flightDuration}
                      departureTime={recommendation.departureTime}
                      arrivalTime={recommendation.arrivalTime}
                      departureAirport={recommendation.departureAirport}
                      arrivalAirport={recommendation.arrivalAirport}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Plane className="h-8 w-8 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enter flight details to get your seat recommendation
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Map Card - Bottom half */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  {recommendation ? (
                    <MapView 
                      flightPath={recommendation.flightPath} 
                      departureAirport={recommendation.departureAirport}
                      arrivalAirport={recommendation.arrivalAirport}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-8 h-8 mx-auto mb-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Flight path will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display - Fixed at bottom */}
        {error && (
          <div className="px-6 pb-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="text-red-600 dark:text-red-400">⚠️</div>
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
