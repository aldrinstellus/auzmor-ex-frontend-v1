import {
  QueryFunctionContext,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';
import { IPostUser } from 'interfaces';

// for future filters
export enum PeopleFilterKeys {
  PeopleFilterType = 'type',
}

export enum FilterType {
  Status = 'STATUS',
  Location = 'LOCATION',
  Depratment = 'DEPARTMENT',
  Reporter = 'REPORTER',
}

export interface IPeopleFilters {
  [PeopleFilterKeys.PeopleFilterType]?: FilterType[];
}

export interface IProfileImage {
  fileId: string;
  original: string;
}
export interface IUserUpdate {
  id: string;
  profileImage?: IProfileImage;
  timezone?: string;
}

export interface IPostUsers {
  users: IPostUser[];
}

interface IGetOrgChartPayload {
  q?: string;
  root?: string;
  target?: string;
  departments?: string[];
  locations?: string[];
  status?: string[]; // Active, Invited, Inactive
  expand?: number; // +/- integer. Expand -> root +/- number levels
  expandAll?: boolean;
}

export const fetchMe = async () => {
  const { data } = await apiService.get('/users/me');
  return data;
};

export const getAllUser = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await apiService.get('/users', queryKey[1]);
  } else return await apiService.get(pageParam);
};

export const useInfiniteUsers = ({
  startFetching = true,
  q,
}: {
  startFetching?: boolean;
  q?: Record<string, any>;
}) => {
  return useInfiniteQuery({
    queryKey: ['users', q],
    queryFn: getAllUser,
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
    enabled: startFetching,
  });
};

// get all users by along with a boolean which identify if the user is already of the team/channel
export const getMembers = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  let transformedData;

  if (pageParam === null) {
    console.log({ 'queryKey[1]': queryKey[1] });
    const response = await apiService.get(`/users/searchIn`, queryKey[1]);
    const { data } = response;
    transformedData = data?.result?.data?.map((item: any) => {
      return {
        id: item.userId,
        ...item,
      };
    });
    return { data: { result: { data: transformedData } } };
  } else return apiService.get(pageParam);
};

export const useInfiniteMembers = ({
  q,
}: {
  entityId: string;
  entityType: string;
  q?: Record<string, any>;
  startFetching?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ['search-team-members', q],
    queryFn: (context) => getMembers(context),
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

export const isUserExistOpen = async (q: { email: string }) => {
  if (!!q.email) {
    const { data } = await apiService.get('/users/email/exists', q);
    return data;
  }
};

export const isUserExistAuthenticated = async (q: { email: string }) => {
  if (!!q.email) {
    const { data } = await apiService.get('/users/exists', q);
    return data;
  }
};

export const isDomainExists = async (q: { domain: string }) => {
  if (!!q.domain) {
    const { data } = await apiService.get('/organizations/domain/exists', q);
    return data;
  }
};

export const useDomainExists = (domain: string) => {
  return useQuery({
    queryKey: ['domain-exist', domain],
    queryFn: () => isDomainExists({ domain }),
    staleTime: 1000,
  });
};

const getNotificationSettings = async () => {
  const { data } = await apiService.get('/notifications/settings');
  return data;
};

export const useNotificationSettings = () =>
  useQuery({
    queryKey: ['notification-settings'],
    queryFn: getNotificationSettings,
    staleTime: 15 * 60 * 1000,
  });

// verify invite
export const verifyInviteLink = async (q: Record<string, any>) => {
  const { data } = await apiService.get('/users/invite/verify', q);
  return data;
};

// get user by id -> users/:id
export const getUser = async (id: string) => {
  const data = await apiService.get(`/users/${id}`, {});
  return data;
};

// update current the user/me -> users/me
export const updateCurrentUser = async (payload: Record<string, any>) => {
  return await apiService.patch('/users/me', payload);
};

// update user by id -> users/:id
export const updateUserById = async (
  userId: string,
  payload: Record<string, any>,
) => {
  return await apiService.patch(`users/${userId}`, payload);
};

// delete user by id -> users/:id
export const deleteUser = async (id: string) => {
  const data = await apiService.delete(`/users/${id}`, {});
  return new Promise((res) => {
    res(data);
  });
};

export const inviteUsers = async (payload: IPostUsers) => {
  const data = await apiService.post('/users', payload);
  return new Promise((res) => {
    res(data);
  });
};

export const acceptInviteSetPassword = async (q: Record<string, any>) => {
  return await apiService.put('/users/invite/reset-password', q);
};

export const getOrgChart = async ({ queryKey }: QueryFunctionContext<any>) => {
  return await apiService.get('/users/chart', queryKey[1]);
};

/* REACT QUERY */

// use react query to get single user
export const useSingleUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    staleTime: 15 * 60 * 1000,
  });
};

export const useVerifyInviteLink = (q: Record<string, any>) => {
  return useQuery({
    queryKey: ['users-invite', q],
    queryFn: () => verifyInviteLink(q),
  });
};

// use react query to get current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user-me'],
    queryFn: () => fetchMe(),
    staleTime: 15 * 60 * 1000,
  });
};

export const useResendInvitation = () => {
  const resendInvitation = async (id: string) => {
    const { data } = await apiService.put(`/users/${id}/resend-invitation`);
    return data;
  };

  return useMutation({
    mutationKey: ['resend-invitation'],
    mutationFn: resendInvitation,
  });
};

export const useIsUserExistOpen = (email = '') => {
  return useQuery({
    queryKey: ['user-exist-open', email],
    queryFn: () => isUserExistOpen({ email }),
    staleTime: 1000,
  });
};

export const useIsUserExistAuthenticated = (email = '') => {
  return useQuery({
    queryKey: ['user-exist-auth', email],
    queryFn: () => isUserExistAuthenticated({ email }),
    staleTime: 1000,
  });
};

export const useOrgChart = (
  payload?: IGetOrgChartPayload,
  rest?: Record<string, any>,
) => {
  return useQuery({
    queryKey: ['organization-chart', payload],
    queryFn: getOrgChart,
    staleTime: 5 * 60 * 1000,
    ...rest,
  });
};
