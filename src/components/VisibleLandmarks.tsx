'use client';

import { LandmarkImage } from './LandmarkImage';

interface VisibleLandmarksProps {
  landmarks?: Array<{
    name: string;
    type: string;
    side: 'Left' | 'Right';
  }>;
}

export function VisibleLandmarks({ landmarks }: VisibleLandmarksProps) {
  if (!landmarks || landmarks.length === 0) {
    // This case is handled by the parent component, but returning null is safe.
    return null; 
  }

  // The component is wrapped in a flex container to correctly position the
  // header and the scrollable list below it.
  return (
    <div className="h-full flex flex-col">
      {/* Header Section - flex-shrink-0 prevents it from shrinking */}
      <div className="text-center mb-6 flex-shrink-0">
        <div className="text-2xl mb-2">🏛️</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Visible Landmarks
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Landmarks you can see from your seat
        </p>
      </div>
      
      {/* Scrollable List Section - flex-1 makes it fill available space */}
      <div className="space-y-4 flex-1 overflow-y-auto -mr-2 pr-2">
        {landmarks.map((landmark, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700/60 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                landmark.side === 'Left' 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                  : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
              }`}>
                {landmark.side} Side
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs capitalize">
                {landmark.type}
              </span>
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              {landmark.name}
            </div>
            <div className="relative w-full h-36 rounded-lg overflow-hidden">
              <LandmarkImage 
                landmarkName={landmark.name}
                landmarkType={landmark.type}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}