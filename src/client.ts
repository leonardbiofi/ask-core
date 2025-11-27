// src/AskClient.ts
import axios, { AxiosInstance } from "axios";
import { lazy } from "./utils";

type ServiceClassConstructor = new (client: AskClient) => any;

export type EagerServiceDictionary = Record<string, ServiceClassConstructor>;
export type LazyServiceDictionary = Record<
  string,
  () => Promise<{ default: ServiceClassConstructor }>
>;

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

  /** Batch registration of eager services */
  registerServices(services: EagerServiceDictionary) {
    for (const [name, ServiceClass] of Object.entries(services)) {
      this.services[name] = new ServiceClass(this);
    }
  }

  /** Batch registration of lazy services */
  registerLazyServices(services: LazyServiceDictionary) {
    for (const [name, lazyImporter] of Object.entries(services)) {
      this.services[name] = lazy(lazyImporter, this);
    }
  }
}
