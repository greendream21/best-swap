import { BinanceClient } from '@thorchain/asgardex-binance';

export declare global {
  // eslint-disable-next-line no-redeclare
  let $COMMIT_HASH: string;

  interface Window {
    // TODO (Veado): Remove `windows.binance`
    // as soon as we know that Cypress does not need that anymore
    // Check `src/clients/binance.ts` for more information
    binance: BinanceClient;
  }
}
