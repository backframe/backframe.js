# catch-unknown: Utility functions for writing type-safe JavaScript catch blocks

While exceptions thrown in JavaScript are usually objects of class `Error`, they can actually be values of any type.
This is particularly relevant in TypeScript, which in version 4.4 starting [defaulting `catch` variables to `unknown`
type](https://devblogs.microsoft.com/typescript/announcing-typescript-4-4/#use-unknown-catch-variables) (instead of `any`).
This small library provides two functions to make writing type-safe catch blocks easier: `isError` returns whether a
value conforms to the `Error` interface, and `asError` will convert any value to an object conforming to `Error` if necessary:

```ts
interface Error {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}

export declare function isError(err: unknown): err is Error;
export declare function asError(err: unknown): Error;
```

This library has no runtime dependencies, compiles to ES6 for wide compatibility, and has a package size of 2.9 kB.

## Installation

```sh
npm install catch-unknown
```

## Usage

Typical usage might look something like this:

```ts
import { asError } from 'catch-unknown';

try {
  // stuff
} catch (err) {
  logger.warn(`Stuff failed due to ${asError(err).message}`);
  throw err;
}
```

## Examples

Hopefully you never see a non-`Error` thrown, but if you do, nothing else will break:

```ts
import { asError, isError } from 'catch-unknown';

try {
  throw new Error('Something is wrong');
} catch (err) {
  console.log(isError(err)); // true
  console.log(asError(err)); // "Error: Something is wrong at ..."
}

try {
  throw { message: 'An odd thing to throw' };
} catch (err) {
  console.log(isError(err)); // false
  console.log(asError(err)); // { name: 'Object', message: 'An odd thing to throw' }
}

try {
  throw { x: 12, y: 5 };
} catch (err) {
  console.log(isError(err)); // false
  console.log(asError(err)); // { name: 'Object', message: '{"x":12,"y":5}' }
}

try {
  throw new Date(0);
} catch (err) {
  console.log(isError(err)); // false
  console.log(asError(err)); // { name: 'Date', message: 'Thu Jan 01 1970 00:00:00 GMT+0000 (Coordinated Universal Time)' }
}

try {
  throw 42;
} catch (err) {
  console.log(isError(err)); // false
  console.log(asError(err)); // { name: 'number', message: '42' }
}
```

## License

`catch-unknown` is available under the [ISC license](LICENSE).
