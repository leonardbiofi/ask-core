// src/index.ts
import { AskClient } from "./client";
import { ReadOnlyApiService } from "./ReadOnlyApiService";
import { BaseApiServiceOptions } from "./BaseApiService";
import { ModelApiService } from "./ModelApiService";

type Constructor<T> = new (...args: any[]) => T;

export function createAskClient(
  baseUrl: string,
  getToken?: () => Promise<string | null>
) {
  const client = new AskClient(baseUrl, { getToken });

  const ReadOnlyService: Constructor<ReadOnlyApiService> = class extends ReadOnlyApiService {
    constructor(options?: BaseApiServiceOptions) {
      super(client, options);
    }
  };

  const ModelService: Constructor<ModelApiService> = class extends ModelApiService {
    constructor(options?: BaseApiServiceOptions) {
      super(client, options);
    }
  };

  return { client, ReadOnlyService, ModelService } as const;
}

// export function getAskClient() {
//   return AskClient.get();
// }

// export * from "./BaseApiService";
// export * from "./ReadOnlyApiService";
// export * from "./ModelApiService";
