export const getAssetIdFromPayload = payload => {
  const {
    asset: { chain, symbol },
  } = payload;

  if (chain && symbol) {
    return `${chain}.${symbol}`;
  }
  return null;
};
