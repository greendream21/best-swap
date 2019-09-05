export const WALLET_ADDRESS = 'WALLET_ADDRESS';
export const KEY_STORE = 'KEY_STORE';

export const saveWalletAddress = address => {
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
  return getWalletAddress() ? true : false;
};

export const saveKeystore = keystore => {
  sessionStorage.setItem(KEY_STORE, keystore);
};

export const getKeystore = () => {
  const keystore = sessionStorage.getItem(KEY_STORE);
  return keystore;
};

export const clearKeystore = () => {
  sessionStorage.removeItem(KEY_STORE);
};
