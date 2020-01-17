export const getAssetIdFromPayload = payload => {
  const {
    asset: { chain, symbol },
  } = payload;

  if (chain && symbol) {
    return `${chain}.${symbol}`;
  }
  return null;
};

export const getAssetSymbolFromPayload = payload => {
  const {
    asset: { symbol },
  } = payload;

  if (symbol) {
    return symbol;
  }
  return null;
};

export const getBNBPoolAddress = poolAddressData => {
  const { current } = poolAddressData;

  if (current) {
    if (Array.isArray(current)) {
      const addressData = current.find(data => data.chain === 'BNB');

      if (addressData) {
        return addressData;
      }
    }
  }

  return null;
};

export const getPoolAddress = payload => {
  const bnbPoolAddress = getBNBPoolAddress(payload);

  if (bnbPoolAddress) {
    return bnbPoolAddress.address;
  }

  return null;
};

export const getAssetDataIndex = assetArray => {
  let assetDataIndex = {};

  assetArray.forEach(assetInfo => {
    const {
      asset: { symbol },
    } = assetInfo;

    if (symbol) {
      assetDataIndex = { ...assetDataIndex, [symbol]: assetInfo };
    }
  });

  return assetDataIndex;
};

export const getPriceIndex = (assetArray, baseTokenTicker) => {
  let baseTokenPrice = 1;
  if (baseTokenTicker.toLowerCase() === 'rune') {
    baseTokenPrice = 1;
  }

  const baseTokenInfo = assetArray.find(
    assetInfo => assetInfo.asset.ticker === baseTokenTicker.toUpperCase(),
  );
  baseTokenPrice = baseTokenInfo ? baseTokenInfo.priceRune : 1;

  let priceDataIndex = {
    RUNE: 1 / baseTokenPrice,
  };

  assetArray.forEach(assetInfo => {
    const {
      asset: { ticker },
      priceRune,
    } = assetInfo;

    let price = 0;
    if (priceRune && baseTokenPrice) {
      price = (1 / baseTokenPrice) * priceRune;
    }

    if (ticker) {
      priceDataIndex = { ...priceDataIndex, [ticker]: price };
    }
  });

  return priceDataIndex;
};
