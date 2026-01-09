import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group p-6 rounded-2xl bg-card shadow-soft hover:shadow-card transition-all duration-300 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl hero-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8 text-primary-foreground" />
      </div>
      <h3 className="font-display font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
