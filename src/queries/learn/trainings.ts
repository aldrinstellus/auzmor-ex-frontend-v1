import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export const useProgressTracker = ({ enabled }: Record<string, any>) => {
  return useQuery({
    queryKey: ['progress-tracker'],
    queryFn: async () =>
      await apiService.get('learner/trainings/pending?page=1&limit=1'),
    enabled,
  });
};

export const useGetRecommendation = ({ enabled }: Record<string, any>) => {
  return useQuery({
    queryKey: ['recommendation-content'],
    queryFn: async () =>
      await apiService.get('learner/trainings/recommendations?limit=3'),
    enabled,
  });
};
