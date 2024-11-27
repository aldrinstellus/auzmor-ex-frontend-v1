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
    id: String(team.id),
    name: team.name,
    orgId: team?.orgId,
    recentMembers: team.recent_users?.map((member: any) => ({
      fullName: member.full_name,
      designation: {
        name: member.designation,
      },
      department: null,
      workLocation: null,
      profileImage: {
        original: member.image_url,
      },
      status: member.status,
      userId: member.id,
      email: member.email,
    })),
    totalMembers: team.members_count,
  } as ITeam);

export const mapTeamMember = (member: any, teamId: string) => ({
  id: String(member.id),
  member: {
    fullName: member.full_name,
    designation: {
      name: member.designation,
    },
    department: null,
    workLocation: null,
    profileImage: {
      original: member.image_url,
    },
    status: member.status,
    userId: member.id,
    email: member.email,
  },
  team: teamId,
  createdAt: member.created_at,
  updatedAt: member.updated_at,
});

export const getAllTeams = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  let response = null;
  const { userId, ...params } = queryKey[1] as Record<string, any>;
  if (pageParam) params['page'] = pageParam;
  if (userId) response = await apiService.get(`/users/teams`, params);
  else response = await apiService.get('/teams', params);
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
  const params = (queryKey[1] as Record<string, any>) || {};
  if (pageParam) params['page'] = pageParam;
  const response = await apiService.get(`users/teams/${id}/users`, params);

  const mappedResponse = {
    ...response,
    data: {
      ...response.data,
      result: {
        ...response.data.result,
        data: response.data.result.data.map((member: any) =>
          mapTeamMember(member, id),
        ),
      },
    },
  };
  return mappedResponse;
};

// get team by id -> teams/:id
export const getTeam = async (id: string) => {
  const data = await apiService.get(`users/teams/${id}`, {});
  const mappedData = {
    ...data,
    data: {
      ...data.data,
      result: {
        ...data.data.result,
        data: mapTeam(data.data.result.data),
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
    getNextPageParam: (lastPage: any, pages: any) => {
      const pageDataLen = lastPage?.data?.result?.data?.length;
      const pageLimit = lastPage?.data?.result?.limit;
      const totalCount = lastPage?.data?.result?.total_records;
      const fetchedCount = pageLimit * pages?.length;
      if (pageDataLen < pageLimit || fetchedCount >= totalCount) {
        return null;
      }
      return pages?.length + 1;
    },
    staleTime: 5 * 60 * 1000,
    enabled: startFetching,
  });
};

export const useInfiniteMyTeams = ({
  startFetching = true,
  q,
}: {
  startFetching?: boolean;
  q?: Record<string, any>;
}) => {
  return useInfiniteQuery({
    queryKey: ['teams', { ...q, userId: 'me' }, 'me'],
    queryFn: getAllTeams,
    getNextPageParam: (lastPage: any, pages: any) => {
      const pageDataLen = lastPage?.data?.result?.data?.length;
      const pageLimit = lastPage?.data?.result?.limit;
      const totalCount = lastPage?.data?.result?.total_records;
      const fetchedCount = pageLimit * pages?.length;
      if (pageDataLen < pageLimit || fetchedCount >= totalCount) {
        return null;
      }
      return pages?.length + 1;
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
    getNextPageParam: (lastPage: any, pages: any) => {
      const pageDataLen = lastPage?.data?.result?.data?.length;
      const pageLimit = lastPage?.data?.result?.limit;
      const totalCount = lastPage?.data?.result?.total_records;
      const fetchedCount = pageLimit * pages?.length;
      if (pageDataLen < pageLimit || fetchedCount >= totalCount) {
        return null;
      }
      return pages?.length + 1;
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
