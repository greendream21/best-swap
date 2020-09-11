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
  const assets = useSelector((state: RootState) => state.Midgard.assets);

  const runePrice = validBNOrZero(priceIndex[RUNE_SYMBOL]);
  const busdPriceInRune = bnOrZero(assets?.[BUSD_SYMBOL]?.priceRune);

  const pricePrefix =
    basePriceAsset === BUSD_SYMBOL
      ? '$'
      : getTickerFormat(basePriceAsset).toUpperCase();

  const reducedPricePrefix = basePriceAsset === BUSD_SYMBOL ? '$' : '';

  const setBasePriceAsset = (symbol: string) => {
    dispatch(midgardActions.setBasePriceAsset(symbol));
  };

  // convert rune amount to the amount based in the selected asset
  const getPrice = (value: BigNumber) => {
    return formatBaseAsTokenAmount(
      baseAmount(value.multipliedBy(runePrice)),
      3,
    );
  };

  // convert rune amount to the USD based amount
  const getUSDPrice = (value: BigNumber) => {
    return formatBaseAsTokenAmount(
      baseAmount(value.dividedBy(busdPriceInRune)),
      3,
    );
  };

  // get price amount and prefix
  const getPriceLabel = (value: BigNumber) => {
    return `${pricePrefix} ${getPrice(value)}`;
  };

  // get price amount and prefix
  const getReducedPriceLabel = (value: BigNumber) => {
    return `${reducedPricePrefix}${getPrice(value)}`;
  };

  // get usd based price amount and prefix, fall back to rune if busd pool doesnt exist
  const getUSDPriceLabel = (value: BigNumber) => {
    const prefix = !busdPriceInRune.isEqualTo(0) ? '$' : 'ᚱ';
    const valueInUSD = !busdPriceInRune.isEqualTo(0)
      ? getUSDPrice(value)
      : value;

    return `${prefix} ${valueInUSD}`;
  };

  // convert rune price to usd price
  const convertPriceToUSD = (price: BigNumber) => {
    const priceInUSD = !busdPriceInRune.isEqualTo(0)
      ? price.dividedBy(busdPriceInRune)
      : bn(0);

    return priceInUSD.toNumber().toFixed(3);
  };

  // get rune price in usd with prefix
  const getPriceInUSD = (price: BigNumber) => {
    return `$ ${convertPriceToUSD(price)}`;
  };

  return {
    runePrice,
    busdPriceInRune,
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
