# 🧰 ASK — Axios Service Kit

A lightweight, typed, extensible service layer built on Axios.
Designed to simplify API client creation with auth, error mapping, and clean service abstractions.

<p align="center"> <img src="https://img.shields.io/badge/axios-service%20kit-4B8BF5?style=for-the-badge" /> <img src="https://img.shields.io/npm/v/ask-core.svg?style=for-the-badge" /> <img src="https://img.shields.io/bundlephobia/minzip/ask-core?style=for-the-badge" /> <img src="https://img.shields.io/npm/l/ask-core?style=for-the-badge" /> </p>

> :warning **Ask core is not yet stable as it is brand new. I am already using it in many project so I intend to keep it maintained on the long term.**

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

`createAskClient` helps you to create your client but also two utility classes that will use to define your services.

- `ModelService` utility class exposes `get`, `post` ,`delete`, `patch`, `put` for you to define your services
- `ReadOnlyService` is the same class except that it only exposes the `get` method.

See below how to use these utility class to use create a new `ApiService`

```ts
//src/ask.ts
import { createAskClient } from "ask-core";

// Initialize client and get two constructors for your service
const {client, ModelService, ReadOnlyService } = createAskClient("https://api.example.com");

```

## 2. Write a Service

After writing your service you must register it or add it to the client for a general usage

```ts
//src/features/todos/api.ts
import { ModelService, client} from '@/ask'

export class TodoApiService extends ModelService {
  constructor() {
    super({ requiresAuth:false }); // will add the Bearer token 
  }
  async getById(todoId:string) {
    return this.get<Todo>({url: `/todos/${todoId}`})
  }
  async getAll() {
    return this.get({url: `/todos/`})
  }
}

//OPTIONAL: Register your service eagerly (bundle size might increase)
client.addService('todos', TodoApiService)

// Or Alternatively you can register your service as lazy import (preferred)

```

## 3. Register your service

Registering your service is important so the `askClient` is aware of all services registered. You can do this either:
  - eagerly in each feature by calling `addService` method. 
  - Lazy imports by calling the registerLazyServices

```ts
//src/ask.ts
import { createAskClient } from "ask-core";

// Any method to get the access token
const getToken = async () => sessionStorage.getItem('API_TOKEN')!

// Initialize client
const { client: baseclient, ModelService, ReadOnlyService } = createAskClient(
  "https://api.example.com",
  { getToken, authHeader: 'Bearer'}
);


// 👇 You MUST reuse the returned client for better typing support
// LazyService to have lazy imports and to avoid circular imports
const client = baseClient.registerLazyServices({
  // Lazy services 🎉  Preferred !
    todos: () => import("@/features/todos/api"),
  //   projects: () => import("@/features/projects/api"),
  // etc..
});

export { client, ModelService, ReadOnlyService };
```

> [!WARNING]
> if you would like to register all your services in an index file, you can do similarly with `client.registerServices` but in a separate file to avoid circular imports



### 4. Use the service layer

```ts
import { client } from '@/ask'
const todos = await client.services.todos.getAll() // eager or lazy
const projects = await client.services.project.list()
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

Here is an full example

```ts
class TodoApiService extends ModelApiClass {
  constructor() {
    super({ requiresAuth: true }); // all requests require auth by default
  }
  async getTodos() {
    // Request override
   return this.get<Todo[]>({ url: "/public-endpoint", config: { requiresAuth: false } });
  }
}
```
> [!NOTE]
> You never have to manually attach Authorization headers — the interceptor automatically handles it based on requiresAuth.
> 
## 🛡️ Error Mapping

ASK lets you map HTTP status codes to:

- custom error classes
- or custom factory functions

```ts
import { ModelService } from "@/ask";

class NotFoundError extends Error {}
class UnauthorizedError extends Error {}

const errorMap = {
  401: UnauthorizedError,
  404: NotFoundError,
  500: (err) => new Error("Server exploded: " + err.message),
};

export class WorkspaceApiService extends ModelService {
  constructor() {
    super({ errorMap });
  }
}

```

## Use it with your favourite library

### ReactQuery Example
```ts
// src/features/todos/hooks.ts
import { useQuery } from "@tanstack/react-query";
import { client } from "@/ask";


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