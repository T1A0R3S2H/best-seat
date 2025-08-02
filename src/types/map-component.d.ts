declare module '*/MapComponent' {
  interface FlightPathPoint {
    lat: number;
    lon: number;
    time: number;
  }

  interface MapComponentProps {
    flightPath: FlightPathPoint[];
  }

  const MapComponent: React.ComponentType<MapComponentProps>;
  export default MapComponent;
} 