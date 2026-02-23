import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Dumbbell, Apple, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { icon: Brain, label: "Analizando tu perfil diagnóstico...", color: "text-purple-500" },
  { icon: Dumbbell, label: "Diseñando tu plan de entrenamiento...", color: "text-blue-500" },
  { icon: Apple, label: "Creando tu menú semanal personalizado...", color: "text-green-500" },
  { icon: Heart, label: "Preparando estrategias de bienestar...", color: "text-red-500" },
  { icon: Sparkles, label: "Finalizando tu plan completo...", color: "text-amber-500" },
];

export function PlanGeneratingLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-0 shadow-card lg:col-span-3 overflow-hidden">
      <div className="h-1 bg-muted overflow-hidden">
        <div className="h-full gradient-primary animate-[shimmer_2s_ease-in-out_infinite] w-1/3" />
      </div>
      <CardContent className="py-12 px-6">
        <div className="max-w-md mx-auto text-center space-y-8">
          {/* Animated icon */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full gradient-primary opacity-20 animate-ping" />
            <div className="absolute inset-2 rounded-full gradient-primary opacity-30 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full gradient-primary flex items-center justify-center">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Icon
                    key={i}
                    className={cn(
                      "w-10 h-10 text-primary-foreground absolute transition-all duration-500",
                      activeStep === i
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-50"
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Generando tu plan personalizado
            </h3>
            <p className="text-sm text-muted-foreground">
              Nuestra IA está analizando tus datos para crear un plan único para ti
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-3 text-left">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeStep;
              const isDone = i < activeStep;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-500",
                    isActive && "bg-primary/5 scale-[1.02]",
                    isDone && "opacity-60",
                    !isActive && !isDone && "opacity-30"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500",
                      isActive ? "gradient-primary" : isDone ? "bg-primary/20" : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-primary-foreground" : isDone ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground">
            Este proceso puede tardar hasta 30 segundos
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
