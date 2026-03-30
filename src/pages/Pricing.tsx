import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Star, Zap, ArrowRight, Mail, UserRound, Loader2, Tag, Heart, Lock } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackFunnelEvent } from "@/lib/funnelTracking";

const plans = [
  {
    id: "prueba", // Matches Stripe price_id mapping
    name: "Prueba",
    price: 4.99,
    duration: "7 días",
    durationMonths: 1, // 1 month of add-on for 7-day trial
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
    id: "mensual", // Matches Stripe price_id mapping
    name: "Mensual",
    price: 14.99,
    duration: "1 mes",
    durationMonths: 1,
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
    id: "trimestral", // Matches Stripe price_id mapping
    name: "Trimestral",
    price: 24.99,
    duration: "3 meses",
    durationMonths: 3,
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

const ADD_ON_BASE_PRICE = 9.99; // €9.99 per month
const VAGUS_BASE_PRICE = 12.50; // €12.50 per month

export default function Pricing() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [addOnSelected, setAddOnSelected] = useState(false);
  const [vagusSelected, setVagusSelected] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"idle" | "email" | "account" | "checkout">("idle");
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);

  // Track pricing page view
  useEffect(() => {
    trackFunnelEvent("pricing_viewed");
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setEmail(session.user.email || "");
        setName(session.user.user_metadata?.full_name || "");
        setCheckoutStep("checkout");
      }
    };
    checkSession();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [selectedPlanId],
  );
  
  // Calculate add-on price based on plan duration (€25 per month)
  const addOnPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    return Math.round(ADD_ON_BASE_PRICE * selectedPlan.durationMonths * 100) / 100;
  }, [selectedPlan]);

  // Vagus Reset is always 12.50€ (30-day program regardless of plan duration)
  const vagusPrice = VAGUS_BASE_PRICE;
  
  const totalPrice = selectedPlan ? Math.round((selectedPlan.price + (addOnSelected ? addOnPrice : 0) + (vagusSelected ? vagusPrice : 0)) * 100) / 100 : 0;

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setCheckoutStep("idle");
    if (summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const saveTestAnswersToDb = async (userId: string) => {
    try {
      const answersJson = localStorage.getItem("testAnswers");
      const profileJson = localStorage.getItem("testProfile");
      if (!answersJson || !profileJson) return;

      const answers = JSON.parse(answersJson);
      const profile = JSON.parse(profileJson);

      // Delete old answers first, then insert new ones
      await supabase.from("test_answers").delete().eq("user_id", userId);
      await supabase.from("test_answers").insert({
        user_id: userId,
        answers,
        profile_scores: profile.scores,
        risk_level: profile.riskLevel,
        main_factors: profile.mainFactors,
      });
      console.log("Test answers saved to DB for user", userId);
    } catch (err) {
      console.error("Error saving test answers to DB:", err);
    }
  };

  const handleCreateAccount = async () => {
    if (!email || !name || !selectedPlan) return;
    
    if (!password || password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    setIsLoading(true);
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setIsLoginMode(true);
          toast.info("Este email ya está registrado. Introduce tu contraseña para iniciar sesión y continuar con la compra.");
          return;
        }
        if (error.message.includes("weak_password") || error.message.includes("Password")) {
          toast.error("La contraseña debe tener al menos 6 caracteres");
          return;
        }
        if (error.message.includes("Invalid email")) {
          toast.error("El email introducido no es válido");
          return;
        }
        throw error;
      }

      if (signUpData?.user?.id) {
        await saveTestAnswersToDb(signUpData.user.id);
      }
      
      setCheckoutStep("checkout");
      trackFunnelEvent("account_created", { plan: selectedPlan.id });
      toast.success("Cuenta creada correctamente");
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Contraseña incorrecta. Inténtalo de nuevo.");
        } else {
          toast.error(error.message || "Error al iniciar sesión");
        }
        return;
      }

      if (data.user) {
        setName(data.user.user_metadata?.full_name || name);
        await saveTestAnswersToDb(data.user.id);
      }

      setCheckoutStep("checkout");
      setIsLoginMode(false);
      toast.success("¡Sesión iniciada! Continúa con tu compra.");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !email || !name) return;
    
    setIsLoading(true);
    try {
      // Ensure test answers are saved to DB for logged-in user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        await saveTestAnswersToDb(session.user.id);
      }

      trackFunnelEvent("checkout_started", { plan: selectedPlan.id });
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          email,
          name,
          duration: selectedPlan.duration,
          includeAddOn: addOnSelected,
          addOnQuantity: selectedPlan.durationMonths,
          includeVagusReset: vagusSelected,
          vagusResetQuantity: 1,
          promoCode: promoCode.trim() || undefined,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error al procesar el pago. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
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
                    {vagusSelected && (
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                        <span className="text-sm text-foreground">
                          Reset del Nervio Vago (programa de 30 días)
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
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Reset Nervio Vago</span>
                      <span>{vagusSelected ? `+${vagusPrice}€` : "No añadido"}</span>
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
                      <span className="text-2xl font-bold text-foreground">9,99€</span>
                      <span className="text-muted-foreground">/mes</span>
                      {selectedPlan && selectedPlan.durationMonths > 1 && (
                        <span className="block text-sm text-muted-foreground">
                          ({addOnPrice}€ para {selectedPlan.duration})
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setAddOnSelected((prev) => !prev)}
                      disabled={!selectedPlan}
                    >
                      {addOnSelected ? "Quitar del plan" : "Añadir al plan"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vagus Reset Add-on */}
          <Card className="border-2 border-emerald-500/50 bg-emerald-500/5 mb-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">
                      Reset del Nervio Vago
                    </h3>
                    <span className="text-xs font-medium bg-emerald-500/20 text-emerald-600 px-2 py-1 rounded-full">
                      Nuevo
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Programa de 30 días con ejercicios diarios para resetear tu nervio vago. 
                    Mejora tu digestión, sueño, estrés y bienestar general.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <Feature text="30 ejercicios guiados" />
                    <Feature text="Técnicas de respiración" />
                    <Feature text="Nutrición específica" />
                    <Feature text="Neuroplasticidad" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-foreground">12,50€</span>
                      <span className="text-muted-foreground">/mes</span>
                      {selectedPlan && (
                        <span className="block text-sm text-muted-foreground">
                          (12,50€ — programa de 30 días)
                        </span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                      onClick={() => setVagusSelected((prev) => !prev)}
                      disabled={!selectedPlan}
                    >
                      {vagusSelected ? "Quitar del plan" : "Añadir al plan"}
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
                    <span>{isLoginMode ? "Inicia sesión para continuar" : "Crea tu cuenta"}</span>
                  </div>
                  
                  {isLoginMode ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        Ya tienes una cuenta con <strong>{email}</strong>. Introduce tu contraseña para continuar con la compra.
                      </p>
                      <div className="grid gap-2">
                        <Label htmlFor="checkout-login-password">Contraseña</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input 
                            id="checkout-login-password" 
                            type="password" 
                            placeholder="Tu contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setIsLoginMode(false);
                            setPassword("");
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          Crear cuenta nueva
                        </button>
                        <Button 
                          onClick={handleLogin}
                          disabled={!password || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Iniciando sesión...
                            </>
                          ) : (
                            "Iniciar sesión y continuar"
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="checkout-name">Nombre</Label>
                          <Input 
                            id="checkout-name" 
                            type="text" 
                            placeholder="María López"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="checkout-password">Contraseña</Label>
                          <Input 
                            id="checkout-password" 
                            type="password" 
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                          />
                          <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setIsLoginMode(true);
                            setPassword("");
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          ¿Ya tienes cuenta? Inicia sesión
                        </button>
                        <Button 
                          onClick={handleCreateAccount}
                          disabled={!name || !password || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Creando cuenta...
                            </>
                          ) : (
                            "Crear cuenta"
                          )}
                        </Button>
                      </div>
                    </>
                  )}
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
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Reset Nervio Vago</span>
                      <span>{vagusSelected ? `+${vagusPrice}€` : "No añadido"}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-base font-semibold text-foreground">
                      <span>Total</span>
                      <span>{totalPrice}€</span>
                    </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="promo-code" className="flex items-center gap-2 text-sm font-medium">
                        <Tag className="w-4 h-4" />
                        Código de descuento (opcional)
                      </Label>
                      <Input
                        id="promo-code"
                        type="text"
                        placeholder="Introduce tu código"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
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
                    <Button 
                      className="shadow-button"
                      onClick={handleCheckout}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        "Finalizar compra"
                      )}
                    </Button>
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
