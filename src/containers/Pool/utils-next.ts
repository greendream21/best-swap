/**
 * Utitily functions for Pool
 *
 * Note: As long as we don't migrate `src/containers/Pool/utils.js` to Typescript
 * we will use this TypeScript based `utils-next`.
 * After migrating of `src/containers/Pool/utils.js` into TypeScript,
 * all sources here has to moved into it, as well.
 */

import {
  getFixedNumber,
  getBaseNumberFormat,
  getTickerFormat,
  getUserFormat,
} from '../../helpers/stringHelper';
import { PoolDataMap, PriceDataIndex } from '../../redux/midgard/types';
import { PoolDetail, AssetDetail } from '../../types/generated/midgard';
import { Maybe } from '../../types/bepswap';
import { getAssetFromString } from '../../redux/midgard/utils';
import { PoolInfoType } from './types';

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
      asset = '',
    } = poolDetail;

    const { symbol } = getAssetFromString(asset);

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

export type PoolData = {
  asset: string;
  target: string;
  depth: number;
  volume24: number;
  volumeAT: number;
  transaction: number;
  liqFee: number;
  roiAT: number;
  totalSwaps: number;
  totalStakers: number;
  values: PoolDataValues;
  raw: PoolDataRaw;
};

export type PoolDataValues = {
  pool: PoolInfoType;
  target: string;
  symbol: string;
  depth: string;
  volume24: string;
  transaction: string;
  liqFee: string;
  roiAT: string;
};

export type PoolDataRaw = {
  depth: number;
  volume24: number;
  transaction: number;
  liqFee: number;
  roiAT: number;
};

export const getCreatePoolTokens = (
  assetData: AssetDetail[],
  pools: string[],
): AssetDetail[] => {
  return assetData.filter(data => {
    let unique = true;

    if (getTickerFormat(data.asset) === 'rune') {
      return false;
    }

    pools.forEach((pool: string) => {
      const { symbol } = getAssetFromString(pool);
      if (symbol && symbol === data.asset) {
        unique = false;
      }
    });

    return unique;
  });
};

export const getPoolData = (
  from: string,
  poolDetail: PoolDetail,
  priceIndex: PriceDataIndex,
  basePriceAsset: string,
): PoolData => {
  const asset = from;
  const { symbol = '', ticker: target = '' } = getAssetFromString(
    poolDetail?.asset,
  );

  const runePrice = priceIndex.RUNE || 0;
  const depth = (poolDetail?.runeDepth ?? 0) * runePrice;
  const volume24 = (poolDetail?.poolVolume24hr ?? 0) * runePrice;
  const volumeAT = (poolDetail?.poolVolume ?? 0) * runePrice;
  const transaction = (poolDetail?.poolTxAverage ?? 0) * runePrice;

  const roiAT = poolDetail?.poolROI ?? 0;
  const liqFee = poolDetail?.poolFeeAverage ?? 0;

  const totalSwaps = poolDetail?.swappersCount ?? 0;
  const totalStakers = poolDetail?.stakersCount ?? 0;

  const depthValue = `${basePriceAsset} ${getUserFormat(
    depth,
  ).toLocaleString()}`;
  const volume24Value = `${basePriceAsset} ${getUserFormat(volume24)}`;
  const transactionValue = `${basePriceAsset} ${getUserFormat(transaction)}`;
  const liqFeeValue = `${getUserFormat(liqFee)}%`;
  const roiAtValue = `${getUserFormat(roiAT)}% pa`;

  return {
    asset,
    target,
    depth,
    volume24,
    volumeAT,
    transaction,
    liqFee,
    roiAT,
    totalSwaps,
    totalStakers,
    values: {
      pool: {
        asset,
        target,
      },
      target,
      symbol,
      depth: depthValue,
      volume24: volume24Value,
      transaction: transactionValue,
      liqFee: liqFeeValue,
      roiAT: roiAtValue,
    },
    raw: {
      depth: getUserFormat(depth),
      volume24: getUserFormat(volume24),
      transaction: getUserFormat(transaction),
      liqFee: getUserFormat(liqFee),
      roiAT: getUserFormat(roiAT),
    },
  };
};

export type CreatePoolCalc = {
  poolPrice: number;
  depth: number;
  share: number;
  poolAddress?: string;
  tokenSymbol?: string;
  Pr?: number;
};

type GetCreatePoolCalcParams = {
  tokenSymbol: string;
  poolAddress: string;
  runeAmount: number;
  runePrice: number;
  tokenAmount: number;
};

export const getCreatePoolCalc = ({
  tokenSymbol,
  poolAddress,
  runeAmount,
  runePrice,
  tokenAmount,
}: GetCreatePoolCalcParams): CreatePoolCalc => {
  const share = 100;

  if (!poolAddress) {
    return {
      poolPrice: 0,
      depth: 0,
      share: 100,
    };
  }

  const poolPrice = (tokenAmount > 0 && getFixedNumber((runeAmount / tokenAmount) * runePrice)) || 0;
  const depth = getFixedNumber(runePrice * runeAmount);

  return {
    poolAddress,
    tokenSymbol,
    poolPrice,
    depth,
    share,
    Pr: runePrice,
  };
};
