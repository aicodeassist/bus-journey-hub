import { MapPin, Calendar, ArrowRightLeft, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "./DatePicker";
import PassengerPicker from "./PassengerPicker";

interface SearchFormProps {
  variant?: "hero" | "compact";
  initialData?: {
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    adults?: number;
    children?: number;
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
    adults: initialData?.adults || 1,
    children: initialData?.children || 0,
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
    const totalPassengers = formData.adults + formData.children;
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.departureDate,
      returnDate: formData.returnDate,
      passengers: totalPassengers.toString(),
      adults: formData.adults.toString(),
      children: formData.children.toString(),
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
          : "bg-card rounded-2xl shadow-card p-4"
        }
      `}
    >
      <div className={`flex flex-col ${isHero ? "lg:flex-row" : "md:flex-row"} gap-3 items-stretch`}>
        {/* From Field */}
        <div className={`relative ${isHero ? "lg:flex-1" : "md:flex-1"}`}>
          {isHero && (
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Звідки
            </label>
          )}
          <div className="relative h-[52px]">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent z-10" />
            <input
              type="text"
              placeholder={isHero ? "Місто відправлення" : "Звідки"}
              value={formData.from}
              onChange={(e) => setFormData(prev => ({ ...prev, from: e.target.value }))}
              onFocus={() => setShowFromSuggestions(true)}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
              className="w-full h-full px-4 pl-12 rounded-xl border-2 border-transparent bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:bg-card transition-all duration-300 hover:bg-secondary"
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

        {/* Swap Button */}
        <div className={`flex items-center justify-center ${isHero ? "lg:items-end lg:pb-1" : "md:items-center"}`}>
          <button
            type="button"
            onClick={handleSwapCities}
            className={`p-2.5 rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-all duration-300 group ${isHero ? "mt-0" : ""}`}
          >
            <ArrowRightLeft className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
          </button>
        </div>

        {/* To Field */}
        <div className={`relative ${isHero ? "lg:flex-1" : "md:flex-1"}`}>
          {isHero && (
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Куди
            </label>
          )}
          <div className="relative h-[52px]">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent z-10" />
            <input
              type="text"
              placeholder={isHero ? "Місто прибуття" : "Куди"}
              value={formData.to}
              onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
              onFocus={() => setShowToSuggestions(true)}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
              className="w-full h-full px-4 pl-12 rounded-xl border-2 border-transparent bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:bg-card transition-all duration-300 hover:bg-secondary"
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
        <div className={isHero ? "lg:flex-1" : "md:flex-1"}>
          {isHero && (
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Дати
            </label>
          )}
          <div className="relative flex items-center h-[52px] bg-secondary/50 rounded-xl border-2 border-transparent hover:bg-secondary focus-within:border-accent focus-within:bg-card transition-all duration-300">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent z-10 pointer-events-none" />
            
            {/* Departure Date */}
            <div className="relative flex-1 h-full flex flex-col justify-center pl-12 pr-2">
              <span className="text-[10px] font-medium text-muted-foreground leading-none">
                Туди
              </span>
              <DatePicker
                value={formData.departureDate}
                onChange={(date) => setFormData(prev => ({ ...prev, departureDate: date }))}
                placeholder="Виберіть"
              />
            </div>
            
            {/* Divider */}
            <div className="w-px h-8 bg-border flex-shrink-0" />
            
            {/* Return Date */}
            <div className="relative flex-1 h-full flex flex-col justify-center pl-3 pr-2">
              <span className="text-[10px] font-medium text-muted-foreground leading-none">
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
        <div className={isHero ? "lg:w-48" : "md:w-40"}>
          {isHero && (
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Пасажири
            </label>
          )}
          <div className="h-[52px]">
            <PassengerPicker
              adults={formData.adults}
              children={formData.children}
              onChangeAdults={(count) => setFormData(prev => ({ ...prev, adults: count }))}
              onChangeChildren={(count) => setFormData(prev => ({ ...prev, children: count }))}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className={`${isHero ? "lg:w-auto" : "md:w-auto"} flex items-end`}>
          <button
            type="submit"
            className="btn-primary h-[52px] px-6 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Search className="w-5 h-5" />
            <span>{isHero ? "Знайти квитки" : "Знайти"}</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;