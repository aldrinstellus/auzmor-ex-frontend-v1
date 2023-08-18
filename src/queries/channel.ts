import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface IChannelPayload {
  name: string;
  category: string;
  description?: string;
}

export const getAllChannels = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await apiService.get('/channels', queryKey[1]);
  } else return await apiService.get(pageParam);
};

export const createChannel = async (payload: IChannelPayload) => {
  const data = await apiService.post('/channels', payload);
  return new Promise((res) => {
    res(data);
  });
};

export const updateChannel = async (id: string, payload: IChannelPayload) => {
  await apiService.put(`/teams/${id}`, payload);
};

// delete team by id -> teams/:id
export const deleteChannel = async (id: string) => {
  const data = await apiService.delete(`/channels/${id}`);
  return new Promise((res) => {
    res(data);
  });
};

// get team members by team id -> /teams/:id/members
export const getChannelMembers = async (
  {
    pageParam = null,
    queryKey,
  }: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>,
  id: string,
) => {
  if (pageParam === null) {
    return apiService.get(`/channels/members/${id}`, queryKey[1]);
  } else return apiService.get(pageParam);
};

export const addChannelMember = async (
  teamId: string,
  payload: { userIds: string[] },
) => {
  const data = await apiService.post(`/channels/members/${teamId}`, payload);
  return new Promise((res) => {
    res(data);
  });
};

export const removeChannelMember = async (teamId: string) => {
  const data = await apiService.delete(`/channels/members/${teamId}`);
  return new Promise((res) => {
    res(data);
  });
};

// ------------------ React Query -----------------------

export const useInfiniteChannels = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['teams', q],
    queryFn: getAllChannels,
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
  });
};

export const useInfiniteChannelMembers = (
  teamId: string,
  q?: Record<string, any>,
) => {
  return useInfiniteQuery({
    queryKey: ['team-members', q, teamId],
    queryFn: (context) => getChannelMembers(context, teamId), // need fix
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
  });
};
