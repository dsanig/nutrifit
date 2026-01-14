import { ClipboardCheck, BarChart3, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Completa el test",
    description: "Responde 30 preguntas sobre tus hábitos, rutinas y estilo de vida. Solo te llevará 3-5 minutos.",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Recibe tu diagnóstico",
    description: "Analizamos tus respuestas para identificar las causas específicas que frenan tu pérdida de peso.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Obtén tu plan",
    description: "Generamos un plan personalizado con hábitos, rutinas y estrategias adaptadas a tu perfil.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Cómo funciona
          </h2>
          <p className="text-muted-foreground text-lg">
            Un proceso simple de 3 pasos para descubrir qué está frenando tu progreso
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 max-w-5xl mx-auto mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="bg-card rounded-2xl p-6 shadow-card relative z-10">
                {/* Step number */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-primary/20">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/test">
            <Button size="lg" className="shadow-button">
              Empezar ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
