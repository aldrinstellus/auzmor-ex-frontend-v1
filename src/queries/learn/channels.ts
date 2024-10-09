import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { IChannelMembersPayload, IChannelPayload } from 'interfaces';
import { chain } from 'lodash';
import {
  CHANNEL_ROLE,
  IChannel,
  IChannelLink,
  useChannelStore,
} from 'stores/channelStore';
import apiService from 'utils/apiService';

export const getAllChannels = async (
  context: QueryFunctionContext<
    (Record<string, any> | undefined | string)[],
    any
  >,
  setChannels: (channels: { [key: string]: IChannel }) => void,
  apiPrefix = '',
) => {
  let response = null;

  try {
    if (!!!context.pageParam) {
      response = await apiService.get(
        `${apiPrefix}/channels`,
        context.queryKey[1],
      );
    } else {
      response = await apiService.get(context.pageParam);
    }
  } catch (e) {}
  setChannels({
    ...chain(response?.data.result.data).keyBy('id').value(),
  });
  return response;
};

// patch req. to update the channel members.
export const updateChannelMember = async (payload: {
  memberId: string;
  channelId: string;
  data: {
    role?: CHANNEL_ROLE;
    bookmark?: boolean;
  };
}) => {
  const { data } = await apiService.patch(
    `channels/${payload.channelId}/members/${payload.memberId}`,
    payload.data,
  );
  return data;
};

// get channel by id -> channels/:id
export const getChannelDetails = async (
  id: string,
  setChannel: (channel: IChannel) => void,
) => {
  const data = await apiService.get(`/channels/${id}`);
  if (data?.data?.result?.data) setChannel(data?.data?.result?.data);
  return data;
};

export const createChannel = async (payload: IChannelPayload) => {
  const response = await apiService.post('/channels', payload);
  return response;
};

export const updateChannel = async (id: string, payload: IChannelPayload) => {
  await apiService.patch(`/channels/${id}`, payload);
};
export const leaveChannel = async (channelId: string) => {
  await apiService.delete(`/channels/${channelId}/leave`);
};
// delete team by id -> channel/:id
export const deleteChannel = async (id: string) => {
  const data = await apiService.delete(`/channels/${id}`);
  return new Promise((res) => {
    res(data);
  });
};
export const deleteChannelLinks = async (payload: {
  id: string;
  linkId: string;
}) => {
  const data = await apiService.delete(
    `/channels/${payload.id}/link/${payload.linkId}`,
  );
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

export const addChannelMembers = async (
  channelId: string,
  payload: IChannelMembersPayload,
) => {
  const data = await apiService.post(
    `/channels/${channelId}/members/bulk`,
    payload,
  );
  return data;
};

export const inviteYourSelf = async (
  channelId: string,
  payload: IChannelMembersPayload,
) => {
  const data = await apiService.post(
    `/channels/${channelId}/members/bulk`,
    payload,
  );
  const jobId = data?.result?.data?.id || '';
  if (jobId) {
    let interval: any = null;
    await new Promise(async (resolve) => {
      let statusResponse = await await getAddChannelMembersStatus(
        channelId,
        jobId,
      );

      const status = statusResponse?.data?.result?.data?.status;
      interval = setInterval(async () => {
        if (status !== 'COMPLETED' && status !== 'FAILED') {
          statusResponse = await apiService.get(
            `/channels/${channelId}/join-requests/bulk/status/${jobId}`,
          );
        } else {
          clearInterval(interval);
          resolve(statusResponse);
        }
      }, 500);
    });
  }
};

export const getAddChannelMembersStatus = async (
  channelId: string,
  jobId: string,
) => {
  const data = await apiService.get(
    `/channels/${channelId}/members/bulk/status/${jobId}`,
  );
  return data;
};

export const removeChannelMember = async (channelId: any, memberId: any) => {
  const data = await apiService.delete(
    `/channels/${channelId}/members/${memberId}`,
  );
  return new Promise((res) => {
    res(data);
  });
};

export const getChannelLinks = async (
  channelId: string,
): Promise<IChannelLink[]> => {
  const data = await apiService.get(`/channels/${channelId}/links`);
  return new Promise((res) => {
    res(data?.data?.result?.data);
  });
};

export const createLinks = async (
  channelId: string,
  payload: { links: IChannelLink[] },
) => {
  const response = await apiService.post(
    `/channels/${channelId}/links`,
    payload,
  );
  return response;
};

export const updateChannelLink = async (payload: {
  channelId: string;
  linkId: string;
  title?: string;
  url?: string;
}) => {
  const data = await apiService.patch(
    `/channels/${payload.channelId}/links/${payload.linkId}`,
    {
      title: payload?.title,
      url: payload?.url,
    },
  );
  return new Promise((res) => {
    res(data);
  });
};

export const updateChannelLinksIndex = async (
  channelId: string,
  payload: { links: IChannelLink[] },
): Promise<IChannelLink[]> => {
  const data = await apiService.patch(`/channels/${channelId}/links`, payload);
  return new Promise((res) => {
    res(data?.data?.result?.data);
  });
};

export const joinChannelRequest = async (channeId: string) => {
  return await apiService.post(`channels/${channeId}/join-requests`);
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
  context: QueryFunctionContext<
    (Record<string, any> | undefined | string)[],
    any
  >,
  channelId?: string,
) => {
  let response = null;
  const reqPath = channelId
    ? `channels/${channelId}/join-requests`
    : `channels/join-requests`;
  try {
    if (!!!context.pageParam) {
      response = await apiService.get(reqPath, context.queryKey[1]);
    } else {
      response = await apiService.get(context.pageParam, context.queryKey[1]);
    }
  } catch (e) {}

  return response;
};

export const approveChannelJoinRequest = async (
  channeId: string,
  joinId: string,
) => {
  return await apiService.post(
    `channels/${channeId}/join-requests/${joinId}/approve`,
  );
};

export const rejectChannelJoinRequest = async (
  channeId: string,
  joinId: string,
) => {
  return await apiService.post(
    `channels/${channeId}/join-requests/${joinId}/reject`,
  );
};

export const bulkChannelRequestUpdate = async (
  channelId: string,
  payload: { approve?: string[]; reject?: Record<string, any>[] },
) => {
  const response = await apiService.post(
    `/channels/${channelId}/join-requests/bulk`,
    payload,
  );
  const id = response?.result?.data?.id;

  let interval: any = null;

  await new Promise(async (resolve) => {
    let statusResponse = await apiService.get(
      `/channels/${channelId}/join-requests/bulk/status/${id}`,
    );

    const status = statusResponse?.data?.result?.data?.status;
    interval = setInterval(async () => {
      if (status !== 'COMPLETED' && status !== 'FAILED') {
        statusResponse = await apiService.get(
          `/channels/${channelId}/join-requests/bulk/status/${id}`,
        );
      } else {
        clearInterval(interval);
        resolve(statusResponse);
      }
    }, 500);
  });
};

// ------------------ React Query -----------------------

export const useInfiniteChannels = (
  q?: Record<string, any>,
  options?: Record<string, any>,
) => {
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
      ...options,
    }),
    channels,
  };
};
export const useInfiniteChannelsLearner = (
  q?: Record<string, any>,
  options?: Record<string, any>,
) => {
  const { channels, setChannels } = useChannelStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['channel', q],
      queryFn: (context) => getAllChannels(context, setChannels, '/learner'),
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
      ...options,
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
    enabled: !!channelId,
  });
};

export const useChannelMembersStatus = ({
  channelId,
  jobId,
  onSuccess,
  onError,
}: {
  channelId: string;
  jobId: string;
  onSuccess?: (data: any) => void;
  onError?: () => void;
}) => {
  return useQuery({
    queryKey: ['add-channel-members-status', channelId, jobId],
    queryFn: () => getAddChannelMembersStatus(channelId, jobId),
    refetchInterval: () => (!!jobId ? 5000 : false),
    enabled: !!jobId && !!channelId,
    onSuccess,
    onError,
  });
};

export const useChannelLinksWidget = (
  channelId: string,
  queryKey = 'channel-links-widget',
) =>
  useQuery({
    queryKey: [queryKey],
    queryFn: () => getChannelLinks(channelId),
    // staleTime: 15 * 60 * 1000,
    cacheTime: 0,
  });

export const useChannelDetails = (channelId: string) => {
  const setChannel = useChannelStore((action) => action.setChannel);
  return useQuery({
    queryKey: ['channel', channelId],
    queryFn: () => getChannelDetails(channelId, setChannel),
    staleTime: 15 * 60 * 1000,
  });
};

export const useInfiniteChannelsRequest = (
  channelId?: string,
  q?: Record<string, any>,
  enabled?: boolean,
) => {
  return {
    ...useInfiniteQuery({
      queryKey: ['channel-requests', q, channelId],
      queryFn: (context) => getJoinChannelRequests(context, channelId),
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
      enabled: enabled,
    }),
  };
};
