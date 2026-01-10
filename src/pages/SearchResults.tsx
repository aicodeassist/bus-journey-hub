import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import RouteCard from "@/components/RouteCard";
import Footer from "@/components/Footer";
import { Filter, SortAsc, ChevronDown } from "lucide-react";
import { useState } from "react";

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
    amenities: ["wifi", "ac", "power"],
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
    amenities: ["wifi", "ac"],
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

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<"price" | "time" | "duration">("price");
  const [showFilters, setShowFilters] = useState(false);

  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const date = searchParams.get("date") || "";
  const adults = parseInt(searchParams.get("adults") || "1");
  const children = parseInt(searchParams.get("children") || "0");

  const formattedDate = date ? new Date(date).toLocaleDateString("uk-UA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "";

  const sortedRoutes = [...mockRoutes].sort((a, b) => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <section className="pt-24 pb-8 hero-gradient">
        <div className="container mx-auto px-4">
          <SearchForm 
            variant="compact" 
            initialData={{ from, to, departureDate: date, adults, children }}
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
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card shadow-soft border border-border hover:border-accent transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Фільтри</span>
              </button>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card shadow-soft border border-border hover:border-accent transition-colors">
                  <SortAsc className="w-4 h-4" />
                  <span className="font-medium">
                    {sortBy === "price" && "За ціною"}
                    {sortBy === "time" && "За часом"}
                    {sortBy === "duration" && "За тривалістю"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu - simplified for now */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-card border border-border overflow-hidden hidden group-hover:block">
                  <button 
                    onClick={() => setSortBy("price")}
                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors"
                  >
                    За ціною
                  </button>
                  <button 
                    onClick={() => setSortBy("time")}
                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors"
                  >
                    За часом
                  </button>
                  <button 
                    onClick={() => setSortBy("duration")}
                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors"
                  >
                    За тривалістю
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-card rounded-2xl shadow-card p-6 mb-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Time Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Час відправлення</h4>
                  <div className="space-y-2">
                    {["Ранок (06:00-12:00)", "День (12:00-18:00)", "Вечір (18:00-00:00)", "Ніч (00:00-06:00)"].map((time) => (
                      <label key={time} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded accent-accent" />
                        <span className="text-sm text-muted-foreground">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Ціна</h4>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder="від" 
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    />
                    <span className="text-muted-foreground">—</span>
                    <input 
                      type="number" 
                      placeholder="до" 
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    />
                  </div>
                </div>

                {/* Carrier Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Перевізник</h4>
                  <div className="space-y-2">
                    {["Автолюкс", "Gunsel", "УкрБус", "EuroClub"].map((carrier) => (
                      <label key={carrier} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded accent-accent" />
                        <span className="text-sm text-muted-foreground">{carrier}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Зручності</h4>
                  <div className="space-y-2">
                    {["Wi-Fi", "Кондиціонер", "Розетки", "Туалет"].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded accent-accent" />
                        <span className="text-sm text-muted-foreground">{amenity}</span>
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
                <RouteCard {...route} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchResults;
