import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export const useAchievements = () => {
  const { user } = useAuth();
  const { profile, updatePoints, updateCoins } = useProfile();
  const queryClient = useQueryClient();

  // Fetch all achievements
  const { data: allAchievements = [], isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's achievement progress
  const { data: userAchievements = [], isLoading: userAchievementsLoading } = useQuery({
    queryKey: ['user_achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Get combined achievement data with progress
  const achievements = allAchievements.map(achievement => {
    const userProgress = userAchievements.find(ua => ua.achievement_id === achievement.id);
    
    // Calculate current progress based on achievement type
    let currentProgress = 0;
    if (profile) {
      switch (achievement.achievement_type) {
        case 'aula':
          // Count completed classes from user_progress
          currentProgress = userProgress?.current_progress || 0;
          break;
        case 'exercicio':
          currentProgress = userProgress?.current_progress || 0;
          break;
        case 'desafio':
          currentProgress = userProgress?.current_progress || 0;
          break;
        case 'material':
          currentProgress = userProgress?.current_progress || 0;
          break;
        case 'coins':
          currentProgress = profile.coins || 0;
          break;
        case 'points':
          currentProgress = profile.points || 0;
          break;
        default:
          currentProgress = userProgress?.current_progress || 0;
      }
    }

    return {
      ...achievement,
      currentProgress,
      claimed: userProgress?.claimed || false,
    };
  });

  // Update achievement progress
  const updateProgress = useMutation({
    mutationFn: async ({ achievementId, increment = 1 }: { achievementId: string; increment?: number }) => {
      if (!user?.id) throw new Error('No user logged in');

      const existing = userAchievements.find(ua => ua.achievement_id === achievementId);
      const newProgress = (existing?.current_progress || 0) + increment;

      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          current_progress: newProgress,
        }, {
          onConflict: 'user_id,achievement_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_achievements'] });
    },
  });

  // Claim achievement reward
  const claimReward = useMutation({
    mutationFn: async (achievementId: string) => {
      if (!user?.id) throw new Error('No user logged in');

      const achievement = allAchievements.find(a => a.id === achievementId);
      if (!achievement) throw new Error('Achievement not found');

      // Mark as claimed
      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          claimed: true,
          claimed_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,achievement_id'
        });

      if (error) throw error;

      // Award points and coins
      updatePoints(achievement.reward_points || 0);
      updateCoins(achievement.reward_coins || 0);

      return achievement;
    },
    onSuccess: (achievement) => {
      queryClient.invalidateQueries({ queryKey: ['user_achievements'] });
      toast.success('Recompensa Resgatada!', {
        description: `Você ganhou ${achievement.reward_points} pontos e ${achievement.reward_coins} moedas!`,
      });
    },
    onError: (error: any) => {
      toast.error('Erro ao resgatar recompensa: ' + error.message);
    },
  });

  return {
    achievements,
    isLoading: achievementsLoading || userAchievementsLoading,
    updateProgress: updateProgress.mutate,
    claimReward: claimReward.mutate,
    isClaiming: claimReward.isPending,
  };
};
