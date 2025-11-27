# 🧰 ASK — Axios Service Kit

A lightweight, typed, extensible service layer built on Axios.
Designed to simplify API client creation with auth, error mapping, and clean service abstractions.

<p align="center"> <img src="https://img.shields.io/badge/axios-service%20kit-4B8BF5?style=for-the-badge" /> <img src="https://img.shields.io/npm/v/ask.svg?style=for-the-badge" /> <img src="https://img.shields.io/bundlephobia/minzip/ask?style=for-the-badge" /> <img src="https://img.shields.io/npm/l/ask?style=for-the-badge" /> </p>

# 🚀 Features

- Typed service classes for GET/POST/PUT/PATCH/DELETE
- Built-in request interceptor with optional auth token injection
- Extensible error mapping (map HTTP status → custom errors)
- Simple, predictable API (ReadOnlyApiService, ModelApiService)
- Reusable Axios instance per service
- Minimal boilerplate for API layers
  
# Installation

```bash
npm install ask-core
# or
yarn add ask-core
# or
pnpm add ask-core
```

# 🛠️ Usage

ASK is built around three core classes:

- BaseApiService — Axios wrapper with auth + error mapping
- ReadOnlyApiService — GET-only service
- ModelApiService — GET + POST + PUT + PATCH + 


```ts
import { AskClient } from "ask-core";

// Initialize singleton
const client = AskClient.create("https://api.example.com");

// Eager services
import { WorkspaceApiService } from "@/features/workspace/api";

client.registerServices({
  models: WorkspaceApiService,
});

// Lazy services 🎉  Preferred ! 
client.registerLazyServices({
  workspaces: () => import("@/features/workspace/api"),
  members: () => import("@/services/members/api"),
});

// Usage
const modelsData = await client.services.models.getModels(); // eager
const workspaceData = await client.services.workspaces.getAll(); // lazy

```
## 🛡️ Error Mapping

ASK lets you map HTTP status codes to:

- custom error classes
- or custom factory functions

```ts
import { ModelApiService } from "ask-core";

class NotFoundError extends Error {}
class UnauthorizedError extends Error {}

const errorMap = {
  401: UnauthorizedError,
  404: NotFoundError,
  500: (err) => new Error("Server exploded: " + err.message),
};

export class WorkspaceApiService extends ModelApiService {
  constructor() {
    super({ errorMap });
  }
}

```

# 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a PR or GitHub issue.

# 📄 License

MIT License © 2025