/**
 * Utitily functions for Pool
 *
 * Note: As long as we don't migrate `src/containers/Pool/utils.js` to Typescript
 * we will use this TypeScript based `utils-next`.
 * After migrating of `src/containers/Pool/utils.js` into TypeScript,
 * all sources here has to moved into it, as well.
 */

import { get as _get } from 'lodash';

import {
  getFixedNumber,
  getBaseNumberFormat,
} from '../../helpers/stringHelper';
import { PoolDataMap } from '../../redux/midgard/types';
import { PoolDetail } from '../../types/generated/midgard';
import { Maybe } from '../../types/bepswap';

export type CalcResult = {
  poolAddress: Maybe<string>;
  ratio?: number;
  symbolTo?: string;
  poolUnits?: number;
  poolPrice: number;
  newPrice: number;
  newDepth: number;
  share: number;
  Pr: number;
  R: number;
  T: number;
};

export const getCalcResult = (
  tokenName: string,
  pools: PoolDataMap,
  poolAddress: Maybe<string>,
  rValue: number,
  runePrice: number,
  tValue: number,
): CalcResult => {
  let R = 10000;
  let T = 10;
  const Pr = runePrice;
  let ratio;
  let symbolTo;
  let poolUnits;

  // CHANGELOG:
  /*
    balance_rune => runeStakedTotal
    balance_token => assetStakedTotal
    pool_units => poolUnits
  */
  Object.keys(pools).forEach(key => {
    const poolDetail: PoolDetail = pools[key];
    const {
      runeStakedTotal,
      assetStakedTotal,
      poolUnits: poolDataUnits,
      asset,
    } = poolDetail;

    const symbol = asset?.symbol;

    if (symbol && symbol.toLowerCase() === tokenName.toLowerCase()) {
      R = Number(runeStakedTotal);
      T = Number(assetStakedTotal);
      ratio = 1 / (R / T);
      symbolTo = symbol;
      poolUnits = poolDataUnits;
    }
  });

  const r = getBaseNumberFormat(rValue);
  const t = getBaseNumberFormat(tValue);

  const poolPrice = getFixedNumber((R / T) * runePrice);
  const newPrice = getFixedNumber((runePrice * (r + R)) / (t + T));
  const newDepth = getFixedNumber(runePrice * (1 + (r / R + t / T) / 2) * R);
  const share: number = getFixedNumber(((r / (r + R) + t / (t + T)) / 2) * 100);

  return {
    poolAddress,
    ratio,
    symbolTo,
    poolUnits,
    poolPrice,
    newPrice,
    newDepth,
    share,
    Pr,
    R,
    T,
  };
};
