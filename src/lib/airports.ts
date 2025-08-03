export interface Airport {
  name: string;
  iata: string;
  city: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export const airports: Airport[] = [
  {
    name: "Indira Gandhi International Airport",
    iata: "DEL",
    city: "Delhi",
    coordinates: { lat: 28.5562, lon: 77.1000 }
  },
  {
    name: "Chhatrapati Shivaji Maharaj International Airport",
    iata: "BOM",
    city: "Mumbai",
    coordinates: { lat: 19.0896, lon: 72.8656 }
  },
  {
    name: "Kempegowda International Airport",
    iata: "BLR",
    city: "Bangalore",
    coordinates: { lat: 13.1986, lon: 77.7066 }
  },
  {
    name: "Chennai International Airport",
    iata: "MAA",
    city: "Chennai",
    coordinates: { lat: 12.9941, lon: 80.1709 }
  },
  {
    name: "Rajiv Gandhi International Airport",
    iata: "HYD",
    city: "Hyderabad",
    coordinates: { lat: 17.2403, lon: 78.4294 }
  },
  {
    name: "John F. Kennedy International Airport",
    iata: "JFK",
    city: "New York",
    coordinates: { lat: 40.6413, lon: -73.7781 }
  },
  {
    name: "Los Angeles International Airport",
    iata: "LAX",
    city: "Los Angeles",
    coordinates: { lat: 33.9416, lon: -118.4085 }
  },
  {
    name: "Heathrow Airport",
    iata: "LHR",
    city: "London",
    coordinates: { lat: 51.4700, lon: -0.4543 }
  },
  {
    name: "Haneda Airport",
    iata: "HND",
    city: "Tokyo",
    coordinates: { lat: 35.5494, lon: 139.7798 }
  },
  {
    name: "Dubai International Airport",
    iata: "DXB",
    city: "Dubai",
    coordinates: { lat: 25.2532, lon: 55.3657 }
  },
  {
    name: "Sydney Airport",
    iata: "SYD",
    city: "Sydney",
    coordinates: { lat: -33.9399, lon: 151.1753 }
  },
  {
    name: "Charles de Gaulle Airport",
    iata: "CDG",
    city: "Paris",
    coordinates: { lat: 49.0097, lon: 2.5479 }
  },
  {
    name: "Frankfurt Airport",
    iata: "FRA",
    city: "Frankfurt",
    coordinates: { lat: 50.0379, lon: 8.5622 }
  },
  {
    name: "Singapore Changi Airport",
    iata: "SIN",
    city: "Singapore",
    coordinates: { lat: 1.3644, lon: 103.9915 }
  },
  {
    name: "Hong Kong International Airport",
    iata: "HKG",
    city: "Hong Kong",
    coordinates: { lat: 22.3080, lon: 113.9185 }
  },
  {
    name: "Amsterdam Airport Schiphol",
    iata: "AMS",
    city: "Amsterdam",
    coordinates: { lat: 52.3105, lon: 4.7683 }
  },
  {
    name: "Madrid Barajas Airport",
    iata: "MAD",
    city: "Madrid",
    coordinates: { lat: 40.4983, lon: -3.5676 }
  },
  {
    name: "Rome Fiumicino Airport",
    iata: "FCO",
    city: "Rome",
    coordinates: { lat: 41.8045, lon: 12.2508 }
  },
  {
    name: "Barcelona El Prat Airport",
    iata: "BCN",
    city: "Barcelona",
    coordinates: { lat: 41.2974, lon: 2.0833 }
  },
  {
    name: "Munich Airport",
    iata: "MUC",
    city: "Munich",
    coordinates: { lat: 48.3538, lon: 11.7861 }
  }
];

export function findAirportByIata(iata: string): Airport | undefined {
  return airports.find(airport => airport.iata === iata.toUpperCase());
} 