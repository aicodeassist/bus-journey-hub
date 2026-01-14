import { Clock, MapPin, Bus, Wifi, Snowflake, Plug, Star, Droplets, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import RouteTimeline from "./RouteTimeline";

interface RouteStop {
  time: string;
  date?: string;
  city: string;
  station: string;
}

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
  stops?: RouteStop[];
  onSelect?: () => void;
  isSelected?: boolean;
}

const amenityIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  wifi: { icon: <Wifi className="w-4 h-4" />, label: "Wi-Fi" },
  ac: { icon: <Snowflake className="w-4 h-4" />, label: "Кондиціонер" },
  power: { icon: <Plug className="w-4 h-4" />, label: "Розетки" },
  wc: { icon: <Droplets className="w-4 h-4" />, label: "Туалет" },
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
  stops,
  onSelect,
  isSelected = false,
}: RouteCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={`route-card ${isSelected ? "ring-2 ring-accent bg-accent/5" : ""}`}>
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
                  title={amenityIcons[amenity]?.label || amenity}
                >
                  {amenityIcons[amenity]?.icon}
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
            <button 
              onClick={onSelect}
              className={`px-6 py-3 text-sm rounded-xl font-medium transition-all ${
                isSelected 
                  ? "bg-accent text-accent-foreground" 
                  : "btn-primary"
              }`}
            >
              {isSelected ? "Обрано ✓" : "Обрати"}
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Details Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-4 pt-4 border-t border-border flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>{showDetails ? "Сховати деталі" : "Детальніше про рейс"}</span>
        {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Details Panel */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-border animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Route Info */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Маршрут</h4>
              <RouteTimeline 
                stops={stops || [
                  { time: departureTime, city: departureCity, station: `${departureCity}, Центральний автовокзал` },
                  { time: arrivalTime, city: arrivalCity, station: `${arrivalCity}, Центральний автовокзал` },
                ]}
                showIntermediateStops={true}
              />
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Зручності</h4>
              <div className="space-y-2">
                {amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-accent">
                      {amenityIcons[amenity]?.icon}
                    </div>
                    <span>{amenityIcons[amenity]?.label || amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Carrier Info */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Перевізник</h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bus className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{carrier}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span>{carrierRating} / 5.0</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Тип автобуса: <span className="text-foreground">{busType}</span></p>
                <p>Клас обслуговування: <span className="text-foreground">Стандарт</span></p>
              </div>
            </div>
          </div>

          {/* Policies */}
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="font-semibold text-foreground mb-3">Умови перевезення</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p>• Безкоштовне скасування за 24 години до виїзду</p>
                <p>• 1 місце багажу включено (до 20 кг)</p>
              </div>
              <div>
                <p>• Ручна поклажа до 5 кг</p>
                <p>• Посадка за 15 хвилин до відправлення</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteCard;