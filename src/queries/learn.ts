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
