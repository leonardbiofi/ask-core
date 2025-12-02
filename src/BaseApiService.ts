import {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { StatusErrorMap, mapAxiosError, defaultStatusMap } from "./ErrorMapper";
import { AskClient } from "./client";

export type ApiServiceParam = {
  url: string;
  config?: AxiosRequestConfig;
  data?: object;
};

export interface BaseApiServiceOptions {
  baseUrl: string;
  requiresAuth: boolean;
  errorMap: StatusErrorMap;
}

export class BaseApiService {
  readonly client: AskClient;
  _requiresAuth: boolean;
  _errorMap: StatusErrorMap;

  constructor(client: AskClient, options?: BaseApiServiceOptions) {
    const { requiresAuth, errorMap } = options ?? {
      requiresAuth: true,
      errorMap: defaultStatusMap,
    };

    // console.log('baseURL', baseURL);
    this.client = client;
    this._requiresAuth = requiresAuth;
    this._errorMap = errorMap;

    this.initializeRequestInterceptor();
    // this.initializeReponseInterceptor();
  }

  /**
   * Initialized the resquest interceptor
   */
  initializeRequestInterceptor() {
    const configCallback = async function (
      this: BaseApiService,
      config: InternalAxiosRequestConfig
    ) {
      if (this._requiresAuth) {
        // Retrieve token from sessionStorage
        const accessToken = await this.client.getAccessToken();
        if (accessToken && config.headers) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }

      config.headers = config.headers || {};
      config.headers["Content-Type"] ||= "application/json";

      return config;
    };

    const errorCallBack = function (error: AxiosError) {
      return Promise.reject(error);
    };

    this.axios.interceptors.request.use(
      configCallback.bind(this),
      errorCallBack.bind(this)
    );
  }

  get axios() {
    return this.client.axios;
  }

  handleErrors(err: unknown) {
    // console.log("Error caught in the api handler: ", err);

    if (err instanceof AxiosError) {
      throw mapAxiosError(err, this._errorMap);
    }

    return Promise.reject(err);
  }
}
