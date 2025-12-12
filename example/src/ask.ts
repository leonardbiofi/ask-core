//src/ask.ts
import { createAskClient } from "ask-core";

// Any method to get the access token
const getToken = async () => sessionStorage.getItem("API_TOKEN")!;

// Initialize client
const {
  client: baseClient,
  ModelService,
  ReadOnlyService,
} = createAskClient("https://dogapi.dog/api/v2", {
  getToken,
  authHeader: "Bearer",
});

export { baseClient, ModelService, ReadOnlyService };
