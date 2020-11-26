import { useMemo, useCallback } from 'react';

import { BigNumber } from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import { bn, validBNOrZero, bnOrZero } from '@thorchain/asgardex-util';
import { formatBaseAsTokenAmount, baseAmount } from '@thorchain/asgardex-token';

import { RootState } from '../redux/store';
import * as midgardActions from '../redux/midgard/actions';

import { getTickerFormat } from '../helpers/stringHelper';
import { RUNE_SYMBOL, BUSD_SYMBOL } from '../settings/assetData';

const usePrice = () => {
  const dispatch = useDispatch();

  const priceIndex = useSelector(
    (state: RootState) => state.Midgard.priceIndex,
  );
  const basePriceAsset = useSelector(
    (state: RootState) => state.Midgard.basePriceAsset,
  );
  const poolData = useSelector((state: RootState) => state.Midgard.poolData);

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

  return {
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
  };
};

export default usePrice;
