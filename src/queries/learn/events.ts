import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export const getAllEvents = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await apiService.get('/learner/events', queryKey[1]);
  } else return await apiService.get(pageParam);
};

export const useInfiniteLearnEvents = ({ q }: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['learnEvent', q],
    queryFn: getAllEvents,
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

export const eventAttendee: any = async (id: string) => {
  const data = await apiService.get(`learner/events/${id}/attendees`);
  return data;
};

export const useEventAttendee = ({ eventId }: Record<string, any>) => {
  return useQuery({
    queryKey: ['event-attendee', eventId],
    queryFn: () => eventAttendee(eventId),
    staleTime: 15 * 60 * 1000,
    enabled: !!eventId,
  });
};
