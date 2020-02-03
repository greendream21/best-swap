/**
 * Utitily functions for swapping
 *
 * Note: As long as we don't migrate `src/containers/Swap/utils.js` to Typescript
 * we will use this TypeScript based `utils-next`.
 * After migrating of `src/containers/Swap/utils.js` into TypeScript,
 * all sources here has to moved into it, as well.
 */

import { getTickerFormat } from '../../helpers/stringHelper';

export const validatePair = (
  pair: { source?: string; target?: string },
  sourceInfo: { asset: string }[],
  targetInfo: { asset: string }[],
) => {
  const { target = '', source = '' } = pair;
  const targetData = targetInfo.filter(
    (data: { asset: string }) =>
      getTickerFormat(data.asset) !== target.toLowerCase(),
  );
  const sourceData = sourceInfo.filter(
    (data: { asset: string }) =>
      getTickerFormat(data.asset) !== source.toLowerCase(),
  );
  return {
    sourceData,
    targetData,
  };
};
