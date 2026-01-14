import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scale, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement auth
    console.log("Auth:", { email, password, isLogin });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
              </CardTitle>
              <p className="text-muted-foreground">
                {isLogin 
                  ? "Accede a tu área de cliente" 
                  : "Empieza tu transformación hoy"
                }
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="text-right">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                )}

                <Button type="submit" className="w-full shadow-button">
                  {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary font-medium hover:underline"
                  >
                    {isLogin ? "Regístrate" : "Inicia sesión"}
                  </button>
                </p>
              </div>

              {!isLogin && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Al crear una cuenta, aceptas nuestros{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Términos y Condiciones
                  </Link>{" "}
                  y{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Política de Privacidad
                  </Link>
                  .
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
