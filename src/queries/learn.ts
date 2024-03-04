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
