import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

async function triggerPlanGeneration(userId: string, subscriptionId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  
  logStep("Triggering plan generation", { userId, subscriptionId });
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        userId,
        subscriptionId,
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      logStep("Plan generation error", { error });
    } else {
      logStep("Plan generation triggered successfully");
    }
  } catch (error) {
    logStep("Error triggering plan generation", { error: String(error) });
  }
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
      logStep("Webhook signature verification failed", { message });
      return new Response(`Webhook Error: ${message}`, { status: 400 });
    }

    logStep("Webhook event received", { type: event.type });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { email, name, planName, duration, addOnIncluded } = session.metadata || {};

      logStep("Checkout completed", { email, planName });

      if (email && planName) {
        // Find user by email
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("user_id")
          .eq("email", email)
          .single();

        if (profile) {
          logStep("User found", { userId: profile.user_id });

          // Calculate end date based on plan
          const startDate = new Date();
          let endDate = new Date();
          
          if (duration === "7 días") {
            endDate.setDate(endDate.getDate() + 7);
          } else if (duration === "1 mes") {
            endDate.setMonth(endDate.getMonth() + 1);
          } else if (duration === "3 meses") {
            endDate.setMonth(endDate.getMonth() + 3);
          }

          // Create subscription record
          const { data: subscription, error: subError } = await supabaseClient
            .from("subscriptions")
            .insert({
              user_id: profile.user_id,
              plan_id: session.metadata?.planId || "unknown",
              plan_name: planName,
              status: "active",
              includes_addon: addOnIncluded === "true",
              start_date: startDate.toISOString(),
              end_date: endDate.toISOString(),
              stripe_session_id: session.id,
            })
            .select()
            .single();

          if (subError) {
            logStep("Error creating subscription", { error: subError });
          } else {
            logStep("Subscription created", { subscriptionId: subscription.id });
            
            // Trigger AI plan generation (fire and forget)
            triggerPlanGeneration(profile.user_id, subscription.id);
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    logStep("Webhook error", { error: String(error) });
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
