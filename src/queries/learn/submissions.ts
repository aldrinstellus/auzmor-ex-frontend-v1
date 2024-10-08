import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';
import useProduct from 'hooks/useProduct';

export const getEvaluationRequest = async (q: Record<string, any>) => {
  const { data } = await apiService.get('/submissions', q);
  return data;
};

export const useGetEvaluation = (q: Record<string, any>) => {
  const { isLxp } = useProduct();

  return useQuery(['evaluation-request', q], () => getEvaluationRequest(q), {
    staleTime: 60 * 60 * 1000,
    enabled: !!isLxp,
  });
};
