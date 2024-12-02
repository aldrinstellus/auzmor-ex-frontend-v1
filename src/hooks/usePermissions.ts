import {
  apiConfigLxp,
  apiConfigOffice,
  componentConfigLxp,
  componentConfigOffice,
} from 'utils/permissions';
import { getProduct, ProductEnum } from 'utils/apiService';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { ComponentEnum } from 'utils/permissions/enums/componentEnum';
import useAuth from './useAuth';
import { UserRole } from 'interfaces';

export const usePermissions = () => {
  const orgRole = useAuth().user?.role;
  const product = process.env.REACT_APP_PRODUCT || ProductEnum.Lxp;

  const getRole = (orgRole: any) => {
    let role = orgRole;
    if (getProduct() === ProductEnum.Lxp) {
      const path = window.location.pathname;
      const isLearner = path.split('/')[1] === 'user';
      if (isLearner) role = UserRole.Learner;
    }
    return role;
  };

  const apiRole = getRole(orgRole as any);
  const apiConfig = (
    product === ProductEnum.Lxp ? apiConfigLxp : apiConfigOffice
  ) as any;

  const getApi = (apiEnum: ApiEnum) => {
    const defaultResponse = () => {};
    try {
      if (apiRole && !!apiConfig[apiEnum][apiRole]) {
        return apiConfig[apiEnum][apiRole];
      } else if (!!apiConfig[apiEnum]!['DEFAULT']) {
        return apiConfig[apiEnum]!['DEFAULT'];
      }
    } catch (_) {
      return defaultResponse;
    }
    return defaultResponse;
  };

  const componentRole = apiRole;
  const componentConfig = (
    product === ProductEnum.Lxp ? componentConfigLxp : componentConfigOffice
  ) as any;

  const getComponent = (componentEnum: ComponentEnum) => {
    const defaultResponse = null;
    try {
      if (componentRole && !!componentConfig[componentEnum][componentRole]) {
        return componentConfig[componentEnum][componentRole];
      } else if (!!componentConfig[componentEnum]!['DEFAULT']) {
        return componentConfig[componentEnum]!['DEFAULT'];
      }
    } catch (_) {
      return defaultResponse;
    }
    return defaultResponse;
  };

  return { getApi, getComponent };
};
