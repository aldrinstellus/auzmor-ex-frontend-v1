import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { chain } from 'utils/misc';
import { useAppStore } from 'stores/appStore';
import apiService from 'utils/apiService';
import { IApp } from 'interfaces';

export interface IAddApp {
  url: string;
  label: string;
  description?: string;
  category?: string;
  icon?: string;
  audience: any;
}

export const fetchApps = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  getApps: () => {
    [key: string]: IApp;
  },
  setApp: (apps: { [key: string]: IApp }) => void,
) => {
  const apps = getApps();
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps', context.queryKey[1]);
  } else {
    response = await apiService.get(context.pageParam);
  }

  setApp({
    ...apps,
    ...chain(response.data.result.data).keyBy('id').value(),
  });
  // updating response
  response.data.result.data = response.data.result.data.map(
    (eachApp: IApp) => ({
      id: eachApp.id,
    }),
  );
  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }

  return response;
};

export const fetchMyApps = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  getApps: () => {
    [key: string]: IApp;
  },
  setApp: (apps: { [key: string]: IApp }) => void,
) => {
  const apps = getApps();
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps/me', context.queryKey[1]);
  } else {
    response = await apiService.get(context.pageParam);
  }
  setApp({
    ...apps,
    ...chain(response.data.result.data).keyBy('id').value(),
  });

  // updating response
  response.data.result.data = response.data.result.data.map(
    (eachApp: IApp) => ({
      id: eachApp.id,
    }),
  );
  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
};

export const fetchFeaturedApps = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,

  getFeaturedApps: () => {
    [key: string]: IApp;
  },
  setFeaturedApp: (apps: { [key: string]: IApp }) => void,
) => {
  const featuredApps = getFeaturedApps();
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps', context.queryKey[1]);
  } else {
    response = await apiService.get(context.pageParam);
  }
  setFeaturedApp({
    ...featuredApps,
    ...chain(response.data.result.data).keyBy('id').value(),
  });
  // updating response
  response.data.result.data = response.data.result.data.map(
    (eachApp: IApp) => ({
      id: eachApp.id,
    }),
  );
  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
};
export const fetchMyFeaturedApps = async (
  context: QueryFunctionContext<
    (string | Record<string, any> | undefined)[],
    any
  >,
  getFeaturedApps: () => {
    [key: string]: IApp;
  },
  setFeaturedApp: (apps: { [key: string]: IApp }) => void,
) => {
  const featuredApps = getFeaturedApps();
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps/me', context.queryKey[1]);
  } else {
    response = await apiService.get(context.pageParam);
  }
  setFeaturedApp({
    ...featuredApps,
    ...chain(response.data.result.data).keyBy('id').value(),
  });
  // updating response
  response.data.result.data = response.data.result.data.map(
    (eachApp: IApp) => ({
      id: eachApp.id,
    }),
  );
  // Setting next next param
  if (!!context.pageParam) {
    if (context.pageParam == response.data.result.paging.next) {
      response.data.result.paging.next = null;
    }
  }
  return response;
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
  const { featuredApps, getFeaturedApps, setFeaturedApp } = useAppStore();
  return {
    ...useInfiniteQuery({
      queryKey: [myApp ? 'my-featured-apps' : 'featured-apps', q],
      queryFn: (context) =>
        myApp
          ? fetchMyFeaturedApps(context, getFeaturedApps, setFeaturedApp)
          : fetchFeaturedApps(context, getFeaturedApps, setFeaturedApp),
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
  const { apps, getApps, setApp } = useAppStore();
  return {
    ...useInfiniteQuery({
      queryKey: [myApp ? 'my-apps' : 'apps', q],
      queryFn: (context) =>
        myApp
          ? fetchMyApps(context, getApps, setApp)
          : fetchApps(context, getApps, setApp),
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
    [key: string]: IApp;
  },
  setApp: (apps: { [key: string]: IApp }) => void,
) => {
  let response = null;
  if (!!!context.pageParam) {
    response = await apiService.get('/apps/widget', context.queryKey[1]);
    setApp({
      ...apps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: IApp) => ({ id: eachApp.id }),
    );
    return response;
  } else {
    response = await apiService.get(context.pageParam, context.queryKey[1]);
    setApp({
      ...apps,
      ...chain(response.data.result.data).keyBy('id').value(),
    });
    response.data.result.data = response.data.result.data.map(
      (eachApp: IApp) => ({ id: eachApp.id }),
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
  const { data } = await apiService.post('/apps', payload);
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

export const launchApp = async (id: string) => {
  const { result } = await apiService.post(`/apps/${id}/launch`);
  return result.data;
};
