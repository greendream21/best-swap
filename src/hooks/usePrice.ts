import { useMemo, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import * as RD from '@devexperts/remote-data-ts';
import {
  formatBaseAsTokenAmount,
  TokenAmount,
  tokenAmount,
  baseToToken,
  BaseAmount,
  baseAmount,
} from '@thorchain/asgardex-token';
import {
  bn,
  validBNOrZero,
  bnOrZero,
  BaseAmount as BA,
  baseAmount as ba,
  assetAmount as aa,
  assetToBase as a2b,
  getValueOfAsset1InAsset2,
  PoolData as PoolBalanceData,
  getValueOfAssetInRune,
  getValueOfRuneInAsset,
} from '@thorchain/asgardex-util';
import { BigNumber } from 'bignumber.js';

import { TransferFeesRD } from 'redux/binance/types';
import * as midgardActions from 'redux/midgard/actions';
import { getAssetFromString } from 'redux/midgard/utils';
import { RootState } from 'redux/store';

import {
  getShortAmount,
  getShortAssetAmount,
  getTickerFormat,
} from 'helpers/stringHelper';
import { bnbBaseAmount, getAssetDataFromBalance } from 'helpers/walletHelper';

import { RUNE_SYMBOL, BUSD_SYMBOL } from 'settings/assetData';

const usePrice = (feeType = 'single') => {
  const dispatch = useDispatch();

  const priceIndex = useSelector(
    (state: RootState) => state.Midgard.priceIndex,
  );
  const basePriceAsset = useSelector(
    (state: RootState) => state.Midgard.basePriceAsset,
  );
  const poolData = useSelector((state: RootState) => state.Midgard.poolData);

  const transferFees: TransferFeesRD = useSelector(
    (state: RootState) => state.Binance.transferFees,
  );
  const assetData = useSelector((state: RootState) => state.Wallet.assetData);
  const user = useSelector((state: RootState) => state.Wallet.user);

  const runePrice = useMemo(() => validBNOrZero(priceIndex[RUNE_SYMBOL]), [
    priceIndex,
  ]);
  const busdPriceInRune = useMemo(
    () => bnOrZero(poolData?.[BUSD_SYMBOL]?.price),
    [poolData],
  );
  const hasBUSDPrice = useMemo(() => !busdPriceInRune.isEqualTo(0), [
    busdPriceInRune,
  ]);

  const pricePrefix = useMemo(
    () =>
      basePriceAsset === BUSD_SYMBOL
        ? '$'
        : getTickerFormat(basePriceAsset).toUpperCase(),
    [basePriceAsset],
  );

  const reducedPricePrefix = useMemo(
    () => (basePriceAsset === BUSD_SYMBOL ? '$' : ''),
    [basePriceAsset],
  );

  const bnbWalletBalance = bnbBaseAmount(assetData);

  /** Users should keep minimum 0.1 amount of bnb at least for the fee */
  const minBnbBalance: BigNumber = bn(0.1);

  /**
   * BNB fee in BaseAmount
   * Returns 0 if fee is not available
   */
  const bnbFeeAmount: BaseAmount = useMemo(() => {
    const fees = RD.toNullable(transferFees);

    if (feeType === 'single') return fees?.single ?? baseAmount(0);
    return fees?.multi ?? baseAmount(0);
  }, [transferFees, feeType]);

  /**
   * threshold bnb amount available for transaction
   */
  const thresholdBnbAmount: TokenAmount = useMemo(() => {
    const bnbBalanceAmount = baseToToken(bnbWalletBalance)?.amount() ?? bn(0);
    const feeAsTokenAmount = baseToToken(bnbFeeAmount).amount();

    // reduce bnb fee amount
    const bnbAmountAfterFee = bnbBalanceAmount.minus(feeAsTokenAmount);

    // reduce minimum bnb amount in the balance
    const thresholdBnb = bnbAmountAfterFee.minus(minBnbBalance);

    return thresholdBnb.isGreaterThan(0)
      ? tokenAmount(thresholdBnb)
      : tokenAmount(0);
  }, [bnbFeeAmount, bnbWalletBalance, minBnbBalance]);

  /**
   * calculate the asset amount of 1 RUNE value
   * @param symbol asset symbol
   */
  const getRuneFeeAmount = (symbol: string): BigNumber => {
    const curTokenPrice = bn(priceIndex[symbol]);

    return runePrice.dividedBy(curTokenPrice);
  };

  /**
   * get asset amount after 1 RUNE Fee (for thorchain fee, not binance)
   * @param value asset amount
   * @param symbol asset symbol
   */
  const getAmountAfterRuneFee = (
    value: TokenAmount,
    symbol: string,
  ): TokenAmount => {
    const runeFee = getRuneFeeAmount(symbol);

    return value.amount().isGreaterThan(runeFee)
      ? tokenAmount(value.amount().minus(runeFee))
      : tokenAmount(0);
  };

  const hasSufficientRuneFee = (
    value: TokenAmount,
    symbol: string,
  ): boolean => {
    if (!symbol) return false;

    return bn(priceIndex[symbol])
      .dividedBy(runePrice)
      .multipliedBy(value.amount())
      .isGreaterThanOrEqualTo(1);
  };

  /**
   * Checks if fee is covered by amounts of BNB in the users wallet
   */
  const hasSufficientBnbFeeInBalance = useMemo((): boolean => {
    return (
      !!bnbWalletBalance &&
      !!bnbFeeAmount &&
      bnbWalletBalance.amount().isGreaterThan(bnbFeeAmount.amount())
    );
  }, [bnbWalletBalance, bnbFeeAmount]);

  /**
   * Checks if amount has sufficient BNB for tx fee
   */
  const hasSufficientBnbFee = (value: TokenAmount, symbol: string): boolean => {
    if (symbol.toUpperCase() !== 'BNB') return true;

    const feeAsTokenAmount = baseToToken(bnbFeeAmount).amount();

    return value.amount().isGreaterThan(feeAsTokenAmount);
  };

  /**
   * get token amount after bnb fee (subtract the fee for only bnb asset)
   * @param value input amount
   * @param symbol asset symbol
   */
  const getAmountAfterBnbFee = (
    value: TokenAmount,
    symbol: string,
  ): TokenAmount => {
    if (symbol.toUpperCase() !== 'BNB') return value;

    const feeAsTokenAmount = baseToToken(bnbFeeAmount).amount();
    const thresholdAmount = thresholdBnbAmount.amount();

    const amountAfterBnbFee = value.amount().minus(feeAsTokenAmount);

    if (amountAfterBnbFee.isLessThan(0)) {
      return tokenAmount(0);
    }

    // if user wallet is connected and send amount is greater than bnb threshold amount, send the MAX amount
    if (amountAfterBnbFee.isGreaterThan(thresholdAmount) && user?.wallet) {
      return tokenAmount(thresholdAmount);
    }

    return tokenAmount(amountAfterBnbFee);
  };

  /** used for swap only
   * return token amount after binance bnb fee and rune network fee
   * @param value input amount
   * @param symbol asset symbol
   */
  const getAmountAfterFee = (
    value: TokenAmount,
    symbol: string,
  ): TokenAmount => {
    let totalAmount = value.amount();

    // if BNB transfer, reduce bnb fee from the input amount
    if (symbol.toUpperCase() === 'BNB') {
      totalAmount = getAmountAfterBnbFee(value, symbol).amount();
    }

    return getAmountAfterRuneFee(tokenAmount(totalAmount), symbol);
  };

  /**
   * return maximum balance available in your wallet
   * @param symbol asset symbol
   */
  const getThresholdAmount = (symbol: string): TokenAmount => {
    if (symbol.toUpperCase() === 'BNB') {
      return thresholdBnbAmount;
    }
    const asset = getAssetDataFromBalance(assetData, symbol);

    const maxBalance = asset?.assetValue.amount() ?? bn(0);

    return tokenAmount(maxBalance);
  };

  const setBasePriceAsset = useCallback(
    (symbol: string) => {
      dispatch(midgardActions.setBasePriceAsset(symbol));
    },
    [dispatch],
  );

  // convert rune amount to the amount based in the selected asset
  const getPrice = useCallback(
    (value: BigNumber, decimal = 3) => {
      return formatBaseAsTokenAmount(
        baseAmount(value.multipliedBy(runePrice)),
        decimal,
      );
    },
    [runePrice],
  );

  // convert rune amount to the USD based amount
  const getUSDPrice = useCallback(
    (value: BigNumber, decimal = 3) => {
      if (!busdPriceInRune.isEqualTo(0)) {
        return formatBaseAsTokenAmount(
          baseAmount(value.dividedBy(busdPriceInRune)),
          decimal,
        );
      }
      return formatBaseAsTokenAmount(baseAmount(value), decimal);
    },
    [busdPriceInRune],
  );

  // get price amount and prefix
  const getPriceLabel = useCallback(
    (value: BigNumber) => {
      return `${pricePrefix} ${getPrice(value)}`;
    },
    [getPrice, pricePrefix],
  );

  // get price amount and prefix
  const getReducedPriceLabel = useCallback(
    (value: BigNumber, decimal = 3) => {
      return `${reducedPricePrefix}${getPrice(value, decimal)}`;
    },
    [getPrice, reducedPricePrefix],
  );

  // get usd based price amount and prefix, fall back to rune if busd pool doesnt exist
  const getUSDPriceLabel = useCallback(
    (value: BigNumber, decimal = 0) => {
      const prefix = !busdPriceInRune.isEqualTo(0) ? '$' : 'ᚱ';
      const valueInUSD = !busdPriceInRune.isEqualTo(0)
        ? getUSDPrice(value, decimal)
        : formatBaseAsTokenAmount(baseAmount(value), decimal);

      return `${prefix} ${valueInUSD}`;
    },
    [getUSDPrice, busdPriceInRune],
  );

  // convert rune price to usd price
  const convertPriceToUSD = useCallback(
    (price: BigNumber) => {
      const priceInUSD = !busdPriceInRune.isEqualTo(0)
        ? price.dividedBy(busdPriceInRune)
        : bn(0);

      return priceInUSD.toNumber().toFixed(3);
    },
    [busdPriceInRune],
  );

  // get rune price in usd with prefix
  const getPriceInUSD = useCallback(
    (price: BigNumber) => {
      return `$ ${convertPriceToUSD(price)}`;
    },
    [convertPriceToUSD],
  );

  /**
   * return pool balance data by pool asset
   */
  const getPoolBalanceDataByAsset = useCallback(
    (asset: string): PoolBalanceData => {
      const { symbol } = getAssetFromString(asset);
      if (symbol) {
        const poolDetail = poolData?.[symbol] ?? {};
        const runeDepth = ba(poolDetail?.runeDepth ?? 0);
        const assetDepth = ba(poolDetail?.assetDepth ?? 0);

        return {
          runeBalance: runeDepth,
          assetBalance: assetDepth,
        };
      }
      return {
        runeBalance: ba(0),
        assetBalance: ba(0),
      };
    },
    [poolData],
  );

  /**
   * get asset1 value based in asset2
   */
  const getAsset1ValueInAsset2 = useCallback(
    ({
      asset1,
      asset2,
      amount,
    }: {
      asset1: string;
      asset2: string;
      amount: BA;
    }): BA => {
      const asset1Balance = getPoolBalanceDataByAsset(asset1);
      const asset2Balance = getPoolBalanceDataByAsset(asset2);

      if (asset1 === RUNE_SYMBOL) {
        return getValueOfRuneInAsset(amount, asset2Balance);
      }
      if (asset2 === RUNE_SYMBOL) {
        return getValueOfAssetInRune(amount, asset1Balance);
      }

      return getValueOfAsset1InAsset2(amount, asset1Balance, asset2Balance);
    },
    [getPoolBalanceDataByAsset],
  );

  /**
   * get asset1 rate based in asset2
   */
  const getAsset1RateInAsset2 = useCallback(
    ({ asset1, asset2 }: { asset1: string; asset2: string }) => {
      const rate = getAsset1ValueInAsset2({
        asset1,
        asset2,
        amount: a2b(aa(1)),
      });

      const rateString = getShortAssetAmount(rate, 8);
      const asset1Ticker = getTickerFormat(asset1).toUpperCase();
      const asset2Ticker = getTickerFormat(asset2).toUpperCase();

      return `1 ${asset1Ticker} = ${rateString} ${asset2Ticker}`;
    },
    [getAsset1ValueInAsset2],
  );

  /**
   * get fee estimation based on the input and output
   */
  const getFeeEstimation = useCallback(
    ({
      asset1,
      amount1,
      asset2,
      amount2,
    }: {
      asset1: string;
      amount1: BA;
      asset2: string;
      amount2: BA;
    }) => {
      const asset1AmountInAsset2 = getAsset1ValueInAsset2({
        asset1,
        asset2,
        amount: ba(amount1.amount()),
      });

      // fee in asset2 = asset1 amount * rate - asset2 amount
      const feeInAsset2: BA = ba(
        asset1AmountInAsset2.amount().minus(amount2.amount()),
      );
      const feeInUSD = getAsset1ValueInAsset2({
        asset1: asset2,
        asset2: BUSD_SYMBOL,
        amount: feeInAsset2,
      });
      const feeInUSDValue = `${getShortAssetAmount(feeInAsset2)}`;

      const outputPercent = amount1.amount().isEqualTo(0)
        ? bn(0)
        : amount2.amount().dividedBy(asset1AmountInAsset2.amount());

      // fee percent = 1 - outputPercent
      const feePercent = amount2.amount().isEqualTo(0)
        ? bn(0)
        : bn(1).minus(outputPercent);
      const feePercentValue = `${getShortAmount(feePercent.multipliedBy(100), 2)}`;

      return {
        feeInUSD,
        feeInUSDValue,
        feePercent,
        feePercentValue,
      };
    },
    [getAsset1ValueInAsset2],
  );

  return {
    bnbFeeAmount,
    hasSufficientRuneFee,
    hasSufficientBnbFee,
    hasSufficientBnbFeeInBalance,
    getAmountAfterFee,
    getAmountAfterRuneFee,
    getAmountAfterBnbFee,
    getThresholdAmount,
    runePrice,
    busdPriceInRune,
    hasBUSDPrice,
    priceIndex,
    basePriceAsset,
    pricePrefix,
    reducedPricePrefix,
    getPriceLabel,
    getReducedPriceLabel,
    getUSDPriceLabel,
    getPrice,
    getUSDPrice,
    getPriceInUSD,
    convertPriceToUSD,
    setBasePriceAsset,
    getAsset1ValueInAsset2,
    getAsset1RateInAsset2,
    getFeeEstimation,
  };
};

export default usePrice;
