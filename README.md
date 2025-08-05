# Scenic View Finder

A Next.js web application that helps air travelers find the best seat for scenic views during their flight. The app analyzes flight paths, sun positions, timing, and visible landmarks to recommend whether to sit on the left or right side of the plane for optimal views.
  
## Features

- **Flight Path Analysis**: Calculates great-circle flight paths between airports with precise timing
- **Sun Position Calculation**: Uses the `suncalc` library to determine sun position during flight
- **Smart Recommendations**: Recommends left or right side seating based on sun position and flight direction
- **Landmark Detection**: Identifies major landmarks visible from the flight path (within 50km radius)
- **Visual Landmarks**: Displays high-quality images of landmarks using Unsplash API integration
- **Interactive Map**: Visualizes flight paths using react-leaflet with departure/arrival markers
- **Dark Mode Support**: Full dark/light theme toggle with system preference detection
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Optimized for desktop and mobile devices
- **TypeScript**: Fully typed for better development experience

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **UI Components**: shadcn/ui with Radix UI primitives
- **Maps**: react-leaflet with Leaflet
- **Sun Calculations**: suncalc
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Geospatial**: @turf/turf for landmark calculations
- **Images**: Unsplash API integration
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18.16.1 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd best-seat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (optional for Unsplash images):
Create a `.env.local` file in the project root:
```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Core Algorithm

1. **Flight Path Calculation**: The app generates intermediate points along the great-circle path between departure and arrival airports using provided flight duration
2. **Sun Position Analysis**: For the midpoint of the journey, it calculates the sun's azimuth and altitude
3. **Landmark Detection**: Identifies landmarks within 50km of the flight path that are visible based on time of day
4. **Recommendation Logic**: 
   - Compares the sun's azimuth to the flight's bearing
   - For sunrise/sunset: recommends the side facing the sun for optimal views
   - For daytime: recommends the side away from the sun to avoid glare
   - For nighttime: recommends either side for night sky viewing
   - Considers visible landmarks in the recommendation

### Data Structure

The app includes:
- **Airports Database**: Curated list of major world airports with IATA codes, city names, and coordinates
- **Landmarks Database**: 25+ world-famous landmarks including mountains, cities, monuments, natural wonders, and architectural marvels

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── recommendation/
│   │   │   └── route.ts          # API endpoint for seat recommendations
│   │   └── unsplash/
│   │       └── route.ts          # API endpoint for landmark images
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with theme provider
│   └── page.tsx                  # Main page component
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── FlightForm.tsx            # Flight input form with enhanced UI
│   ├── MapView.tsx               # Map wrapper component
│   ├── MapComponent.tsx          # Leaflet map implementation
│   ├── RecommendationResult.tsx  # Results display component
│   ├── VisibleLandmarks.tsx      # Landmark display component
│   ├── LandmarkImage.tsx         # Unsplash image integration
│   └── ThemeToggleButton.tsx     # Dark/light mode toggle
├── contexts/
│   └── ThemeContext.tsx          # Theme management context
├── lib/
│   ├── airports.ts               # Airport data and utilities
│   ├── landmarks.ts              # Landmark database and types
│   ├── flightSunPositions.ts     # Sun position calculations
│   ├── getSubsolarPoint.ts       # Subsolar point utilities
│   └── utils.ts                  # Utility functions
└── types/
    ├── map-component.d.ts        # Map component types
    └── suncalc.d.ts              # TypeScript declarations for suncalc
```

## API Endpoints

### POST /api/recommendation

**Request Body:**
```json
{
  "departureIata": "JFK",
  "arrivalIata": "LAX", 
  "departureTimestamp": 1704067200000,
  "flightDurationMinutes": 330
}
```

**Response:**
```json
{
  "recommendation": "Left Side",
  "reason": "You will have a beautiful view of the sunset.",
  "flightPath": [
    {
      "lat": 40.6413,
      "lon": -73.7781,
      "time": 1704067200000
    }
  ],
  "sunPosition": {
    "azimuth": 245.6,
    "altitude": 12.3
  },
  "flightDuration": 330,
  "departureTime": "10:00 AM",
  "arrivalTime": "3:30 PM",
  "departureAirport": {
    "iata": "JFK",
    "city": "New York",
    "coordinates": {
      "lat": 40.6413,
      "lon": -73.7781
    }
  },
  "arrivalAirport": {
    "iata": "LAX",
    "city": "Los Angeles",
    "coordinates": {
      "lat": 33.9416,
      "lon": -118.4085
    }
  },
  "visibleLandmarks": [
    {
      "name": "Mount Fuji",
      "type": "Mountain",
      "side": "Right"
    }
  ]
}
```

### GET /api/unsplash

**Query Parameters:**
- `query`: Search term for landmark images

**Response:**
```json
{
  "images": [
    {
      "id": "image_id",
      "urls": {
        "small": "https://...",
        "regular": "https://..."
      },
      "alt_description": "Description",
      "user": {
        "name": "Photographer Name"
      }
    }
  ]
}
```

## Features in Detail

### Landmark Detection
- **25+ World Landmarks**: Including Mount Fuji, Eiffel Tower, Grand Canyon, and more
- **Smart Visibility**: Considers time of day and landmark type for visibility
- **Side Detection**: Determines if landmarks are on the left or right side of the aircraft
- **Visual Integration**: High-quality images from Unsplash API

### Enhanced UI/UX
- **Dark Mode**: Full theme support with system preference detection
- **Responsive Design**: Optimized layouts for desktop and mobile
- **Loading States**: Smooth loading animations and skeleton screens
- **Error Handling**: Graceful error states with helpful messages

### Flight Analysis
- **Precise Timing**: Uses actual flight duration for accurate calculations
- **Multiple Time Points**: Analyzes sun position at multiple points along the flight path
- **Enhanced Recommendations**: Considers both sun position and visible landmarks

## Usage

1. **Select Airports**: Choose departure and arrival airports from the dropdown
2. **Set Date & Time**: Pick your departure date and time
3. **Enter Flight Duration**: Specify the flight duration in minutes
4. **Get Recommendation**: Click "Find Best Seat" to get your recommendation
5. **View Results**: See the recommended side, reason, interactive flight path map, and visible landmarks
6. **Toggle Theme**: Use the theme toggle button for dark/light mode

## Environment Variables

### Required
- None (app works without any environment variables)

### Optional
- `UNSPLASH_ACCESS_KEY`: Your Unsplash API access key for landmark images
  - Get one at [Unsplash Developers](https://unsplash.com/developers)
  - Demo mode: 50 requests/hour (perfect for development)
  - Production mode: 5000 requests/hour

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [suncalc](https://github.com/mourner/suncalc) for sun position calculations
- [react-leaflet](https://react-leaflet.js.org/) for map integration
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Unsplash](https://unsplash.com/) for landmark images
- [@turf/turf](https://turfjs.org/) for geospatial calculations
