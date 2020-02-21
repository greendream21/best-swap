import { Nothing, Maybe } from '../types/bepswap';

export const COMMIT_HASH: Maybe<string> =
  $COMMIT_HASH && $COMMIT_HASH !== '' ? $COMMIT_HASH : Nothing;
