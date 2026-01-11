import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bus, MapPin, Clock, Star, User, Mail, Phone, CreditCard, Shield, ArrowLeft } from "lucide-react";
import { useState } from "react";

const mockRoute = {
  id: "1",
  carrier: "Автолюкс",
  carrierRating: 4.8,
  departureTime: "06:30",
  arrivalTime: "12:45",
  departureCity: "Київ",
  arrivalCity: "Львів",
  duration: "6г 15хв",
  price: 450,
  busType: "Комфорт",
};

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const from = searchParams.get("from") || mockRoute.departureCity;
  const to = searchParams.get("to") || mockRoute.arrivalCity;
  const date = searchParams.get("date") || "";
  const adults = parseInt(searchParams.get("adults") || "1");
  const children = parseInt(searchParams.get("children") || "0");
  const totalPassengers = adults + children;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const totalPrice = mockRoute.price * totalPassengers;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Бронювання успішне! Квиток надіслано на вашу пошту.");
    navigate("/");
  };

  const formattedDate = date ? new Date(date).toLocaleDateString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }) : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад до результатів
          </button>

          <h1 className="font-display font-bold text-3xl text-foreground mb-8">Бронювання квитка</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Summary */}
              <div className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-semibold text-lg mb-4">Деталі рейсу</h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{mockRoute.carrier}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span>{mockRoute.carrierRating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 py-4 border-y border-border">
                  <div className="text-center">
                    <div className="text-xl font-bold">{mockRoute.departureTime}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{from}
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div className="flex-1 h-px bg-border" />
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />{mockRoute.duration}
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{mockRoute.arrivalTime}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{to}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>{formattedDate}</p>
                  <p>{totalPassengers} {totalPassengers === 1 ? "пасажир" : "пасажири"}</p>
                </div>
              </div>

              {/* Passenger Info */}
              <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  Дані пасажира
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Ім'я</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent"
                      placeholder="Введіть ім'я"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Прізвище</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent"
                      placeholder="Введіть прізвище"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />Телефон
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-accent"
                      placeholder="+380"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Оплатити {totalPrice} ₴
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl shadow-card p-6 sticky top-24">
                <h2 className="font-semibold text-lg mb-4">Ваше замовлення</h2>
                
                <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Квиток ({totalPassengers} × {mockRoute.price} ₴)</span>
                    <span>{totalPrice} ₴</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Сервісний збір</span>
                    <span className="text-accent">Безкоштовно</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold mb-6">
                  <span>Всього</span>
                  <span className="text-2xl">{totalPrice} ₴</span>
                </div>

                <div className="flex items-start gap-3 text-sm text-muted-foreground bg-secondary/50 rounded-xl p-4">
                  <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p>Безпечна оплата. Ваші дані захищені сучасними технологіями шифрування.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;