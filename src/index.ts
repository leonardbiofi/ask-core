// src/index.ts
import { AskClient } from "./client";

export function createAskClient(
  baseUrl: string,
  getToken?: () => Promise<string | null>
) {
  return AskClient.create(baseUrl, getToken);
}

export function getAskClient() {
  return AskClient.get();
}

export * from "./BaseApiService";
export * from "./ReadOnlyApiService";
export * from "./ModelApiService";
