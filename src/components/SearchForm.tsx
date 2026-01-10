import { MapPin, Calendar, Users, ArrowRightLeft, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "./DatePicker";
interface SearchFormProps {
  variant?: "hero" | "compact";
  initialData?: {
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    passengers?: number;
  };
}

const popularCities = [
  "Київ", "Львів", "Одеса", "Харків", "Дніпро", 
  "Запоріжжя", "Вінниця", "Полтава", "Чернівці", "Ужгород"
];

const SearchForm = ({ variant = "hero", initialData }: SearchFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    from: initialData?.from || "",
    to: initialData?.to || "",
    departureDate: initialData?.departureDate || "",
    returnDate: initialData?.returnDate || "",
    passengers: initialData?.passengers || 1,
  });
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const handleSwapCities = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.departureDate,
      returnDate: formData.returnDate,
      passengers: formData.passengers.toString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  const filteredFromCities = popularCities.filter(city => 
    city.toLowerCase().includes(formData.from.toLowerCase())
  );

  const filteredToCities = popularCities.filter(city => 
    city.toLowerCase().includes(formData.to.toLowerCase())
  );

  const isHero = variant === "hero";

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        ${isHero 
          ? "bg-card rounded-3xl shadow-search p-6 md:p-8" 
          : "bg-card rounded-2xl shadow-card p-4 md:p-6"
        }
      `}
    >
      <div className={`grid gap-4 ${isHero ? "md:grid-cols-2 lg:grid-cols-5" : "md:grid-cols-6"}`}>
        {/* From Field */}
        <div className={`relative ${isHero ? "lg:col-span-1" : "md:col-span-1"}`}>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Звідки
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
            <input
              type="text"
              placeholder="Місто відправлення"
              value={formData.from}
              onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
              onFocus={() => setShowFromSuggestions(true)}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              className="search-input pl-12"
              required
            />
            {showFromSuggestions && formData.from && filteredFromCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-card border border-border z-20 overflow-hidden">
                {filteredFromCities.slice(0, 5).map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, from: city }));
                      setShowFromSuggestions(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Swap Button - Only visible on larger screens between from/to */}
        {isHero && (
          <div className="hidden lg:flex items-end justify-center pb-2">
            <button
              type="button"
              onClick={handleSwapCities}
              className="p-3 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-all duration-300 group"
            >
              <ArrowRightLeft className="w-5 h-5 transition-transform group-hover:rotate-180 duration-300" />
            </button>
          </div>
        )}

        {/* To Field */}
        <div className={`relative ${isHero ? "lg:col-span-1" : "md:col-span-1"}`}>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Куди
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
            <input
              type="text"
              placeholder="Місто прибуття"
              value={formData.to}
              onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
              onFocus={() => setShowToSuggestions(true)}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              className="search-input pl-12"
              required
            />
            {showToSuggestions && formData.to && filteredToCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-card border border-border z-20 overflow-hidden">
                {filteredToCities.slice(0, 5).map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, to: city }));
                      setShowToSuggestions(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3"
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Combined Date Fields */}
        <div className={isHero ? "lg:col-span-1" : "md:col-span-2"}>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Дати поїздки
          </label>
          <div className="relative flex items-center bg-secondary rounded-xl border-2 border-transparent focus-within:border-accent transition-colors">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent z-10 pointer-events-none" />
            
            {/* Departure Date */}
            <div className="relative flex-1 pl-10">
              <span className="absolute left-10 top-1 text-[10px] font-medium text-muted-foreground pointer-events-none">
                Туди
              </span>
              <DatePicker
                value={formData.departureDate}
                onChange={(date) => setFormData(prev => ({ ...prev, departureDate: date }))}
                placeholder="Виберіть"
              />
            </div>
            
            {/* Divider */}
            <div className="w-px h-10 bg-border flex-shrink-0" />
            
            {/* Return Date */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1 text-[10px] font-medium text-muted-foreground pointer-events-none">
                Назад
              </span>
              <DatePicker
                value={formData.returnDate}
                onChange={(date) => setFormData(prev => ({ ...prev, returnDate: date }))}
                placeholder="+ Додати"
                minDate={formData.departureDate}
              />
            </div>
          </div>
        </div>

        {/* Passengers */}
        <div className={isHero ? "" : "md:col-span-1"}>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Пасажири
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
            <select
              value={formData.passengers}
              onChange={(e) => setFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
              className="search-input pl-12 appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "пасажир" : num < 5 ? "пасажири" : "пасажирів"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className={`${isHero ? "md:col-span-2 lg:col-span-5" : "md:col-span-1"} flex items-end`}>
          <button
            type="submit"
            className={`
              btn-primary w-full flex items-center justify-center gap-3 
              ${isHero ? "py-4 text-lg" : "py-3"}
            `}
          >
            <Search className="w-5 h-5" />
            <span>Знайти квитки</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
