import { Clock, MapPin, Bus, Wifi, Snowflake, Plug, Star } from "lucide-react";

interface RouteCardProps {
  id: string;
  carrier: string;
  carrierRating: number;
  departureTime: string;
  arrivalTime: string;
  departureCity: string;
  arrivalCity: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  amenities: string[];
  busType: string;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  ac: <Snowflake className="w-4 h-4" />,
  power: <Plug className="w-4 h-4" />,
};

const RouteCard = ({
  carrier,
  carrierRating,
  departureTime,
  arrivalTime,
  departureCity,
  arrivalCity,
  duration,
  price,
  seatsAvailable,
  amenities,
  busType,
}: RouteCardProps) => {
  return (
    <div className="route-card">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        {/* Carrier Info */}
        <div className="flex items-center gap-4 lg:w-48">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{carrier}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-muted-foreground">{carrierRating}</span>
            </div>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="flex-1">
          <div className="flex items-center gap-4">
            {/* Departure */}
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{departureTime}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {departureCity}
              </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <div className="flex-1 relative">
                <div className="h-0.5 bg-border w-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{duration}</span>
                  </div>
                </div>
              </div>
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>

            {/* Arrival */}
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{arrivalTime}</div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {arrivalCity}
              </div>
            </div>
          </div>

          {/* Amenities & Bus Type */}
          <div className="flex items-center gap-4 mt-4">
            <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
              {busType}
            </span>
            <div className="flex items-center gap-2">
              {amenities.map(amenity => (
                <div 
                  key={amenity}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground"
                  title={amenity}
                >
                  {amenityIcons[amenity]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price & Booking */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-2 lg:w-48 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-border lg:pl-6">
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">{price} ₴</div>
            <div className="text-sm text-muted-foreground">за місце</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-sm ${seatsAvailable < 5 ? "text-destructive" : "text-muted-foreground"}`}>
              {seatsAvailable < 5 ? `Залишилось ${seatsAvailable} місць` : `${seatsAvailable} місць`}
            </span>
            <button className="btn-primary px-6 py-3 text-sm">
              Обрати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
