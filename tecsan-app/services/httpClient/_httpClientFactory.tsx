import { API_URL } from '@/constants/environment-variables';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { HttpClient, HttpRequest, HttpResponse } from '../types/Http';
import { httpErros } from './errors';
import { isAuthenticated } from '@/utils/auth';

const axiosiInstance = axios.create({
    baseURL: API_URL
});

axiosiInstance.interceptors.request.use(
    async (config) => {
        const auth = await isAuthenticated()
        if (auth.isAuthenticated && !!auth.accessToken) {
            config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }
        return config;
    },
    (error) => {
        console.log(error)
        return Promise.reject(error);
    }
);

axiosiInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {        
       return Promise.reject(error);
      }
      console.log(error)
      return Promise.reject(error);
    }
  );


class AxiosHttpClientAdapter implements HttpClient {
    async request(data: HttpRequest) {
        let axiosResponse: AxiosResponse;
        try {
            axiosResponse = await axiosiInstance.request({
                url: data.url,
                method: data.method,
                data: data.body,
                headers: data.headers
            })
        }
        catch (error) {
            const _error = error as AxiosError<{ message: string[] | string }>;
            if (_error?.response?.data?.message && _error?.response?.status != 500 && _error?.response?.status != 401) {
                if (typeof (_error?.response?.data?.message) == 'string') {
                    _error.response.data.message = [_error?.response?.data?.message]
                }
                let errorArray = _error?.response?.data?.message
                throw new Error(errorArray && errorArray[0])
            }
            else if (_error?.response?.status) {
                throw new Error(httpErros[_error.response.status])
            }
            else if (_error.code) {
                throw new Error(httpErros[_error.code])
            }
            else {
                throw new Error(_error?.message)
            }
        }
        return {
            statusCode: axiosResponse.status,
            data: axiosResponse?.data
        }
    }
}

const httpClientFactory = (): HttpClient => new AxiosHttpClientAdapter();

export default httpClientFactory
