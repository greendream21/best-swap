import BigNumber from 'bignumber.js';
import {
  getStakeMemo,
  getCreateMemo,
  getWithdrawMemo,
} from '../../helpers/memoHelper';
import { getTickerFormat } from '../../helpers/stringHelper';
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
import { Maybe, Nothing } from '../../types/bepswap';
import {
  tokenToBase,
  baseAmount,
  formatBaseAsTokenAmount,
} from '../../helpers/tokenHelper';
import {
  bn,
  BN_ZERO,
  bnOrZero,
  validBNOrZero,
  fixedBN,
  isValidBN,
} from '../../helpers/bnHelper';
import { TokenAmount } from '../../types/token';
import { PoolData } from './types';

export type CalcResult = {
  poolAddress: Maybe<string>;
  ratio: Maybe<BigNumber>;
  symbolTo: Maybe<string>;
  poolUnits: Maybe<BigNumber>;
  poolPrice: BigNumber;
  newPrice: BigNumber;
  newDepth: BigNumber;
  share: BigNumber;
  Pr: BigNumber;
  R: BigNumber;
  T: BigNumber;
};

export const getCalcResult = (
  tokenName: string,
  pools: PoolDataMap,
  poolAddress: Maybe<string>,
  rValue: TokenAmount,
  runePrice: BigNumber,
  tValue: TokenAmount,
): CalcResult => {
  let R = bn(10000);
  let T = bn(10);
  let ratio: Maybe<BigNumber> = Nothing;
  let symbolTo: Maybe<string> = Nothing;
  let poolUnits: Maybe<BigNumber> = Nothing;

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
      R = bn(runeStakedTotal || 0);
      T = bn(assetStakedTotal || 0);
      // formula: 1 / (R / T)
      const a = R.div(T);
      // Ratio does need more than 2 decimal places
      ratio = bn(1)
        .div(a)
        .decimalPlaces(2);
      symbolTo = symbol;
      poolUnits = bn(poolDataUnits || 0);
    }
  });

  const rBase = tokenToBase(rValue);
  const r = rBase.amount();
  const tBase = tokenToBase(tValue);
  const t = tBase.amount();

  // formula: (R / T) * runePrice
  const poolPrice = fixedBN(R.div(T).multipliedBy(runePrice));
  // formula: (runePrice * (r + R)) / (t + T)
  const a = r.plus(R).multipliedBy(runePrice);
  const aa = t.plus(T);
  const newPrice = fixedBN(a.dividedBy(aa));
  // formula: runePrice * (1 + (r / R + t / T) / 2) * R
  const b = r.dividedBy(R); // r / R
  const bb = t.dividedBy(T); // t / T
  const bbb = b.plus(bb); // (r / R + t / T)
  const bbbb = bbb.dividedBy(2).plus(1); // (1 + (r / R + t / T) / 2)
  const newDepth = fixedBN(runePrice.multipliedBy(bbbb).multipliedBy(R));
  // formula: ((r / (r + R) + t / (t + T)) / 2) * 100
  const c = r.plus(R); // (r + R)
  const cc = t.plus(T); // (t + T)
  const ccc = r.dividedBy(c); // r / (r + R)
  const cccc = t.dividedBy(cc); // (t / (t + T))
  const share = fixedBN(
    ccc
      .plus(cccc)
      .div(2)
      .multipliedBy(100),
  );

  return {
    poolAddress,
    ratio,
    symbolTo,
    poolUnits,
    poolPrice,
    newPrice,
    newDepth,
    share,
    Pr: runePrice,
    R,
    T,
  };
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

// TODO(Chris): merge duplicated functions from swap and pool utils
// TODO(Chris): Refactor utils

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

  const runePrice = validBNOrZero(priceIndex?.RUNE);

  const R = bn(poolDetail?.runeStakedTotal ?? 0);
  const T = bn(poolDetail?.assetStakedTotal ?? 0);
  // formula: (R / T) * runePrice
  const poolPrice = fixedBN(R.div(T).multipliedBy(runePrice));
  const poolPriceValue = `${basePriceAsset} ${poolPrice}`;

  const depthResult = bnOrZero(poolDetail?.runeDepth).multipliedBy(runePrice);
  const depth = baseAmount(depthResult);
  const volume24Result = bnOrZero(poolDetail?.poolVolume24hr).multipliedBy(
    runePrice,
  );
  const volume24 = baseAmount(volume24Result);
  const volumeATResult = bnOrZero(poolDetail?.poolVolume).multipliedBy(
    runePrice,
  );
  const volumeAT = baseAmount(volumeATResult);
  const transactionResult = bnOrZero(poolDetail?.poolTxAverage).multipliedBy(
    runePrice,
  );
  const transaction = baseAmount(transactionResult);

  const roiATResult = poolDetail?.poolROI ?? 0;
  const roiAT = baseAmount(roiATResult);
  const liqFeeResult = poolDetail?.poolFeeAverage ?? 0;
  const liqFee = baseAmount(liqFeeResult);

  const totalSwaps = Number(poolDetail?.swappersCount ?? 0);
  const totalStakers = Number(poolDetail?.stakersCount ?? 0);

  const depthValue = `${basePriceAsset} ${formatBaseAsTokenAmount(depth)}`;
  const volume24Value = `${basePriceAsset} ${formatBaseAsTokenAmount(
    volume24,
  )}`;
  const transactionValue = `${basePriceAsset} ${formatBaseAsTokenAmount(
    transaction,
  )}`;
  const liqFeeValue = `${formatBaseAsTokenAmount(liqFee)}%`;
  const roiAtValue = `${formatBaseAsTokenAmount(roiAT)}% pa`;

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
      poolPrice: poolPriceValue,
    },
    raw: {
      depth,
      volume24,
      transaction,
      liqFee,
      roiAT,
      poolPrice,
    },
  };
};

export type CreatePoolCalc = {
  poolPrice: BigNumber;
  depth: BigNumber;
  share: number;
  poolAddress?: string;
  tokenSymbol?: string;
  Pr?: BigNumber;
};

type GetCreatePoolCalcParams = {
  tokenSymbol: string;
  poolAddress: string;
  runeAmount: TokenAmount;
  tokenAmount: TokenAmount;
  runePrice: BigNumber;
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
      poolPrice: BN_ZERO,
      depth: BN_ZERO,
      share: 100,
    };
  }

  // formula: (runeAmount / tokenAmount) * runePrice)
  const poolPrice = tokenAmount.amount().isGreaterThan(0)
    ? runeAmount
        .amount()
        .div(tokenAmount.amount())
        .multipliedBy(runePrice)
    : BN_ZERO;
  // formula: runePrice * runeAmount
  const depth = runeAmount.amount().multipliedBy(runePrice);

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
  INVALID_TOKEN_AMOUNT = 'Invalid token amount.',
  INVALID_RUNE_AMOUNT = 'Invalid RUNE amount.',
}

export type ConfirmStakeParams = {
  bncClient: BinanceClient;
  wallet: Address;
  runeAmount: TokenAmount;
  tokenAmount: TokenAmount;
  poolAddress: Maybe<string>;
  symbolTo: Maybe<string>;
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
    const runeAmountValue = runeAmount.amount();
    if (!runeAmountValue.isFinite()) {
      return reject(new Error(StakeErrorMsg.INVALID_RUNE_AMOUNT));
    }
    const tokenAmountValue = tokenAmount.amount();
    if (!tokenAmountValue.isFinite()) {
      return reject(new Error(StakeErrorMsg.INVALID_TOKEN_AMOUNT));
    }

    if (!poolAddress) {
      return reject(new Error(StakeErrorMsg.MISSING_POOL_ADDRESS));
    }

    if (!symbolTo) {
      return reject(new Error(StakeErrorMsg.MISSING_SYMBOL));
    }

    // We have to convert BNs back into numbers needed by Binance JS SDK
    // However, we are safe here, since we have already checked amounts of rune and token before
    const runeAmountNumber = runeAmountValue.toNumber();
    const tokenAmountNumber = tokenAmountValue.toNumber();
    if (runeAmountValue.isGreaterThan(0) && tokenAmountValue.isGreaterThan(0)) {
      const memo = getStakeMemo(symbolTo);

      const outputs: MultiTransfer[] = [
        {
          to: poolAddress,
          coins: [
            {
              denom: 'RUNE-A1F',
              amount: runeAmountNumber,
            },
            {
              denom: symbolTo,
              amount: tokenAmountNumber,
            },
          ],
        },
      ];

      bncClient
        .multiSend(wallet, outputs, memo)
        .then((response: TransferResult) => resolve(response))
        .catch((error: Error) => reject(error));
    } else if (runeAmountValue.isLessThanOrEqualTo(0) && tokenAmount) {
      const memo = getStakeMemo(symbolTo);

      bncClient
        .transfer(wallet, poolAddress, tokenAmountNumber, symbolTo, memo)
        .then((response: TransferResult) => resolve(response))
        .catch((error: Error) => reject(error));
    } else if (runeAmount && tokenAmountValue.isLessThanOrEqualTo(0)) {
      const memo = getStakeMemo(symbolTo);

      bncClient
        .transfer(wallet, poolAddress, runeAmountNumber, 'RUNE-A1F', memo)
        .then(response => resolve(response))
        .catch(error => reject(error));
    }
  });
};

export enum CreatePoolErrorMsg {
  MISSING_WALLET = 'Wallet address is missing or invalid.',
  INVALID_TOKEN_AMOUNT = 'Token amount is invalid.',
  INVALID_RUNE_AMOUNT = 'Rune amount is invalid.',
  MISSING_POOL_ADDRESS = 'Pool address is missing.',
  MISSING_TOKEN_SYMBOL = 'Token symbol is missing.',
}

type ConfirmCreatePoolParams = {
  bncClient: BinanceClient;
  wallet: string;
  runeAmount: TokenAmount;
  tokenAmount: TokenAmount;
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

    const runeValue = runeAmount.amount();
    if (
      !isValidBN(runeValue) ||
      runeValue.isLessThanOrEqualTo(0) ||
      !runeValue.isFinite()
    ) {
      return reject(new Error(CreatePoolErrorMsg.INVALID_RUNE_AMOUNT));
    }
    const tokenValue = tokenAmount.amount();
    if (
      !isValidBN(tokenValue) ||
      tokenValue.isLessThanOrEqualTo(0) ||
      !tokenValue.isFinite()
    ) {
      return reject(new Error(CreatePoolErrorMsg.INVALID_TOKEN_AMOUNT));
    }

    if (!poolAddress) {
      return reject(new Error(CreatePoolErrorMsg.MISSING_POOL_ADDRESS));
    }

    if (!tokenSymbol) {
      return reject(new Error(CreatePoolErrorMsg.MISSING_TOKEN_SYMBOL));
    }

    const memo = getCreateMemo(tokenSymbol);

    // We have to convert BNs back into numbers needed by Binance JS SDK
    // We are safe here, since we have already checked that amounts of RUNE and toke are valid numbers
    const runeAmountNumber = runeAmount.amount().toNumber();
    const tokenAmountNumber = tokenAmount.amount().toNumber();

    const outputs: MultiTransfer[] = [
      {
        to: poolAddress,
        coins: [
          {
            denom: 'RUNE-A1F',
            amount: runeAmountNumber,
          },
          {
            denom: tokenSymbol,
            amount: tokenAmountNumber,
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
