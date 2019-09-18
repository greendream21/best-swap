export function getTokenName(assetName) {
  const [tokenName] = assetName.split('-');
  return tokenName;
}
