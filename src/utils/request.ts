// index.ts
import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { notification } from "antd";
import jwt from "@/utils/jwt";
import qs from 'qs';
import { feedbackToast } from "@/utils/common";

type Result<T> = {
  code: number;
  message: string;
  data: T;
};

const baseURL = import.meta.env.VITE_API_PREFIX
const timeout = import.meta.env.VITE_API_TIMEOUT

export function paramsSerializer(params:any) {
  const result:any = {};
  Object.keys(params).forEach((p) => {
    const value = params[p];
    if (Array.isArray(value)) {
      result[p] = value;
    } else if (value === null || value === undefined) {
      result[p] = value;
    } else if (typeof value === 'object') {
      result[p] = JSON.stringify(value);
    } else {
      result[p] = value;
    }
  });
  return qs.stringify(result, { arrayFormat: 'repeat', skipNulls: true });
}

// 导出Request类，可以用来自定义传递配置来创建实例
export class Request {
  // axios 实例
  instance: AxiosInstance;
  // 基础配置，url和超时时间
  baseConfig: AxiosRequestConfig = { baseURL: baseURL, timeout: Number(timeout) };

  constructor(config: AxiosRequestConfig) {
    // 使用axios.create创建axios实例
    this.instance = axios.create(Object.assign(this.baseConfig, config));


    this.instance.interceptors.request.use(
      // @ts-ignore
      (config: AxiosRequestConfig) => {
        // 一般会请求拦截里面加token，用于后端的验证
        config.headers = config.headers || {};
        config.headers.Authorization = jwt.getAccessToken(process.env.COOKIE_NAME!) || "";
        return config;
      },
      (err: any) => {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(err);
      }
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        // 直接返回res，当然你也可以只返回res.data
        // 系统如果有自定义code也可以在这里处理
        const { data } = res

        const { code, message } = data

        if (code === 1) {
          notification.error({
            message: message || "未知错误",
          })
          return Promise.reject(data);
        }
        if (code === 999) {
          notification.error({
            message: message || "登录过期, 请重新登录",
          })
          return Promise.reject(data);
        }
        if (code !== 0) {
          notification.error({
            message: message || "未定义错误",
          })
          return Promise.reject(data);
        }
        if (code === 0 && !!message) {
          notification.success({
            message,
          });
        }
        return res.data;
      },
      (err: any) => {
        // 这里用来处理http常见错误，进行全局提示
        let message = "";
        switch (err.response.status) {
          case 400:
            message = "请求错误(400)";
            break;
          case 401:
            message = "未授权，请重新登录(401)";
            // 这里可以做清空storage并跳转到登录页的操作
            break;
          case 403:
            message = "拒绝访问(403)";
            break;
          case 404:
            message = "请求出错(404)";
            break;
          case 408:
            message = "请求超时(408)";
            break;
          case 500:
            message = "服务器错误(500)";
            break;
          case 501:
            message = "服务未实现(501)";
            break;
          case 502:
            message = "网络错误(502)";
            break;
          case 503:
            message = "服务不可用(503)";
            break;
          case 504:
            message = "网络超时(504)";
            break;
          case 505:
            message = "HTTP版本不受支持(505)";
            break;
          default:
            message = `连接出错(${err.response.status})!`;
        }
        // 这里错误消息可以使用全局弹框展示出来
        feedbackToast({error: err, msg: message})
        // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
        return Promise.reject(err.response);
      }
    );
  }

  // 定义请求方法
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    params?:any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.get(url, {
      ...config,
      params: params,
      paramsSerializer,
    });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<Result<T>> {
    return this.instance.delete(url, config);
  }
}

// 默认导出Request实例
export default new Request({})
