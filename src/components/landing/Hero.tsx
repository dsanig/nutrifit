import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Target } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 py-12 lg:py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card shadow-card rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Test científico y personalizado
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in">
            Descubre por qué{" "}
            <span className="text-primary">no estás bajando de peso</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Nuestro test analiza tus hábitos, rutinas y patrones para crear un 
            plan personalizado basado en ciencia conductual, no en dietas restrictivas.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-in">
            <Link to="/test">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 shadow-button hover:shadow-lg transition-all">
                Empezar test gratuito
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Solo 3-5 minutos</span>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto animate-slide-in">
            <TrustItem 
              icon={<Shield className="w-5 h-5 text-primary" />}
              text="Sin compromiso"
            />
            <TrustItem 
              icon={<Target className="w-5 h-5 text-primary" />}
              text="100% personalizado"
            />
            <TrustItem 
              icon={<Clock className="w-5 h-5 text-primary" />}
              text="Resultados inmediatos"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center justify-center gap-2 bg-card/50 backdrop-blur-sm rounded-lg px-4 py-3">
      {icon}
      <span className="text-sm font-medium text-foreground">{text}</span>
    </div>
  );
}
