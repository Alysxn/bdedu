import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProgress } from './useProgress';
import { useLessons } from './useLessons';

export const useChallenges = () => {
  const { user } = useAuth();
  const { progress } = useProgress();
  const { isLessonUnlocked } = useLessons();

  // Fetch all challenges
  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['desafios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('desafios')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });

  // Check if challenge is unlocked (based on lesson unlock status)
  const isChallengeUnlocked = (challengeAulaId: number | null) => {
    if (!challengeAulaId) return true; // If no lesson link, always unlocked
    return isLessonUnlocked(challengeAulaId);
  };

  // Get challenge progress
  const getChallengeProgress = (challengeId: number) => {
    const challengeProgress = progress.find(
      p => p.content_type === 'desafio' && p.content_id === challengeId
    );
    return {
      completed: challengeProgress?.completed || false,
      attempts: challengeProgress?.attempts || 0,
    };
  };

  // Get challenges with unlock status
  const challengesWithStatus = challenges.map(challenge => {
    const { completed, attempts } = getChallengeProgress(challenge.id);
    return {
      ...challenge,
      isUnlocked: isChallengeUnlocked(challenge.aula_id),
      completed,
      attempts,
    };
  }).filter(challenge => challenge.isUnlocked); // Only show unlocked challenges

  return {
    challenges: challengesWithStatus,
    allChallenges: challenges,
    isLoading,
    isChallengeUnlocked,
    getChallengeProgress,
  };
};
