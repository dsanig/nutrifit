import { Brain, Utensils, Activity, Moon, TrendingUp, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  {
    icon: Brain,
    title: "Análisis Conductual",
    description: "Identificamos patrones de comportamiento que sabotean tu progreso sin que te des cuenta.",
  },
  {
    icon: Utensils,
    title: "Nutrición Práctica",
    description: "Estrategias alimentarias adaptadas a tu vida real, sin contar calorías obsesivamente.",
  },
  {
    icon: Activity,
    title: "Movimiento Sostenible",
    description: "Rutinas de actividad diseñadas para tu estilo de vida, no para atletas profesionales.",
  },
  {
    icon: Moon,
    title: "Optimización del Sueño",
    description: "El sueño afecta directamente al peso. Te ayudamos a mejorar tu descanso.",
  },
  {
    icon: TrendingUp,
    title: "Progreso Medible",
    description: "Métricas claras para seguir tu evolución más allá de la báscula.",
  },
  {
    icon: Heart,
    title: "Bienestar Integral",
    description: "Enfoque holístico que mejora tu relación con la comida y tu cuerpo.",
  },
];

export function Benefits() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Un enfoque diferente para{" "}
            <span className="text-primary">resultados diferentes</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            No más dietas restrictivas. Entendemos las causas reales de por qué 
            no pierdes peso y te damos herramientas prácticas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-card card-hover bg-card"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
