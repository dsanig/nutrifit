import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Star, Zap, ArrowRight, Mail, UserRound } from "lucide-react";
import { useMemo, useRef, useState } from "react";

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
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [addOnSelected, setAddOnSelected] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "email" | "account" | "checkout">("idle");
  const [email, setEmail] = useState("");
  const summaryRef = useRef<HTMLDivElement | null>(null);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [selectedPlanId],
  );
  const addOnPrice = 25;
  const totalPrice = selectedPlan ? selectedPlan.price + (addOnSelected ? addOnPrice : 0) : 0;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setCheckoutStep("idle");
    if (summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    Elegir plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Plan Summary */}
          <div ref={summaryRef} className="space-y-6 mb-10">
            <Card className="border-2 border-primary/40 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {selectedPlan ? "Tu plan seleccionado" : "Selecciona un plan para continuar"}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedPlan
                    ? "Revisa los detalles, añade el seguimiento inteligente y confirma tu compra."
                    : "Al elegir uno de los planes arriba, veremos aquí el resumen de compra."}
                </p>
              </CardHeader>
              {selectedPlan && (
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-foreground">{selectedPlan.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedPlan.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-foreground">{selectedPlan.price}€</span>
                      <span className="text-muted-foreground">/{selectedPlan.duration}</span>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {selectedPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-success mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                    {addOnSelected && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-accent mt-0.5" />
                        <span className="text-sm text-foreground">
                          Seguimiento Inteligente activo (informes y ajustes semanales)
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="rounded-lg border border-border bg-background p-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Plan base</span>
                      <span>{selectedPlan.price}€</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Seguimiento Inteligente</span>
                      <span>{addOnSelected ? `+${addOnPrice}€` : "No añadido"}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-base font-semibold text-foreground">
                      <span>Total estimado</span>
                      <span>{totalPrice}€</span>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
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
                    <Button
                      variant="outline"
                      className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setAddOnSelected((prev) => !prev)}
                    >
                      {addOnSelected ? "Quitar del plan" : "Añadir al plan"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checkout Flow */}
          <Card className="border-2 border-primary/30 mb-12">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Confirmar compra</h3>
                  <p className="text-sm text-muted-foreground">
                    Completa el proceso para activar tu plan y desbloquear el acceso inmediato.
                  </p>
                </div>
                <Button
                  className="shrink-0"
                  disabled={!selectedPlan}
                  onClick={() => setCheckoutStep("email")}
                >
                  Confirmar compra
                </Button>
              </div>

              {checkoutStep === "email" && (
                <div className="grid gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Mail className="w-4 h-4" />
                    <span>Introduce tu email para continuar</span>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="checkout-email">Email</Label>
                    <Input
                      id="checkout-email"
                      type="email"
                      placeholder="tucorreo@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setCheckoutStep("account")}
                      disabled={!email}
                    >
                      Continuar con el email
                    </Button>
                  </div>
                </div>
              )}

              {checkoutStep === "account" && (
                <div className="grid gap-4 rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <UserRound className="w-4 h-4" />
                    <span>Crea tu cuenta</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="checkout-name">Nombre</Label>
                      <Input id="checkout-name" type="text" placeholder="María López" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="checkout-password">Contraseña</Label>
                      <Input id="checkout-password" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => setCheckoutStep("checkout")}>Crear cuenta</Button>
                  </div>
                </div>
              )}

              {checkoutStep === "checkout" && selectedPlan && (
                <div className="grid gap-6 rounded-lg border border-border bg-background p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Paso final: revisa y paga</p>
                    <p className="text-sm text-muted-foreground">
                      Todo listo para completar tu compra. El acceso se activará inmediatamente.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm font-medium text-foreground mb-2">Resumen de compra</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{selectedPlan.name}</span>
                      <span>{selectedPlan.price}€</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Seguimiento Inteligente</span>
                      <span>{addOnSelected ? `+${addOnPrice}€` : "No añadido"}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-base font-semibold text-foreground">
                      <span>Total</span>
                      <span>{totalPrice}€</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
                    <p className="font-semibold mb-2">Si no completas la compra</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Enviaremos recordatorios por email durante las próximas 48h.</li>
                      <li>La oferta quedará disponible en tu cuenta para finalizarla cuando quieras.</li>
                      <li>Podrás completar el pago desde el área de cliente con un solo clic.</li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Button variant="outline">Ver oferta en mi cuenta</Button>
                    <Button className="shadow-button">Finalizar compra</Button>
                  </div>
                </div>
              )}
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
