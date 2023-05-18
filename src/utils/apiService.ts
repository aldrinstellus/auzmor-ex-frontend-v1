import qs from 'qs';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

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
  }

  async get(url: string, params = {}) {
    const _params = qs.stringify(params, { arrayFormat: 'repeat' });
    let _url = url;
    if (_params) {
      _url += `?${_params}`;
    }
    return await this.instance.get(_url);
  }

  async put(url: string, data = {}) {
    const { data: res } = await this.instance.put(url, data);
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
