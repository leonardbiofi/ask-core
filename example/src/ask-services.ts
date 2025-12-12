//src/ask-services.ts
import { baseClient } from "./ask";
import { BreedsApiService } from "./features/breeds/api";

// 👇 You MUST reuse the returned client for better typing support
const client = baseClient
  // Eager services (bundle size might increase if you have big services)
  .registerServices({
    breeds: BreedsApiService,
  })
  // LazyService to have lazy imports and to avoid circular imports
  .registerLazyServices({
    // Lazy services 🎉  Preferred !
    facts: () => import("./features/facts/api"),
    //   projects: () => import("@/features/projects/api"),
    // etc..
  });

// Rename your export to have to only use 'api' afterwards
export const { services: api } = client;
