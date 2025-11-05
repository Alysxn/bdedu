import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RankingUser {
  id: string;
  display_name: string;
  avatar_icon: string;
  points: number;
  coins: number;
  rank: number;
}

export const useRanking = () => {
  const { data: rankings, isLoading } = useQuery({
    queryKey: ['rankings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_icon, points, coins')
        .order('points', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Add rank to each user
      const rankedUsers: RankingUser[] = (data || []).map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      return rankedUsers;
    },
  });

  return {
    rankings: rankings || [],
    isLoading,
  };
};
