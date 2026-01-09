import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PopularRouteProps {
  from: string;
  to: string;
  price: number;
  imageUrl: string;
}

const PopularRoute = ({ from, to, price, imageUrl }: PopularRouteProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const today = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams({
      from,
      to,
      date: today,
      passengers: "1",
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className="group relative overflow-hidden rounded-2xl aspect-[4/3] w-full text-left"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-2 text-primary-foreground font-semibold text-lg mb-1">
          <span>{from}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          <span>{to}</span>
        </div>
        <div className="text-primary-foreground/80 text-sm">
          від <span className="font-bold text-accent text-lg">{price} ₴</span>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default PopularRoute;
