import { useState, useRef, useEffect } from "react";
import { MapPin, X, Search, Clock } from "lucide-react";

interface CityPickerProps {
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
  label?: string;
}

const popularCities = [
  "Київ", "Львів", "Одеса", "Харків", "Дніпро", 
  "Запоріжжя", "Вінниця", "Полтава", "Чернівці", "Ужгород"
];

const SEARCH_HISTORY_KEY = "citySearchHistory";
const MAX_HISTORY_ITEMS = 5;

const getSearchHistory = (): string[] => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

const addToSearchHistory = (city: string) => {
  try {
    const history = getSearchHistory();
    const filtered = history.filter(c => c !== city);
    const newHistory = [city, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  } catch {
    // Ignore localStorage errors
  }
};

const CityPicker = ({ value, onChange, placeholder = "Виберіть місто", label }: CityPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobile && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
      // Focus with delay to prevent scroll jump
      setTimeout(() => {
        mobileInputRef.current?.focus();
      }, 350);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isOpen) {
      setSearchHistory(getSearchHistory());
      if (!isMobile) {
        setSearchQuery(value);
      } else {
        setSearchQuery("");
      }
    }
  }, [isOpen, isMobile, value]);

  const filteredCities = popularCities.filter(city => 
    city.toLowerCase().includes((isMobile ? searchQuery : value).toLowerCase())
  );

  const handleSelectCity = (city: string) => {
    onChange(city);
    addToSearchHistory(city);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isMobile) {
      setSearchQuery(e.target.value);
    } else {
      onChange(e.target.value);
    }
  };

  const CityList = ({ cities, title }: { cities: string[]; title?: string }) => (
    <div className="space-y-1">
      {title && (
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-2">
          {title}
        </p>
      )}
      {cities.length > 0 ? (
        cities.map(city => (
          <button
            key={city}
            type="button"
            onClick={() => handleSelectCity(city)}
            className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 rounded-xl"
          >
            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">{city}</span>
          </button>
        ))
      ) : (
        <div className="px-4 py-3 text-muted-foreground text-center">
          Місто не знайдено
        </div>
      )}
    </div>
  );

  const HistoryList = ({ cities }: { cities: string[] }) => (
    <div className="space-y-1 mb-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-2">
        Нещодавно
      </p>
      {cities.map(city => (
        <button
          key={city}
          type="button"
          onClick={() => handleSelectCity(city)}
          className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 rounded-xl"
        >
          <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium">{city}</span>
        </button>
      ))}
    </div>
  );

  const showHistory = searchQuery === "" && searchHistory.length > 0;

  return (
    <div ref={containerRef} className="relative h-full">
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent z-10 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="w-full h-full px-4 pl-12 rounded-xl border-2 border-transparent bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:bg-card transition-all duration-300 hover:bg-secondary cursor-pointer"
        readOnly={isMobile}
      />

      {isOpen && (
        <>
          {isMobile ? (
            /* Fullscreen mobile view */
            <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-bottom duration-300">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold">{label || placeholder}</h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Search Input */}
                <div className="px-4 py-4 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      ref={mobileInputRef}
                      type="text"
                      placeholder="Пошук міста..."
                      value={searchQuery}
                      onChange={handleInputChange}
                      className="w-full h-12 px-4 pl-12 rounded-xl border border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:bg-card transition-all"
                    />
                  </div>
                </div>

                {/* Cities List */}
                <div className="flex-1 p-4 overflow-auto">
                  {showHistory && <HistoryList cities={searchHistory} />}
                  <CityList cities={filteredCities} title="Популярні міста" />
                </div>

                {/* Footer */}
                {value && (
                  <div className="px-6 py-4 border-t border-border bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-accent" />
                        <span className="font-medium">{value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-2 bg-accent text-accent-foreground rounded-xl font-medium transition-colors hover:bg-accent/90"
                      >
                        Готово
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Desktop dropdown */
            (filteredCities.length > 0 || showHistory) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-card border border-border z-20 overflow-hidden max-h-[320px] overflow-y-auto animate-fade-in p-2">
                {showHistory && <HistoryList cities={searchHistory} />}
                <CityList cities={filteredCities.slice(0, 6)} title={showHistory ? "Популярні міста" : undefined} />
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default CityPicker;
