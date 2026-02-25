import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[VERIFY-SESSION] ${step}${detailsStr}`);
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
    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error("sessionId is required");
    }

    logStep("Verifying session", { sessionId });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Session retrieved", { status: session.payment_status, email: session.metadata?.email });

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ success: false, error: "Payment not completed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { email, planId, planName, duration, addOnIncluded } = session.metadata || {};
    if (!email || !planName) {
      throw new Error("Missing metadata in checkout session");
    }

    // Check if subscription already exists for this session (idempotency)
    const { data: existingSub } = await supabaseClient
      .from("subscriptions")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (existingSub) {
      logStep("Subscription already exists", { id: existingSub.id });

      // Check if plan exists
      const { data: existingPlan } = await supabaseClient
        .from("user_plans")
        .select("id, status")
        .eq("subscription_id", existingSub.id)
        .maybeSingle();

      return new Response(JSON.stringify({
        success: true,
        alreadyProcessed: true,
        subscriptionId: existingSub.id,
        planExists: !!existingPlan,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Find user by email
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      logStep("No user found for email", { email });
      return new Response(JSON.stringify({
        success: false,
        error: "No se encontró una cuenta con ese email. Regístrate primero.",
        needsAccount: true,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("User found", { userId: profile.user_id });

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    if (duration === "7 días") {
      endDate.setDate(endDate.getDate() + 7);
    } else if (duration === "1 mes") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (duration === "3 meses") {
      endDate.setMonth(endDate.getMonth() + 3);
    }

    // Create subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from("subscriptions")
      .insert({
        user_id: profile.user_id,
        plan_id: planId || "unknown",
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
      logStep("Error creating subscription", subError);
      throw new Error(`Failed to create subscription: ${subError.message}`);
    }

    logStep("Subscription created", { subscriptionId: subscription.id });

    // Trigger plan generation (fire and forget)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

    fetch(`${supabaseUrl}/functions/v1/generate-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        userId: profile.user_id,
        subscriptionId: subscription.id,
      }),
    }).catch((err) => logStep("Plan generation trigger error", String(err)));

    logStep("Plan generation triggered");

    return new Response(JSON.stringify({
      success: true,
      subscriptionId: subscription.id,
      userId: profile.user_id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    logStep("Error", { message });
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
