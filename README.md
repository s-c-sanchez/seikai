# Seikai

[![CI](https://img.shields.io/github/actions/workflow/status/s-c-sanchez/seikai/ci.yml?branch=main&style=for-the-badge&logo=github&label=CI)](https://github.com/s-c-sanchez/seikai/actions/workflows/ci.yml)

> A precise and reliable TypeScript validation library with a modular API.

Seikai (Japanese for _"correct"_ or _"right answer"_) is a schema validation and parsing library built for TypeScript. It focuses on precision, reliability, and modularity, taking inspiration from libraries like [Valibot](https://valibot.dev/).

## Why Seikai?

With mature options like Zod or Valibot already existing, why build another validation library? 

- **Learning & Understanding**: I firmly believe that the best way to understand how a tool works under the hood is to build one yourself. Seikai is born from a deep curiosity to explore how type validation and parsing libraries are constructed from scratch.
- **Zero Bloat Philosophy**: I dislike libraries that do more than they should. While tools like Zod and Valibot are excellent and not inherently bloated, building my own allows me to strictly limit the scope to _exactly_ what is necessary and nothing else.
- **Tailored Developer Experience**: Creating this library gives me the freedom to design an API that perfectly adapts to my personal style and preferences.

## Features

- **Modular API**: Import only what you need, keeping your bundle sizes extremely small.
- **Type-safe**: Excellent TypeScript support. Infer your input and output types directly from your schemas.
- **Sync & Async**: Built-in support for both synchronous and asynchronous validations.
- **Developer Experience**: Simple, intuitive, and predictable API.

## Quick Start

Here is a quick example of the modular API approach:

```typescript
import * as s from "seikai";

// 1. Define your schema
const UserSchema = s.object({
  id: s.number(),
  username: s.string(),
  email: s.string()
});

// 2. Infer TypeScript types automatically
type UserInput = s.Input<typeof UserSchema>;
type UserOutput = s.Output<typeof UserSchema>;

// 3. Parse and validate your data
const data = {
  id: 1,
  username: "seikai_user",
  email: "hello@seikai.dev"
};

const result = s.parse(UserSchema, data);
```

## API Reference

Currently, Seikai exposes the foundational core types for building schemas:

### Core Types

- `Schema<TInput, TOutput>`: The base interface for synchronous schemas.
- `AsyncSchema<TInput, TOutput>`: The base interface for asynchronous schemas.
- `GenericSchema<TInput, TOutput>`: A union type representing either a synchronous or an asynchronous schema.

### Utility Types

- `Input<TSchema>`: Utility type to extract the input type from a given schema.
- `Output<TSchema>`: Utility type to extract the output type from a given schema.

## License

[MIT](./LICENSE) - Built with ❤️ by [Sergio Casado](https://github.com/s-c-sanchez)
