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

  // Check if exercise is unlocked (based on lesson unlock status and previous exercise completion)
  const isExerciseUnlocked = (exerciseId: number, exerciseAulaId: number | null) => {
    if (!exerciseAulaId) return true; // If no lesson link, always unlocked
    
    // Check if lesson is unlocked
    if (!isLessonUnlocked(exerciseAulaId)) return false;
    
    // Find all exercises for the same lesson, ordered by id
    const lessonExercises = exercises
      .filter(e => e.aula_id === exerciseAulaId)
      .sort((a, b) => a.id - b.id);
    
    // Find the index of the current exercise
    const currentIndex = lessonExercises.findIndex(e => e.id === exerciseId);
    
    // If it's the first exercise in the lesson, it's unlocked
    if (currentIndex === 0) return true;
    
    // Check if the previous exercise is completed
    const previousExercise = lessonExercises[currentIndex - 1];
    const previousProgress = progress.find(
      p => p.content_type === 'exercicio' && p.content_id === previousExercise.id
    );
    
    return previousProgress?.completed || false;
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
      isUnlocked: isExerciseUnlocked(exercise.id, exercise.aula_id),
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
