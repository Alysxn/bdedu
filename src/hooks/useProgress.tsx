import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

type ContentType = 'aula' | 'exercicio' | 'desafio' | 'material';

export const useProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress = [] } = useQuery({
    queryKey: ['progress', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const markComplete = useMutation({
    mutationFn: async ({ contentType, contentId }: { contentType: ContentType; contentId: number }) => {
      if (!user?.id) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,content_type,content_id'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: ['user_achievements'] });
    },
  });

  const incrementAttempts = useMutation({
    mutationFn: async ({ contentType, contentId }: { contentType: ContentType; contentId: number }) => {
      if (!user?.id) throw new Error('No user logged in');
      
      // Get current progress
      const { data: current } = await supabase
        .from('user_progress')
        .select('attempts')
        .eq('user_id', user.id)
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .single();
      
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          content_type: contentType,
          content_id: contentId,
          attempts: (current?.attempts || 0) + 1,
        }, {
          onConflict: 'user_id,content_type,content_id'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
    },
  });

  const isCompleted = (contentType: ContentType, contentId: number) => {
    return progress.some(
      p => p.content_type === contentType && 
           p.content_id === contentId && 
           p.completed
    );
  };

  const getAttempts = (contentType: ContentType, contentId: number) => {
    const item = progress.find(
      p => p.content_type === contentType && p.content_id === contentId
    );
    return item?.attempts || 0;
  };

  return {
    progress,
    markComplete: markComplete.mutate,
    incrementAttempts: incrementAttempts.mutate,
    isCompleted,
    getAttempts,
  };
};
