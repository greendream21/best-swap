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
