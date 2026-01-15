import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";

export default function Success() {
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
                Tu plan ha sido activado correctamente. Hemos enviado un email con 
                todos los detalles y el acceso a tu área de cliente.
              </p>
              
              <div className="bg-background rounded-lg border border-border p-6 mb-8 text-left">
                <h3 className="font-semibold text-foreground mb-4">Próximos pasos:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Revisa tu email para ver tu plan personalizado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Accede a tu área de cliente para comenzar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">Empieza con la Fase 1 de tu roadmap</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/login">Acceder a mi cuenta</Link>
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
