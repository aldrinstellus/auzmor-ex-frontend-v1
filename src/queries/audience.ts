import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

const getAudience = async ({
  queryKey,
}: QueryFunctionContext<(string | Record<string, any> | undefined)[], any>) => {
  return await apiService.get(`/posts/${queryKey[1]}/audience}`);
};

export const useAudience = (entityId: string, rest: Record<string, any>) => {
  return useQuery({
    queryKey: ['audience', entityId],
    queryFn: getAudience,
    staleTime: 5 * 60 * 1000,
    ...rest,
  });
};
