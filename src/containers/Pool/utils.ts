import {
  getStakeMemo,
  getCreateMemo,
  getWithdrawMemo,
} from '../../helpers/memoHelper';
import {
  getFixedNumber,
  getBaseNumberFormat,
  getTickerFormat,
  getUserFormat,
} from '../../helpers/stringHelper';
import { getTxHashFromMemo } from '../../helpers/binance';
import {
  Address,
  MultiTransfer,
  TransferResult,
  TransferEvent,
} from '../../types/binance';
import { BinanceClient } from '../../clients/binance';
import { PoolDataMap, PriceDataIndex } from '../../redux/midgard/types';
import { PoolDetail, AssetDetail } from '../../types/generated/midgard';
import { getAssetFromString } from '../../redux/midgard/utils';
import { PoolInfoType } from './types';
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
      asset = '',
    } = poolDetail;

    const { symbol } = getAssetFromString(asset);

    if (symbol && symbol.toLowerCase() === tokenName.toLowerCase()) {
      R = Number(runeStakedTotal);
      T = Number(assetStakedTotal);
      ratio = 1 / (R / T);
      symbolTo = symbol;
      poolUnits = Number(poolDataUnits);
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
  const depth = Number(poolDetail?.runeDepth ?? 0) * runePrice;
  const volume24 = Number(poolDetail?.poolVolume24hr ?? 0) * runePrice;
  const volumeAT = Number(poolDetail?.poolVolume ?? 0) * runePrice;
  const transaction = Number(poolDetail?.poolTxAverage ?? 0) * runePrice;

  const roiAT = Number(poolDetail?.poolROI ?? 0);
  const liqFee = Number(poolDetail?.poolFeeAverage ?? 0);

  const totalSwaps = Number(poolDetail?.swappersCount ?? 0);
  const totalStakers = Number(poolDetail?.stakersCount ?? 0);

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

  const poolPrice =
    (tokenAmount > 0 &&
      getFixedNumber((runeAmount / tokenAmount) * runePrice)) ||
    0;
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

export enum StakeErrorMsg {
  MISSING_SYMBOL = 'Symbol to stake is missing.',
  MISSING_POOL_ADDRESS = 'Pool address is missing.',
}

export type ConfirmStakeParams = {
  bncClient: BinanceClient;
  wallet: Address;
  runeAmount: number;
  tokenAmount: number;
  poolAddress: Maybe<string>;
  symbolTo?: string;
};

export const confirmStake = (
  params: ConfirmStakeParams,
): Promise<TransferResult> => {
  const {
    bncClient,
    wallet,
    runeAmount,
    tokenAmount,
    poolAddress,
    symbolTo,
  } = params;

  return new Promise<TransferResult>((resolve, reject) => {
    if (!poolAddress) {
      return reject(new Error(StakeErrorMsg.MISSING_POOL_ADDRESS));
    }

    if (!symbolTo) {
      return reject(new Error(StakeErrorMsg.MISSING_SYMBOL));
    }

    if (runeAmount > 0 && tokenAmount > 0) {
      const memo = getStakeMemo(symbolTo);

      const outputs: MultiTransfer[] = [
        {
          to: poolAddress,
          coins: [
            {
              denom: 'RUNE-A1F',
              amount: Number(runeAmount.toFixed(8)),
            },
            {
              denom: symbolTo,
              amount: Number(tokenAmount.toFixed(8)),
            },
          ],
        },
      ];

      bncClient
        .multiSend(wallet, outputs, memo)
        .then(response => resolve(response))
        .catch(error => reject(error));
    } else if (runeAmount <= 0 && tokenAmount) {
      const memo = getStakeMemo(symbolTo);

      bncClient
        .transfer(wallet, poolAddress, tokenAmount, symbolTo, memo)
        .then(response => resolve(response))
        .catch(error => reject(error));
    } else if (tokenAmount <= 0 && runeAmount) {
      const memo = getStakeMemo('RUNE-A1F');

      bncClient
        .transfer(wallet, poolAddress, runeAmount, 'RUNE-A1F', memo)
        .then(response => resolve(response))
        .catch(error => reject(error));
    }
  });
};

export enum CreatePoolErrorMsg {
  MISSING_WALLET = 'Wallet address is missing or invalid.',
  INVALID_TOKEN_AMOUNT = 'Token amount has to be greater then 0.',
  MISSING_POOL_ADDRESS = 'Pool address is missing.',
  MISSING_TOKEN_SYMBOL = 'Token symbol is missing.',
}

type ConfirmCreatePoolParams = {
  bncClient: BinanceClient;
  wallet: string;
  runeAmount: number;
  tokenAmount: number;
  poolAddress: Maybe<string>;
  tokenSymbol?: string;
};
export const confirmCreatePool = (
  params: ConfirmCreatePoolParams,
): Promise<TransferResult> => {
  const {
    bncClient,
    wallet,
    runeAmount,
    tokenAmount,
    poolAddress,
    tokenSymbol,
  } = params;
  return new Promise<TransferResult>((resolve, reject) => {
    if (!wallet) {
      return reject(new Error(CreatePoolErrorMsg.MISSING_WALLET));
    }

    if (tokenAmount <= 0) {
      return reject(new Error(CreatePoolErrorMsg.INVALID_TOKEN_AMOUNT));
    }

    if (!poolAddress) {
      return reject(new Error(CreatePoolErrorMsg.MISSING_POOL_ADDRESS));
    }

    if (!tokenSymbol) {
      return reject(new Error(CreatePoolErrorMsg.MISSING_TOKEN_SYMBOL));
    }

    const memo = getCreateMemo(tokenSymbol);

    const outputs: MultiTransfer[] = [
      {
        to: poolAddress,
        coins: [
          {
            denom: 'RUNE-A1F',
            amount: Number(runeAmount.toFixed(8)),
          },
          {
            denom: tokenSymbol,
            amount: Number(tokenAmount.toFixed(8)),
          },
        ],
      },
    ];

    bncClient
      .multiSend(wallet, outputs, memo)
      .then(response => resolve(response))
      .catch(error => reject(error));
  });
};

export enum WithdrawErrorMsg {
  MISSING_WALLET = 'Wallet address is missing or invalid.',
  MISSING_POOL_ADDRESS = 'Pool address is missing.',
}

type WithdrawParams = {
  bncClient: BinanceClient;
  wallet: string;
  poolAddress: Maybe<string>;
  symbol: string;
  percent: number;
};
export const confirmWithdraw = (
  params: WithdrawParams,
): Promise<TransferResult> => {
  const { bncClient, wallet, poolAddress, symbol, percent } = params;
  return new Promise<TransferResult>((resolve, reject) => {
    if (!wallet) {
      return reject(new Error(WithdrawErrorMsg.MISSING_WALLET));
    }
    if (!poolAddress) {
      return reject(new Error(WithdrawErrorMsg.MISSING_POOL_ADDRESS));
    }

    const memo = getWithdrawMemo(symbol, percent * 100);

    // Fee
    const amount = 0.00000001;
    bncClient
      .transfer(wallet, poolAddress, amount, 'RUNE-A1F', memo)
      .then(response => resolve(response))
      .catch(() => {
        bncClient
          .transfer(wallet, poolAddress, amount, 'BNB', memo)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
  });
};

export const getTxType = (memo?: string) => {
  let txType = 'unknown';

  if (memo) {
    const str = memo.toLowerCase();

    const memoTypes = [
      {
        type: 'stake',
        memos: ['stake', 'st', '+'],
      },
      {
        type: 'withdraw',
        memos: ['withdraw', 'wd', '-'],
      },
      {
        type: 'outbound',
        memos: ['outbound'],
      },
    ];

    memoTypes.forEach(memoData => {
      const { type, memos } = memoData;
      let matched = false;

      memos.forEach(memoText => {
        if (str.includes(`${memoText}:`)) {
          matched = true;
        }
      });

      if (matched) {
        txType = type;
      }
    });
  }

  return txType;
};

export type WithdrawResultParams = {
  tx: TransferEvent;
  hash: string;
};

export const withdrawResult = ({ tx, hash }: WithdrawResultParams) => {
  const txType = getTxType(tx?.data?.M);
  const txHash = getTxHashFromMemo(tx);
  return txType === 'outbound' && hash === txHash;
};
