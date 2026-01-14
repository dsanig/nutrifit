import { Link } from "react-router-dom";
import { Scale } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Scale className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">NutriFit</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-4">
              Herramienta educativa de bienestar para identificar hábitos y patrones 
              que afectan la pérdida de peso. No sustituye el consejo médico profesional.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} NutriFit. Todos los derechos reservados.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Producto</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/test" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Empezar test
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border pt-8">
          <div className="bg-secondary/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Aviso importante:</strong> Esta aplicación es una herramienta educativa de bienestar 
              y no constituye consejo médico, diagnóstico o tratamiento. Los planes y recomendaciones 
              proporcionados están basados en principios generales de hábitos saludables y no sustituyen 
              la consulta con profesionales de la salud. Si tienes condiciones médicas, tomas medicación 
              o tienes preocupaciones sobre tu salud, consulta con tu médico antes de realizar cambios 
              en tu alimentación o actividad física. Los resultados pueden variar según la persona.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
