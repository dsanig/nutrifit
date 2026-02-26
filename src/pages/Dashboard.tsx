import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { PlanView } from "@/components/dashboard/PlanView";
import { PlanGeneratingLoader } from "@/components/dashboard/PlanGeneratingLoader";
import { 
  User, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  LogOut,
  Crown,
  Target,
  Activity,
  BookOpen,
  Loader2
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
}

interface Subscription {
  id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  includes_addon: boolean;
  start_date: string;
  end_date: string | null;
}

interface Habit {
  id: string;
  habit_name: string;
  completed: boolean;
  week_number: number;
}

interface UserPlan {
  id: string;
  plan_content: {
    title: string;
    summary: string;
    estimatedDuration: string;
    difficulty: string;
  };
  phases: Array<{
    phase: number;
    title: string;
    duration: string;
    description: string;
    goals: string[];
    keyActions: string[];
  }>;
  habits: Array<{
    id: number;
    title: string;
    description: string;
    frequency: string;
    category: string;
    priority: "high" | "medium" | "low";
  }>;
  nutrition_tips: Array<{
    id: number;
    title: string;
    description: string;
    examples: string[];
  }>;
  psychology_tips: Array<{
    id: number;
    title: string;
    description: string;
    technique: string;
  }>;
  meal_plan: Array<{
    week: number;
    weekLabel: string;
    days: Array<{
      day: string;
      breakfast: string;
      lunch: string;
      dinner: string;
    }>;
  }> | null;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weekProgress, setWeekProgress] = useState(0);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [showPlan, setShowPlan] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    await Promise.all([
      loadProfile(session.user.id),
      loadSubscription(session.user.id),
      loadHabits(session.user.id),
      loadUserPlan(session.user.id)
    ]);
    
    setLoading(false);
  };

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (data) setProfile(data);
  };

  const loadSubscription = async (userId: string) => {
    const { data } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (data) setSubscription(data);
  };

  const loadUserPlan = async (userId: string) => {
    // Using type assertion since table was just created
    const { data } = await (supabase.from("user_plans") as ReturnType<typeof supabase.from>)
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (data) setUserPlan(data as UserPlan);
  };

  const generatePlanManually = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setGeneratingPlan(true);
    try {
      // Build testAnswers from localStorage as fallback for DB
      let testAnswers: Record<string, unknown> | undefined;
      const answersJson = localStorage.getItem("testAnswers");
      const profileJson = localStorage.getItem("testProfile");
      if (answersJson && profileJson) {
        const answers = JSON.parse(answersJson);
        const profile = JSON.parse(profileJson);
        testAnswers = {
          answers,
          profileScores: profile.scores,
          riskLevel: profile.riskLevel,
          mainFactors: profile.mainFactors,
        };
      }

      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: {
          userId: session.user.id,
          subscriptionId: subscription?.id,
          testAnswers,
        },
      });

      if (error) throw error;
      if (data?.error) {
        throw new Error(data.error);
      }
      if (data?.plan) {
        setUserPlan(data.plan as UserPlan);
        setShowPlan(true);
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      const msg = error instanceof Error ? error.message : "Error desconocido";
      if (msg.includes("No test answers")) {
        toast.error("No se encontraron respuestas del test. Por favor, realiza el test primero.");
      } else {
        toast.error("Error al generar el plan. Inténtalo de nuevo.");
      }
    } finally {
      setGeneratingPlan(false);
    }
  };

  const loadHabits = async (userId: string) => {
    const currentWeek = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 604800000);
    
    const { data } = await supabase
      .from("habit_tracker")
      .select("*")
      .eq("user_id", userId)
      .eq("week_number", currentWeek);
    
    if (data && data.length > 0) {
      setHabits(data);
      const completed = data.filter(h => h.completed).length;
      setWeekProgress((completed / data.length) * 100);
    } else {
      // Create default habits for new users
      const defaultHabits = [
        "Entrenar 3 veces",
        "Beber 2L de agua diarios",
        "Dormir 7+ horas",
        "Seguir plan nutricional",
        "Meditar 10 min"
      ];
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const newHabits = defaultHabits.map(name => ({
          user_id: session.user.id,
          habit_name: name,
          completed: false,
          week_number: currentWeek
        }));
        
        const { data: inserted } = await supabase
          .from("habit_tracker")
          .insert(newHabits)
          .select();
        
        if (inserted) {
          setHabits(inserted);
        }
      }
    }
  };

  const toggleHabit = async (habitId: string, currentState: boolean) => {
    const { error } = await supabase
      .from("habit_tracker")
      .update({ 
        completed: !currentState,
        completed_at: !currentState ? new Date().toISOString() : null
      })
      .eq("id", habitId);
    
    if (!error) {
      setHabits(prev => prev.map(h => 
        h.id === habitId ? { ...h, completed: !currentState } : h
      ));
      
      const updatedHabits = habits.map(h => 
        h.id === habitId ? { ...h, completed: !currentState } : h
      );
      const completed = updatedHabits.filter(h => h.completed).length;
      setWeekProgress((completed / updatedHabits.length) * 100);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const getDaysRemaining = () => {
    if (!subscription?.end_date) return null;
    return differenceInDays(new Date(subscription.end_date), new Date());
  };

  const getPlanProgress = () => {
    if (!subscription?.start_date || !subscription?.end_date) return 0;
    const total = differenceInDays(new Date(subscription.end_date), new Date(subscription.start_date));
    const elapsed = differenceInDays(new Date(), new Date(subscription.start_date));
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  // Show plan view if toggled
  if (showPlan && userPlan) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Mi Plan Personalizado</h1>
            <Button variant="outline" onClick={() => setShowPlan(false)}>
              Volver al Dashboard
            </Button>
          </div>
          <PlanView plan={userPlan} userName={profile?.full_name || "Usuario"} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              ¡Hola, {profile?.full_name || "Usuario"}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="w-fit">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Personal Plan Card */}
          {subscription && !generatingPlan && (
            <Card className="border-0 shadow-card lg:col-span-3 overflow-hidden">
              <div className="h-2 gradient-primary" />
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                      <BookOpen className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-foreground">
                        {userPlan ? userPlan.plan_content.title : "Tu Plan Personalizado"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {userPlan 
                          ? `Generado el ${format(new Date(userPlan.created_at), "d 'de' MMMM, yyyy", { locale: es })}`
                          : "Plan basado en tu perfil diagnóstico"
                        }
                      </p>
                    </div>
                  </div>
                  {userPlan ? (
                    <Button onClick={() => setShowPlan(true)} className="shadow-button">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Ver mi plan completo
                    </Button>
                  ) : (
                    <Button 
                      onClick={generatePlanManually} 
                      className="shadow-button"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Generar mi plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {generatingPlan && <PlanGeneratingLoader />}

          {/* Plan Status Card */}
          <Card className="border-0 shadow-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Tu Plan Activo</CardTitle>
                <p className="text-sm text-muted-foreground">Estado de tu suscripción</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-lg">{subscription.plan_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Activo
                        </span>
                        {subscription.includes_addon && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                            + Seguimiento IA
                          </span>
                        )}
                      </div>
                    </div>
                    {getDaysRemaining() !== null && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{getDaysRemaining()}</p>
                        <p className="text-sm text-muted-foreground">días restantes</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progreso del plan</span>
                      <span className="font-medium">{Math.round(getPlanProgress())}%</span>
                    </div>
                    <Progress value={getPlanProgress()} className="h-2" />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Inicio: {format(new Date(subscription.start_date), "d MMM yyyy", { locale: es })}</span>
                    </div>
                    {subscription.end_date && (
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span>Fin: {format(new Date(subscription.end_date), "d MMM yyyy", { locale: es })}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No tienes ningún plan activo</p>
                  <Button onClick={() => navigate("/pricing")} className="shadow-button">
                    Ver planes disponibles
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="border-0 shadow-card">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Esta Semana</CardTitle>
                <p className="text-sm text-muted-foreground">Tu progreso semanal</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      className="text-muted"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="48"
                      cy="48"
                    />
                    <circle
                      className="text-accent"
                      strokeWidth="8"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (weekProgress / 100) * 251.2}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="48"
                      cy="48"
                    />
                  </svg>
                  <span className="absolute text-2xl font-bold">{Math.round(weekProgress)}%</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {habits.filter(h => h.completed).length} de {habits.length} hábitos
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Habits Tracker */}
          <Card className="border-0 shadow-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Hábitos Semanales</CardTitle>
                <p className="text-sm text-muted-foreground">Marca tus logros de esta semana</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div 
                    key={habit.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      habit.completed ? "bg-success/5" : "bg-muted/30"
                    }`}
                  >
                    <Checkbox
                      id={habit.id}
                      checked={habit.completed}
                      onCheckedChange={() => toggleHabit(habit.id, habit.completed)}
                      className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                    />
                    <label
                      htmlFor={habit.id}
                      className={`flex-1 cursor-pointer ${
                        habit.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {habit.habit_name}
                    </label>
                    {habit.completed && (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="border-0 shadow-card">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <User className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Mi Perfil</CardTitle>
                <p className="text-sm text-muted-foreground">Tu información</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{profile?.full_name || "No especificado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile?.email || "No especificado"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
