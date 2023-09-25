import {
  QueryFunctionContext,
  useInfiniteQuery,
  // useQuery,
} from '@tanstack/react-query';
import { chain } from 'utils/misc';
import { useAppStore } from 'stores/appStore';
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

export type App = {
  id: string;
  url: string;
  label: string;
  description: string;
  category: Record<string, any>;
  icon: AppIcon;
  credentials: AppCredentials;
  audience?: IAudience[];
  featured?: boolean;
  createdAt: string;
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

export enum AudienceEntityType {
  User = 'USER',
  Team = 'TEAM',
  Channel = 'CHANNEL',
}

export interface IAudience {
  entityType: AudienceEntityType;
  entityId: string;
  name: string;
}

// Get apps categories
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

export const fetchApps = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  apps: {
    [key: string]: App;
  },
  setApp: (apps: { [key: string]: App }) => void,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps', context.queryKey[1]);
    setApp({
      ...apps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setApp({
      ...apps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  }
};

export const fetchMyApps = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  apps: {
    [key: string]: App;
  },
  setApp: (apps: { [key: string]: App }) => void,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps/me', context.queryKey[1]);
    setApp({
      ...apps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setApp({
      ...apps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  }
};

export const fetchFeaturedApps = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  featuredApps: {
    [key: string]: App;
  },
  setFeaturedApp: (apps: { [key: string]: App }) => void,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps', context.queryKey[1]);
    setFeaturedApp({
      ...featuredApps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setFeaturedApp({
      ...featuredApps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  }
};
export const fetchMyFeaturedApps = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  featuredApps: {
    [key: string]: App;
  },
  setFeaturedApp: (apps: { [key: string]: App }) => void,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps/me', context.queryKey[1]);
    setFeaturedApp({
      ...featuredApps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setFeaturedApp({
      ...featuredApps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  }
};

export const useInfiniteFeaturedApps = ({
  q,
  startFetching = true,
  myApp = false,
}: {
  q?: Record<string, any>;
  startFetching?: boolean;
  myApp?: boolean;
}) => {
  const { featuredApps, setFeaturedApp } = useAppStore();
  return {
    ...useInfiniteQuery({
      queryKey: [myApp ? 'my-featured-apps' : 'featured-apps', q],
      queryFn: (context) =>
        myApp
          ? fetchMyFeaturedApps(context, featuredApps, setFeaturedApp)
          : fetchFeaturedApps(context, featuredApps, setFeaturedApp),
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
    }),
    featuredApps,
  };
};

export const useInfiniteApps = ({
  q,
  myApp = false,
  startFetching = true,
}: {
  q?: Record<string, any>;
  startFetching?: boolean;
  myApp?: boolean;
}) => {
  const { apps, setApp } = useAppStore();
  return {
    ...useInfiniteQuery({
      queryKey: [myApp ? 'my-apps' : 'apps', q],
      queryFn: (context) =>
        myApp
          ? fetchMyApps(context, apps, setApp)
          : fetchApps(context, apps, setApp),
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
    }),
    apps,
  };
};

export const fetchWidgetApps = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  apps: {
    [key: string]: App;
  },
  setApp: (apps: { [key: string]: App }) => void,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps/widget', context.queryKey[1]);
    setApp({
      ...apps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setApp({
      ...apps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: App) => ({ id: eachApp.id }),
    );
    return response;
  }
};

export const useInfiniteWidgetApps = (q?: Record<string, any>) => {
  const { widgetApps, setWidgetApp } = useAppStore();
  return {
    ...useInfiniteQuery({
      queryKey: ['apps', q],
      queryFn: (context) => fetchWidgetApps(context, widgetApps, setWidgetApp),
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
    widgetApps,
  };
};

export const createApp = async (payload: IAddApp) => {
  const { data } = await apiService.post('apps', payload);
  return data;
};

export const editApp = async (id: string, payload: IAddApp) => {
  const { data } = await apiService.put(`/apps/${id}`, payload);
  return data;
};

export const deleteApp = async (id: string) => {
  const data = await apiService.delete(`/apps/${id}`);
  return data;
};
