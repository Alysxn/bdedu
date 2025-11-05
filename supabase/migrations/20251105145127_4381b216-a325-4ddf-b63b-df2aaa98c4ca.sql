-- Allow users to view public profile information of all users for rankings
CREATE POLICY "Anyone can view public profile info"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;