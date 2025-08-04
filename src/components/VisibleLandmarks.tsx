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
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
      <div className="text-center mb-6">
        <div className="text-2xl mb-2">🏛️</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Visible Landmarks
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Landmarks you can see from your seat
        </p>
      </div>
      
      <div className="space-y-4">
        {landmarks.map((landmark, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                landmark.side === 'Left' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              }`}>
                {landmark.side} Side
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs capitalize">
                {landmark.type}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              {landmark.name}
            </div>
            <div className="relative w-full h-32 rounded-lg overflow-hidden">
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