import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, PartyPopper, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Success() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsAccount, setNeedsAccount] = useState(false);

  useEffect(() => {
    if (sessionId) {
      verifySession(sessionId);
    } else {
      setVerifying(false);
      setVerified(true); // No session_id means direct visit, show success
    }
  }, [sessionId]);

  const verifySession = async (sid: string) => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("verify-session", {
        body: { sessionId: sid },
      });

      if (fnError) throw fnError;

      if (data?.success) {
        setVerified(true);
      } else if (data?.needsAccount) {
        setNeedsAccount(true);
        setError(data.error);
      } else {
        setError(data?.error || "Error verificando el pago");
      }
    } catch (err) {
      console.error("Verify error:", err);
      setError("Error verificando el pago. Contacta con soporte si el problema persiste.");
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-0 shadow-card">
              <CardContent className="p-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Verificando tu pago...</h2>
                <p className="text-muted-foreground">Estamos activando tu plan. Esto solo toma unos segundos.</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !verified) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-destructive/30 bg-destructive/5">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  {needsAccount ? "Cuenta no encontrada" : "Error en la verificación"}
                </h1>
                <p className="text-muted-foreground mb-8">{error}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {needsAccount ? (
                    <Button asChild>
                      <Link to="/login">Crear cuenta / Iniciar sesión</Link>
                    </Button>
                  ) : (
                    <Button onClick={() => sessionId && verifySession(sessionId)}>
                      Reintentar
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link to="/">Volver al inicio</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-success/30 bg-success/5">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <PartyPopper className="w-10 h-10 text-success" />
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                ¡Compra completada! 🎉
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Tu plan ha sido activado correctamente. Estamos generando tu plan 
                personalizado con IA. ¡Accede a tu dashboard para verlo!
              </p>
              
              <div className="bg-background rounded-lg border border-border p-6 mb-8 text-left">
                <h3 className="font-semibold text-foreground mb-4">Próximos pasos:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Tu suscripción ya está activa</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Tu plan personalizado se está generando con IA</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Accede a tu dashboard para ver todo</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/dashboard">Ir a mi Dashboard</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Volver al inicio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}