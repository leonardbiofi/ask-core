// src/index.ts
import { AskClient, type AskClientOptions } from "./client";
import { ReadOnlyApiService } from "./ReadOnlyApiService";
import { BaseApiServiceOptions } from "./BaseApiService";
import { ModelApiService } from "./ModelApiService";

type Constructor<T> = new (...args: any[]) => T;

export function createAskClient(baseUrl: string, options: AskClientOptions) {
  const client = new AskClient(baseUrl, { ...options });

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
