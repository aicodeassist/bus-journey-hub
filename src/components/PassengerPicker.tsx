import { useState, useRef, useEffect } from "react";
import { Users, X, Minus, Plus, User, Baby } from "lucide-react";

interface PassengerPickerProps {
  adults: number;
  children: number;
  onChangeAdults: (count: number) => void;
  onChangeChildren: (count: number) => void;
}

const PassengerPicker = ({ adults, children, onChangeAdults, onChangeChildren }: PassengerPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPassengers = adults + children;

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

  const getPassengerText = () => {
    const parts: string[] = [];
    if (adults > 0) {
      parts.push(`${adults} ${adults === 1 ? "дорослий" : adults < 5 ? "дорослих" : "дорослих"}`);
    }
    if (children > 0) {
      parts.push(`${children} ${children === 1 ? "дитина" : children < 5 ? "дитини" : "дітей"}`);
    }
    return parts.join(", ") || "Виберіть";
  };

  const CounterButton = ({ 
    onClick, 
    disabled, 
    children: buttonChildren 
  }: { 
    onClick: () => void; 
    disabled?: boolean; 
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center transition-all
        ${disabled 
          ? "bg-muted text-muted-foreground/30 cursor-not-allowed" 
          : "bg-secondary hover:bg-accent hover:text-accent-foreground active:scale-95"
        }
      `}
    >
      {buttonChildren}
    </button>
  );

  const PassengerRow = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    value, 
    onDecrease, 
    onIncrease,
    minValue = 0,
    maxValue = 9
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle: string;
    value: number;
    onDecrease: () => void;
    onIncrease: () => void;
    minValue?: number;
    maxValue?: number;
  }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <CounterButton onClick={onDecrease} disabled={value <= minValue}>
          <Minus className="w-4 h-4" />
        </CounterButton>
        <span className="w-8 text-center text-lg font-semibold">{value}</span>
        <CounterButton onClick={onIncrease} disabled={value >= maxValue}>
          <Plus className="w-4 h-4" />
        </CounterButton>
      </div>
    </div>
  );

  const PickerContent = () => (
    <div className="divide-y divide-border">
      <PassengerRow
        icon={User}
        title="Дорослі"
        subtitle="13 років і старше"
        value={adults}
        onDecrease={() => onChangeAdults(adults - 1)}
        onIncrease={() => onChangeAdults(adults + 1)}
        minValue={1}
      />
      <PassengerRow
        icon={Baby}
        title="Діти"
        subtitle="від 0 до 12 років"
        value={children}
        onDecrease={() => onChangeChildren(children - 1)}
        onIncrease={() => onChangeChildren(children + 1)}
        minValue={0}
      />
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full search-input pl-12 text-left cursor-pointer flex items-center"
        >
          <span className="truncate">
            {totalPassengers} {totalPassengers === 1 ? "пасажир" : totalPassengers < 5 ? "пасажири" : "пасажирів"}
          </span>
        </button>
      </div>

      {isOpen && (
        <>
          {isMobile ? (
            /* Fullscreen mobile view */
            <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-bottom duration-300">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold">Пасажири</h2>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-4 overflow-auto">
                  <PickerContent />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-accent" />
                      <span className="font-medium">{getPassengerText()}</span>
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
              </div>
            </div>
          ) : (
            /* Desktop dropdown */
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-card border border-border z-50 p-4 min-w-[320px] animate-fade-in">
              <PickerContent />
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-accent text-accent-foreground rounded-xl font-medium transition-colors hover:bg-accent/90"
                >
                  Готово
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PassengerPicker;