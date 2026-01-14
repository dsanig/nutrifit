import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  "Test de 30 preguntas validadas",
  "Diagnóstico personalizado inmediato",
  "Plan adaptado a tu estilo de vida",
  "Sin dietas restrictivas",
];

export function CTA() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-primary rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
                Empieza hoy a entender tu cuerpo
              </h2>
              <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-8">
                Miles de personas ya han descubierto por qué no perdían peso. 
                El primer paso es entender qué está pasando realmente.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                  >
                    <CheckCircle className="w-4 h-4 text-primary-foreground" />
                    <span className="text-sm text-primary-foreground font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/test">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  Empezar test gratuito
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <p className="text-primary-foreground/70 text-sm mt-4">
                Sin tarjeta de crédito · Solo 3-5 minutos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
