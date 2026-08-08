import axios, { AxiosRequestConfig } from 'axios';
import { useApiConfig } from '@/contexts/ApiConfigContext';

export const useApiClient = () => {
  const { config } = useApiConfig();

  const request = async <T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    data?: any,
    extraConfig?: AxiosRequestConfig
  ): Promise<T> => {
    const url = `${config.baseUrl.replace(/\/*$/, '')}/${path.replace(/^\/*/, '')}`;
    const headers = {
      'X-API-Key': config.apiKey,
      'Content-Type': 'application/json',
      ...(extraConfig?.headers || {}),
    };

    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      headers,
      data,
      ...extraConfig,
    };

    const response = await axios(axiosConfig);
    return response.data as T;
  };

  return { request };
};
