// src/index.ts
import { AskClient } from "./client";
import { ReadOnlyApiService } from "./ReadOnlyApiService";
import { BaseApiServiceOptions } from "./BaseApiService";
import { ModelApiService } from "./ModelApiService";

export function createAskClient(
  baseUrl: string,
  getToken?: () => Promise<string | null>
) {
  const client = new AskClient(baseUrl, { getToken });

  const ReadOnlyService = class extends ReadOnlyApiService {
    constructor(options?: BaseApiServiceOptions) {
      super(client, options);
    }
  };

  const ModelService = class extends ModelApiService {
    constructor(options?: BaseApiServiceOptions) {
      super(client, options);
    }
  };

  return { client, ReadOnlyService, ModelService };
}

export function getAskClient() {
  return AskClient.get();
}

export * from "./BaseApiService";
export * from "./ReadOnlyApiService";
export * from "./ModelApiService";
