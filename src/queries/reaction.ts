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

interface IContent {
  html: string;
  text: string;
  editor: Record<string, any>;
}

interface IComments {
  entityId: string;
  entityType: string;
  limit?: number;
  page?: number;
  content?: IContent;
  hashtags?: Array<object>;
  mentions?: Array<object>;
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
  const { data } = await apiService.get(`reactions`, {
    ...queryKey[1],
    cursor: pageParam,
  });
  return data;
};

export const useReactions = (
  q: IReactions,
  config?: UseInfiniteQueryOptions,
) => {
  return useInfiniteQuery({
    queryKey: ['reactions', q],
    queryFn: getReactions,
    staleTime: 0,
    getNextPageParam: (lastPage: any) => {
      return lastPage?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) => {
      return currentPage?.paging?.previous;
    },
    ...config,
  });
};

export const deleteReaction = async (payload: IDelete) => {
  const { entityId, entityType, id } = payload;

  await apiService.delete(`/reactions/${id}`, { entityId, entityType });
};

export const deleteComment = async (id: string) => {
  await apiService.delete(`/comments/${id}`);
};

export const getComments = async (payload: IComments) => {
  const { data } = await apiService.get(`/comments`, payload);
  return data;
};

export const useComments = (q: IComments) => {
  return useQuery({
    queryKey: ['comments', q],
    queryFn: () => getComments(q),
  });
};

export const useInfiniteComments = (q: IComments) => {
  return useInfiniteQuery({
    queryKey: ['comments', q],
    queryFn: () => getComments(q),
    getNextPageParam: (lastPage: any) => {
      const pageDataLen = lastPage?.result?.data?.length;
      const pageLimit = lastPage?.result?.paging?.limit;
      if (pageDataLen < pageLimit) {
        return null;
      }
      return lastPage?.result?.paging?.next;
    },
    getPreviousPageParam: (currentPage: any) =>
      currentPage?.result?.paging?.prev,
  });
};

export const createComments = async (payload: IComments) => {
  const { data } = await apiService.post(`/comments`, payload);
  return data;
};
