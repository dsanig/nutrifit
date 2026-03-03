import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, BookOpen, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { vagusExercises, bonusTips } from "@/lib/vagusExercises";

export function VagusExercises() {
  const [currentDay, setCurrentDay] = useState(0);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  const toggleDay = (day: number) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const exercise = vagusExercises[currentDay];
  const progress = Math.round((completedDays.size / vagusExercises.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="border-0 shadow-card overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">Reset del Nervio Vago</h2>
              <p className="text-muted-foreground text-sm">
                Programa de 30 días · {completedDays.size}/{vagusExercises.length} completados ({progress}%)
              </p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Navigator */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDay((d) => Math.max(0, d - 1))}
          disabled={currentDay === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-1 pb-1">
            {vagusExercises.map((_, i) => (
              <Button
                key={i}
                variant={currentDay === i ? "default" : completedDays.has(i + 1) ? "secondary" : "outline"}
                size="sm"
                className="flex-shrink-0 w-9 h-9 p-0 text-xs"
                onClick={() => setCurrentDay(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDay((d) => Math.min(vagusExercises.length - 1, d + 1))}
          disabled={currentDay === vagusExercises.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Current Exercise */}
      {exercise && (
        <Card className="border-0 shadow-card">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{exercise.day}</span>
                </div>
                <div>
                  <CardTitle className="text-lg">{exercise.exercise}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {exercise.learn}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={completedDays.has(exercise.day)}
                  onCheckedChange={() => toggleDay(exercise.day)}
                />
                <span className="text-sm text-muted-foreground">Hecho</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {exercise.description && (
              <p className="text-muted-foreground">{exercise.description}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Bonus Tips */}
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Consejos Extra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {bonusTips.map((tip, i) => (
              <AccordionItem
                key={i}
                value={`bonus-${i}`}
                className="border rounded-lg px-3"
              >
                <AccordionTrigger className="py-2 hover:no-underline text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{tip.category}</Badge>
                    <span>{tip.tip}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-2">
                  Incorpora este consejo en tu rutina diaria para potenciar los beneficios del programa.
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
