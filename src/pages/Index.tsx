import Header from "@/components/Header";
import SearchForm from "@/components/SearchForm";
import PopularRoute from "@/components/PopularRoute";
import FeatureCard from "@/components/FeatureCard";
import Footer from "@/components/Footer";
import { Shield, Clock, CreditCard, Headphones } from "lucide-react";
import heroBus from "@/assets/hero-bus.jpg";

const popularRoutes = [
  { from: "Київ", to: "Львів", price: 450, imageUrl: "https://images.unsplash.com/photo-1561542320-9a18cd340469?w=800&q=80" },
  { from: "Одеса", to: "Київ", price: 520, imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80" },
  { from: "Харків", to: "Дніпро", price: 280, imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80" },
  { from: "Львів", to: "Чернівці", price: 320, imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80" },
  { from: "Київ", to: "Одеса", price: 520, imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80" },
  { from: "Запоріжжя", to: "Київ", price: 480, imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80" },
];

const features = [
  {
    icon: Shield,
    title: "Безпечні платежі",
    description: "Усі транзакції захищені сучасними технологіями шифрування",
  },
  {
    icon: Clock,
    title: "Миттєве бронювання",
    description: "Отримуйте квитки на email одразу після оплати",
  },
  {
    icon: CreditCard,
    title: "Без прихованих комісій",
    description: "Прозора ціна без додаткових зборів та комісій",
  },
  {
    icon: Headphones,
    title: "Підтримка 24/7",
    description: "Наша команда завжди готова допомогти вам",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBus})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient opacity-80" />
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-accent/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-10 w-48 h-48 rounded-full bg-primary-foreground/10 blur-2xl animate-float-delayed" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="font-display font-extrabold text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 animate-slide-up text-balance">
              Подорожуйте Україною
              <span className="block text-accent">легко та комфортно</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 animate-slide-up-delay-1 max-w-2xl mx-auto">
              Знайдіть найкращі автобусні рейси за найвигіднішими цінами. 
              Понад 500 напрямків по всій Україні.
            </p>
          </div>
          
          {/* Search Form */}
          <div className="max-w-5xl mx-auto animate-slide-up-delay-2">
            <SearchForm variant="compact" />
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 animate-slide-up-delay-3">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">500+</div>
              <div className="text-primary-foreground/70 text-sm">Напрямків</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">50+</div>
              <div className="text-primary-foreground/70 text-sm">Перевізників</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">1M+</div>
              <div className="text-primary-foreground/70 text-sm">Задоволених клієнтів</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Чому обирають нас?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ми прагнемо зробити ваші подорожі максимально комфортними та безтурботними
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section id="popular" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Популярні напрямки
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Найбільш затребувані маршрути серед наших пасажирів
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route, index) => (
              <PopularRoute key={index} {...route} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 hero-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary-foreground/10 blur-2xl" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-primary-foreground mb-6">
            Готові до подорожі?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Приєднуйтесь до мільйона задоволених клієнтів, які обрали БусТік для своїх подорожей
          </p>
          <button className="btn-primary text-lg">
            Знайти квитки зараз
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
