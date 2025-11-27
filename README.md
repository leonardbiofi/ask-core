# 🧰 ASK — Axios Service Kit

A lightweight, typed, extensible service layer built on Axios.
Designed to simplify API client creation with auth, error mapping, and clean service abstractions.

<p align="center"> <img src="https://img.shields.io/badge/axios-service%20kit-4B8BF5?style=for-the-badge" /> <img src="https://img.shields.io/npm/v/ask-core.svg?style=for-the-badge" /> <img src="https://img.shields.io/bundlephobia/minzip/ask-core?style=for-the-badge" /> <img src="https://img.shields.io/npm/l/ask-core?style=for-the-badge" /> </p>

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

## 1. Initialize the AskClient

```ts
//src/ask.ts
import { AskClient } from "ask-core";

// Initialize singleton
export const askClient = AskClient.create("https://api.example.com");

```

## 2. Write a Service

```ts
//src/features/todos/api.ts
import { ModelApiService } from "ask-core";

class NotFoundError extends Error {}
class UnauthorizedError extends Error {}

const errorMap = {
  401: UnauthorizedError,
  404: NotFoundError,
  500: (err) => new Error("Server exploded: " + err.message),
};

export class TodoApiService extends ModelApiService {
  constructor() {
    super({ errorMap, requiresAuth:false });
  }

  async getById(todoId:string) {
    return this.get<Todo>({url: `/todos/${todoId}`})
  }
  async getAll() {
    return this.get({url: `/todos/`})
  }
}
```

## 3. Register your service

```ts
//src/ask.ts
import { AskClient } from "ask-core";

// Initialize singleton
export const askClient = AskClient.create("https://api.example.com");

// Eager services
import { TodoApiService } from "@/features/todos/api";

client.registerServices({
  todos: TodoApiService,
  // etc..
});

// Lazy services 🎉  Preferred ! 
client.registerLazyServices({
  todos: () => import("@/features/todos/api"),
  projects: () => import("@/features/projects/api"),
  // etc..
});

```

### 4. Use the service layer

```ts
import { askClient } from '@/ask'
const todos = await askClient.services.todos.getAll() // eager or lazy
const todos = await askClient.services.project.list()
// etc...
```


## Authentication

### Service-level default:
You can mark a whole service as private by passing requiresAuth: true in the constructor:
```ts
super({ errorMap, requiresAuth: true });
```

### Request-level override:
Individual requests can override via config:
```ts
this.get({ url: "/some-public-endpoint", config: { requiresAuth: false } });
```

Token injection:
You never have to manually attach Authorization headers — the interceptor automatically handles it based on requiresAuth.

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

## Use it in your favourite library

### ReactQuery Example
```ts
// src/features/workspace/hooks/useWorkspaces.ts
import { useQuery } from "@tanstack/react-query";
import { askClient } from "@/ask";


export const useGetAllTodos = () => {
  const query = useQuery({queryKey: ["todos"], queryFn: () => askClient.services.todos.getAll()});
  return query
};

export const useGetTodobyId = (todoId:string) => {
  const query = useQuery({queryKey: ["todos", todoId], queryFn: () => askClient.services.todos.getById(todoId)});
  return query
};

```

# 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a PR or GitHub issue.

# 📄 License

MIT License © 2025