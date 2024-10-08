import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';
import { getCookieValue, getCookieParam } from 'utils/misc';
import { getItem } from 'utils/persist';

export const checkLogin = async () => {
  const data = await apiService.get('/login');
  return data;
};

export const useCheckLogin = () =>
  useQuery({
    queryKey: ['check-login'],
    queryFn: () => checkLogin(),
  });

export const learnLogout = async () => {
  const visitToken = getItem('visitToken');
  const authToken = getCookieValue(getCookieParam());
  let url = `/users/logout?auth_token=${authToken}`;
  if (visitToken) url += `&visit_token=${visitToken}`;
  await apiService.delete(url);
};
