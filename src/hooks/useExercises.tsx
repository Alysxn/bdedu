import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProgress } from './useProgress';
import { useLessons } from './useLessons';

export const useExercises = () => {
  const { user } = useAuth();
  const { progress } = useProgress();
  const { isLessonUnlocked } = useLessons();

  // Fetch all exercises
  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['exercicios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercicios')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });

  // Check if exercise is unlocked (based on lesson unlock status)
  const isExerciseUnlocked = (exerciseAulaId: number | null) => {
    if (!exerciseAulaId) return true; // If no lesson link, always unlocked
    return isLessonUnlocked(exerciseAulaId);
  };

  // Get exercise progress
  const getExerciseProgress = (exerciseId: number) => {
    const exerciseProgress = progress.find(
      p => p.content_type === 'exercicio' && p.content_id === exerciseId
    );
    return {
      completed: exerciseProgress?.completed || false,
      attempts: exerciseProgress?.attempts || 0,
    };
  };

  // Get exercises with unlock status
  const exercisesWithStatus = exercises.map(exercise => {
    const { completed, attempts } = getExerciseProgress(exercise.id);
    return {
      ...exercise,
      isUnlocked: isExerciseUnlocked(exercise.aula_id),
      completed,
      attempts,
    };
  }).filter(exercise => exercise.isUnlocked); // Only show unlocked exercises

  return {
    exercises: exercisesWithStatus,
    allExercises: exercises,
    isLoading,
    isExerciseUnlocked,
    getExerciseProgress,
  };
};
