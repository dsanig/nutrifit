import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Target,
  Zap,
  Brain,
  Utensils,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Download,
} from "lucide-react";
import { downloadPlanAsHtml } from "@/lib/generatePlanHtml";

interface Phase {
  phase: number;
  title: string;
  duration: string;
  description: string;
  goals: string[];
  keyActions: string[];
}

interface Habit {
  id: number;
  title: string;
  description: string;
  frequency: string;
  category: string;
  priority: "high" | "medium" | "low";
}

interface NutritionTip {
  id: number;
  title: string;
  description: string;
  examples: string[];
}

interface PsychologyTip {
  id: number;
  title: string;
  description: string;
  technique: string;
}

interface UserPlan {
  id: string;
  plan_content: {
    title: string;
    summary: string;
    estimatedDuration: string;
    difficulty: string;
  };
  phases: Phase[];
  habits: Habit[];
  nutrition_tips: NutritionTip[];
  psychology_tips: PsychologyTip[];
  status: string;
  created_at: string;
}

interface PlanViewProps {
  plan: UserPlan;
  userName?: string;
}

export function PlanView({ plan, userName = "Usuario" }: PlanViewProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-destructive/10 text-destructive">Alta</Badge>;
      case "medium":
        return <Badge className="bg-warning/10 text-warning">Media</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Baja</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <Card className="border-0 shadow-card overflow-hidden">
        <div className="h-2 gradient-primary" />
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground mb-1">
                {plan.plan_content.title}
              </h2>
              <p className="text-muted-foreground text-sm mb-3">
                {plan.plan_content.summary}
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {plan.plan_content.estimatedDuration}
                </Badge>
                <Badge variant="outline">
                  Dificultad: {plan.plan_content.difficulty}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadPlanAsHtml(plan, userName)}
                  className="ml-auto"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Descargar HTML
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="phases" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="phases" className="text-xs sm:text-sm">
            <Target className="w-4 h-4 mr-1 hidden sm:inline" />
            Fases
          </TabsTrigger>
          <TabsTrigger value="habits" className="text-xs sm:text-sm">
            <Zap className="w-4 h-4 mr-1 hidden sm:inline" />
            Hábitos
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="text-xs sm:text-sm">
            <Utensils className="w-4 h-4 mr-1 hidden sm:inline" />
            Nutrición
          </TabsTrigger>
          <TabsTrigger value="psychology" className="text-xs sm:text-sm">
            <Brain className="w-4 h-4 mr-1 hidden sm:inline" />
            Psicología
          </TabsTrigger>
        </TabsList>

        {/* Phases Tab */}
        <TabsContent value="phases" className="space-y-4">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {plan.phases.map((phase, index) => (
              <Button
                key={phase.phase}
                variant={currentPhase === index ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPhase(index)}
                className="flex-shrink-0"
              >
                Fase {phase.phase}
              </Button>
            ))}
          </div>

          {plan.phases[currentPhase] && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">
                      {plan.phases[currentPhase].phase}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {plan.phases[currentPhase].title}
                    </CardTitle>
                    <p className="text-sm text-primary">
                      {plan.phases[currentPhase].duration}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {plan.phases[currentPhase].description}
                </p>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Objetivos
                  </h4>
                  <ul className="space-y-2">
                    {plan.phases[currentPhase].goals.map((goal, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    Acciones Clave
                  </h4>
                  <ul className="space-y-2">
                    {plan.phases[currentPhase].keyActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs text-primary font-medium">{i + 1}</span>
                        </div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Habits Tab */}
        <TabsContent value="habits" className="space-y-3">
          {plan.habits.map((habit) => (
            <Card key={habit.id} className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{habit.title}</h4>
                      {getPriorityBadge(habit.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {habit.description}
                    </p>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="secondary">{habit.frequency}</Badge>
                      <Badge variant="outline">{habit.category}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition">
          <Accordion type="single" collapsible className="space-y-2">
            {plan.nutrition_tips?.map((tip) => (
              <AccordionItem
                key={tip.id}
                value={`tip-${tip.id}`}
                className="border-0 bg-card shadow-card rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Utensils className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{tip.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <p className="text-muted-foreground mb-3">{tip.description}</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm font-medium text-foreground mb-2">Ejemplos:</p>
                    <ul className="space-y-1">
                      {tip.examples.map((example, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        {/* Psychology Tab */}
        <TabsContent value="psychology">
          <Accordion type="single" collapsible className="space-y-2">
            {plan.psychology_tips?.map((tip) => (
              <AccordionItem
                key={tip.id}
                value={`psych-${tip.id}`}
                className="border-0 bg-card shadow-card rounded-xl overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Brain className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-medium text-foreground">{tip.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <Badge variant="secondary" className="mb-3">{tip.technique}</Badge>
                  <p className="text-muted-foreground">{tip.description}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
