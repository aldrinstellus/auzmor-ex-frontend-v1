import qs from 'qs';
import axios, {
  AxiosInstance,
  // InternalAxiosRequestConfig
} from 'axios';

import { getItem } from './persist';

class ApiService {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
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
        if (
          !window.location.hostname?.startsWith('office') &&
          !window.location.pathname?.includes('logout') &&
          error?.response?.status === 401
        ) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    );
  }

  updateContentType = (contentType: string) => {
    this.instance.defaults.headers.common['Content-Type'] = contentType;
  };

  async get(url: string, params = {}) {
    const _params = qs.stringify(params, { arrayFormat: 'comma' });
    let _url = url;
    if (_params) {
      _url += `?${_params}`;
    }
    return await this.instance.get(_url);
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
