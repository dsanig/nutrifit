import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface TestAnswers {
  answers: Record<number, unknown>;
  profileScores: Array<{
    category: string;
    score: number;
    level: string;
    name: string;
  }>;
  riskLevel: string;
  mainFactors: Array<{
    category: string;
    name: string;
    score: number;
  }>;
}

interface GeneratedPlan {
  planContent: {
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
  nutritionTips: Array<{
    id: number;
    title: string;
    description: string;
    examples: string[];
  }>;
  psychologyTips: Array<{
    id: number;
    title: string;
    description: string;
    technique: string;
  }>;
  mealPlan: Array<{
    week: number;
    weekLabel: string;
    days: Array<{
      day: string;
      breakfast: string;
      lunch: string;
      dinner: string;
    }>;
  }>;
}

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[GENERATE-PLAN] ${step}${detailsStr}`);
};

async function generatePlanWithAI(testData: TestAnswers, userName: string): Promise<GeneratedPlan> {
  const mainFactorsText = testData.mainFactors
    .map((f, i) => `${i + 1}. ${f.name} (puntuación: ${f.score}/100)`)
    .join("\n");

  const prompt = `Eres un experto en nutrición, psicología conductual y pérdida de peso sostenible. 
Genera un plan personalizado de pérdida de peso para "${userName}" basado en su perfil diagnóstico.

## PERFIL DEL USUARIO:
- Nivel de dificultad general: ${testData.riskLevel.toUpperCase()}
- Factores principales identificados:
${mainFactorsText}

## PUNTUACIONES POR CATEGORÍA:
${testData.profileScores.map(s => `- ${s.name}: ${s.score}/100 (nivel ${s.level})`).join("\n")}

## INSTRUCCIONES:
Genera un plan COMPLETAMENTE PERSONALIZADO que:
1. Aborde específicamente los factores principales identificados
2. Sea progresivo y realista
3. Use técnicas de psicología conductual
4. Incluya hábitos pequeños y manejables
5. Esté en ESPAÑOL de España

## FORMATO DE RESPUESTA (JSON):
{
  "planContent": {
    "title": "Título descriptivo del plan",
    "summary": "Resumen de 2-3 frases del enfoque del plan",
    "estimatedDuration": "12 semanas",
    "difficulty": "moderado"
  },
  "phases": [
    {
      "phase": 1,
      "title": "Estabilización",
      "duration": "Semanas 1-2",
      "description": "Descripción de la fase",
      "goals": ["objetivo1", "objetivo2", "objetivo3"],
      "keyActions": ["acción1", "acción2", "acción3"]
    }
  ],
  "habits": [
    {
      "id": 1,
      "title": "Título del hábito",
      "description": "Descripción detallada del hábito",
      "frequency": "Diario",
      "category": "nutrición",
      "priority": "high"
    }
  ],
  "nutritionTips": [
    {
      "id": 1,
      "title": "Título del consejo",
      "description": "Descripción detallada",
      "examples": ["ejemplo1", "ejemplo2"]
    }
  ],
  "psychologyTips": [
    {
      "id": 1,
      "title": "Título de la técnica",
      "description": "Cómo aplicarla",
      "technique": "Nombre de la técnica psicológica"
    }
  ]
}

IMPORTANTE:
- Genera exactamente 3 fases
- Genera exactamente 8 hábitos personalizados
- Genera 4-5 consejos nutricionales
- Genera 3-4 técnicas psicológicas
- Genera un plan de comidas para TODAS las semanas del plan (si el plan dura 12 semanas, genera 12 semanas de menú)
- Cada semana tiene 7 días (Lunes a Domingo) con desayuno, comida y cena
- Solo indica nombres de platos o ingredientes principales, SIN cantidades ni gramajes
- Los platos deben ser variados, realistas y adaptados al perfil del usuario
- TODO debe estar adaptado a los factores identificados del usuario

Añade al JSON este campo adicional:
"mealPlan": [
  {
    "week": 1,
    "weekLabel": "Semana 1",
    "days": [
      { "day": "Lunes", "breakfast": "Tostadas integrales con aguacate y huevo revuelto", "lunch": "Ensalada de pollo con verduras asadas", "dinner": "Merluza al horno con brócoli" },
      ...
    ]
  },
  ...
]`;

  logStep("Calling Lovable AI Gateway");
  
  const response = await fetch(LOVABLE_AI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content: "Eres un experto en nutrición y pérdida de peso. Responde SOLO con JSON válido, sin markdown ni texto adicional."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 16000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    logStep("AI Gateway error", { status: response.status, error });
    throw new Error(`AI Gateway error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  logStep("AI response received", { length: content?.length });

  // Parse the JSON response (handle potential markdown code blocks)
  let jsonContent = content;
  if (content.includes("```json")) {
    jsonContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  } else if (content.includes("```")) {
    jsonContent = content.replace(/```\n?/g, "");
  }

  const plan = JSON.parse(jsonContent.trim());
  return plan as GeneratedPlan;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { userId, subscriptionId, testAnswers } = await req.json();

    if (!userId) {
      throw new Error("userId is required");
    }

    logStep("Processing for user", { userId, subscriptionId });

    // Get user profile for name
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", userId)
      .single();

    const userName = profile?.full_name || "Usuario";
    logStep("User profile loaded", { userName });

    // Get or use provided test answers
    let testData: TestAnswers;
    
    if (testAnswers) {
      testData = testAnswers;
    } else {
      // Fetch from database
      const { data: storedAnswers } = await supabaseClient
        .from("test_answers")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!storedAnswers) {
        throw new Error("No test answers found for user");
      }

      testData = {
        answers: storedAnswers.answers,
        profileScores: storedAnswers.profile_scores || [],
        riskLevel: storedAnswers.risk_level || "medio",
        mainFactors: storedAnswers.main_factors || [],
      };
    }

    logStep("Test data loaded", { riskLevel: testData.riskLevel });

    // Generate the plan using AI
    const plan = await generatePlanWithAI(testData, userName);
    logStep("Plan generated successfully");

    // Save to database
    const { data: savedPlan, error: saveError } = await supabaseClient
      .from("user_plans")
      .insert({
        user_id: userId,
        subscription_id: subscriptionId || null,
        plan_content: plan.planContent,
        phases: plan.phases,
        habits: plan.habits,
        nutrition_tips: plan.nutritionTips,
        psychology_tips: plan.psychologyTips,
        meal_plan: plan.mealPlan,
        status: "active",
      })
      .select()
      .single();

    if (saveError) {
      logStep("Error saving plan", saveError);
      throw new Error(`Failed to save plan: ${saveError.message}`);
    }

    logStep("Plan saved to database", { planId: savedPlan.id });

    // Also create initial habits in habit_tracker
    const currentWeek = Math.ceil(
      (new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 604800000
    );

    const habitEntries = plan.habits.slice(0, 5).map((habit) => ({
      user_id: userId,
      habit_name: habit.title,
      completed: false,
      week_number: currentWeek,
    }));

    await supabaseClient.from("habit_tracker").insert(habitEntries);
    logStep("Initial habits created");

    return new Response(
      JSON.stringify({
        success: true,
        planId: savedPlan.id,
        plan: savedPlan,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in generate-plan", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
