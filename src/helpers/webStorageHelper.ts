import { FixmeType } from '../types/bepswap';
import { LIGHT_THEME } from '../settings/themes';

export const WALLET_ADDRESS = 'WALLET_ADDRESS';
export const KEY_STORE = 'KEY_STORE';
export const BASE_PRICE_ASSET = 'BASE_PRICE_ASSET';
export const THEME_TYPE = 'THEME_TYPE';

export const saveWalletAddress = (address: string) => {
  sessionStorage.setItem(WALLET_ADDRESS, address);
};

export const getWalletAddress = () => {
  const address = sessionStorage.getItem(WALLET_ADDRESS);
  return address;
};

export const clearWalletAddress = () => {
  sessionStorage.removeItem(WALLET_ADDRESS);
};

export const isUserExist = () => {
  return !!getWalletAddress();
};

export const saveKeystore = (keystore: FixmeType): FixmeType => {
  if (keystore) {
    sessionStorage.setItem(KEY_STORE, JSON.stringify(keystore));
  }
};

export const getKeystore = () => {
  const keystoreStr = sessionStorage.getItem(KEY_STORE) || '{}';
  return JSON.parse(keystoreStr);
};

export const clearKeystore = () => {
  sessionStorage.removeItem(KEY_STORE);
};

export const saveBasePriceAsset = (asset: string) => {
  sessionStorage.setItem(BASE_PRICE_ASSET, asset);
};

export const getBasePriceAsset = () => {
  return sessionStorage.getItem(BASE_PRICE_ASSET);
};

export const saveTheme = (themeType: string) => {
  localStorage.setItem(THEME_TYPE, themeType);
};

export const getTheme = () => {
  return localStorage.getItem(THEME_TYPE) || LIGHT_THEME;
};
