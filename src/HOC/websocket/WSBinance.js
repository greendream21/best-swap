import { getWalletAddress } from '../../helpers/webStorageHelper';
import withWebsocket from './withWebsocket';

const BINANCE_WEBSOCKET_URI = 'wss://dex.binance.org/api/ws';

export const withBinanceWS = () => {
  const address = getWalletAddress();
  const url = `${BINANCE_WEBSOCKET_URI}/${address}`;

  return withWebsocket(url, 'binanceWS');
};
