import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { chain } from 'lodash';
import {
  CHANNEL_MEMBER_STATUS,
  CHANNEL_ROLE,
  CHANNEL_STATUS,
  ChannelVisibilityEnum,
  IChannel,
  IChannelLink,
  IChannelRequest,
  useChannelStore,
} from 'stores/channelStore';
import {
  ChannelUserRequests,
  channelAdmins,
  channelLinks,
} from 'mocks/Channels';
import apiService from 'utils/apiService';

export interface IChannelPayload {
  name?: string;
  categoryIds?: string[];
  description?: string;
  settings?: { visibility?: ChannelVisibilityEnum };
  status?: CHANNEL_STATUS;
}
export interface IChannelSettings {
  settings?: {
    visibility: ChannelVisibilityEnum;
    restriction: {
      canPost: boolean;
      canComment: boolean;
      canMakeAnnouncements: boolean;
    };
  };
}
export const getAllChannels = async (
  context: QueryFunctionContext<
    (Record<string, any> | undefined | string)[],
    any
  >,
  setChannels: (channels: { [key: string]: IChannel }) => void,
) => {
  let response = null;

  try {
    if (!!!context.pageParam) {
      response = await apiService.get('/channels', context.queryKey[1]);
    } else {
      response = await apiService.get(context.pageParam, context.queryKey[1]);
    }
  } catch (e) {}
  setChannels({
    ...chain(response?.data.result.data).keyBy('id').value(),
  });
  return response;
};

// patch req. to update the channel members roles.
export const updateMemberRole = async (payload: {
  id: string;
  channelId?: string;
  role: CHANNEL_ROLE;
}) => {
  const { data } = await apiService.patch(
    `channels/${payload?.channelId}/members/${payload?.id}`,
    {
      role: payload?.role,
    },
  );
  return data;
};

// get channel by id -> channels/:id
export const getChannelDetails = async (id: string) => {
  const data = await apiService.get(`/channels/${id}`);
  return data;
};

export const createChannel = async (payload: IChannelPayload) => {
  const response = await apiService.post('/channels', payload);
  return response;
};

export const updateChannel = async (id: string, payload: IChannelPayload) => {
  await apiService.patch(`/channels/${id}`, payload);
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
  let response = null;
  try {
    if (pageParam == null)
      response = await apiService.get(`/channels/${id}/members`, queryKey[1]);
    else response = await apiService.get(pageParam);
  } catch (e) {}
  return response;
};
// get channel request by channel id -> /channels/:channelId/members/?memberStatus=pending

export const getChannelRequests = async (
  channelId: string,
): Promise<IChannelRequest[]> => {
  console.log(channelId);
  return new Promise((res) => res(ChannelUserRequests));
  // const data = await apiService.get(`/channels/:channelId/members/?memberStatus=pending`);
  // return new Promise((res) => {
  //   res(data?.data?.result?.data);
  // });
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
export const getChannelAdmins = async (channelId: string): Promise<any> => {
  console.log(channelId);
  return new Promise((res) => res(channelAdmins));
  // const data = await apiService.get(`/channels/${channelId}/admins`);
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

export const joinChannelRequest = async (channeId: string) => {
  return await apiService.post(`channels/${channeId}/join-requests`);
};

export const getJoinChannelRequest = async (
  channeId: string,
  joinId: string,
) => {
  return await apiService.get(`channels/${channeId}/join-requests/${joinId}`);
};

export const deleteJoinChannelRequest = async (
  channeId: string,
  joinId: string,
) => {
  return await apiService.delete(
    `channels/${channeId}/join-requests/${joinId}/withdraw`,
  );
};

export const getJoinChannelRequests = async (
  channeId: string,
  status: CHANNEL_MEMBER_STATUS,
) => {
  return await apiService.get(`channels/${channeId}/join-requests`, { status });
};

// ------------------ React Query -----------------------

export const useInfiniteChannels = (q?: Record<string, any>) => {
  const { channels, setChannels } = useChannelStore();
  return {
    ...useInfiniteQuery({
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
    }),
    channels,
  };
};

export const useInfiniteChannelMembers = ({
  q,
  channelId,
}: {
  q?: Record<any, any>;
  channelId: any;
}) => {
  return useInfiniteQuery({
    queryKey: ['channel-members', q, channelId],
    queryFn: (context) => getChannelMembers(context, channelId), // need fix
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

export const useChannelAdmins = (
  channelId: string,
  queryKey = 'channel-admins',
) =>
  useQuery({
    queryKey: [queryKey],
    queryFn: () => getChannelAdmins(channelId),
    staleTime: 15 * 60 * 1000,
  });
export const useChannelRequests = (
  channelId: string,
  queryKey = 'channel-requests-widget',
) =>
  useQuery({
    queryKey: [queryKey],
    queryFn: () => getChannelRequests(channelId),
    staleTime: 15 * 60 * 1000,
  });

export const useChannelDetails = (channelId: string) => {
  return useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => getChannelDetails(channelId),
    staleTime: 15 * 60 * 1000,
  });
};
