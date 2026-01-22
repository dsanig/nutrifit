-- Table to store user test answers
CREATE TABLE public.test_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  answers JSONB NOT NULL,
  profile_scores JSONB,
  risk_level TEXT,
  main_factors JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.test_answers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own test answers" 
ON public.test_answers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test answers" 
ON public.test_answers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own test answers" 
ON public.test_answers FOR UPDATE 
USING (auth.uid() = user_id);

-- Table to store AI-generated personalized plans
CREATE TABLE public.user_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id),
  plan_content JSONB NOT NULL,
  phases JSONB NOT NULL,
  habits JSONB NOT NULL,
  nutrition_tips JSONB,
  psychology_tips JSONB,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own plans" 
ON public.user_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans" 
ON public.user_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans" 
ON public.user_plans FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_test_answers_updated_at
BEFORE UPDATE ON public.test_answers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at
BEFORE UPDATE ON public.user_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();