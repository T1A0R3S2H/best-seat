'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plane } from 'lucide-react';
import { format } from 'date-fns';
import { airports, Airport } from '@/lib/airports';
import { cn } from '@/lib/utils';

interface FlightFormProps {
  onSubmit: (data: {
    departureIata: string;
    arrivalIata: string;
    departureTimestamp: number;
  }) => void;
  isLoading: boolean;
}

export function FlightForm({ onSubmit, isLoading }: FlightFormProps) {
  const [departureAirport, setDepartureAirport] = useState<Airport | null>(null);
  const [arrivalAirport, setArrivalAirport] = useState<Airport | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('12:00');
  const [departureSearch, setDepartureSearch] = useState('');
  const [arrivalSearch, setArrivalSearch] = useState('');
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showArrivalDropdown, setShowArrivalDropdown] = useState(false);

  const filteredDepartureAirports = airports.filter(airport =>
    airport.name.toLowerCase().includes(departureSearch.toLowerCase()) ||
    airport.iata.toLowerCase().includes(departureSearch.toLowerCase()) ||
    airport.city.toLowerCase().includes(departureSearch.toLowerCase())
  );

  const filteredArrivalAirports = airports.filter(airport =>
    airport.name.toLowerCase().includes(arrivalSearch.toLowerCase()) ||
    airport.iata.toLowerCase().includes(arrivalSearch.toLowerCase()) ||
    airport.city.toLowerCase().includes(arrivalSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!departureAirport || !arrivalAirport || !date) {
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const departureDate = new Date(date);
    departureDate.setHours(hours, minutes, 0, 0);

    onSubmit({
      departureIata: departureAirport.iata,
      arrivalIata: arrivalAirport.iata,
      departureTimestamp: departureDate.getTime(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-3">
        {/* Departure Airport */}
        <div className="space-y-1">
          <Label htmlFor="departure" className="text-xs font-medium text-gray-700">
            Departure Airport
          </Label>
          <div className="relative">
            <Input
              id="departure"
              placeholder="Search departure airport..."
              value={departureSearch}
              onChange={(e) => {
                setDepartureSearch(e.target.value);
                setShowDepartureDropdown(true);
              }}
              onFocus={() => setShowDepartureDropdown(true)}
              className="h-9 text-sm"
            />
            {showDepartureDropdown && (
              <div className="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-auto bg-white border-gray-200">
                {filteredDepartureAirports.map((airport) => (
                  <button
                    key={airport.iata}
                    type="button"
                    className="w-full px-3 py-2 text-left transition-colors hover:bg-gray-50 text-sm"
                    onClick={() => {
                      setDepartureAirport(airport);
                      setDepartureSearch(`${airport.iata} - ${airport.city}`);
                      setShowDepartureDropdown(false);
                    }}
                  >
                    <div className="font-medium">{airport.iata}</div>
                    <div className="text-xs text-gray-600">
                      {airport.city}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Arrival Airport */}
        <div className="space-y-1">
          <Label htmlFor="arrival" className="text-xs font-medium text-gray-700">
            Arrival Airport
          </Label>
          <div className="relative">
            <Input
              id="arrival"
              placeholder="Search arrival airport..."
              value={arrivalSearch}
              onChange={(e) => {
                setArrivalSearch(e.target.value);
                setShowArrivalDropdown(true);
              }}
              onFocus={() => setShowArrivalDropdown(true)}
              className="h-9 text-sm"
            />
            {showArrivalDropdown && (
              <div className="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-auto bg-white border-gray-200">
                {filteredArrivalAirports.map((airport) => (
                  <button
                    key={airport.iata}
                    type="button"
                    className="w-full px-3 py-2 text-left transition-colors hover:bg-gray-50 text-sm"
                    onClick={() => {
                      setArrivalAirport(airport);
                      setArrivalSearch(`${airport.iata} - ${airport.city}`);
                      setShowArrivalDropdown(false);
                    }}
                  >
                    <div className="font-medium">{airport.iata}</div>
                    <div className="text-xs text-gray-600">
                      {airport.city}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium text-gray-700">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9 text-sm",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {date ? format(date, "MMM dd") : <span>Pick date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label htmlFor="time" className="text-xs font-medium text-gray-700">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-9 text-sm" 
        disabled={!departureAirport || !arrivalAirport || !date || isLoading}
      >
        <Plane className="mr-2 h-3 w-3" />
        {isLoading ? 'Finding...' : 'Find Best Seat'}
      </Button>
    </form>
  );
} 