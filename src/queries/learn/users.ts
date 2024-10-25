import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';
import { IPostUser } from 'interfaces';
import { convertKeysToCamelCase } from 'utils/misc';

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

export const mapUser = (user: Record<string, any>) => {
  return {
    preferredName: user?.display_name,
    fullName: user?.full_name || user?.name,
    firstName: user?.first_name,
    lastName: user?.last_name,
    profileImage: { original: user?.image_url },
    workEmail: user?.email,
    ...user,
  };
};

export const fetchMe = async () => {
  const { data } = await apiService.get('/me');
  const { data: orgData } = await apiService.get('/organization');
  const user = data?.result?.data;
  const mappedData = {
    message: data?.message,
    result: {
      data: {
        id: String(user?.id),
        fullName: user?.full_name,
        workEmail: user?.email,
        role: user?.role,
        org: {
          id: orgData.result.data.id,
          domain: orgData.result.data.custom_domain,
          name: orgData.result.data.name,
          url: orgData.result.data.url,
          subscription: {
            type: orgData.result.data?.remaining_trial_days
              ? 'TRIAL'
              : 'PURCHASED',
            daysRemaining: orgData.result.data?.remaining_trial_days || 0,
          },
          setting: {
            enableMentorship:
              orgData.result.data.organization_setting.enable_mentorship,
            enablechecklist:
              orgData.result.data.organization_setting.enablechecklist,
            enableEcommerce:
              orgData.result.data.organization_setting.enable_ecommerce,
          },
        },
        ...(user?.designation && {
          designation: {
            name: user?.designation,
          },
        }),
        ...(user?.image_url && {
          profileImage: {
            small: user.image_url,
            medium: user.image_url,
            large: user.image_url,
            original: user.image_url,
          },
        }),
        permissions: [],
        preferences: {
          ...(user?.preferences?.learner_view_type && {
            learnerViewType: user?.preferences?.learner_view_type,
          }),
        },
        timeZone: user?.time_zone,
        branding: {
          primaryColor: orgData.result.data?.primary_color,
          secondaryColor: orgData.result.data?.secondary_color,
          favicon: { original: orgData.result.data?.favicon },
          logo: { original: orgData.result.data?.logo },
        },
        profileColor: user?.profile_color,
      },
    },
  };
  return mappedData;
};

export const getAllUser = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<[string, any | undefined], any>) => {
  let response = null;
  const defaultParams = {
    identifier: '@',
    q: '',
  };
  if (pageParam === null) {
    response = await apiService.get('/mentions/auto_suggest', {
      ...defaultParams,
      ...queryKey[1],
    });
  } else {
    response = await apiService.get(pageParam);
  }
  const mappedResponse = {
    ...response,
    data: {
      ...response.data,
      result: {
        ...response.data.result,
        data: response.data.result.data.map(mapUser),
      },
    },
  };
  return mappedResponse;
};

// get all users by along with a boolean which identify if the user is already of the team/channel
export const getMembers = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  let transformedData;
  if (pageParam === null) {
    const response = await apiService.get(
      `/channels/${(queryKey[1] as Record<string, any>)?.entityId}/users`,
      queryKey[1],
    );
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

// get user by id -> users/:id
export const getUser = async (id: string) => {
  const data = await apiService.get(`/users/${id}`, {});
  const mappedData = {
    ...data,
    data: {
      ...data.data,
      result: {
        ...data.data.result,
        data: data.data.result.data.map(mapUser),
      },
    },
  };
  return mappedData;
};
export const getBranches = async (orgId: string) => {
  const { data } = await apiService.get(
    `users/organizations?limit=2&exclude_organizations=${orgId}&sort=%2Blast_sign_in_at`,
    {},
  );

  return convertKeysToCamelCase(data);
};

export const useGetBranches = (orgId: string) =>
  useQuery({
    queryKey: ['learn-branches'],
    queryFn: () => getBranches(orgId),
    staleTime: 15 * 60 * 1000,
  });

/* REACT QUERY */

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

// use react query to get single user
export const useSingleUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    staleTime: 15 * 60 * 1000,
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
