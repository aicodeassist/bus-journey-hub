import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
}

const MONTHS_UK = [
  "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
  "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
];

const WEEKDAYS_UK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

const DatePicker = ({ value, onChange, placeholder = "Виберіть дату", minDate }: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const date = new Date(value);
      return { month: date.getMonth(), year: date.getFullYear() };
    }
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });
  const containerRef = useRef<HTMLDivElement>(null);

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
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getDate()} ${MONTHS_UK[date.getMonth()].slice(0, 3)}`;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { month: prev.month - 1, year: prev.year };
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { month: prev.month + 1, year: prev.year };
    });
  };

  const handleSelectDate = (day: number) => {
    const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(dateStr);
    setIsOpen(false);
  };

  const isDateDisabled = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(currentMonth.year, currentMonth.month, day);
    
    if (checkDate < today) return true;
    
    if (!minDate) return false;
    const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr < minDate;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.month === today.getMonth() &&
      currentMonth.year === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    return (
      day === selectedDate.getDate() &&
      currentMonth.month === selectedDate.getMonth() &&
      currentMonth.year === selectedDate.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth.month, currentMonth.year);
  const firstDay = getFirstDayOfMonth(currentMonth.month, currentMonth.year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const CalendarContent = () => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-3 rounded-xl hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-lg text-foreground">
          {MONTHS_UK[currentMonth.month]} {currentMonth.year}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-3 rounded-xl hover:bg-secondary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {WEEKDAYS_UK.map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map(i => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const disabled = isDateDisabled(day);
          const selected = isSelected(day);
          const today = isToday(day);
          
          return (
            <button
              key={day}
              type="button"
              onClick={() => !disabled && handleSelectDate(day)}
              disabled={disabled}
              className={`
                aspect-square rounded-xl text-base font-medium transition-all flex items-center justify-center
                ${disabled 
                  ? "text-muted-foreground/30 cursor-not-allowed" 
                  : "hover:bg-accent/10 cursor-pointer active:scale-95"
                }
                ${selected 
                  ? "bg-accent text-accent-foreground shadow-lg" 
                  : ""
                }
                ${today && !selected 
                  ? "ring-2 ring-accent ring-inset" 
                  : ""
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-transparent text-foreground focus:outline-none cursor-pointer py-0.5"
      >
        {value ? (
          <span className="font-medium text-sm">{formatDisplayDate(value)}</span>
        ) : (
          <span className="text-muted-foreground text-sm">{placeholder}</span>
        )}
      </button>

      {isOpen && (
        <>
          {isMobile ? (
            /* Fullscreen mobile view */
            <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-bottom duration-300">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Виберіть дату</h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Calendar */}
                <div className="flex-1 p-6 overflow-auto">
                  <CalendarContent />
                </div>

                {/* Footer */}
                {value && (
                  <div className="px-6 py-4 border-t border-border bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-accent" />
                        <span className="font-medium">{formatDisplayDate(value)}</span>
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
            <div className="absolute top-full left-0 mt-2 bg-card rounded-2xl shadow-card border border-border z-50 p-5 min-w-[320px] animate-fade-in">
              <CalendarContent />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DatePicker;