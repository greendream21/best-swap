import BigNumber from 'bignumber.js';
import {
  Address,
  TransferResult,
  MultiTransfer,
  WS,
} from '@thorchain/asgardex-binance';
import {
  bn,
  fixedBN,
  bnOrZero,
  validBNOrZero,
  isValidBN,
} from '@thorchain/asgardex-util';
import {
  TokenAmount,
  tokenToBase,
  baseAmount,
  formatBaseAsTokenAmount,
} from '@thorchain/asgardex-token';
import { AssetDetail } from '../../types/generated/midgard/api';
import { getStakeMemo, getWithdrawMemo } from '../memoHelper';
import { getTickerFormat } from '../stringHelper';
import { PoolDataMap, PriceDataIndex } from '../../redux/midgard/types';
import { PoolDetail } from '../../types/generated/midgard';
import { getAssetFromString } from '../../redux/midgard/utils';
import { AssetData } from '../../redux/wallet/types';
import { FixmeType, Maybe, Nothing } from '../../types/bepswap';
import { PoolData } from './types';
import { RUNE_SYMBOL } from '../../settings/assetData';

// TODO: Refactor pool utils

export const isAsymStakeValid = () => {
  return localStorage.getItem('ASYM') === 'true';
};

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

export const getAvailableTokensToCreate = (
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

// TODO(Chris): Refactor utils

/**
 * return pool detail data
 * @param symbol pool symbol
 * @param poolDetail pool detail values
 * @param priceIndex price index
 */
export const getPoolData = (
  symbol: string,
  poolDetail: PoolDetail,
  assetDetail: AssetDetail,
  priceIndex: PriceDataIndex,
): PoolData => {
  const asset = 'RUNE';
  const target = getTickerFormat(symbol).toUpperCase();

  const runePrice = validBNOrZero(priceIndex[RUNE_SYMBOL]);

  const poolPrice = validBNOrZero(priceIndex[symbol.toUpperCase()]);
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

  // ROI (Return To Date)
  const roiATResult = Number(poolDetail?.poolROI ?? 0);
  const roi = Number((roiATResult * 100).toFixed(2));

  // APY (Annual Percent Yield)
  // Formula: poolROI / ((now - pool.genesis) / (seconds per day)) * 365
  const poolGenesis = assetDetail?.dateCreated ?? 0;
  const pastDays = (Date.now() / 1000 - poolGenesis) / (24 * 60 * 60);
  const apy = poolGenesis
    ? Number(((roiATResult / pastDays) * 365 * 100).toFixed(2))
    : 0;

  const poolROI12Data = poolDetail?.poolROI12 ?? 0;
  const poolROI12 = bn(poolROI12Data).multipliedBy(100);

  // poolFeeAverage * runePrice
  const liqFeeResult = bnOrZero(poolDetail?.poolFeeAverage).multipliedBy(
    runePrice,
  );
  const liqFee = baseAmount(liqFeeResult);

  const totalSwaps = Number(poolDetail?.swappingTxCount ?? 0);
  const totalStakers = Number(poolDetail?.stakersCount ?? 0);

  const runeStakedTotal = baseAmount(bnOrZero(poolDetail?.runeStakedTotal));
  const runeStakedTotalValue = `${formatBaseAsTokenAmount(runeStakedTotal)}`;

  const depthValue = `${formatBaseAsTokenAmount(depth)}`;
  const volume24Value = `${formatBaseAsTokenAmount(volume24)}`;
  const transactionValue = `${formatBaseAsTokenAmount(transaction)}`;
  const liqFeeValue = `${formatBaseAsTokenAmount(liqFee)}`;
  const roiValue = `${roi}% ROI`;
  const apyValue = `${apy}% APY`;

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
    roi,
    apy,
    poolROI12,
    totalSwaps,
    totalStakers,
    runeStakedTotal,
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
      roi: roiValue,
      apy: apyValue,
      runeStakedTotal: runeStakedTotalValue,
      poolPrice: poolPriceValue,
    },
  };
};

export enum StakeErrorMsg {
  MISSING_SYMBOL = 'Missing asset to stake.',
  MISSING_POOL_ADDRESS = 'Missing Pool Address.',
  INVALID_TOKEN_AMOUNT = 'Invalid TOKEN amount.',
  INVALID_RUNE_AMOUNT = 'Invalid RUNE amount.',
}

export type StakeRequestParams = {
  bncClient: FixmeType;
  wallet: Address;
  runeAmount: TokenAmount;
  tokenAmount: TokenAmount;
  poolAddress: Maybe<string>;
  symbolTo: Maybe<string>;
};

export const stakeRequest = (
  params: StakeRequestParams,
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
              denom: RUNE_SYMBOL,
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
        .transfer(wallet, poolAddress, runeAmountNumber, RUNE_SYMBOL, memo)
        .then((response: TransferResult) => resolve(response))
        .catch((error: Error) => reject(error));
    }
  });
};

export enum CreatePoolErrorMsg {
  MISSING_WALLET = 'Wallet address is missing or invalid.',
  INVALID_TOKEN_AMOUNT = 'Token amount is invalid.',
  INVALID_RUNE_AMOUNT = 'Rune amount is invalid.',
  MISSING_POOL_ADDRESS = 'Pool address is missing.',
  MISSING_TOKEN_SYMBOL = 'Missing asset to create a new pool.',
}

type CreatePoolRequestParams = {
  bncClient: FixmeType;
  wallet: string;
  runeAmount: TokenAmount;
  tokenAmount: TokenAmount;
  poolAddress: Maybe<string>;
  tokenSymbol?: string;
};

export const createPoolRequest = (
  params: CreatePoolRequestParams,
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
            denom: RUNE_SYMBOL,
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
      .then((response: TransferResult) => resolve(response))
      .catch((error: Error) => reject(error));
  });
};

export enum WithdrawErrorMsg {
  MISSING_WALLET = 'Wallet address is missing or invalid.',
  MISSING_POOL_ADDRESS = 'Pool address is missing.',
}

type WithdrawParams = {
  bncClient: FixmeType;
  wallet: string;
  poolAddress: Maybe<string>;
  symbol: string;
  percent: number;
};
export const withdrawRequest = (
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
      .transfer(wallet, poolAddress, amount, RUNE_SYMBOL, memo)
      .then((response: TransferResult) => resolve(response))
      // If first tx ^ fails (e.g. there is no RUNE available)
      // another tx w/ same memo will be sent, but by using BNB now
      .catch(() => {
        bncClient
          .transfer(wallet, poolAddress, amount, 'BNB', memo)
          .then((response: TransferResult) => resolve(response))
          .catch((error: Error) => reject(error));
      });
  });
};

export const parseTransfer = (tx?: Pick<WS.TransferEvent, 'data'>) => {
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
  tx: WS.TransferEvent;
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
