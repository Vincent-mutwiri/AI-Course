import { useEffect, useCallback } from 'react';
import { progressAPI } from '@/services/api';

interface UseProgressTrackingProps {
  courseId?: string;
  moduleId?: string;
  lessonIndex?: number;
}

export const useProgressTracking = ({ courseId, moduleId, lessonIndex }: UseProgressTrackingProps) => {
  // Track when user accesses a lesson
  useEffect(() => {
    if (courseId && moduleId !== undefined && lessonIndex !== undefined) {
      progressAPI.updateAccess(courseId, moduleId, lessonIndex).catch(err => {
        console.error('Failed to track lesson access:', err);
      });
    }
  }, [courseId, moduleId, lessonIndex]);

  // Function to mark lesson as complete
  const markComplete = useCallback(async (quizScore?: number) => {
    if (!courseId || moduleId === undefined || lessonIndex === undefined) {
      return;
    }

    try {
      await progressAPI.updateLesson(courseId, moduleId, lessonIndex, true, quizScore);
      return true;
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
      return false;
    }
  }, [courseId, moduleId, lessonIndex]);

  // Function to track interaction (for analytics)
  const trackInteraction = useCallback(async (interactionType: string, data?: any) => {
    if (!courseId || moduleId === undefined || lessonIndex === undefined) {
      return;
    }

    try {
      // You can extend this to call an analytics endpoint
      console.log('Interaction tracked:', {
        courseId,
        moduleId,
        lessonIndex,
        interactionType,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  }, [courseId, moduleId, lessonIndex]);

  return {
    markComplete,
    trackInteraction,
  };
};
