import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Lock,
  CheckCircle,
  Target,
  Zap,
  Brain
} from "lucide-react";
import { questions, categories } from "@/lib/questions";

interface ProfileScore {
  category: string;
  score: number;
  level: "bajo" | "medio" | "alto";
  name: string;
}

interface Profile {
  scores: ProfileScore[];
  mainTrait: string;
  rootFactor: string;
  dominantMechanism: string;
  riskLevel: "bajo" | "medio" | "alto";
}

export default function Results() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const answersJson = localStorage.getItem("testAnswers");
    if (!answersJson) {
      navigate("/test");
      return;
    }

    const answers = JSON.parse(answersJson);
    const calculatedProfile = calculateProfile(answers);
    setProfile(calculatedProfile);
    setIsLoading(false);
  }, [navigate]);

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Analizando tu perfil...</p>
        </div>
      </div>
    );
  }

  const topFactors = profile.scores
    .filter((s) => s.level !== "bajo")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Test completado</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Tu Perfil de Pérdida de Peso
            </h1>
            <p className="text-muted-foreground">
              Hemos analizado tus respuestas e identificado los factores clave
            </p>
          </div>

          {/* Risk Level Card */}
          <Card className="border-0 shadow-card mb-6 overflow-hidden">
            <div className={`h-2 ${getRiskColor(profile.riskLevel)}`} />
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getRiskBgColor(profile.riskLevel)}`}>
                  <AlertTriangle className={`w-8 h-8 ${getRiskIconColor(profile.riskLevel)}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    Dificultad estimada: {profile.riskLevel.toUpperCase()}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getRiskDescription(profile.riskLevel)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Factors */}
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Factores principales identificados
          </h2>
          <div className="space-y-4 mb-8">
            {topFactors.map((factor, index) => (
              <Card key={factor.category} className="border-0 shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{factor.name}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelBadge(factor.level)}`}>
                          Impacto {factor.level}
                        </span>
                      </div>
                      <Progress value={factor.score} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {getFactorDescription(factor.category)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Timeline Preview */}
          <Card className="border-0 shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary" />
                Timeline Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                
                <TimelinePhase
                  phase="Fase 1: Estabilización"
                  duration="0-2 semanas"
                  description="Normalizar patrones básicos y crear fundamentos"
                  isLocked={false}
                />
                <TimelinePhase
                  phase="Fase 2: Pérdida Activa"
                  duration="3-6 semanas"
                  description="Implementar cambios progresivos y medir resultados"
                  isLocked={true}
                />
                <TimelinePhase
                  phase="Fase 3: Consolidación"
                  duration="7-12 semanas"
                  description="Mantener hábitos y prevenir recaídas"
                  isLocked={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* Habit Preview (Limited) */}
          <Card className="border-0 shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Tu Primer Hábito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {getFirstHabit(topFactors[0]?.category).title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {getFirstHabit(topFactors[0]?.category).description}
                </p>
              </div>

              {/* Locked content preview */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10 flex items-end justify-center pb-4">
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">
                      +7 hábitos personalizados en tu plan completo
                    </p>
                  </div>
                </div>
                <div className="opacity-30">
                  <div className="bg-secondary/50 rounded-lg p-4 mb-2">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-4">
                    <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-0 shadow-lg gradient-primary overflow-hidden">
            <CardContent className="p-6 sm:p-8 text-center">
              <Zap className="w-12 h-12 text-primary-foreground/80 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-2">
                Desbloquea tu Plan Completo
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">
                Obtén acceso a tu roadmap personalizado, hábitos detallados, 
                estrategias nutricionales y técnicas de psicología conductual.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/pricing">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/90"
                  >
                    Ver planes
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
              
              <p className="text-primary-foreground/60 text-xs mt-4">
                Prueba de 7 días disponible
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function TimelinePhase({ 
  phase, 
  duration, 
  description, 
  isLocked 
}: { 
  phase: string; 
  duration: string; 
  description: string; 
  isLocked: boolean;
}) {
  return (
    <div className="relative pl-10 pb-6 last:pb-0">
      <div className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
        isLocked ? "bg-muted border-muted-foreground" : "bg-primary border-primary"
      }`} />
      <div className={isLocked ? "opacity-50" : ""}>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-foreground text-sm">{phase}</h4>
          {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
        </div>
        <p className="text-xs text-primary font-medium mb-1">{duration}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// Helper functions
function calculateProfile(answers: Record<number, any>): Profile {
  const categoryScores: Record<string, number[]> = {};

  questions.forEach((q) => {
    const answer = answers[q.id];
    if (answer === undefined) return;

    if (!categoryScores[q.category]) {
      categoryScores[q.category] = [];
    }

    if (q.type === "multi") {
      const multiAnswer = answer as string[];
      const score = multiAnswer.includes("ninguna") ? 1 : Math.min(5, multiAnswer.length + 1);
      categoryScores[q.category].push(score);
    } else {
      const option = q.options?.find((o) => o.value === answer);
      if (option?.score) {
        categoryScores[q.category].push(option.score);
      }
    }
  });

  const scores: ProfileScore[] = Object.entries(categoryScores).map(([category, scoreArr]) => {
    const avgScore = scoreArr.reduce((a, b) => a + b, 0) / scoreArr.length;
    const normalizedScore = Math.round((avgScore / 5) * 100);
    
    let level: "bajo" | "medio" | "alto" = "bajo";
    if (normalizedScore >= 70) level = "alto";
    else if (normalizedScore >= 40) level = "medio";

    return {
      category,
      score: normalizedScore,
      level,
      name: categories[category as keyof typeof categories]?.name || category,
    };
  });

  const sortedScores = scores.sort((a, b) => b.score - a.score);
  const avgOverall = scores.reduce((a, b) => a + b.score, 0) / scores.length;

  let riskLevel: "bajo" | "medio" | "alto" = "bajo";
  if (avgOverall >= 65) riskLevel = "alto";
  else if (avgOverall >= 40) riskLevel = "medio";

  return {
    scores: sortedScores,
    mainTrait: sortedScores[0]?.name || "No identificado",
    rootFactor: sortedScores[0]?.category || "unknown",
    dominantMechanism: getDominantMechanism(sortedScores[0]?.category),
    riskLevel,
  };
}

function getDominantMechanism(category?: string): string {
  const mechanisms: Record<string, string> = {
    deficit_calorico: "Inconsistencia energética",
    saciedad_proteina: "Señales de saciedad alteradas",
    ultraprocesados: "Sobreestimulación alimentaria",
    neat_sedentarismo: "Metabolismo reducido",
    entrenamiento_fuerza: "Pérdida muscular",
    sueno: "Desregulación hormonal",
    estres: "Alimentación emocional",
    alcohol_liquidas: "Calorías invisibles",
    adherencia: "Patrón yo-yo",
    factores_medicos: "Factores fisiológicos",
  };
  return mechanisms[category || ""] || "Múltiples factores";
}

function getRiskColor(level: string): string {
  switch (level) {
    case "alto": return "bg-destructive";
    case "medio": return "bg-warning";
    default: return "bg-success";
  }
}

function getRiskBgColor(level: string): string {
  switch (level) {
    case "alto": return "bg-destructive/10";
    case "medio": return "bg-warning/10";
    default: return "bg-success/10";
  }
}

function getRiskIconColor(level: string): string {
  switch (level) {
    case "alto": return "text-destructive";
    case "medio": return "text-warning";
    default: return "text-success";
  }
}

function getRiskDescription(level: string): string {
  switch (level) {
    case "alto":
      return "Hay varios factores significativos que están frenando tu progreso. Un plan estructurado puede ayudarte.";
    case "medio":
      return "Tienes algunos obstáculos identificables. Con los cambios correctos, puedes ver resultados.";
    default:
      return "Tus hábitos base son buenos. Pequeños ajustes pueden marcar la diferencia.";
  }
}

function getLevelBadge(level: string): string {
  switch (level) {
    case "alto": return "bg-destructive/10 text-destructive";
    case "medio": return "bg-warning/10 text-warning-foreground";
    default: return "bg-success/10 text-success";
  }
}

function getFactorDescription(category: string): string {
  const descriptions: Record<string, string> = {
    deficit_calorico: "Tu ingesta calórica no es consistente, lo que dificulta crear un déficit sostenible.",
    saciedad_proteina: "No estás comiendo suficiente proteína o fibra para sentirte saciado/a.",
    ultraprocesados: "El consumo de ultraprocesados y el picoteo afectan tu balance energético.",
    neat_sedentarismo: "Tu nivel de movimiento diario es bajo, reduciendo tu gasto calórico total.",
    entrenamiento_fuerza: "La falta de entrenamiento de fuerza puede estar afectando tu metabolismo.",
    sueno: "La calidad o cantidad de sueño está impactando tus hormonas del hambre.",
    estres: "El estrés está influyendo en tus decisiones alimentarias.",
    alcohol_liquidas: "Las bebidas calóricas aportan energía sin saciedad.",
    adherencia: "Tienes dificultad para mantener los cambios a largo plazo.",
    factores_medicos: "Hay factores médicos que podrían estar influyendo.",
  };
  return descriptions[category] || "Este factor necesita atención.";
}

function getFirstHabit(category?: string): { title: string; description: string } {
  const habits: Record<string, { title: string; description: string }> = {
    deficit_calorico: {
      title: "Planifica tu comida principal del día",
      description: "Cada mañana, decide qué vas a comer en tu comida principal. Solo eso. No toda la semana, solo hoy.",
    },
    saciedad_proteina: {
      title: "Añade proteína a tu desayuno",
      description: "Incluye al menos una fuente de proteína en tu primera comida del día: huevos, yogur griego, jamón, etc.",
    },
    ultraprocesados: {
      title: "Identifica tu snack problemático",
      description: "Anota cuál es el ultraprocesado que más consumes y busca una alternativa más saciante.",
    },
    neat_sedentarismo: {
      title: "Caminata de 10 minutos después de comer",
      description: "Añade un paseo corto después de tu comida principal. No es ejercicio, es movimiento.",
    },
    entrenamiento_fuerza: {
      title: "5 sentadillas al levantarte",
      description: "Antes de desayunar, haz 5 sentadillas. Es mínimo, pero crea el hábito.",
    },
    sueno: {
      title: "Alarma para ir a dormir",
      description: "Pon una alarma 30 minutos antes de tu hora ideal de acostarte como recordatorio.",
    },
    estres: {
      title: "3 respiraciones profundas antes de comer",
      description: "Antes de cada comida, haz 3 respiraciones profundas para activar el sistema parasimpático.",
    },
    alcohol_liquidas: {
      title: "Un vaso de agua antes de cada bebida calórica",
      description: "Antes de tomar cualquier bebida con calorías, bebe un vaso de agua completo.",
    },
    adherencia: {
      title: "Compromiso mínimo de 2 semanas",
      description: "Elige UN solo hábito y comprométete a hacerlo solo 14 días. Nada más.",
    },
    factores_medicos: {
      title: "Agenda una cita con tu médico",
      description: "Si no lo has hecho, agenda una revisión para descartar factores médicos.",
    },
  };
  return habits[category || "deficit_calorico"] || habits.deficit_calorico;
}
