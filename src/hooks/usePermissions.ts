import { apiConfigLxp, apiConfigOffice } from 'utils/permissions';
import { getProduct, ProductEnum } from 'utils/apiService';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import useAuth from './useAuth';
import { UserRole } from 'interfaces';

export const usePermissions = () => {
  const getRole = (orgRole: any) => {
    let role = orgRole;
    if (getProduct() === ProductEnum.Lxp) {
      const path = window.location.pathname;
      const isLearner = path.split('/')[1] === 'user';
      if (isLearner) {
        if (role === UserRole.Admin || role === UserRole.PrimaryAdmin) {
          role = UserRole.Learner;
        }
      }
    }
    return role;
  };

  const role = getRole(useAuth().user?.role as any);

  const product = process.env.REACT_APP_PRODUCT || ProductEnum.Lxp;

  const apiConfig = (
    product === ProductEnum.Lxp ? apiConfigLxp : apiConfigOffice
  ) as any;

  const getApi = (apiEnum: ApiEnum) => {
    const defaultResponse = () => {};
    try {
      if (role && !!apiConfig[apiEnum][role]) {
        return apiConfig[apiEnum][role];
      } else if (!!apiConfig[apiEnum]!['DEFAULT']) {
        return apiConfig[apiEnum]!['DEFAULT'];
      }
    } catch (_) {
      return defaultResponse;
    }
    return defaultResponse;
  };

  return { getApi };
};
