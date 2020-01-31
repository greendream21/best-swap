// This is just a dummy type to signal it has to be updated
// It's needed to migrate all code to TS step by step
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FixmeType = any;


// Very simple way to provide a `Maybe` thing
// Again, it's not a Monad or so, just a very simple TS type :)
export type Nothing = null | undefined;
export const Nothing = null as Nothing;
export type Maybe<T> = T | Nothing;
