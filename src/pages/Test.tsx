import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { questions, Question, QuestionOption, categories } from "@/lib/questions";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { supabase } from "@/integrations/supabase/client";

type Answer = string | number | string[];

interface ProfileScore {
  category: string;
  score: number;
  level: "bajo" | "medio" | "alto";
  name: string;
}

function calculateProfile(answers: Record<number, unknown>) {
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
    riskLevel,
    mainFactors: sortedScores.slice(0, 3),
  };
}

export default function Test() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = questions[currentQuestion];
  const currentAnswer = answers[question.id];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswer = (value: Answer) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const handleMultiSelect = (value: string) => {
    const current = (currentAnswer as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    handleAnswer(updated);
  };

  const canProceed = () => {
    if (question.type === "multi") {
      return (currentAnswer as string[])?.length > 0;
    }
    return currentAnswer !== undefined;
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate profile from answers
    const profile = calculateProfile(answers);
    
    // Store in localStorage for Results page
    localStorage.setItem("testAnswers", JSON.stringify(answers));
    localStorage.setItem("testProfile", JSON.stringify(profile));
    
    // Try to save to database if user is logged in
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Delete existing answers first, then insert new ones
        await supabase.from("test_answers").delete().eq("user_id", session.user.id);
        // Using type assertion since table was just created
        await (supabase.from("test_answers") as ReturnType<typeof supabase.from>).insert([{
          user_id: session.user.id,
          answers: answers,
          profile_scores: profile.scores,
          risk_level: profile.riskLevel,
          main_factors: profile.mainFactors,
        }]);
      }
    } catch (error) {
      console.error("Error saving test answers:", error);
    }
    
    navigate("/results");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <ProgressBar value={currentQuestion + 1} max={questions.length} />
          </div>

          {/* Question Card */}
          <Card className="border-0 shadow-card mb-6">
            <CardContent className="p-6 sm:p-8">
              {/* Category badge */}
              <div className="mb-4">
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {getCategoryLabel(question.category)}
                </span>
              </div>

              {/* Question */}
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
                {question.text}
              </h2>

              {/* Helper text */}
              {question.helperText && (
                <p className="text-muted-foreground text-sm mb-6">
                  {question.helperText}
                </p>
              )}

              {/* Options */}
              <div className="space-y-3">
                {question.type === "multi" ? (
                  question.options?.map((option) => (
                    <MultiOption
                      key={String(option.value)}
                      option={option}
                      isSelected={(currentAnswer as string[])?.includes(String(option.value))}
                      onSelect={() => handleMultiSelect(String(option.value))}
                    />
                  ))
                ) : (
                  question.options?.map((option) => (
                    <SingleOption
                      key={String(option.value)}
                      option={option}
                      isSelected={currentAnswer === option.value}
                      onSelect={() => handleAnswer(option.value)}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className="gap-2 shadow-button"
            >
              {isSubmitting ? (
                "Procesando..."
              ) : isLastQuestion ? (
                <>
                  Ver resultados
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SingleOption({
  option,
  isSelected,
  onSelect,
}: {
  option: QuestionOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            isSelected ? "border-primary bg-primary" : "border-muted-foreground"
          }`}
        >
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-primary-foreground" />
          )}
        </div>
        <span
          className={`font-medium ${
            isSelected ? "text-primary" : "text-foreground"
          }`}
        >
          {option.label}
        </span>
      </div>
    </button>
  );
}

function MultiOption({
  option,
  isSelected,
  onSelect,
}: {
  option: QuestionOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 bg-card"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
            isSelected ? "border-primary bg-primary" : "border-muted-foreground"
          }`}
        >
          {isSelected && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
        </div>
        <span
          className={`font-medium ${
            isSelected ? "text-primary" : "text-foreground"
          }`}
        >
          {option.label}
        </span>
      </div>
    </button>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    deficit_calorico: "Déficit Calórico",
    saciedad_proteina: "Saciedad y Proteína",
    ultraprocesados: "Ultraprocesados",
    neat_sedentarismo: "Movimiento Diario",
    entrenamiento_fuerza: "Entrenamiento",
    sueno: "Sueño",
    estres: "Estrés",
    alcohol_liquidas: "Calorías Líquidas",
    adherencia: "Adherencia",
    factores_medicos: "Factores Médicos",
  };
  return labels[category] || category;
}
