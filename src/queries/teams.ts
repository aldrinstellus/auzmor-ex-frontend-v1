import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export interface ITeamPayload {
  name: string;
  category: string;
  description?: string;
}

export const getAllTeams = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return apiService.get('/teams', queryKey[1]);
  } else return apiService.get(pageParam);
};

export const createTeams = async (payload: ITeamPayload) => {
  const data = await apiService.post('/teams', payload);
  return new Promise((res) => {
    res(data);
  });
};

export const updateTeam = async (id: string, payload: ITeamPayload) => {
  await apiService.put(`/teams/${id}`, payload);
};

// delete team by id -> teams/:id
export const deleteTeam = async (id: string) => {
  const data = await apiService.delete(`/teams/${id}`);
  return new Promise((res) => {
    res(data);
  });
};

// get team members by team id -> /teams/:id/members
export const getTeamMembers = async (
  {
    pageParam = null,
    queryKey,
  }: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>,
  id: string,
) => {
  if (pageParam === null) {
    if (typeof queryKey[1] === 'object') {
      if (!queryKey[1]?.status || queryKey[1]?.status === 'ALL') {
        return apiService.get(`/teams/members/${id}`, {
          q: queryKey[1]?.q,
          role: queryKey[1]?.role,
          sort: queryKey[1]?.sort,
        });
      } else {
        return apiService.get(`/teams/members/${id}`, queryKey[1]);
      }
    }
  } else return apiService.get(pageParam);
};

// delete team by id -> teams/:id
export const deleteTeamMember = async (id: string) => {
  const data = await apiService.delete(`/teams/members/${id}`);
  return new Promise((res) => {
    res(data);
  });
};

export const addTeamMember = async (
  teamId: string,
  payload: { userIds: string[] },
) => {
  const data = await apiService.post(`/teams/members/${teamId}`, payload);
  return new Promise((res) => {
    res(data);
  });
};

export const removeTeamMember = async (teamId: string) => {
  const data = await apiService.delete(`/teams/members/${teamId}`);
  return new Promise((res) => {
    res(data);
  });
};

// ------------------ React Query -----------------------

export const useInfiniteTeams = (q?: Record<string, any>) => {
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
  });
};

export const useInfiniteTeamMembers = (
  teamId: string,
  q?: Record<string, any>,
) => {
  return useInfiniteQuery({
    queryKey: ['team-members', q, teamId],

    // queryFn: (context) => {
    //   getTeamMembers(context, teamId); # data is not stored in cache
    // },

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
