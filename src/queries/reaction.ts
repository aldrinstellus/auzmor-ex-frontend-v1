import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { IComment } from 'components/Comments';
import { useCommentStore } from 'stores/commentStore';
import apiService from 'utils/apiService';
import { chain } from 'utils/misc';
import { IComments } from './comments';

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

export const deleteComment = async (id: string) => {
  await apiService.delete(`/comments/${id}`);
};

export const getComments = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  comment: {
    [key: string]: IComment;
  },
  setComment: (feed: { [key: string]: IComment }) => void,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/comments', context.queryKey[1]);
    setComment({
      ...comment,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IComment) => ({ id: eachPost.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam);
    setComment({
      ...comment,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachPost: IComment) => ({ id: eachPost.id }),
    );
    return response;
  }
};

export const useInfiniteReplies = (q: IComments) => {
  const { comment, setComment } = useCommentStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['comments', q],
      queryFn: (context) => getComments(context, comment, setComment),
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
    }),
    comment,
  };
};
