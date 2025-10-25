-- Add progress_percentage to user_progress for video tracking
ALTER TABLE public.user_progress 
  ADD COLUMN IF NOT EXISTS progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Create saved_materials table for user material bookmarks
CREATE TABLE IF NOT EXISTS public.saved_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  material_id INTEGER REFERENCES public.materiais(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, material_id)
);

-- Enable RLS on saved_materials
ALTER TABLE public.saved_materials ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved_materials
CREATE POLICY "Users can view their own saved materials"
ON public.saved_materials
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved materials"
ON public.saved_materials
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved materials"
ON public.saved_materials
FOR DELETE
USING (auth.uid() = user_id);

-- Function to check if previous lesson is completed
CREATE OR REPLACE FUNCTION public.is_previous_lesson_completed(
  _user_id UUID,
  _lesson_id INTEGER
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- First lesson is always accessible
  SELECT CASE 
    WHEN _lesson_id = 1 THEN true
    ELSE EXISTS (
      SELECT 1
      FROM user_progress
      WHERE user_id = _user_id
        AND content_type = 'aula'
        AND content_id = _lesson_id - 1
        AND completed = true
        AND progress_percentage = 100
    )
  END;
$$;