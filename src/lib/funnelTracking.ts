import { supabase } from "@/integrations/supabase/client";

function getSessionId(): string {
  let sid = localStorage.getItem("funnel_session_id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("funnel_session_id", sid);
  }
  return sid;
}

export type FunnelEvent =
  | "test_started"
  | "test_completed"
  | "results_viewed"
  | "pricing_viewed"
  | "account_created"
  | "checkout_started"
  | "payment_completed";

export async function trackFunnelEvent(
  eventType: FunnelEvent,
  metadata?: Record<string, unknown>
) {
  try {
    const sessionId = getSessionId();
    const { data: { session } } = await supabase.auth.getSession();

    await supabase.from("funnel_events" as any).insert({
      event_type: eventType,
      session_id: sessionId,
      user_id: session?.user?.id || null,
      metadata: metadata || {},
    });
  } catch (err) {
    console.error("Funnel tracking error:", err);
  }
}
