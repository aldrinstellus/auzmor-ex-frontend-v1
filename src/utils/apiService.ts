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
    return await this.instance.get(url, { params });
  }

  async put(url: string, data = {}) {
    try {
      const { data: res } = await this.instance.put(url, data);
      return res;
    } catch (e: any) {
      throw new Error(e.response.data.message);
    }
  }
  async post(url: string, data = {}) {
    try {
      const { data: res } = await this.instance.post(url, data);
      return res;
    } catch (e: any) {
      throw new Error(e.response.data.message);
    }
  }

  async delete(url: string, params = {}) {
    try {
      return this.instance.delete(url, { params });
    } catch (e: any) {
      throw new Error(e.response.data.message);
    }
  }

  async patch(url: string, data = {}) {
    try {
      const { data: res } = await this.instance.patch(url, data);
      return res;
    } catch (e: any) {
      throw new Error(e.response.data.message);
    }
  }
}

export default new ApiService();
