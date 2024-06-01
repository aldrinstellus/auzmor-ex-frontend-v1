import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import useProduct from 'hooks/useProduct';
import learnApiService from 'utils/learnApiService';
import { getCookieValue, getCookieParam } from 'utils/misc';
import { getItem } from 'utils/persist';

export const learnLogout = async () => {
  const visitToken = getItem('visitToken');
  const authToken = getCookieValue(getCookieParam());
  let url = `/users/logout?auth_token=${authToken}`;
  if (visitToken) url += `&visit_token=${visitToken}`;
  await learnApiService.delete(url);
};

export const getAllEvents = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await learnApiService.get('/learner/events', queryKey[1]);
  } else return await learnApiService.get(pageParam);
};
export const useInfiniteLearnEvents = ({ q }: { q?: Record<string, any> }) => {
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
export const useProgressTracker = () => {
  const { isLxp } = useProduct();
  return useQuery({
    queryKey: ['progress-tracker'],
    queryFn: async () =>
      await learnApiService.get(
        'learner/libraries?filter=IN_PROGRESS&page=1&limit=1',
      ),
    enabled: !!isLxp,
  });
};
export const eventAttendee: any = async (id: string) => {
  const data = await learnApiService.get(`learner/events/${id}/attendees`);
  return data;
};

export const useEventAttendee = (eventId: string) => {
  return useQuery({
    queryKey: ['event-attendee', eventId],
    queryFn: () => eventAttendee(eventId),
    staleTime: 15 * 60 * 1000,
    enabled: !!eventId,
  });
};
export const useGetRecommendation = () => {
  const { isLxp } = useProduct();
  return useQuery({
    queryKey: ['recommendation-content'],
    queryFn: async () =>
      await learnApiService.get('learner/trainings/recommendations?limit=3'),
    enabled: !!isLxp,
  });
};

export const uploadImage = async (payload: any) => {
  learnApiService.updateContentType('multipart/form-data');
  const data = await learnApiService.post('photos', payload);
  return data;
};

export const getAllCategory = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  let transformedData;
  if (pageParam === null) {
    const response = await learnApiService.get('/categories', queryKey[1]);
    const { data } = response;

    transformedData = data?.result?.data?.map((item: any) => {
      return {
        name: item.title,
        type: 'APP',
        id: item.id,
      };
    });

    return { data: { result: { data: transformedData } } };
  } else return await learnApiService.get(pageParam);
};
export const useInfiniteLearnCategory = (q?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['learnCategory', q],
    queryFn: getAllCategory,
    staleTime: 5 * 60 * 1000,
  });
};

export const createCatergory = async (payload: any) => {
  const data = await learnApiService.post('categories', payload);
  return data;
};
