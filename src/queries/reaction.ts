import {
  useQuery,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  QueryFunctionContext,
} from '@tanstack/react-query';
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

export interface IGetReaction {
  type: string;
  reaction: string;
  createdBy: ICreatedBy;
  entityId: string;
  entityType: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface ICreatedBy {
  department: string;
  designation: string;
  fullName: string;
  profileImage: { id: string; original: string; blurHash: string };
  status: string;
  userId: string;
  workLocation: string;
  email: string;
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
    console.log('here.... first time....');
    console.log(queryKey[1], 'payloadss...');
  } else {
    return apiService.get(pageParam, queryKey[1]);
  }
  const { data } = await apiService.get(!!pageParam ? pageParam : `reactions`, {
    ...queryKey[1],
  });
  return data;
};

export const useInfiniteReactions = (q: IReactions) => {
  return useInfiniteQuery({
    queryKey: ['reactions', q],
    queryFn: getReactions,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.paging?.previous;
    },
    staleTime: 0,
  });
};

export const deleteReaction = async (payload: IDelete) => {
  const { entityId, entityType, id } = payload;

  await apiService.delete(`/reactions/${id}`, { entityId, entityType });
};
