import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

interface IReactions {
  entityId: string;
  entityType: string;
  reaction?: string;
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

export const createReaction = async (payload: IReactions) => {
  const { data } = await apiService.post('/reactions', payload);
  return data;
};

export const getReactions = async (payload: IReactions) => {
  const { entityId, entityType } = payload;

  const { data } = await apiService.get(`reactions`, { entityId, entityType });
  return data;
};

export const useReactions = (q: IReactions) => {
  return useQuery({
    queryKey: ['reactions'],
    queryFn: () => getReactions(q),
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

export const createComments = async (payload: IComments) => {
  const { data } = await apiService.post(`/comments`, payload);
  return data;
};
