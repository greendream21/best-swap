import bncClient from '@binance-chain/javascript-sdk';
import { NET, isTestnet } from '../env';
import {
  BncClient,
  Address,
  MultiTransfer,
  Market,
  Balance,
  TransferResult,
} from '../types/binance';
import { Maybe, Nothing } from '../types/bepswap';

/**
 * Interface for Binance client
 * Feel free to extend it with more methods if needed.
 */
export interface BinanceClient {
  getBalance(address: Address): Promise<Balance>;
  multiSend(
    address: Address,
    transactions: MultiTransfer[],
    memo?: string,
  ): Promise<TransferResult>;
  transfer(
    fromAddress: Address,
    toAddress: Address,
    amount: number,
    asset: string,
    memo?: string,
  ): Promise<TransferResult>;
}

class Binance implements BinanceClient {
  private baseURL: string;

  private explorerBaseURL: string;

  private net: string;

  private bncClient: Maybe<BncClient> = Nothing;

  constructor() {
    this.baseURL = isTestnet
      ? 'https://testnet-dex.binance.org'
      : 'https://dex.binance.org';
    this.explorerBaseURL = isTestnet
      ? 'https://testnet-explorer.binance.org'
      : 'https://explorer.binance.org';
    this.net = NET;
  }

  private initClient = async (): Promise<BncClient> => {
    const client = new bncClient(this.baseURL);
    client.chooseNetwork(this.net);
    await client.initChain();
    return client;
  };

  private getClient = async (): Promise<BncClient> => {
    // If a client has not been created yet,
    // a new client will be instantiated, but w/o using a private key
    // If you do need a private key to add, call `setPrivateKey` before
    if (!this.bncClient) {
      const client = await this.initClient();
      this.bncClient = client;
      return client;
    } else {
      return new Promise<BncClient>(resolve =>
        resolve(this.bncClient as BncClient),
      );
    }
  };

  /**
   * Sets a private key to the client
   */
  setPrivateKey = async (privateKey: string): Promise<BinanceClient> => {
    try {
      const client = await this.getClient();
      await client.setPrivateKey(privateKey);
      return this;
    } catch (error) {
      return error;
    }
  };

  /**
   * Removes a private key from client by creating a new client w/o a private key
   * We can not use the undocumented reference of `bncClient.privateKey` to remove key,
   * since `setPrivateKey` won't work anymore
   * There might be a better solution in the future: https://github.com/binance-chain/javascript-sdk/pull/254
   */
  removePrivateKey = async (): Promise<void> => {
    try {
      this.bncClient = await this.initClient();
    } catch (error) {
      return error;
    }
  }

  getBinanceUrl = (): string => this.baseURL;

  getExplorerUrl = (): string => this.explorerBaseURL;

  getPrefix = (): string => (isTestnet ? 'tbnb' : 'bnb');

  isValidAddress = async (address: Address) => {
    const client = await this.getClient();
    return client.checkAddress(address, this.getPrefix());
  };

  getBalance = async (address: Address): Promise<Balance> => {
    const client = await this.getClient();
    return client.getBalance(address);
  };

  getMarkets = async (limit = 1000, offset = 0): Promise<Market> => {
    const client = await this.getClient();
    return client.getMarkets(limit, offset);
  };


  multiSend = async (
    address: Address,
    transactions: MultiTransfer[],
    memo = '',
  ) => {
    const client = await this.getClient();
    const result = await client.multiSend(address, transactions, memo);
    await this.removePrivateKey();
    return result;
  };

  transfer = async (
    fromAddress: Address,
    toAddress: Address,
    amount: number, // TokenAmount
    asset: string,
    memo = '',
  ) => {
    const client = await this.getClient();
    const result = await client.transfer(fromAddress, toAddress, amount, asset, memo);
    await this.removePrivateKey();
    return result;
  };
}

const client = new Binance();
// NOTE (Rudi): cypress expects this here
// TODO (Veado): Check if it's still the case since we have `initClient` now.
window.binance = client;

export default client;
