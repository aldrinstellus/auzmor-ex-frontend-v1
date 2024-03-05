import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import useProduct from 'hooks/useProduct';
import { ApiService, ProductEnum } from 'utils/apiService';
import { getCookieValue, getCookieParam } from 'utils/misc';
import { getItem } from 'utils/persist';

const learnAPIService = new ApiService(ProductEnum.Learn);

export const learnLogout = async () => {
  const visitToken = getItem('visitToken');
  const authToken = getCookieValue(getCookieParam());
  let url = `/users/logout?auth_token=${authToken}`;
  if (visitToken) url += `&visit_token=${visitToken}`;
  await learnAPIService.delete(url);
};

export const getAllEvents = async ({
  pageParam = null,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  if (pageParam === null) {
    return await learnAPIService.get('/learner/events', queryKey[1]);
  } else return await learnAPIService.get(pageParam);
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
      await learnAPIService.get(
        'learner/libraries?filter=IN_PROGRESS&page=1&limit=1',
      ),
    enabled: !!isLxp,
  });
};

export const useGetRecommendation = () => {
  const { isLxp } = useProduct();
  return useQuery({
    queryKey: ['recommendation-content'],
    queryFn: async () =>
      await learnAPIService.get('learner/trainings/recommendations?limit=3'),
    enabled: !!isLxp,
  });
};
