/**
 * Conditional type to infer a value from a Promise
 * Based on https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types
 *
 * <T> Type of a Promise
 * <U> Type to unpack, which is wrapped by a Promise type
 */
export type UnpackedPromise<T> = T extends Promise<infer U> ? U : T;
