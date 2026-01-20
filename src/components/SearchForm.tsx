import { Calendar, ArrowRightLeft, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "./DatePicker";
import PassengerPicker from "./PassengerPicker";
import CityPicker from "./CityPicker";
import "../styles/components/search-form.css";

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
  const formClass = `search-form ${isHero ? "search-form--hero" : "search-form--compact"}`;

  return (
    <form 
      onSubmit={handleSubmit}
      className={formClass}
      role="search"
      aria-label="Пошук автобусних квитків"
    >
      <fieldset className="search-form__fieldset">
        <legend className="search-form__legend">
          Форма пошуку квитків на автобус
        </legend>

        <div className="search-form__content">
          {/* Cities Group */}
          <div className="search-form__cities" role="group" aria-labelledby="cities-group-label">
            <span id="cities-group-label" className="search-form__legend">
              Маршрут подорожі
            </span>

            {/* From Field */}
            <div className="search-form__group">
              <label 
                htmlFor="departure-city" 
                className="search-form__label"
              >
                Звідки
              </label>
              <div className="search-form__input-wrapper">
                <CityPicker
                  value={formData.from}
                  onChange={(city) => setFormData(prev => ({ ...prev, from: city }))}
                  placeholder={isHero ? "Місто відправлення" : "Звідки"}
                  label="Звідки"
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwapCities}
              className="search-form__swap-btn"
              aria-label="Поміняти місця відправлення та прибуття"
            >
              <ArrowRightLeft aria-hidden="true" />
            </button>

            {/* To Field */}
            <div className="search-form__group">
              <label 
                htmlFor="arrival-city" 
                className="search-form__label"
              >
                Куди
              </label>
              <div className="search-form__input-wrapper">
                <CityPicker
                  value={formData.to}
                  onChange={(city) => setFormData(prev => ({ ...prev, to: city }))}
                  placeholder={isHero ? "Місто прибуття" : "Куди"}
                  label="Куди"
                />
              </div>
            </div>
          </div>

          {/* Dates Group */}
          <div className="search-form__dates" role="group" aria-labelledby="dates-group-label">
            <label 
              id="dates-group-label" 
              className="search-form__label"
            >
              Дати
            </label>
            <div className="search-form__dates-container">
              <Calendar className="search-form__dates-icon" aria-hidden="true" />
              
              {/* Departure Date */}
              <div className="search-form__date-field">
                <span className="search-form__date-label" id="departure-date-label">
                  Туди
                </span>
                <DatePicker
                  value={formData.departureDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, departureDate: date }))}
                  placeholder="Виберіть"
                />
              </div>
              
              {/* Divider */}
              <div className="search-form__date-divider" aria-hidden="true" />
              
              {/* Return Date */}
              <div className="search-form__date-field">
                <span className="search-form__date-label" id="return-date-label">
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
          <div className="search-form__passengers">
            <label className="search-form__label" id="passengers-label">
              Пасажири
            </label>
            <div className="search-form__input-wrapper">
              <PassengerPicker
                adults={formData.adults}
                children={formData.children}
                onChangeAdults={(count) => setFormData(prev => ({ ...prev, adults: count }))}
                onChangeChildren={(count) => setFormData(prev => ({ ...prev, children: count }))}
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="search-form__submit-group">
            <div className="search-form__spacer" aria-hidden="true" />
            <button
              type="submit"
              className="search-form__submit-btn"
            >
              <Search aria-hidden="true" />
              <span>{isHero ? "Знайти квитки" : "Знайти"}</span>
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default SearchForm;
