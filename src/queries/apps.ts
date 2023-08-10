import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import apiService from 'utils/apiService';

export type AppIcon = {
  id: string;
  original: string;
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  blurHash: string;
};

export type AppCredentials = {
  acsUrl: string;
  entityId: string;
  relayState: string;
};

export enum AudienceType {
  USER = 'USER',
  TEAM = 'TEAM',
  CHANNEL = 'CHANNEL',
}

export type AppAudience = {
  entityType: AudienceType;
  entityId: string;
  name: string;
};

export type App = {
  id: string;
  url: string;
  label: string;
  description: string;
  category: string;
  icon: AppIcon;
  credentials: AppCredentials;
  audience?: AppAudience[];
};

export enum CategoryType {
  APP = 'APP',
  TEAM = 'TEAM',
}

export type Category = {
  name: string;
  type: CategoryType;
  id: string;
};

export interface IAddApp {
  url: string;
  label: string;
  description?: string;
  category?: string;
  icon?: string;
  audience: any;
}

// Get app categories
export const getCategories = ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(string | Record<string, any> | undefined)[], any>) => {
  if (pageParam === null) {
    if (typeof queryKey[1] === 'object') {
      return apiService.get('/categories', {
        q: queryKey[1]?.q,
        type: queryKey[1]?.type,
        limit: queryKey[1]?.limit,
      });
    } else {
      return apiService.get('/categories', queryKey[1]);
    }
  } else return apiService.get(pageParam);
};

// Infinite scroll for notifications
export const useInfiniteCategories = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['categories', q],
    queryFn: getCategories,
    getNextPageParam: (lastPage: any) =>
      lastPage?.data?.result?.data?.length >= q?.limit
        ? lastPage?.data?.result?.paging?.next
        : null,
    getPreviousPageParam: (currentPage: any) =>
      currentPage?.data?.result?.data?.length >= q?.limit
        ? currentPage?.data?.result?.paging?.prev
        : null,
  });
};

export const createApp = async (payload: IAddApp) => {
  const { data } = await apiService.post('apps', payload);
  return data;
};
