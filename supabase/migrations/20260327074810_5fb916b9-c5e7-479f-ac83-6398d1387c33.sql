
CREATE TABLE public.funnel_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  session_id text,
  user_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_funnel_events_type ON public.funnel_events(event_type);
CREATE INDEX idx_funnel_events_created ON public.funnel_events(created_at);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (including anonymous visitors)
CREATE POLICY "Anyone can insert funnel events"
  ON public.funnel_events FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Admins can view all funnel events"
  ON public.funnel_events FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
