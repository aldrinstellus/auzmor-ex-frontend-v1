import { apiConfigLxp, apiConfigOffice } from 'utils/permissions';
import { ProductEnum } from 'utils/apiService';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import useAuth from './useAuth';

export const usePermissions = () => {
  const role = useAuth().user?.role as any;
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
