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
import { LandmarkImage } from './LandmarkImage';

interface FlightFormProps {
  onSubmit: (data: {
    departureIata: string;
    arrivalIata: string;
    departureTimestamp: number;
    flightDurationMinutes: number;
  }) => void;
  isLoading: boolean;
  visibleLandmarks?: Array<{
    name: string;
    type: string;
    side: 'Left' | 'Right';
  }>;
}

export function FlightForm({ onSubmit, isLoading, visibleLandmarks }: FlightFormProps) {
  const [departureAirport, setDepartureAirport] = useState<Airport | null>(null);
  const [arrivalAirport, setArrivalAirport] = useState<Airport | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('12:00');
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
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

    // Validate that user has entered a flight duration
    if (duration.hours === 0 && duration.minutes === 0) {
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const departureDate = new Date(date);
    departureDate.setHours(hours, minutes, 0, 0);

    // Calculate total duration in minutes
    const flightDurationMinutes = duration.hours * 60 + duration.minutes;

    onSubmit({
      departureIata: departureAirport.iata,
      arrivalIata: arrivalAirport.iata,
      departureTimestamp: departureDate.getTime(),
      flightDurationMinutes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-3">
        {/* Departure Airport */}
        <div className="space-y-1">
          <Label htmlFor="departure" className="text-xs font-medium text-gray-700 dark:text-gray-300">
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
              <div className="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {filteredDepartureAirports.map((airport) => (
                  <button
                    key={airport.iata}
                    type="button"
                    className="w-full px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                    onClick={() => {
                      setDepartureAirport(airport);
                      setDepartureSearch(`${airport.iata} - ${airport.city}`);
                      setShowDepartureDropdown(false);
                    }}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{airport.iata}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
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
          <Label htmlFor="arrival" className="text-xs font-medium text-gray-700 dark:text-gray-300">
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
              <div className="absolute z-10 w-full mt-1 border rounded-lg shadow-lg max-h-48 overflow-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {filteredArrivalAirports.map((airport) => (
                  <button
                    key={airport.iata}
                    type="button"
                    className="w-full px-3 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                    onClick={() => {
                      setArrivalAirport(airport);
                      setArrivalSearch(`${airport.iata} - ${airport.city}`);
                      setShowArrivalDropdown(false);
                    }}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">{airport.iata}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
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
            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Date</Label>
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
            <Label htmlFor="time" className="text-xs font-medium text-gray-700 dark:text-gray-300">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
        </div>

        {/* Flight Duration */}
        <div className="space-y-1">
          <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Flight Duration</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="hours" className="text-xs font-medium text-gray-600 dark:text-gray-400">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="24"
                placeholder="H"
                value={duration.hours || ''}
                onChange={(e) => setDuration(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="minutes" className="text-xs font-medium text-gray-600 dark:text-gray-400">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                placeholder="M"
                value={duration.minutes || ''}
                onChange={(e) => setDuration(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                className="h-9 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-9 text-sm" 
        disabled={!departureAirport || !arrivalAirport || !date || (duration.hours === 0 && duration.minutes === 0) || isLoading}
      >
        <Plane className="mr-2 h-3 w-3" />
        {isLoading ? 'Finding...' : 'Find Best Seat'}
      </Button>

             {/* Visible Landmarks Section */}
       {visibleLandmarks && visibleLandmarks.length > 0 && (
         <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
           <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
             <h4 className="text-xs font-medium mb-3 text-blue-700 dark:text-blue-300">
               🏛️ Visible Landmarks
             </h4>
             <div className="grid grid-cols-1 gap-3">
               {visibleLandmarks.map((landmark, index) => (
                 <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                   <div className="flex items-center justify-between mb-2">
                     <span className={`px-2 py-1 rounded text-xs font-medium ${
                       landmark.side === 'Left' 
                         ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                         : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                     }`}>
                       {landmark.side} Side
                     </span>
                     <span className="text-gray-500 dark:text-gray-400 text-xs">{landmark.type}</span>
                   </div>
                   <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                     {landmark.name}
                   </div>
                   <div className="relative w-full h-24 rounded overflow-hidden">
                     <LandmarkImage 
                       landmarkName={landmark.name}
                       landmarkType={landmark.type}
                       className="w-full h-full"
                     />
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       )}
    </form>
  );
} 