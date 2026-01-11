import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import RouteCard from "@/components/RouteCard";
import Footer from "@/components/Footer";
import { Filter, SortAsc, ChevronDown, X } from "lucide-react";
import { useState, useMemo } from "react";

// Mock data for search results
const mockRoutes = [
  {
    id: "1",
    carrier: "Автолюкс",
    carrierRating: 4.8,
    departureTime: "06:30",
    arrivalTime: "12:45",
    departureCity: "Київ",
    arrivalCity: "Львів",
    duration: "6г 15хв",
    price: 450,
    seatsAvailable: 12,
    amenities: ["wifi", "ac", "power"],
    busType: "Комфорт",
  },
  {
    id: "2",
    carrier: "Gunsel",
    carrierRating: 4.9,
    departureTime: "08:00",
    arrivalTime: "13:30",
    departureCity: "Київ",
    arrivalCity: "Львів",
    duration: "5г 30хв",
    price: 520,
    seatsAvailable: 4,
    amenities: ["wifi", "ac", "power", "wc"],
    busType: "VIP",
  },
  {
    id: "3",
    carrier: "УкрБус",
    carrierRating: 4.5,
    departureTime: "10:15",
    arrivalTime: "17:00",
    departureCity: "Київ",
    arrivalCity: "Львів",
    duration: "6г 45хв",
    price: 380,
    seatsAvailable: 23,
    amenities: ["ac"],
    busType: "Стандарт",
  },
  {
    id: "4",
    carrier: "Автолюкс",
    carrierRating: 4.8,
    departureTime: "14:00",
    arrivalTime: "19:45",
    departureCity: "Київ",
    arrivalCity: "Львів",
    duration: "5г 45хв",
    price: 480,
    seatsAvailable: 8,
    amenities: ["wifi", "ac", "power"],
    busType: "Комфорт",
  },
  {
    id: "5",
    carrier: "EuroClub",
    carrierRating: 4.7,
    departureTime: "16:30",
    arrivalTime: "22:15",
    departureCity: "Київ",
    arrivalCity: "Львів",
    duration: "5г 45хв",
    price: 490,
    seatsAvailable: 15,
    amenities: ["wifi", "ac", "wc"],
    busType: "Комфорт",
  },
  {
    id: "6",
    carrier: "Night Express",
    carrierRating: 4.6,
    departureTime: "22:00",
    arrivalTime: "05:30",
    departureCity: "Київ",
    arrivalCity: "Львів",
    duration: "7г 30хв",
    price: 420,
    seatsAvailable: 18,
    amenities: ["wifi", "ac", "power"],
    busType: "Нічний",
  },
];

interface Filters {
  timeSlots: string[];
  priceMin: string;
  priceMax: string;
  carriers: string[];
  amenities: string[];
}

const timeSlots = [
  { id: "morning", label: "Ранок (06:00-12:00)", start: 6, end: 12 },
  { id: "afternoon", label: "День (12:00-18:00)", start: 12, end: 18 },
  { id: "evening", label: "Вечір (18:00-00:00)", start: 18, end: 24 },
  { id: "night", label: "Ніч (00:00-06:00)", start: 0, end: 6 },
];

const amenitiesList = [
  { id: "wifi", label: "Wi-Fi" },
  { id: "ac", label: "Кондиціонер" },
  { id: "power", label: "Розетки" },
  { id: "wc", label: "Туалет" },
];

const carriersList = ["Автолюкс", "Gunsel", "УкрБус", "EuroClub", "Night Express"];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<"price" | "time" | "duration">("price");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    timeSlots: [],
    priceMin: "",
    priceMax: "",
    carriers: [],
    amenities: [],
  });

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const returnDate = searchParams.get("returnDate") || "";
  const adults = parseInt(searchParams.get("adults") || "1");
  const children = parseInt(searchParams.get("children") || "0");

  const formattedDate = date ? new Date(date).toLocaleDateString("uk-UA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "";

  const handleSelectRoute = (routeId: string) => {
    const params = new URLSearchParams({
      routeId,
      from,
      to,
      date,
      returnDate,
      adults: adults.toString(),
      children: children.toString(),
    });
    navigate(`/booking?${params.toString()}`);
  };

  // Filter logic
  const filteredRoutes = useMemo(() => {
    return mockRoutes.filter(route => {
      // Time slot filter
      if (filters.timeSlots.length > 0) {
        const hour = parseInt(route.departureTime.split(":")[0]);
        const matchesTimeSlot = filters.timeSlots.some(slotId => {
          const slot = timeSlots.find(s => s.id === slotId);
          if (!slot) return false;
          if (slot.start < slot.end) {
            return hour >= slot.start && hour < slot.end;
          } else {
            return hour >= slot.start || hour < slot.end;
          }
        });
        if (!matchesTimeSlot) return false;
      }

      // Price filter
      if (filters.priceMin && route.price < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && route.price > parseInt(filters.priceMax)) return false;

      // Carrier filter
      if (filters.carriers.length > 0 && !filters.carriers.includes(route.carrier)) {
        return false;
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(a => route.amenities.includes(a));
        if (!hasAllAmenities) return false;
      }

      return true;
    });
  }, [filters]);

  // Sort logic
  const sortedRoutes = useMemo(() => {
    return [...filteredRoutes].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "time") return a.departureTime.localeCompare(b.departureTime);
      if (sortBy === "duration") {
        const getDurationMinutes = (d: string) => {
          const match = d.match(/(\d+)г\s*(\d+)?хв?/);
          return match ? parseInt(match[1]) * 60 + (parseInt(match[2]) || 0) : 0;
        };
        return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
      }
      return 0;
    });
  }, [filteredRoutes, sortBy]);

  const toggleFilter = (category: keyof Pick<Filters, 'timeSlots' | 'carriers' | 'amenities'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      timeSlots: [],
      priceMin: "",
      priceMax: "",
      carriers: [],
      amenities: [],
    });
  };

  const activeFiltersCount = filters.timeSlots.length + 
    filters.carriers.length + 
    filters.amenities.length +
    (filters.priceMin ? 1 : 0) + 
    (filters.priceMax ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <section className="pt-24 pb-6 hero-gradient">
        <div className="container mx-auto px-4">
          <SearchForm 
            variant="compact" 
            initialData={{ from, to, departureDate: date, returnDate, adults, children }}
          />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                {from} → {to}
              </h1>
              <p className="text-muted-foreground mt-1">
                {formattedDate} • {adults + children} {(adults + children) === 1 ? "пасажир" : (adults + children) < 5 ? "пасажири" : "пасажирів"}
                {returnDate && (
                  <span className="ml-2 text-accent">• Зворотній квиток</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-soft border transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-card border-border hover:border-accent"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Фільтри</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-accent-foreground text-accent text-xs flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card shadow-soft border border-border hover:border-accent transition-colors"
                >
                  <SortAsc className="w-4 h-4" />
                  <span className="font-medium">
                    {sortBy === "price" && "За ціною"}
                    {sortBy === "time" && "За часом"}
                    {sortBy === "duration" && "За тривалістю"}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-card border border-border overflow-hidden z-20">
                    <button 
                      onClick={() => { setSortBy("price"); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-3 text-left transition-colors ${sortBy === "price" ? "bg-accent/10 text-accent" : "hover:bg-secondary"}`}
                    >
                      За ціною
                    </button>
                    <button 
                      onClick={() => { setSortBy("time"); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-3 text-left transition-colors ${sortBy === "time" ? "bg-accent/10 text-accent" : "hover:bg-secondary"}`}
                    >
                      За часом
                    </button>
                    <button 
                      onClick={() => { setSortBy("duration"); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-3 text-left transition-colors ${sortBy === "duration" ? "bg-accent/10 text-accent" : "hover:bg-secondary"}`}
                    >
                      За тривалістю
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-card rounded-2xl shadow-card p-6 mb-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Фільтри</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-accent hover:underline"
                  >
                    <X className="w-4 h-4" />
                    Скинути все
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Time Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Час відправлення</h4>
                  <div className="space-y-2">
                    {timeSlots.map((slot) => (
                      <label key={slot.id} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={filters.timeSlots.includes(slot.id)}
                          onChange={() => toggleFilter("timeSlots", slot.id)}
                          className="w-4 h-4 rounded border-border accent-accent cursor-pointer" 
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {slot.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Ціна (₴)</h4>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="від" 
                      value={filters.priceMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-accent"
                    />
                    <span className="text-muted-foreground">—</span>
                    <input 
                      type="number" 
                      placeholder="до" 
                      value={filters.priceMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Carrier Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Перевізник</h4>
                  <div className="space-y-2">
                    {carriersList.map((carrier) => (
                      <label key={carrier} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={filters.carriers.includes(carrier)}
                          onChange={() => toggleFilter("carriers", carrier)}
                          className="w-4 h-4 rounded border-border accent-accent cursor-pointer" 
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {carrier}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Зручності</h4>
                  <div className="space-y-2">
                    {amenitiesList.map((amenity) => (
                      <label key={amenity.id} className="flex items-center gap-2 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={filters.amenities.includes(amenity.id)}
                          onChange={() => toggleFilter("amenities", amenity.id)}
                          className="w-4 h-4 rounded border-border accent-accent cursor-pointer" 
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {amenity.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <p className="text-muted-foreground mb-6">
            Знайдено <span className="font-semibold text-foreground">{sortedRoutes.length}</span> рейсів
          </p>

          {/* Route Cards */}
          <div className="space-y-4">
            {sortedRoutes.map((route, index) => (
              <div 
                key={route.id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <RouteCard {...route} onSelect={() => handleSelectRoute(route.id)} />
              </div>
            ))}

            {sortedRoutes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">Рейсів не знайдено</p>
                <p className="text-muted-foreground mb-6">Спробуйте змінити параметри пошуку або фільтри</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Скинути фільтри
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchResults;