import { Calendar, ArrowRightLeft, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "./DatePicker";
import PassengerPicker from "./PassengerPicker";
import CityPicker from "./CityPicker";

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

  const isHero = variant === "hero";

  return (
    <form 
      onSubmit={handleSubmit}
      className={`
        ${isHero 
          ? "bg-card rounded-3xl shadow-search p-4 md:p-6" 
          : "bg-card rounded-2xl shadow-card p-4"
        }
      `}
    >
      <div className={`flex flex-col ${isHero ? "lg:flex-row" : "md:flex-row"} gap-3 items-stretch`}>
        {/* Cities Container with Swap Button */}
        <div className={`relative flex flex-col md:flex-row gap-3 ${isHero ? "lg:flex-[2]" : "md:flex-[2]"}`}>
          {/* From Field */}
          <div className="relative flex-1">
            {isHero && (
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Звідки
              </label>
            )}
            <div className="h-[52px]">
              <CityPicker
                value={formData.from}
                onChange={(city) => setFormData(prev => ({ ...prev, from: city }))}
                placeholder={isHero ? "Місто відправлення" : "Звідки"}
                label="Звідки"
              />
            </div>
          </div>

          {/* Swap Button - positioned between cities */}
          <div className={`
            absolute z-20
            md:top-1/2 md:left-1/2 md:-translate-x-1/2
            ${isHero ? "md:translate-y-1" : "md:-translate-y-1/2"}
            top-[52px] right-4 -translate-y-1/2 md:right-auto
            ${isHero && "lg:top-[calc(50%+14px)]"}
          `}>
            <button
              type="button"
              onClick={handleSwapCities}
              className="p-2.5 rounded-full bg-card border-2 border-border shadow-soft hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 group"
            >
              <ArrowRightLeft className="w-4 h-4 transition-transform group-hover:rotate-180 duration-300" />
            </button>
          </div>

          {/* To Field */}
          <div className="relative flex-1">
            {isHero && (
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Куди
              </label>
            )}
            <div className="h-[52px]">
              <CityPicker
                value={formData.to}
                onChange={(city) => setFormData(prev => ({ ...prev, to: city }))}
                placeholder={isHero ? "Місто прибуття" : "Куди"}
                label="Куди"
              />
            </div>
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
        <div className={isHero ? "lg:w-44" : "md:w-40"}>
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
        <div className={`flex ${isHero ? "lg:items-end" : "md:items-center"}`}>
          {isHero && <div className="hidden lg:block h-[22px]" />}
          <button
            type="submit"
            className={`btn-primary h-[52px] px-6 flex items-center justify-center gap-2 whitespace-nowrap ${isHero ? "w-full lg:w-auto" : "w-full md:w-auto"}`}
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
