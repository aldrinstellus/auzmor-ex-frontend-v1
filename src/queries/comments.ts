import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

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

export const createComment = async (payload: IComments) => {
  const { data } = await apiService.post(`/comments`, payload);
  return data;
};

export const updateComment = async (id: string, payload: any) => {
  const { data } = await apiService.put(`/comments/${id}`, payload);
  return data;
};
