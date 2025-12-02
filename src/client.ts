// src/AskClient.ts
import axios, { AxiosInstance } from "axios";
import { lazy, AsyncifyMethods } from "./utils";

type ServiceClassConstructor<T = any> = new (client: AskClient<any>) => T;

export type EagerServiceDictionary = Record<string, ServiceClassConstructor>;
export type LazyServiceDictionary = Record<
  string,
  () => Promise<{ default: ServiceClassConstructor }>
>;

interface AskClientOptions {
  getToken?: () => Promise<string | null>;
}
export class AskClient<Services extends Record<string, any> = {}> {
  private static instance: AskClient | null = null;
  public readonly axios: AxiosInstance;
  public services = {} as Services;
  public getAccessToken: () => Promise<string | null> | void;

  constructor(baseURL: string, options: AskClientOptions) {
    this.axios = axios.create({ baseURL });
    this.getAccessToken = options.getToken || (() => {});
  }

  /** Initialize singleton with baseURL */

  /** Retrieve singleton */
  public static get() {
    if (!AskClient.instance) {
      throw new Error(
        "AskClient not initialized — call createAskClient() first."
      );
    }
    return AskClient.instance;
  }

  /** Eager services */
  registerServices<T extends EagerServiceDictionary>(services: T) {
    for (const [name, ServiceClass] of Object.entries(services)) {
      (this.services as any)[name] = new ServiceClass(this);
    }

    type NewServicesMap = {
      [K in keyof T]: InstanceType<T[K]>;
    };

    return this as unknown as AskClient<Services & NewServicesMap>;
  }

  /** Lazy services */
  registerLazyServices<T extends LazyServiceDictionary>(services: T) {
    for (const [name, lazyImporter] of Object.entries(services)) {
      (this.services as any)[name] = lazy(lazyImporter, this);
    }

    type LazyServicesMap = {
      [K in keyof T]: T[K] extends () => Promise<{ default: infer C }>
        ? C extends new (...args: any[]) => any
          ? AsyncifyMethods<InstanceType<C>>
          : never
        : never;
    };

    return this as unknown as AskClient<Services & LazyServicesMap>;
  }
}
