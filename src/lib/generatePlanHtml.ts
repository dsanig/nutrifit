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
  created_at: string;
}

const priorityLabel = (p: string) => {
  switch (p) {
    case "high": return "🔴 Alta";
    case "medium": return "🟡 Media";
    default: return "🟢 Baja";
  }
};

export function generatePlanHtml(plan: UserPlan, userName: string): string {
  const date = new Date(plan.created_at).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${plan.plan_content.title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: #f8f9fc; line-height: 1.6; }
  .container { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
  .header { text-align: center; margin-bottom: 48px; padding: 48px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border-radius: 20px; color: white; }
  .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
  .header p { opacity: 0.9; font-size: 15px; max-width: 500px; margin: 0 auto 16px; }
  .meta { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
  .meta span { background: rgba(255,255,255,0.2); padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 500; }
  .section { margin-bottom: 40px; }
  .section-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 3px solid #6366f1; display: inline-block; }
  .phase-card { background: white; border-radius: 16px; padding: 28px; margin-bottom: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); border-left: 4px solid #6366f1; }
  .phase-card h3 { font-size: 18px; color: #6366f1; margin-bottom: 4px; }
  .phase-card .duration { font-size: 13px; color: #8b5cf6; font-weight: 600; margin-bottom: 12px; }
  .phase-card p { color: #555; margin-bottom: 16px; }
  .phase-card ul { list-style: none; padding: 0; }
  .phase-card li { padding: 6px 0; padding-left: 24px; position: relative; color: #444; font-size: 14px; }
  .phase-card li::before { content: '✓'; position: absolute; left: 0; color: #22c55e; font-weight: 700; }
  .goals-label, .actions-label { font-size: 14px; font-weight: 600; color: #1a1a2e; margin-bottom: 8px; margin-top: 4px; }
  .habit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 600px) { .habit-grid { grid-template-columns: 1fr; } }
  .habit-card { background: white; border-radius: 14px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  .habit-card h4 { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
  .habit-card p { font-size: 13px; color: #666; margin-bottom: 10px; }
  .habit-tags { display: flex; gap: 8px; flex-wrap: wrap; }
  .tag { font-size: 11px; padding: 3px 10px; border-radius: 12px; background: #f0f0ff; color: #6366f1; font-weight: 500; }
  .tag.priority { background: #fef3c7; color: #92400e; }
  .tip-card { background: white; border-radius: 14px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  .tip-card h4 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
  .tip-card p { font-size: 14px; color: #555; margin-bottom: 12px; }
  .examples { background: #f8f9fc; border-radius: 10px; padding: 14px 18px; }
  .examples strong { font-size: 13px; display: block; margin-bottom: 6px; }
  .examples li { font-size: 13px; color: #666; padding: 2px 0; list-style: disc inside; }
  .psych-card { background: white; border-radius: 14px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  .psych-card .technique { display: inline-block; background: #ede9fe; color: #7c3aed; padding: 3px 12px; border-radius: 10px; font-size: 12px; font-weight: 600; margin-bottom: 10px; }
  .psych-card h4 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
  .psych-card p { font-size: 14px; color: #555; }
  .footer { text-align: center; margin-top: 48px; padding: 24px; color: #999; font-size: 13px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>${plan.plan_content.title}</h1>
    <p>${plan.plan_content.summary}</p>
    <div class="meta">
      <span>📅 ${date}</span>
      <span>⏱ ${plan.plan_content.estimatedDuration}</span>
      <span>📊 Dificultad: ${plan.plan_content.difficulty}</span>
      <span>👤 ${userName}</span>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">📋 Fases del Plan</h2>
    ${plan.phases.map(phase => `
    <div class="phase-card">
      <h3>Fase ${phase.phase}: ${phase.title}</h3>
      <div class="duration">${phase.duration}</div>
      <p>${phase.description}</p>
      <div class="goals-label">🎯 Objetivos</div>
      <ul>${phase.goals.map(g => `<li>${g}</li>`).join("")}</ul>
      <div class="actions-label" style="margin-top:14px">⚡ Acciones Clave</div>
      <ul>${phase.keyActions.map(a => `<li>${a}</li>`).join("")}</ul>
    </div>`).join("")}
  </div>

  <div class="section">
    <h2 class="section-title">✅ Hábitos Personalizados</h2>
    <div class="habit-grid">
      ${plan.habits.map(h => `
      <div class="habit-card">
        <h4>${h.title}</h4>
        <p>${h.description}</p>
        <div class="habit-tags">
          <span class="tag">${h.frequency}</span>
          <span class="tag">${h.category}</span>
          <span class="tag priority">${priorityLabel(h.priority)}</span>
        </div>
      </div>`).join("")}
    </div>
  </div>

  ${plan.nutrition_tips?.length ? `
  <div class="section">
    <h2 class="section-title">🥗 Consejos Nutricionales</h2>
    ${plan.nutrition_tips.map(tip => `
    <div class="tip-card">
      <h4>${tip.title}</h4>
      <p>${tip.description}</p>
      ${tip.examples?.length ? `
      <div class="examples">
        <strong>Ejemplos:</strong>
        <ul>${tip.examples.map(e => `<li>${e}</li>`).join("")}</ul>
      </div>` : ""}
    </div>`).join("")}
  </div>` : ""}

  ${plan.psychology_tips?.length ? `
  <div class="section">
    <h2 class="section-title">🧠 Técnicas Psicológicas</h2>
    ${plan.psychology_tips.map(tip => `
    <div class="psych-card">
      <span class="technique">${tip.technique}</span>
      <h4>${tip.title}</h4>
      <p>${tip.description}</p>
    </div>`).join("")}
  </div>` : ""}

  <div class="footer">
    <p>Plan generado el ${date} · Personalizado para ${userName}</p>
  </div>
</div>
</body>
</html>`;
}

export function downloadPlanAsHtml(plan: UserPlan, userName: string) {
  const html = generatePlanHtml(plan, userName);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mi-plan-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
