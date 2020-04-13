import { binance } from 'asgardex-common';

export declare global {
  interface Window {
    // TODO (Veado): Remove `windows.binance`
    // as soon as we know that Cypress does not need that anymore
    // Check `src/clients/binance.ts` for more information
    binance: binance.BinanceClient
  }
}
