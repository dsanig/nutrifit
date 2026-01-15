import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

// PLACEHOLDER - Replace with your actual keys
const STRIPE_SECRET_KEY = "STRIPE_SECRET_KEY";
const STRIPE_WEBHOOK_SECRET = "STRIPE_WEBHOOK_SECRET";
const RESEND_API_KEY = "RESEND_API_KEY";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendPlanEmail(email: string, name: string, planName: string, duration: string, addOnIncluded: boolean) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Plan Personalizado</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">¡Bienvenido/a, ${name}! 🎉</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Tu plan está listo para comenzar</p>
            </td>
          </tr>
          
          <!-- Plan Details -->
          <tr>
            <td style="padding: 40px 30px;">
              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #166534; margin: 0 0 16px; font-size: 20px;">📋 Tu Plan: ${planName}</h2>
                <p style="color: #15803d; margin: 0; font-size: 14px;">Duración: <strong>${duration}</strong></p>
                ${addOnIncluded ? `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #bbf7d0;">
                  <p style="color: #166534; margin: 0; font-size: 14px;">✨ <strong>Seguimiento Inteligente</strong> incluido</p>
                </div>
                ` : ''}
              </div>
              
              <!-- What's Included -->
              <h3 style="color: #18181b; margin: 0 0 16px; font-size: 18px;">Lo que incluye tu plan:</h3>
              <ul style="margin: 0 0 24px; padding-left: 20px; color: #52525b;">
                <li style="margin-bottom: 8px;">Acceso completo al plan personalizado</li>
                <li style="margin-bottom: 8px;">Roadmap de 3 fases adaptado a ti</li>
                <li style="margin-bottom: 8px;">8 hábitos personalizados</li>
                <li style="margin-bottom: 8px;">Estrategias nutricionales</li>
                <li style="margin-bottom: 8px;">Técnicas de psicología conductual</li>
                ${addOnIncluded ? `
                <li style="margin-bottom: 8px;">Informes semanales de IA</li>
                <li style="margin-bottom: 8px;">Ajustes automáticos del plan</li>
                ` : ''}
              </ul>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="#" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">Acceder a Mi Plan</a>
                  </td>
                </tr>
              </table>
              
              <!-- Next Steps -->
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin-top: 24px;">
                <h4 style="color: #92400e; margin: 0 0 12px; font-size: 16px;">🚀 Próximos pasos:</h4>
                <ol style="margin: 0; padding-left: 20px; color: #a16207; font-size: 14px;">
                  <li style="margin-bottom: 6px;">Accede a tu área de cliente</li>
                  <li style="margin-bottom: 6px;">Revisa tu plan personalizado</li>
                  <li style="margin-bottom: 6px;">Comienza con la Fase 1</li>
                  <li style="margin-bottom: 0;">¡Celebra cada pequeño logro!</li>
                </ol>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #18181b; padding: 30px; text-align: center;">
              <p style="color: #a1a1aa; margin: 0 0 8px; font-size: 14px;">¿Tienes preguntas? Estamos aquí para ayudarte.</p>
              <p style="color: #71717a; margin: 0; font-size: 12px;">© 2024 Tu Plan de Peso. Todos los derechos reservados.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Tu Plan <noreply@tudominio.com>", // PLACEHOLDER - Replace with your verified domain
      to: [email],
      subject: `🎉 ¡Tu Plan ${planName} está listo!`,
      html: htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Webhook signature verification failed:", message);
      return new Response(`Webhook Error: ${message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { email, name, planName, duration, addOnIncluded } = session.metadata || {};

      if (email && name && planName && duration) {
        await sendPlanEmail(email, name, planName, duration, addOnIncluded === "true");
        console.log(`Email sent to ${email} for plan ${planName}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
