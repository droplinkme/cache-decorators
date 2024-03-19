# Cache Decorators

[![MAIN CI status](https://github.com/droplinkme/cache-decorators/actions/workflows/release.yml/badge.svg)](https://github.com/droplinkme/cache-decorators/actions/workflows/release.yml?query=branch%3Amain)
[![Coverage Status](https://coveralls.io/repos/github/droplinkme/cache-decorators/badge.svg)](https://coveralls.io/github/droplinkme/cache-decorators)
[![NPM](https://img.shields.io/npm/v/%40droplink%2Fcache-decorators)](https://www.npmjs.com/package/@droplink/cache-decorators)
![NPM Downloads](https://img.shields.io/npm/dw/%40droplink%2Fcache-decorators)

Cache Decorators is a lightweight TypeScript library that provides decorators for caching function results, seamlessly integrating with various caching implementations. It offers decorators for caching, invalidating cache entries, and removing cache entries based on predefined conditions. With Cache Decorators, you can easily enhance the performance of your applications by caching expensive function calls, reducing response times, and optimizing resource utilization.

## Solution

Cache Decorators adopts a decorator-based approach, allowing you to apply caching logic to your functions with minimal effort. Whether you need to cache function results, invalidate cache entries, or remove cached data under specific conditions, Cache Decorators offers a flexible solution to suit your needs. Additionally, its support for the adapter pattern enables you to switch between different caching implementations effortlessly.

## Installation

You can install Cache Decorators via npm:

```bash
npm install @droplink/cache-decorators
```

## Getting Started

To start using Cache Decorators, follow these simple steps:

**Initialize Repository**: Start by initializing the cache repository using your preferred caching solution. For example:

```typescript
import { DataSource, AdapterEnum } from "@droplink/cache-decorators";

DataSource.initialize(AdapterEnum.REDIS, {
  host: process.env.REDIS_HOST, // Set your caching host
  port: Number(process.env.REDIS_PORT), // Set your caching port
});
```

**Initialize Custom Repository**

Alternatively, you can define your own custom repository implementation.

First, import the `ICacheRepository` interface from the `@droplink/cache-decorators` package. Ensure that this interface is implemented to provide all necessary methods for decorators.

```typescript
import { ICacheRepository } from "@droplink/cache-decorators"; // Ensure that this interface is implemented to provide all necessary methods for decorators

export class MyCustomRepository implements ICacheRepository {
  // Implement the required methods here
}
```

Then, initialize your custom repository like this:

```typescript
import { DataSource } from "@droplink/cache-decorators";
import { MyCustomRepository } from "../MyCustomRepository";

DataSource.setCustomRepository(new MyCustomRepository());
```

Now, you can get your custom repository anywhere in your code, like this:

```typescript
import { DataSource } from "@droplink/cache-decorators";

const repository = DataSource.getCustomRepository();
```

## Using Decorators

**Apply Decorators**: Apply the cache decorators to your functions. For example:

**@CacheSave**

```typescript
class MyClass {
  @CacheSave({ key: "my-key", ttl: 60 }) // TTL is specified in seconds
  public async save(): Promise<any> {
    // Your function logic here
  }
}
```

**@CacheRetrieve**

```typescript
class MyClass {
  @CacheRetrieve({ key: "my-key", ttl: 60 }) // TTL is specified in seconds
  public async get(): Promise<any> {
    // Your function logic here
  }
}
```

**@CacheRemove**

```typescript
class MyClass {
  @CacheRemove({ key: "my-key" })
  public async save(): Promise<any> {
    // Your function logic here
  }
}
```

**@CacheRemoveByPrefix**

```typescript
class MyClass {
  @CacheRemoveByPrefix({ key: "my-key-prefix" })
  public async save(): Promise<any> {
    // Your function logic here
  }
}
```

**@CacheInvalidate**

```typescript
class MyClass {
  @CacheInvalidate({ key: "my-key" })
  public async save(): Promise<any> {
    // Your function logic here
  }
}
```

**Using Custom Keys**

You have the flexibility to define custom keys for all decorators, as demonstrated below:

**@CacheRetrieve** | **@CacheInvalidate** | **@CacheRemove** | **@CacheRemoveByPattern**

You can specify the types for your input and use them to create a dynamic key based on the input arguments.

```typescript
class MyClass {
  @CacheRetrieve<Input>({ key: (input) => `my-prefix/${input.myParams}` })
  public async save(input: Input): Promise<any> {
    // Your function logic here
  }
}
```

**@CacheSave**

You can specify the types for your input and output and use them to create a dynamic key based on the input and output arguments.

```typescript
class MyClass {
  @CacheSave<Input, Output>({
    key: (input, output) =>
      `my-prefix/${input.myInputParams}/${output.myOutputParams}`,
  })
  public async save(input: Input): Promise<Output> {
    // Your function logic here
  }
}
```

## License

This project is licensed under the [MIT License](LICENSE).

## Created By

[<img src="https://github.com/allanchrs.png" width="50" height="50" style="border-radius: 50%;">](https://github.com/allanchrs)
