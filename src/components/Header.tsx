import { Bus, User, Menu, X, Ticket } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/components/header.css";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // Track scroll state for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Focus trap and escape key for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen]);

  // Check if current route is active
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { to: "/", label: "Головна", isLink: true },
    { to: "/search", label: "Пошук рейсів", isLink: true },
    { href: "#popular", label: "Популярні напрямки", isLink: false },
    { href: "#about", label: "Про нас", isLink: false },
  ];

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="sr-only-focusable skip-link">
        Перейти до основного вмісту
      </a>

      <header 
        className="site-header" 
        role="banner"
        data-scrolled={isScrolled}
      >
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="header-logo" aria-label="БусТік - На головну">
              <span className="header-logo__icon" aria-hidden="true">
                <Bus />
              </span>
              <span className="header-logo__text">busbooking</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="header-nav" aria-label="Основна навігація">
              <ul className="header-nav__list" role="list">
                {navItems.map((item) => (
                  <li key={item.label}>
                    {item.isLink ? (
                      <Link
                        to={item.to!}
                        className="header-nav__link"
                        aria-current={isActive(item.to!) ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a href={item.href} className="header-nav__link">
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
                <li>
                  <Link
                    to="/my-bookings"
                    className="header-nav__link"
                    aria-current={isActive("/my-bookings") ? "page" : undefined}
                  >
                    <Ticket aria-hidden="true" />
                    <span>Мої квитки</span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Desktop Actions */}
            <div className="header-actions">
              <button 
                type="button"
                className="header-actions__btn"
                aria-label="Увійти до особистого кабінету"
              >
                <User aria-hidden="true" />
                <span>Увійти</span>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              ref={menuButtonRef}
              type="button"
              className="header-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Закрити меню" : "Відкрити меню"}
            >
              {isMenuOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            ref={menuRef}
            id="mobile-menu"
            className="header-mobile-menu"
            data-open={isMenuOpen}
            aria-hidden={!isMenuOpen}
          >
            <nav className="header-mobile-menu__nav" aria-label="Мобільна навігація">
              {navItems.map((item) => (
                item.isLink ? (
                  <Link
                    key={item.label}
                    to={item.to!}
                    className="header-mobile-menu__link"
                    aria-current={isActive(item.to!) ? "page" : undefined}
                    tabIndex={isMenuOpen ? 0 : -1}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="header-mobile-menu__link"
                    tabIndex={isMenuOpen ? 0 : -1}
                  >
                    {item.label}
                  </a>
                )
              ))}
              <Link
                to="/my-bookings"
                className="header-mobile-menu__link"
                aria-current={isActive("/my-bookings") ? "page" : undefined}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                <Ticket aria-hidden="true" />
                <span>Мої квитки</span>
              </Link>
              <button
                type="button"
                className="header-mobile-menu__link"
                tabIndex={isMenuOpen ? 0 : -1}
              >
                <User aria-hidden="true" />
                <span>Увійти</span>
              </button>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
