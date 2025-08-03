'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LandmarkImageProps {
  landmarkName: string;
  landmarkType: string;
  className?: string;
}

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

export function LandmarkImage({ landmarkName, landmarkType, className = "w-8 h-8 rounded" }: LandmarkImageProps) {
  const [image, setImage] = useState<UnsplashImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Create search query based on landmark name and type
        const searchQuery = `${landmarkName} ${landmarkType}`.toLowerCase();
        
        const response = await fetch(`/api/unsplash?query=${encodeURIComponent(searchQuery)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        
        const data = await response.json();
        
        if (data.images && data.images.length > 0) {
          setImage(data.images[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching landmark image:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [landmarkName, landmarkType]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse rounded`} />
    );
  }

  if (error || !image) {
    return (
      <div className={`${className} bg-gray-100 rounded flex items-center justify-center`}>
        <span className="text-gray-400 text-xs">🏛️</span>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden rounded`}>
      <Image
        src={image.urls.regular}
        alt={image.alt_description || `${landmarkName} ${landmarkType}`}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 400px"
        quality={85}
        priority={false}
        style={{
          imageRendering: 'crisp-edges',
        }}
      />
    </div>
  );
} 