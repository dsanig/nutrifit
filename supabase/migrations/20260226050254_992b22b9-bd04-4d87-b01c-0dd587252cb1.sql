-- Add DELETE policy for test_answers so users can replace their answers
CREATE POLICY "Users can delete own test answers"
ON public.test_answers
FOR DELETE
USING (auth.uid() = user_id);