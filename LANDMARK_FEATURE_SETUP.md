# Landmark Detection Feature Setup

## Overview
The Scenic View Finder application now includes landmark detection functionality that identifies major landmarks visible from the flight path and determines which side of the plane they are on.

## Installation

### 1. Install Turf.js
Run the following command to install the required geospatial library:

```bash
npm install @turf/turf
```

### 2. Enable Turf.js in the API
After installing the package, uncomment the Turf.js import in `src/app/api/recommendation/route.ts`:

```typescript
// Change this line:
// import * as turf from '@turf/turf'; // Uncomment after installing @turf/turf

// To this:
import * as turf from '@turf/turf';
```

## Features Implemented

### 1. Landmark Database (`src/lib/landmarks.ts`)
- **25+ World-famous landmarks** including:
  - Mountains: Mount Fuji, Mount Everest, Mount Kilimanjaro, Matterhorn, Denali
  - Cities: New York, Tokyo, London, Paris, Sydney
  - Monuments: Eiffel Tower, Statue of Liberty, Taj Mahal, Christ the Redeemer
  - Natural Wonders: Grand Canyon, Niagara Falls, Victoria Falls, Uluru
  - Islands: Hawaii, Iceland, Maldives
  - Architecture: Burj Khalifa, Petronas Towers, Shanghai Tower

### 2. Landmark Detection Logic
- **Visibility Radius**: 300km from flight path
- **Side Detection**: Determines if landmarks are on Left or Right side of aircraft
- **Distance Calculation**: Uses great circle distance for accurate measurements
- **Bearing Analysis**: Calculates relative angles for side determination

### 3. Enhanced API Response
The API now returns additional landmark information:
```json
{
  "recommendation": "Left Side",
  "reason": "You will have a beautiful view of the sunset.",
  "flightPath": [...],
  "visibleLandmarks": [
    {
      "name": "Mount Fuji",
      "type": "Mountain", 
      "side": "Right"
    }
  ]
}
```

### 4. UI Enhancements
- **Landmark Display**: Shows visible landmarks in the recommendation card
- **Side Indicators**: Color-coded badges (Blue for Left, Green for Right)
- **Type Classification**: Shows landmark type (Mountain, City, Monument, etc.)
- **Visual Hierarchy**: Integrated seamlessly with existing boarding pass design

## Usage

1. **Enter Flight Details**: Fill in departure/arrival airports and time
2. **Get Recommendations**: The system will show both sun position and visible landmarks
3. **View Landmarks**: See which landmarks are visible and on which side of the plane
4. **Make Informed Decision**: Choose your seat based on both scenic views and landmark visibility

## Technical Details

### Visibility Calculation
- Uses great circle distance calculations
- Considers 300km visibility radius from flight path
- Accounts for Earth's curvature in calculations

### Side Determination
- Calculates bearing from flight midpoint to landmark
- Compares with overall flight bearing
- Determines relative angle (1-179° = Right, 181-359° = Left)

### Performance
- Efficient filtering of landmarks within range
- Minimal impact on API response time
- Scalable landmark database structure

## Future Enhancements
- Add more landmarks to the database
- Implement landmark-specific visibility conditions (weather, time of day)
- Add landmark photos and descriptions
- Include landmark elevation considerations 