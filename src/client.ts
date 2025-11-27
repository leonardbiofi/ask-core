// src/AskClient.ts
import axios, { AxiosInstance } from "axios";

interface AskClientOptions {
  getToken?: CallableFunction;
}
export class AskClient {
  private static instance: AskClient | null = null;
  public readonly axios: AxiosInstance;
  public services: Record<string, any> = {};
  public getAccessToken: CallableFunction;

  private constructor(baseURL: string, options: AskClientOptions) {
    this.axios = axios.create({ baseURL });
    this.getAccessToken = options.getToken || (async () => {});
  }

  /** Initialize singleton with baseURL */
  public static create(baseURL: string, getToken: CallableFunction) {
    if (!AskClient.instance) {
      AskClient.instance = new AskClient(baseURL, { getToken });
    }
    return AskClient.instance;
  }

  /** Retrieve singleton */
  public static get() {
    if (!AskClient.instance) {
      throw new Error(
        "AskClient not initialized — call createAskClient() first."
      );
    }
    return AskClient.instance;
  }

  //   /** Register a service class */
  //   registerService<T>(
  //     name: string,
  //     ServiceClass: new (client: AskClient, options?: BaseApiServiceOptions) => T,
  //     options?: BaseApiServiceOptions
  //   ) {
  //     this.services[name] = new ServiceClass(this, options);
  //   }

  //   /** Register lazy services */
  //   lazyRegisterServices(loaders: Record<string, () => Promise<any>>) {
  //     Object.entries(loaders).forEach(([key, loader]) => {
  //       Object.defineProperty(this.services, key, {
  //         configurable: true,
  //         enumerable: true,
  //         get: () => {
  //           return loader().then((mod) => {
  //             const ServiceClass = mod.default;
  //             const instance = new ServiceClass(this);
  //             this.services[key] = instance;
  //             return instance;
  //           });
  //         },
  //       });
  //     });
  //   }
}
