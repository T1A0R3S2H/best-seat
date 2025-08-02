# Airplane Scenic View Finder

A Next.js web application that helps air travelers find the best seat for scenic views during their flight. The app analyzes flight paths, sun positions, and timing to recommend whether to sit on the left or right side of the plane for optimal views.
  
## Features

- **Flight Path Analysis**: Calculates great-circle flight paths between airports
- **Sun Position Calculation**: Uses the `suncalc` library to determine sun position during flight
- **Smart Recommendations**: Recommends left or right side seating based on sun position and flight direction
- **Interactive Map**: Visualizes flight paths using react-leaflet
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **TypeScript**: Fully typed for better development experience

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Maps**: react-leaflet with Leaflet
- **Sun Calculations**: suncalc
- **Date Handling**: date-fns
- **Icons**: Lucide React

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

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Core Algorithm

1. **Flight Path Calculation**: The app generates intermediate points along the great-circle path between departure and arrival airports
2. **Sun Position Analysis**: For the midpoint of the journey, it calculates the sun's azimuth (the angle between North, measured clockwise around the observer's horizon, and a celestial body (sun, moon)) and altitude
3. **Recommendation Logic**: 
   - Compares the sun's azimuth to the flight's bearing
   - If the sun is to the right of the flight path, recommends "Right Side"
   - If the sun is to the left, recommends "Left Side"
   - Determines if it's sunrise, sunset, or daytime based on sun altitude

### Data Structure

The app includes a curated list of major world airports with:
- Airport name and IATA code (unique 3 letter airport code)
- City location
- Latitude and longitude coordinates

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── recommendation/
│   │       └── route.ts          # API endpoint for seat recommendations
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── FlightForm.tsx            # Flight input form
│   ├── MapView.tsx               # Map wrapper component
│   ├── MapComponent.tsx          # Leaflet map implementation
│   └── RecommendationResult.tsx  # Results display component
├── lib/
│   ├── airports.ts               # Airport data and utilities
│   └── utils.ts                  # Utility functions
└── types/
    └── suncalc.d.ts              # TypeScript declarations for suncalc
```

## API Endpoints

### POST /api/recommendation

**Request Body:**
```json
{
  "departureIata": "JFK",
  "arrivalIata": "LAX", 
  "departureTimestamp": 1704067200000
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
  }
}
```

## Usage

1. **Select Airports**: Choose departure and arrival airports from the dropdown
2. **Set Date & Time**: Pick your departure date and time
3. **Get Recommendation**: Click "Find Best Seat" to get your recommendation
4. **View Results**: See the recommended side, reason, and interactive flight path map

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
