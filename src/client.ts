// src/AskClient.ts
import axios, { AxiosInstance } from "axios";
import { lazy, AsyncifyMethods } from "./utils";
type Constructor<T> = new (...args: any[]) => T;

// type ServiceClassConstructor<T = any> = new (client: AskClient<any>) => T;
type ServiceClassConstructor = new (...args: any[]) => any;

export type EagerServiceDictionary = Record<string, ServiceClassConstructor>;
// export type LazyServiceDictionary = Record<
//   string,
//   () => Promise<{ default: ServiceClassConstructor }>
// >;
export type LazyServiceDictionary = Record<
  string,
  () => Promise<{ default: Constructor<any> }>
>;

type AuthHeader = "Bearer" | "Basic" | "Token";
export interface AskClientOptions {
  authHeader?: AuthHeader;
  getToken?: () => Promise<string | null | undefined>;
}
export class AskClient<Services extends Record<string, any> = {}> {
  private static instance: AskClient | null = null;
  public readonly axios: AxiosInstance;
  public services: Services = {} as Services;

  getAccessToken: () => Promise<string | null> | void;
  authHeader: AuthHeader;

  constructor(baseURL: string, options: AskClientOptions) {
    this.axios = axios.create({ baseURL });
    this.getAccessToken = options.getToken || (() => {});
    this.authHeader = options.authHeader || "Bearer";
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
  // registerServices<T extends EagerServiceDictionary>(services: T) {
  //   for (const [name, ServiceClass] of Object.entries(services)) {
  //     (this.services as any)[name] = new ServiceClass(this);
  //   }

  //   type NewServicesMap = {
  //     [K in keyof T]: InstanceType<T[K]>;
  //   };

  //   return this as AskClient<Services & NewServicesMap>;
  // }

  // /** Lazy services */
  // registerLazyServices<T extends LazyServiceDictionary>(services: T) {
  //   for (const [name, lazyImporter] of Object.entries(services)) {
  //     (this.services as any)[name] = lazy(lazyImporter, this);
  //   }

  //   type LazyServicesMap = {
  //     [K in keyof T]: T[K] extends () => Promise<{ default: infer C }>
  //       ? C extends new (...args: any[]) => any
  //         ? AsyncifyMethods<InstanceType<C>>
  //         : never
  //       : never;
  //   };

  //   return this as AskClient<Services & LazyServicesMap>;
  // }

  /** Eager services */
  registerServices<T extends EagerServiceDictionary>(services: T) {
    const mapped: any = {};

    for (const [key, ServiceClass] of Object.entries(services)) {
      const ServiceWrapper = class extends ServiceClass {
        constructor() {
          super(); // service constructor receives (options?), client already captured
        }
      };

      mapped[key] = new ServiceWrapper();
    }

    Object.assign(this.services, mapped);

    type Added = { [K in keyof T]: InstanceType<T[K]> };

    return this as AskClient<Services & Added>;
  }

  /** Lazy services */
  registerLazyServices<T extends LazyServiceDictionary>(services: T) {
    const mapped: any = {};

    for (const [key, importer] of Object.entries(services)) {
      mapped[key] = lazy(importer, (Original) => {
        return class ServiceWrapper extends Original {
          constructor() {
            super(); // call your ModelService/ReadOnlyService constructor
          }
        };
      });
    }

    Object.assign(this.services, mapped);

    type Added = {
      [K in keyof T]: T[K] extends () => Promise<{ default: infer C }>
        ? C extends Constructor<any>
          ? AsyncifyMethods<InstanceType<C>>
          : never
        : never;
    };

    return this as AskClient<Services & Added>;
  }
}
