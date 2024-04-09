import qs from 'qs';
import axios, {
  AxiosInstance,
  GenericAbortSignal,
  // InternalAxiosRequestConfig
} from 'axios';

import { getItem } from './persist';

export enum ProductEnum {
  Lxp = 'lxp',
  Office = 'office',
  Learn = 'learn',
}

const productBaseUrlMap: { [key in ProductEnum]: string } = {
  [ProductEnum.Lxp]: process.env.REACT_APP_LXP_BACKEND_BASE_URL || '',
  [ProductEnum.Office]: process.env.REACT_APP_OFFICE_BACKEND_BASE_URL || '',
  [ProductEnum.Learn]: process.env.REACT_APP_LEARN_BACKEND_BASE_URL || '',
};

export const getProduct: () => ProductEnum = () => {
  if (process.env.NODE_ENV === 'development') {
    return ProductEnum.Lxp;
  }
  const host = window.location.host;
  if (
    host.includes(
      process.env.REACT_APP_OFFICE_BASE_URL?.replace('https://', '') ||
        'office.auzmor.com',
    )
  ) {
    return ProductEnum.Office;
  } else if (
    host.includes(
      process.env.REACT_APP_LXP_BASE_URL?.replace('https://', '') ||
        'lxp.auzmor.com',
    )
  ) {
    return ProductEnum.Lxp;
  }
  return ProductEnum.Office;
};

export class ApiService {
  instance: AxiosInstance;

  constructor(product?: ProductEnum) {
    const currentProduct = product || getProduct();
    this.instance = axios.create({
      baseURL: productBaseUrlMap[currentProduct],
      withCredentials: true,
    });

    this.instance.interceptors.request.use((config: any) => {
      let headers = {};
      const token = getItem(process.env.REACT_APP_SESSION_KEY || 'uat');
      if (token) {
        headers = {
          ...headers,
          authorization: `Bearer ${token}`,
        };
      }

      return {
        ...config,
        headers: {
          ...headers,
          ...config.headers,
        },
      };
    });

    this.instance.interceptors.response.use(
      (response: any) => {
        const userStatus = response.headers?.['x-user-status'];
        if (userStatus === 'USER_IS_DELETED') {
          window.location.href = '/login';
        } else if (userStatus === 'USER_IS_DEACTIVATED') {
          window.document.dispatchEvent(new Event('account_deactivated'));
        } else if (userStatus === 'SUBSCRIPTION_IS_EXPIRED') {
          window.document.dispatchEvent(new Event('session_expired'));
        }

        return response;
      },
      (error: any) => {
        const userStatus = error?.response.headers?.['x-user-status'];
        if (userStatus === 'USER_IS_DEACTIVATED') {
          window.document.dispatchEvent(new Event('account_deactivated'));
        } else if (
          !window.location.hostname?.startsWith('office') &&
          !window.location.pathname?.includes('logout') &&
          error?.response?.status === 401
        ) {
          const codes =
            error?.response?.data?.errors?.map(
              (err: { code: string; message: string; reason: string }) =>
                err?.code,
            ) || [];

          // Redirecting to login when error response does not contain INVALID_CREDENTIALS error code. " If " condition will prevent reload on incorrect password.
          if (!codes.includes('INVALID_CREDENTIALS')) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      },
    );
  }

  updateBaseUrl = (baseURL: string) => {
    this.instance.defaults.baseURL = baseURL;
  };

  updateContentType = (contentType: string) => {
    this.instance.defaults.headers.common['Content-Type'] = contentType;
  };

  async get(url: string, params = {}, signal?: GenericAbortSignal) {
    const _params = qs.stringify(params, { arrayFormat: 'comma' });
    let _url = url;
    if (_params) {
      _url += `?${_params}`;
    }
    return await this.instance.get(_url, { signal });
  }

  async put(url: string, data = {}, headers = {}) {
    const { data: res } = await this.instance.put(url, data, {
      headers,
    });
    return res;
  }
  async post(url: string, data = {}) {
    const { data: res } = await this.instance.post(url, data);
    return res;
  }

  async delete(url: string, params = {}) {
    return this.instance.delete(url, { params });
  }

  async patch(url: string, data = {}) {
    const { data: res } = await this.instance.patch(url, data);
    return res;
  }
}

export default new ApiService();
