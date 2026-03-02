import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Scale, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; fullName: string | null } | null>(null);
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    // If we're on the home page, scroll directly
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate home then scroll
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          email: session.user.email || "",
          fullName: meta?.full_name || meta?.name || null,
        });
      } else {
        setUser(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          email: session.user.email || "",
          fullName: meta?.full_name || meta?.name || null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  const displayName = user?.fullName || user?.email || "";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border safe-area-top">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">NutriFit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("how-it-works")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cómo funciona
            </button>
            <button onClick={() => scrollToSection("faq")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </button>
          </nav>

          {/* Desktop CTA / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[150px] truncate">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Mi cuenta
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link to="/test">
                  <Button size="sm">
                    Empezar test
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-3">
              <button 
                onClick={() => scrollToSection("how-it-works")}
                className="text-foreground py-2 text-left"
              >
                Cómo funciona
              </button>
              <button 
                onClick={() => scrollToSection("faq")}
                className="text-foreground py-2 text-left"
              >
                FAQ
              </button>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 px-2 py-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate">{displayName}</span>
                    </div>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Mi cuenta
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive" 
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Iniciar sesión
                      </Button>
                    </Link>
                    <Link to="/test" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">
                        Empezar test
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
