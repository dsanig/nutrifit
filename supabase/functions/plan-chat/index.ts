import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const LOVABLE_AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[PLAN-CHAT] ${step}${detailsStr}`);
};

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
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");
    const userId = userData.user.id;

    logStep("User authenticated", { userId });

    // Verify user has addon subscription
    const { data: sub } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .eq("includes_addon", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub) {
      return new Response(JSON.stringify({ error: "No tienes el Seguimiento Inteligente activo." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    const { message, chatHistory, planId } = await req.json();
    if (!message || !planId) throw new Error("message and planId are required");

    logStep("Processing chat", { planId, messageLength: message.length });

    // Get current plan
    const { data: plan } = await supabaseClient
      .from("user_plans")
      .select("*")
      .eq("id", planId)
      .eq("user_id", userId)
      .single();

    if (!plan) throw new Error("Plan not found");

    const planContent = plan.plan_content as { title: string; summary: string; estimatedDuration: string; difficulty: string };
    const phases = plan.phases as Array<{ phase: number; title: string; duration: string; description: string; goals: string[]; keyActions: string[] }>;
    const habits = plan.habits as Array<{ id: number; title: string; description: string; frequency: string; category: string; priority: string }>;
    const nutritionTips = plan.nutrition_tips as Array<{ id: number; title: string; description: string; examples: string[] }>;
    const psychologyTips = plan.psychology_tips as Array<{ id: number; title: string; description: string; technique: string }>;
    const mealPlan = plan.meal_plan as Array<{ week: number; weekLabel: string; days: Array<{ day: string; breakfast: string; lunch: string; dinner: string }> }>;

    const systemPrompt = `Eres un asistente nutricional experto de NutriFit. El usuario tiene un plan personalizado activo y quiere hacer cambios o consultas.

## PLAN ACTUAL DEL USUARIO:
- Título: ${planContent.title}
- Resumen: ${planContent.summary}
- Duración: ${planContent.estimatedDuration}
- Dificultad: ${planContent.difficulty}

### Fases:
${phases.map(p => `Fase ${p.phase}: ${p.title} (${p.duration}) - ${p.description}`).join("\n")}

### Hábitos:
${habits.map(h => `- ${h.title}: ${h.description} (${h.frequency})`).join("\n")}

### Consejos nutricionales:
${nutritionTips?.map(t => `- ${t.title}: ${t.description}`).join("\n") || "N/A"}

### Técnicas psicológicas:
${psychologyTips?.map(t => `- ${t.title}: ${t.description} (${t.technique})`).join("\n") || "N/A"}

### Plan de comidas (resumen):
${mealPlan ? mealPlan.map(w => `${w.weekLabel}: ${w.days.length} días planificados`).join(", ") : "N/A"}

## REGLAS IMPORTANTES:
1. Responde SIEMPRE en español de España
2. Puedes modificar CUALQUIER aspecto del plan: fases, hábitos, nutrición, psicología, menú de comidas
3. NO puedes modificar la DURACIÓN total del plan ni los días restantes
4. Cuando el usuario pida un cambio, responde confirmando el cambio Y devuelve el plan actualizado en formato JSON
5. Si el usuario solo hace una pregunta sin pedir cambios, responde normalmente sin JSON
6. Para cambios, incluye al FINAL de tu respuesta un bloque JSON con este formato exacto:

\`\`\`plan_update
{
  "planContent": { ... },
  "phases": [ ... ],
  "habits": [ ... ],
  "nutritionTips": [ ... ],
  "psychologyTips": [ ... ],
  "mealPlan": [ ... ]
}
\`\`\`

7. El JSON debe contener TODO el plan completo (no solo los cambios), respetando la misma estructura
8. Mantén la misma duración (${planContent.estimatedDuration}) y número de semanas en el mealPlan
9. Sé amable, profesional y empático`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(chatHistory || []),
      { role: "user", content: message },
    ];

    const response = await fetch(LOVABLE_AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        temperature: 0.7,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logStep("AI error", { status: response.status, error });
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 429,
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA agotados." }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 402,
        });
      }
      throw new Error(`AI error: ${error}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0]?.message?.content || "";

    logStep("AI response received", { length: aiContent.length });

    // Check if there's a plan update in the response
    let planUpdated = false;
    const planUpdateMatch = aiContent.match(/```plan_update\s*([\s\S]*?)\s*```/);
    
    if (planUpdateMatch) {
      try {
        const updatedPlan = JSON.parse(planUpdateMatch[1]);
        logStep("Plan update detected, saving to DB");

        // Preserve original duration
        if (updatedPlan.planContent) {
          updatedPlan.planContent.estimatedDuration = planContent.estimatedDuration;
        }

        const updateData: Record<string, unknown> = {};
        if (updatedPlan.planContent) updateData.plan_content = updatedPlan.planContent;
        if (updatedPlan.phases) updateData.phases = updatedPlan.phases;
        if (updatedPlan.habits) updateData.habits = updatedPlan.habits;
        if (updatedPlan.nutritionTips) updateData.nutrition_tips = updatedPlan.nutritionTips;
        if (updatedPlan.psychologyTips) updateData.psychology_tips = updatedPlan.psychologyTips;
        if (updatedPlan.mealPlan) updateData.meal_plan = updatedPlan.mealPlan;

        const { error: updateError } = await supabaseClient
          .from("user_plans")
          .update(updateData)
          .eq("id", planId)
          .eq("user_id", userId);

        if (updateError) {
          logStep("Error updating plan", updateError);
        } else {
          planUpdated = true;
          logStep("Plan updated successfully");
        }
      } catch (e) {
        logStep("Failed to parse plan update JSON", { error: String(e) });
      }
    }

    // Clean AI response (remove the JSON block for display)
    const cleanResponse = aiContent.replace(/```plan_update[\s\S]*?```/g, "").trim();

    return new Response(JSON.stringify({
      response: cleanResponse,
      planUpdated,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
