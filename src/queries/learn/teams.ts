import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query';
import { ITeam } from 'interfaces';
import apiService from 'utils/apiService';

export interface ITeamPayload {
  name: string;
  category: string;
  description?: string;
}

export const mapTeam = (team: any) =>
  ({
    category: team?.category,
    createdAt: team.created_at,
    description: team?.description,
    id: team.id,
    name: team.name,
    orgId: team?.orgId,
    recentMembers: team.recent_users,
    totalMembers: team.members_count,
  } as ITeam);

export const getAllTeams = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  let response = null;
  if (pageParam === null) {
    response = await apiService.get('/teams', queryKey[1]);
  } else {
    response = await apiService.get(pageParam);
  }
  const mappedResponse = {
    ...response,
    data: {
      ...response.data,
      result: {
        ...response.data.result,
        data: response.data.result.data.map(mapTeam),
      },
    },
  };
  return mappedResponse;
};

// get team members by team id -> /teams/:id/members
export const getTeamMembers = async (
  {
    pageParam = null,
    queryKey,
  }: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>,
  id: string,
) => {
  let response = null;
  if (pageParam === null) {
    response = await apiService.get(`/teams/members/${id}`, queryKey[1]);
  } else {
    response = await apiService.get(pageParam);
  }
  const mappedResponse = {
    ...response,
    data: {
      ...response.data,
      result: {
        ...response.data.result,
        data: response.data.result.data.map(mapTeam),
      },
    },
  };
  return mappedResponse;
};

// get team by id -> teams/:id
export const getTeam = async (id: string) => {
  const data = await apiService.get(`/teams/${id}`, {});
  const mappedData = {
    ...data,
    data: {
      ...data.data,
      result: {
        ...data.data.result,
        data: data.data.result.data.map(mapTeam),
      },
    },
  };
  return mappedData;
};

// ------------------ React Query -----------------------

export const useInfiniteTeams = ({
  startFetching = true,
  q,
}: {
  startFetching?: boolean;
  q?: Record<string, any>;
}) => {
  return useInfiniteQuery({
    queryKey: ['teams', q],
    queryFn: getAllTeams,
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

export const useInfiniteTeamMembers = ({
  teamId,
  q,
  startFetching,
}: {
  teamId: string;
  q?: Record<string, any>;
  startFetching?: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: ['team-members', q, teamId],
    queryFn: (context) => getTeamMembers(context, teamId),
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

export const useSingleTeam = (teamId: string) => {
  return useQuery({
    queryKey: ['team', teamId],
    queryFn: () => getTeam(teamId),
    staleTime: 15 * 60 * 1000,
  });
};
