import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';

export const useTutorial = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const markTutorialCompleted = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ tutorial_completed: true })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const shouldShowTutorial = () => {
    // Show tutorial if profile exists and tutorial_completed is false
    return profile && profile.tutorial_completed === false;
  };

  return {
    shouldShowTutorial: shouldShowTutorial(),
    markTutorialCompleted: markTutorialCompleted.mutate,
  };
};
