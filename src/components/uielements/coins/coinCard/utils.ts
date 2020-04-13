export function getTokenName(assetName: string): string {
  const [tokenName] = assetName.split('-');
  return tokenName;
}
