import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import * as RD from '@devexperts/remote-data-ts';
import { bn, validBNOrZero } from '@thorchain/asgardex-util';
import {
  TokenAmount,
  tokenAmount,
  baseToToken,
  BaseAmount,
  baseAmount,
} from '@thorchain/asgardex-token';

import { TransferFeesRD } from '../redux/binance/types';

import { RootState } from '../redux/store';
import { RUNE_SYMBOL } from '../settings/assetData';
import {
  bnbBaseAmount,
  getAssetDataFromBalance,
} from '../helpers/walletHelper';

const useFee = (feeType = 'single') => {
  const priceIndex = useSelector(
    (state: RootState) => state.Midgard.priceIndex,
  );
  const transferFees: TransferFeesRD = useSelector(
    (state: RootState) => state.Binance.transferFees,
  );
  const assetData = useSelector((state: RootState) => state.Wallet.assetData);
  const user = useSelector((state: RootState) => state.Wallet.user);

  const runePrice = validBNOrZero(priceIndex[RUNE_SYMBOL]);

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

  return {
    bnbFeeAmount,
    hasSufficientRuneFee,
    hasSufficientBnbFee,
    hasSufficientBnbFeeInBalance,
    getAmountAfterFee,
    getAmountAfterRuneFee,
    getAmountAfterBnbFee,
    getThresholdAmount,
  };
};

export default useFee;
