import { getWalletAddress } from '../../helpers/webStorageHelper';
import { withWebsocket } from './withWebsocket';

const BINANCE_TESTNET_WS_URI =
  process.env.REACT_APP_BINANCE_TESTNET_WS_URI ||
  'wss://testnet-dex.binance.org/api/ws';

export const withBinanceWS = component => {
  const address = getWalletAddress();
  const url = `${BINANCE_TESTNET_WS_URI}/${address}`;

  return withWebsocket(url, 'binanceWS')(component);
};

export const withBinanceTransferWS = component => {
  const address = getWalletAddress();
  const url = BINANCE_TESTNET_WS_URI;
  let websocket;

  return withWebsocket(url, 'wsTransfers', {
    onRef: wsClient => {
      websocket = wsClient;
    },
    onOpen: () => {
      websocket.send(
        JSON.stringify({ method: 'subscribe', topic: 'transfers', address }),
      );
    },
  })(component);
};
