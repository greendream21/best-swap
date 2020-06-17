import BigNumber from 'bignumber.js';
import {
  BinanceClient,
  Address,
  TransferResult,
  MultiTransfer,
  TransferEvent,
} from '@thorchain/asgardex-binance';
import {
  bn,
  fixedBN,
  bnOrZero,
  validBNOrZero,
  isValidBN,
} from '@thorchain/asgardex-util';
import {
  tokenAmount,
  TokenAmount,
  tokenToBase,
  baseAmount,
  formatBaseAsTokenAmount,
} from '@thorchain/asgardex-token';
import { getStakeMemo, getWithdrawMemo } from '../../helpers/memoHelper';
import { getTickerFormat } from '../../helpers/stringHelper';
import { PoolDataMap, PriceDataIndex } from '../../redux/midgard/types';
import { PoolDetail } from '../../types/generated/midgard';
import { getAssetFromString } from '../../redux/midgard/utils';
import { AssetData } from '../../redux/wallet/types';
import { Maybe, Nothing } from '../../types/bepswap';
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

export const getRoundedDownBN = (value: BigNumber, decimal = 2) => {
  return value.toFixed(decimal, 1);
};

export const roundedDownAmount = (value: BigNumber, decimal = 2) => {
  const roundedBN = getRoundedDownBN(value, decimal);

  return tokenAmount(roundedBN);
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

  Object.keys(pools).forEach(key => {
    const poolDetail: PoolDetail = pools[key];
    const {
      runeDepth,
      assetDepth,
      poolUnits: poolDataUnits,
      asset = '',
    } = poolDetail;

    const { symbol } = getAssetFromString(asset);

    if (symbol && symbol.toLowerCase() === tokenName.toLowerCase()) {
      R = bn(runeDepth || 0);
      T = bn(assetDepth || 0);
      // formula: 1 / (R / T)
      const a = R.div(T);
      // Ratio does need more than 2 decimal places
      ratio = bn(1).div(a);
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
  assetData: AssetData[],
  pools: string[],
): AssetData[] => {
  return assetData.filter((data: AssetData) => {
    let unique = true;
    const isSmallAmount = data.assetValue.amount().isLessThan(0.01);
    if (getTickerFormat(data.asset) === 'rune') {
      return false;
    }

    pools.forEach((pool: string) => {
      const { symbol } = getAssetFromString(pool);
      if (symbol && symbol === data.asset) {
        unique = false;
      }
    });

    return unique && !isSmallAmount;
  });
};

// TODO(Chris): merge duplicated functions from swap and pool utils
// TODO(Chris): Refactor utils

export const getPoolData = (
  from: string,
  poolDetail: PoolDetail,
  priceIndex: PriceDataIndex,
): PoolData => {
  const asset = from;
  const { symbol = '', ticker: target = '' } = getAssetFromString(
    poolDetail?.asset,
  );

  const runePrice = validBNOrZero(priceIndex?.RUNE);

  const poolPrice = validBNOrZero(priceIndex[target.toUpperCase()]);
  const poolPriceValue = `${poolPrice.toFixed(3)}`;

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
  const roiAT = Number((Number(roiATResult) * 100).toFixed(2));

  const poolROI12Data = poolDetail?.poolROI12 ?? 0;
  const poolROI12 = bn(poolROI12Data).multipliedBy(100);

  // poolFeeAverage * runePrice
  const liqFeeResult = bnOrZero(poolDetail?.poolFeeAverage).multipliedBy(
    runePrice,
  );
  const liqFee = baseAmount(liqFeeResult);

  const totalSwaps = Number(poolDetail?.swappingTxCount ?? 0);
  const totalStakers = Number(poolDetail?.stakersCount ?? 0);

  const depthValue = `${formatBaseAsTokenAmount(depth)}`;
  const volume24Value = `${formatBaseAsTokenAmount(volume24)}`;
  const transactionValue = `${formatBaseAsTokenAmount(transaction)}`;
  const liqFeeValue = `${formatBaseAsTokenAmount(liqFee)}`;
  const roiAtValue = `${roiAT}% APR`;

  return {
    pool: {
      asset,
      target,
    },
    asset,
    target,
    depth,
    volume24,
    volumeAT,
    transaction,
    liqFee,
    roiAT,
    poolROI12,
    totalSwaps,
    totalStakers,
    poolPrice,
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
      poolPrice: bn(0),
      depth: bn(0),
      share: 100,
    };
  }

  // formula: (runeAmount / tokenAmount) * runePrice)
  const poolPrice = tokenAmount.amount().isGreaterThan(0)
    ? runeAmount
        .amount()
        .div(tokenAmount.amount())
        .multipliedBy(runePrice)
    : bn(0);
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

    const memo = getStakeMemo(tokenSymbol);

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

    // Minimum amount to send memo on-chain
    const amount = 0.00000001;
    bncClient
      .transfer(wallet, poolAddress, amount, 'RUNE-A1F', memo)
      .then(response => resolve(response))
      // If first tx ^ fails (e.g. there is no RUNE available)
      // another tx w/ same memo will be sent, but by using BNB now
      .catch(() => {
        bncClient
          .transfer(wallet, poolAddress, amount, 'BNB', memo)
          .then(response => resolve(response))
          .catch(error => reject(error));
      });
  });
};

export const parseTransfer = (tx?: Pick<TransferEvent, 'data'>) => {
  const txHash = tx?.data?.H;
  const txMemo = tx?.data?.M;
  const txFrom = tx?.data?.f;
  const t = tx?.data?.t ?? [];
  const txTo = t[0]?.o;
  const c = t[0]?.c ?? [];
  const txAmount = c[0]?.A;
  const txToken = c[0]?.a;

  return {
    txHash,
    txMemo,
    txFrom,
    txTo,
    txToken,
    txAmount,
  };
};

export type WithdrawResultParams = {
  tx: TransferEvent;
  symbol: string;
  address: string;
};

export const withdrawResult = ({
  tx,
  symbol,
  address,
}: WithdrawResultParams) => {
  const { txToken, txTo } = parseTransfer(tx);

  const IS_IN_TX = address && txTo === address;
  const IS_WITHDRAW =
    IS_IN_TX && symbol.toLowerCase() === txToken.toLowerCase();

  return IS_WITHDRAW;
};
