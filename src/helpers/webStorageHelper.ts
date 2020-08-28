import { ThemeType } from '@thorchain/asgardex-theme';

import { Maybe } from '../types/bepswap';
import { User, WalletType } from '../redux/wallet/types';

export const WALLET_ADDRESS = 'WALLET_ADDRESS';
export const KEY_STORE = 'KEY_STORE';
export const BASE_PRICE_ASSET = 'BASE_PRICE_ASSET';
export const THEME_TYPE = 'THEME_TYPE';
export const BETA_CONFIRM = 'BETA_CONFIRM';

export const BEPSWAP_WALLET = 'BEPSWAP_WALLET';

export const saveWallet = (user: User) => {
  sessionStorage.setItem(BEPSWAP_WALLET, JSON.stringify(user));
};

export const getWallet = (): Maybe<User> => {
  const userObj = sessionStorage.getItem(BEPSWAP_WALLET);

  if (userObj) {
    const user: User = JSON.parse(userObj);
    const walletType: WalletType = user?.type;
    if (walletType === 'keystore' && user?.keystore) {
      return {
        type: 'keystore',
        wallet: user.wallet,
        keystore: user.keystore,
      };
    }
  }

  // if wallet is invalid, reset the web storage
  clearWallet();

  return null;
};

export const clearWallet = () => {
  sessionStorage.removeItem(BEPSWAP_WALLET);
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
  return localStorage.getItem(THEME_TYPE) || ThemeType.LIGHT;
};

export const saveBetaConfirm = (hasConfirmed: boolean) => {
  localStorage.setItem(BETA_CONFIRM, JSON.stringify(hasConfirmed));
};

export const getBetaConfirm = () => {
  return JSON.parse(localStorage.getItem(BETA_CONFIRM) || 'false');
};
