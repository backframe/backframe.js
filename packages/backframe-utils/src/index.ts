export * from "./env.js";
export * as logger from "./logger.js";
export * from "./pkg.js";

export function deepMerge<T, S>(target: T, source: S): T & S {
  for (const key in source) {
    const k = key as unknown as keyof T;
    if (source[key] instanceof Object && target[k] instanceof Object) {
      deepMerge(target[k], source[key]);
    } else {
      // @ts-expect-error (nvm)
      (target as T & S)[key] = source[key];
    }
  }
  return target as T & S;
}
