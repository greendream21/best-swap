import { getWalletAddress } from '../../helpers/webStorageHelper';
import withWebsocket from './withWebsocket';

const BINANCE_MAINNET_WS_URI = process.env.BINANCE_MAINNET_WS_URI;

export const withBinanceWS = () => {
  const address = getWalletAddress();
  const url = `${BINANCE_MAINNET_WS_URI}/${address}`;

  return withWebsocket(url, 'binanceWS');
};
