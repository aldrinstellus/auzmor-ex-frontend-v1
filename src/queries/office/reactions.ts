import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface IReactions {
  entityId: string;
  entityType: string;
  reaction?: string;
  limit?: number;
  cursor?: string;
}

interface IDelete {
  entityId: string;
  entityType: string;
  id: string;
}

export const createReaction = async (payload: IReactions) => {
  const { data } = await apiService.post('/reactions', payload);
  return data;
};

export const getReactions = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<any>) => {
  if (pageParam === null) {
    return apiService.get('/reactions', queryKey[1]);
  } else {
    return apiService.get(pageParam);
  }
};

export const useInfiniteReactions = (q: IReactions) => {
  return useInfiniteQuery({
    queryKey: ['reactions', q],
    queryFn: getReactions,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.data?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.data?.paging?.prev;
    },
    staleTime: 0,
  });
};

export const deleteReaction = async (payload: IDelete) => {
  const { entityId, entityType, id } = payload;

  await apiService.delete(`/reactions/${id}`, { entityId, entityType });
};
