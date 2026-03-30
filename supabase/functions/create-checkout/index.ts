import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mapping de planes a price_id de Stripe
const PRICE_IDS: Record<string, string> = {
  prueba: "price_1TGZlFFd344hbed9dQ8oWUOS",      // Plan Prueba 7 días - 4.99€
  mensual: "price_1TGZmKFd344hbed9akXxu2L2",     // Plan Mensual - 14.99€
  trimestral: "price_1TGZmfFd344hbed9DNshydFZ",  // Plan Trimestral - 24.99€
};

const ADDON_PRICE_ID = "price_1TGZv3Fd344hbed9k2RI0vfP"; // Seguimiento Inteligente - 9.99€/mes
const VAGUS_PRICE_ID = "price_1T6lPiFd344hbed9rzOVkUD4"; // Reset Nervio Vago - 12.50€/mes

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planId, planName, email, name, duration, includeAddOn, addOnQuantity, includeVagusReset, vagusResetQuantity, promoCode } = await req.json();

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Validate planId
    const priceId = PRICE_IDS[planId];
    if (!priceId) {
      throw new Error(`Invalid plan ID: ${planId}`);
    }

    // Create or get customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: { planId, duration },
      });
      customerId = customer.id;
    }

    // Build line items using price_id
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    // Add addon if included (quantity based on duration: 1 for prueba/mensual, 3 for trimestral)
    if (includeAddOn) {
      const quantity = addOnQuantity || (planId === "trimestral" ? 3 : 1);
      lineItems.push({
        price: ADDON_PRICE_ID,
        quantity: quantity,
      });
    }

    // Add Vagus Reset if included (always 12.50€, 30-day program regardless of plan)
    if (includeVagusReset) {
      lineItems.push({
        price: VAGUS_PRICE_ID,
        quantity: 1,
      });
    }

    // Build session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        planId,
        planName,
        duration,
        email,
        name,
        addOnIncluded: includeAddOn ? "true" : "false",
        vagusResetIncluded: includeVagusReset ? "true" : "false",
      },
    };

    // If promo code provided, look it up and apply; otherwise allow manual entry
    if (promoCode && promoCode.trim()) {
      const promoCodes = await stripe.promotionCodes.list({ code: promoCode.trim(), active: true, limit: 1 });
      if (promoCodes.data.length > 0) {
        sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }];
      } else {
        // Let Stripe show the promo field so user can retry
        sessionParams.allow_promotion_codes = true;
      }
    } else {
      sessionParams.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Checkout session created successfully:", session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
