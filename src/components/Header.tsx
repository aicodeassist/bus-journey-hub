import { Bus, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center transition-transform group-hover:scale-105">
              <Bus className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">
              busbooking
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-foreground/80 hover:text-foreground font-medium transition-colors"
            >
              Головна
            </Link>
            <Link 
              to="/search" 
              className="text-foreground/80 hover:text-foreground font-medium transition-colors"
            >
              Пошук рейсів
            </Link>
            <a 
              href="#popular" 
              className="text-foreground/80 hover:text-foreground font-medium transition-colors"
            >
              Популярні напрямки
            </a>
            <a 
              href="#about" 
              className="text-foreground/80 hover:text-foreground font-medium transition-colors"
            >
              Про нас
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-foreground hover:bg-secondary transition-colors">
              <User className="w-5 h-5" />
              <span className="font-medium">Увійти</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/" 
                className="px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Головна
              </Link>
              <Link 
                to="/search" 
                className="px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Пошук рейсів
              </Link>
              <a 
                href="#popular" 
                className="px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Популярні напрямки
              </a>
              <a 
                href="#about" 
                className="px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium"
              >
                Про нас
              </a>
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors font-medium">
                <User className="w-5 h-5" />
                <span>Увійти</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
