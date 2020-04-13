/**
 * Conditional type to infer a value from a Promise
 * Based on https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-inference-in-conditional-types
 *
 * <T> Type of a Promise
 * <U> Type to unpack, which is wrapped by a Promise type
 */
export type UnpackedPromise<T> = T extends Promise<infer U> ? U : T;

/**
 * Helper type to infer types of `axios` (or any other promise based) responses
 * Helpfull for `redux-saga` `call` functions, which need to know what a return type is.
 *
 * Basicly it's a transformation from Promise<AnyValue>) to AxiosResponse<AnyValue>
 * by using `conditional types` and `infer` features of TypeScript
 *
 * Note: `call` of `redux-saga` would just return an `any` without using that helper type
 * and we would lost all type safety w/o using this helper type.
 *
 * <F> Type of any Promise based endpoint function
 * <R> Return type of Promise based endpoint function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnpackPromiseResponse<F> = F extends (...args: any[]) => infer R
  ? UnpackedPromise<R>
  : F;
