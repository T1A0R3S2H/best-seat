export type Landmark = {
  name: string;
  type: string;
  coordinates: {
    lat: number;
    lon: number;
    alt: number;
  };
};

export const landmarks: Landmark[] = [
  // Mountains
  {
    name: 'Mount Fuji',
    type: 'Mountain',
    coordinates: { lat: 35.3606, lon: 138.7274, alt: 3776 }
  },
  {
    name: 'Mount Everest',
    type: 'Mountain',
    coordinates: { lat: 27.9881, lon: 86.9250, alt: 8848 }
  },
  {
    name: 'Mount Kilimanjaro',
    type: 'Mountain',
    coordinates: { lat: -3.0674, lon: 37.3556, alt: 5895 }
  },
  {
    name: 'Matterhorn',
    type: 'Mountain',
    coordinates: { lat: 45.9766, lon: 7.6586, alt: 4478 }
  },
  {
    name: 'Mount McKinley (Denali)',
    type: 'Mountain',
    coordinates: { lat: 63.0692, lon: -151.0070, alt: 6190 }
  },

  // Cities and Urban Areas
  {
    name: 'New York City',
    type: 'City',
    coordinates: { lat: 40.7128, lon: -74.0060, alt: 10 }
  },
  {
    name: 'Tokyo',
    type: 'City',
    coordinates: { lat: 35.6762, lon: 139.6503, alt: 40 }
  },
  {
    name: 'London',
    type: 'City',
    coordinates: { lat: 51.5074, lon: -0.1278, alt: 35 }
  },
  {
    name: 'Paris',
    type: 'City',
    coordinates: { lat: 48.8566, lon: 2.3522, alt: 35 }
  },
  {
    name: 'Sydney',
    type: 'City',
    coordinates: { lat: -33.8688, lon: 151.2093, alt: 6 }
  },

  // Monuments and Landmarks
  {
    name: 'Eiffel Tower',
    type: 'Monument',
    coordinates: { lat: 48.8584, lon: 2.2945, alt: 324 }
  },
  {
    name: 'Statue of Liberty',
    type: 'Monument',
    coordinates: { lat: 40.6892, lon: -74.0445, alt: 93 }
  },
  {
    name: 'Taj Mahal',
    type: 'Monument',
    coordinates: { lat: 27.1751, lon: 78.0421, alt: 73 }
  },
  {
    name: 'Christ the Redeemer',
    type: 'Monument',
    coordinates: { lat: -22.9519, lon: -43.2105, alt: 38 }
  },
  {
    name: 'Great Wall of China',
    type: 'Monument',
    coordinates: { lat: 40.4319, lon: 116.5704, alt: 1000 }
  },

  // Natural Wonders
  {
    name: 'Grand Canyon',
    type: 'Natural Wonder',
    coordinates: { lat: 36.1069, lon: -112.1129, alt: 2000 }
  },
  {
    name: 'Niagara Falls',
    type: 'Natural Wonder',
    coordinates: { lat: 43.0962, lon: -79.0377, alt: 167 }
  },
  {
    name: 'Victoria Falls',
    type: 'Natural Wonder',
    coordinates: { lat: -17.9243, lon: 25.8572, alt: 108 }
  },
  {
    name: 'Uluru (Ayers Rock)',
    type: 'Natural Wonder',
    coordinates: { lat: -25.3444, lon: 131.0369, alt: 863 }
  },

  // Islands and Coastal Features
  {
    name: 'Hawaii (Big Island)',
    type: 'Island',
    coordinates: { lat: 19.8968, lon: -155.5828, alt: 4205 }
  },
  {
    name: 'Iceland',
    type: 'Island',
    coordinates: { lat: 64.9631, lon: -19.0208, alt: 2000 }
  },
  {
    name: 'Maldives',
    type: 'Island',
    coordinates: { lat: 3.2028, lon: 73.2207, alt: 2 }
  },

  // Architectural Wonders
  {
    name: 'Burj Khalifa',
    type: 'Architecture',
    coordinates: { lat: 25.1972, lon: 55.2744, alt: 828 }
  },
  {
    name: 'Petronas Towers',
    type: 'Architecture',
    coordinates: { lat: 3.1579, lon: 101.7116, alt: 452 }
  },
  {
    name: 'Shanghai Tower',
    type: 'Architecture',
    coordinates: { lat: 31.2340, lon: 121.5060, alt: 632 }
  }
]; 