import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { chain } from 'lodash';
import { IChannel, IChannelLink, useChannelStore } from 'stores/channelStore';
import { channelLinks } from 'mocks/Channels';
import apiService from 'utils/apiService';

export interface IChannelPayload {
  name: string;
  category: string;
  description?: string;
}

export const getAllChannels = async (
  {
    pageParam = null,
    queryKey,
  }: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>,
  setChannels: (channels: { [key: string]: IChannel }) => void,
) => {
  let response = null;
  if (!!!pageParam) {
    response = await apiService.get('/channels/me', queryKey[1]);
  } else {
    response = await apiService.get(pageParam, queryKey[1]);
  }
  setChannels({
    ...chain(response.data.result.data).keyBy('id').value(),
  });
  response.data.result.data = response.data.result.data.map(
    (eachChannel: IChannel) => ({ id: eachChannel.id }),
  );
  return response;
};

export const createChannel = async (payload: IChannelPayload) => {
  const data = await apiService.post('/channels', payload);
  return new Promise((res) => {
    res(data);
  });
};

export const updateChannel = async (id: string, payload: IChannelPayload) => {
  await apiService.put(`/channel/${id}`, payload);
};

// delete team by id -> channel/:id
export const deleteChannel = async (id: string) => {
  const data = await apiService.delete(`/channels/${id}`);
  return new Promise((res) => {
    res(data);
  });
};

// get team members by team id -> /channel/:id/members
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

export const getChannelLinks = async (
  channelId: string,
): Promise<IChannelLink[]> => {
  console.log(channelId);
  return new Promise((res) => res(channelLinks));
  // const data = await apiService.get(`/channels/${channelId}/links`);
  // return new Promise((res) => {
  //   res(data?.data?.result?.data);
  // });
};

export const updateChannelLinks = async (
  channelId: string,
  payload: { links: IChannelLink[] },
): Promise<IChannelLink[]> => {
  const data = await apiService.put(`/channels/${channelId}/links`, payload);
  return new Promise((res) => {
    res(data?.data?.result?.data);
  });
};

// ------------------ React Query -----------------------

export const useInfiniteChannels = (q?: Record<string, any>) => {
  const { setChannels } = useChannelStore();
  return useInfiniteQuery({
    queryKey: ['channel', q],
    queryFn: (context) => getAllChannels(context, setChannels),
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

export const useChannelLinksWidget = (
  channelId: string,
  queryKey = 'channel-links-widget',
) =>
  useQuery({
    queryKey: [queryKey],
    queryFn: () => getChannelLinks(channelId),
    staleTime: 15 * 60 * 1000,
  });
