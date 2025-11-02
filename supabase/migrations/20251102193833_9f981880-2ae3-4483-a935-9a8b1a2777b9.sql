-- Add tutorial_completed field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN tutorial_completed BOOLEAN DEFAULT FALSE;