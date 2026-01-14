import { Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Zap, ArrowRight } from "lucide-react";

const plans = [
  {
    id: "7d",
    name: "Prueba",
    price: 9,
    duration: "7 días",
    description: "Ideal para probar el sistema",
    features: [
      "Acceso completo al plan personalizado",
      "Roadmap de 3 fases",
      "8 hábitos personalizados",
      "Estrategias nutricionales",
      "Técnicas de psicología conductual",
    ],
    popular: false,
  },
  {
    id: "1m",
    name: "Mensual",
    price: 19,
    duration: "1 mes",
    description: "Nuestro plan más popular",
    features: [
      "Todo lo de Prueba +",
      "Tracking de hábitos",
      "Métricas de progreso",
      "Acceso al área de cliente",
      "Soporte por email",
    ],
    popular: true,
  },
  {
    id: "3m",
    name: "Trimestral",
    price: 39,
    duration: "3 meses",
    description: "Mejor valor para resultados duraderos",
    features: [
      "Todo lo de Mensual +",
      "Ahorro del 30%",
      "Acceso extendido",
      "Contenido actualizado",
      "Prioridad en soporte",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Elige tu plan
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Accede a tu plan personalizado de pérdida de peso y empieza a 
              transformar tus hábitos hoy mismo.
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`border-2 relative ${
                  plan.popular 
                    ? "border-primary shadow-lg scale-105" 
                    : "border-border shadow-card"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-popular flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Más popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}€</span>
                    <span className="text-muted-foreground">/{plan.duration}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? "shadow-button" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Elegir plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Premium Add-on */}
          <Card className="border-2 border-accent/50 bg-accent/5 mb-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-7 h-7 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      Seguimiento Inteligente
                    </h3>
                    <span className="text-xs font-medium bg-accent/20 text-accent px-2 py-1 rounded-full">
                      Premium
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Potencia tu progreso con seguimiento automatizado basado en IA. 
                    Recibe ajustes semanales personalizados según tu evolución.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <Feature text="Informe semanal de IA" />
                    <Feature text="Ajustes automáticos del plan" />
                    <Feature text="Mensajes motivacionales" />
                    <Feature text="Historial de progreso" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">25€</span>
                      <span className="text-muted-foreground">/mes</span>
                    </div>
                    <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      Añadir al plan
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guarantee & FAQ */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Pago seguro con Stripe. Cancela cuando quieras.
            </p>
            <p className="text-xs text-muted-foreground">
              Los reembolsos se gestionan según la política de Stripe y la legislación vigente en España.
              <br />
              Este servicio no garantiza resultados específicos. Los resultados varían según la persona.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Check className="w-4 h-4 text-accent" />
      <span className="text-sm text-foreground">{text}</span>
    </div>
  );
}
