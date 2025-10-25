import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProgress } from './useProgress';

export const useLessons = () => {
  const { user } = useAuth();
  const { progress } = useProgress();

  // Fetch all lessons
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['aulas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('aulas')
        .select('*')
        .order('id');
      
      if (error) throw error;
      return data;
    },
  });

  // Check if lesson is unlocked
  const isLessonUnlocked = (lessonId: number) => {
    // First lesson is always unlocked
    if (lessonId === 1) return true;
    
    // Check if previous lesson is completed
    const previousLesson = progress.find(
      p => p.content_type === 'aula' && 
           p.content_id === lessonId - 1 && 
           p.completed && 
           p.progress_percentage === 100
    );
    
    return !!previousLesson;
  };

  // Get lesson progress
  const getLessonProgress = (lessonId: number) => {
    const lessonProgress = progress.find(
      p => p.content_type === 'aula' && p.content_id === lessonId
    );
    return lessonProgress?.progress_percentage || 0;
  };

  // Get lessons with unlock status and progress
  const lessonsWithStatus = lessons.map(lesson => ({
    ...lesson,
    isUnlocked: isLessonUnlocked(lesson.id),
    progress: getLessonProgress(lesson.id),
    isCompleted: progress.some(
      p => p.content_type === 'aula' && 
           p.content_id === lesson.id && 
           p.completed
    ),
  }));

  return {
    lessons: lessonsWithStatus,
    isLoading,
    isLessonUnlocked,
    getLessonProgress,
  };
};
