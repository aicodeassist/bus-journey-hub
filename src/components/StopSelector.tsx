import { useState, useEffect } from "react";
import { MapPin, ArrowDown, Check, AlertCircle } from "lucide-react";
import "./StopSelector.css";

interface RouteStop {
  time: string;
  date?: string;
  city: string;
  station: string;
}

interface StopSelectorProps {
  stops: RouteStop[];
  basePrice: number;
  onSelectionChange?: (selection: StopSelection) => void;
}

export interface StopSelection {
  boardingIndex: number;
  alightingIndex: number;
  adjustedPrice: number;
  boardingStop: RouteStop;
  alightingStop: RouteStop;
}

// Calculate price based on selected segment (proportional to stops traveled)
const calculatePrice = (
  basePrice: number,
  totalStops: number,
  boardingIndex: number,
  alightingIndex: number
): number => {
  if (totalStops <= 1) return basePrice;
  
  const totalSegments = totalStops - 1;
  const selectedSegments = alightingIndex - boardingIndex;
  
  // Calculate proportional price with minimum 30% of base price
  const proportion = selectedSegments / totalSegments;
  const adjustedPrice = Math.max(
    Math.round(basePrice * proportion),
    Math.round(basePrice * 0.3)
  );
  
  return adjustedPrice;
};

const StopSelector = ({ stops, basePrice, onSelectionChange }: StopSelectorProps) => {
  const [boardingIndex, setBoardingIndex] = useState(0);
  const [alightingIndex, setAlightingIndex] = useState(stops.length - 1);
  const [showBoardingDropdown, setShowBoardingDropdown] = useState(false);
  const [showAlightingDropdown, setShowAlightingDropdown] = useState(false);

  const adjustedPrice = calculatePrice(basePrice, stops.length, boardingIndex, alightingIndex);
  const priceDifference = adjustedPrice - basePrice;

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        boardingIndex,
        alightingIndex,
        adjustedPrice,
        boardingStop: stops[boardingIndex],
        alightingStop: stops[alightingIndex],
      });
    }
  }, [boardingIndex, alightingIndex, adjustedPrice, stops, onSelectionChange]);

  // Get available boarding stops (all except last)
  const boardingStops = stops.slice(0, -1);
  
  // Get available alighting stops (all after boarding point)
  const alightingStops = stops.slice(boardingIndex + 1);

  const handleBoardingSelect = (index: number) => {
    setBoardingIndex(index);
    // Reset alighting if it becomes invalid
    if (alightingIndex <= index) {
      setAlightingIndex(stops.length - 1);
    }
    setShowBoardingDropdown(false);
  };

  const handleAlightingSelect = (originalIndex: number) => {
    setAlightingIndex(originalIndex);
    setShowAlightingDropdown(false);
  };

  if (stops.length < 2) return null;

  return (
    <div className="stop-selector">
      <div className="stop-selector__header">
        <h4 className="stop-selector__title">
          <MapPin className="w-4 h-4" />
          Вибір зупинки
        </h4>
        {priceDifference !== 0 && (
          <div className={`stop-selector__price-diff ${priceDifference < 0 ? 'stop-selector__price-diff--savings' : ''}`}>
            {priceDifference < 0 ? (
              <>Економія: {Math.abs(priceDifference)} ₴</>
            ) : (
              <>+{priceDifference} ₴</>
            )}
          </div>
        )}
      </div>

      <div className="stop-selector__content">
        {/* Boarding Point */}
        <div className="stop-selector__field">
          <label className="stop-selector__label">Посадка</label>
          <div className="stop-selector__dropdown-wrapper">
            <button
              type="button"
              className="stop-selector__button"
              onClick={() => {
                setShowBoardingDropdown(!showBoardingDropdown);
                setShowAlightingDropdown(false);
              }}
            >
              <div className="stop-selector__button-content">
                <div className="stop-selector__indicator stop-selector__indicator--boarding" />
                <div className="stop-selector__button-text">
                  <span className="stop-selector__city">{stops[boardingIndex].city}</span>
                  <span className="stop-selector__time">{stops[boardingIndex].time}</span>
                </div>
              </div>
              <ArrowDown className={`w-4 h-4 transition-transform ${showBoardingDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showBoardingDropdown && (
              <div className="stop-selector__dropdown">
                {boardingStops.map((stop, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`stop-selector__option ${index === boardingIndex ? 'stop-selector__option--selected' : ''}`}
                    onClick={() => handleBoardingSelect(index)}
                  >
                    <div className="stop-selector__option-content">
                      <span className="stop-selector__option-time">{stop.time}</span>
                      <div className="stop-selector__option-info">
                        <span className="stop-selector__option-city">{stop.city}</span>
                        <span className="stop-selector__option-station">{stop.station}</span>
                      </div>
                    </div>
                    {index === boardingIndex && <Check className="w-4 h-4 text-accent" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visual connector */}
        <div className="stop-selector__connector">
          <div className="stop-selector__connector-line" />
        </div>

        {/* Alighting Point */}
        <div className="stop-selector__field">
          <label className="stop-selector__label">Висадка</label>
          <div className="stop-selector__dropdown-wrapper">
            <button
              type="button"
              className="stop-selector__button"
              onClick={() => {
                setShowAlightingDropdown(!showAlightingDropdown);
                setShowBoardingDropdown(false);
              }}
            >
              <div className="stop-selector__button-content">
                <div className="stop-selector__indicator stop-selector__indicator--alighting" />
                <div className="stop-selector__button-text">
                  <span className="stop-selector__city">{stops[alightingIndex].city}</span>
                  <span className="stop-selector__time">{stops[alightingIndex].time}</span>
                </div>
              </div>
              <ArrowDown className={`w-4 h-4 transition-transform ${showAlightingDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showAlightingDropdown && (
              <div className="stop-selector__dropdown">
                {alightingStops.map((stop, relativeIndex) => {
                  const originalIndex = boardingIndex + 1 + relativeIndex;
                  return (
                    <button
                      key={originalIndex}
                      type="button"
                      className={`stop-selector__option ${originalIndex === alightingIndex ? 'stop-selector__option--selected' : ''}`}
                      onClick={() => handleAlightingSelect(originalIndex)}
                    >
                      <div className="stop-selector__option-content">
                        <span className="stop-selector__option-time">{stop.time}</span>
                        <div className="stop-selector__option-info">
                          <span className="stop-selector__option-city">{stop.city}</span>
                          <span className="stop-selector__option-station">{stop.station}</span>
                        </div>
                      </div>
                      {originalIndex === alightingIndex && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="stop-selector__summary">
        <div className="stop-selector__route-info">
          <span>{stops[boardingIndex].city}</span>
          <span className="stop-selector__arrow">→</span>
          <span>{stops[alightingIndex].city}</span>
        </div>
        <div className="stop-selector__price">
          {priceDifference !== 0 && (
            <span className="stop-selector__original-price">{basePrice} ₴</span>
          )}
          <span className="stop-selector__final-price">{adjustedPrice} ₴</span>
        </div>
      </div>

      {stops.length > 2 && (
        <div className="stop-selector__hint">
          <AlertCircle className="w-3 h-3" />
          <span>Виберіть проміжну зупинку для посадки або висадки, щоб зекономити</span>
        </div>
      )}
    </div>
  );
};

export default StopSelector;
