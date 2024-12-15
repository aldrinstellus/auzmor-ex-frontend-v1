import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

const getAudience = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<any>) => {
  const [_queryKey, entity, entityId, params] = queryKey;
  const mappedEntity = entity === 'posts' ? 'feed' : entity;
  if (pageParam === null) {
    return await apiService.get(`/${mappedEntity}/${entityId}/audience`, {
      limit: 10,
      ...(params || {}),
    });
  } else return await apiService.get(pageParam);
};

export const useInfiniteAudience = (
  entity: string,
  entityId: string,
  params?: Record<string, string>,
  rest?: Record<string, any>,
) => {
  return useInfiniteQuery({
    queryKey: ['audience', entity, entityId, params],
    queryFn: getAudience,
    getNextPageParam: (lastPage: any) => {
      const pageDataLen = lastPage?.data?.result?.data?.length;
      const pageLimit = lastPage?.data?.result?.paging?.limit;
      if (pageDataLen < pageLimit) {
        return null;
      }
      return lastPage?.data?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.result?.paging?.prev;
    },
    staleTime: 5 * 60 * 1000,
    ...rest,
  });
};
