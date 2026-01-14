import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { questions, Question, QuestionOption } from "@/lib/questions";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Header } from "@/components/landing/Header";

type Answer = string | number | string[];

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
    // Store answers in localStorage for now (will be saved to DB later)
    localStorage.setItem("testAnswers", JSON.stringify(answers));
    // Navigate to results
    setTimeout(() => {
      navigate("/results");
    }, 1000);
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
