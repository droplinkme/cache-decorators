# Cache Decorators

Cache Decorators is a lightweight TypeScript library that provides decorators for caching function results, seamlessly integrating with various caching implementations. It offers decorators for caching, invalidating cache entries, and removing cache entries based on predefined conditions. With Cache Decorators, you can easily enhance the performance of your applications by caching expensive function calls, reducing response times, and optimizing resource utilization.

## Solution

Cache Decorators adopts a decorator-based approach, allowing you to apply caching logic to your functions with minimal effort. Whether you need to cache function results, invalidate cache entries, or remove cached data under specific conditions, Cache Decorators offers a flexible solution to suit your needs. Additionally, its support for the adapter pattern enables you to switch between different caching implementations effortlessly.

## Installation

You can install Cache Decorators via npm:

```bash
npm install cache-decorators
```

## Getting Started

To start using Cache Decorators, follow these simple steps:

1. **Initialize Repository**: Start by initializing the cache repository using your preferred caching solution. For example:

```typescript
import { DataSource } from "@database/datasource";

const dataSource = new DataSource();

dataSource.initialize({
  adapter: "ioredis", // Choose your caching adapter
  host: process.env.REDIS_HOST, // Set your caching host
  port: Number(process.env.REDIS_PORT), // Set your caching port
});

// OR

dataSource.setReposiory(your - repository); // Make sure to implements ICacheRepository
```

2. **Apply Decorators**: Apply the cache decorators to your functions. For example:

```typescript
import {
  CacheSave,
  CacheRetrieve,
  CacheInvalidate,
  CacheRemove,
  CacheRemoveByPrefix,
} from "cache-decorators";

class MyClass {
  @CacheRetrieve({ key: "my-key", ttl: 60 })
  public async get(): Promise<any> {
    // Your function logic here
  }

  @CacheSave({ key: "my-key", ttl: 60 })
  public async save(): Promise<any> {
    // Your function logic here
  }

  @CacheInvalidate({ key: "my-key" })
  public async remove(): Promise<any> {
    // Your function logic here
  }

  @CacheRemove({ key: "my-key" })
  public async remove(): Promise<any> {
    // Your function logic here
  }

  @CacheRemoveByPrefix({ key: "my-key" })
  public async removeByPrefix(): Promise<any> {
    // Your function logic here
  }

  @CacheSave<Input, Output>({
    custom_key: (input, output) => `my-key/${input.id}/${output?.key}`, // Define a custom cache key using input and output values
  })
  async saveWithCustomKey(input: Input): Promise<Output> {
    // Your function logic here
  }

  // Define custom Key

  @CacheRetrieve<Input & { key: string }>({
    custom_key: (input) => `my-key/${input.id}/${input?.key}`, // Define a custom cache key using input properties
  })
  async retrieveWithCustomKey(input: Input & { key: string }): Promise<Output> {
    // Your function logic here
  }

  @CacheInvalidate<Input & { key: string }>({
    custom_key: (input) => `my-key/${input.id}/${input?.key}`, // Define a custom cache key using input properties
  })
  async invalidateWithCustomKey(
    input: Input & { key: string }
  ): Promise<Output> {
    // Your function logic here
  }

  @CacheRemove<Input & { key: string }>({
    custom_key: (input) => `my-key/${input.id}/${input?.key}`, // Define a custom cache key using input properties
  })
  async removeWithCustomKey(input: Input & { key: string }): Promise<Output> {
    // Your function logic here
  }

  @CacheRemoveByPrefix<Input & { key: string }>({
    custom_key: (input) => `my-key/${input.id}/${input?.key}`, // Define a custom cache key using input properties
  })
  async removeByPrefixWithCustomKey(
    input: Input & { key: string }
  ): Promise<Output> {
    // Your function logic here
  }
}
```
