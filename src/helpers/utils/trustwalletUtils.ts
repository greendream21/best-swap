import { TokenAmount, BaseAmount } from '@thorchain/asgardex-token';
import { getSwapMemo, getWithdrawMemo, getStakeMemo } from '../memoHelper';

import { FixmeType } from '../../types/bepswap';

import { CHAIN_ID } from '../../env';

const NETWORK_ID = 714;
const RUNE = 'RUNE-B1A'; // RUNE symbol in the mainnet

type SendTrustSignedTxParams = {
  walletConnect: FixmeType;
  bncClient: FixmeType;
  walletAddress: string;
  sendOrder: FixmeType;
  memo: string
};

/**
 * Sign the Tx by trustwallet and send raw transaction using binance sdk
 * @param walletConnect wallet connect object
 * @param bncClient     binance client
 * @param walletAddress User wallet address
 * @param sendOrder     Order to be signed by trustwallet
 * @param memo          memo for tx
 */
export const sendTrustSignedTx = ({
  walletConnect,
  bncClient,
  walletAddress,
  sendOrder,
  memo = '',
}: SendTrustSignedTxParams) => {
  return new Promise((resolve, reject) => {
    if (walletConnect) {
      bncClient
        .getAccount(walletAddress)
        .then((response: FixmeType) => {
          const account = response.result;
          const tx: FixmeType = {
            accountNumber: account.account_number.toString(),
            chainId: CHAIN_ID,
            sequence: account.sequence.toString(),
            memo,
          };

          tx.send_order = sendOrder;

          walletConnect
            .trustSignTransaction(NETWORK_ID, tx)
            .then((result: FixmeType) => {
              bncClient
                .sendRawTransaction(result, true)
                .then((response: FixmeType) => {
                  resolve(response);
                })
                .catch((error: FixmeType) => {
                  reject(error);
                });
            })
            .catch((error: FixmeType) => reject(error));
        })
        .catch((error: FixmeType) => reject(error));
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    reject('wallet connect error');
  });
};

type WithdrawRequestParam = {
  walletConnect: FixmeType;
  bncClient: FixmeType;
  walletAddress: string;
  poolAddress: string;
  symbol: string;
  percent: number;
};

/**
 * Send Withdraw tx signed by trustwallet
 * @param walletConnect wallet connect object
 * @param bncClient     binance client
 * @param walletAddress User wallet address
 * @param poolAddress   RUNE, TOKEN Pool address
 * @param symbol        SYMBOL of token to withdraw
 * @param percent       Percentage of tokens to withdraw from the pool
 */
export const withdrawRequestUsingWalletConnect = ({
  walletConnect,
  bncClient,
  walletAddress,
  poolAddress,
  symbol,
  percent,
}: WithdrawRequestParam) => {
  // Minimum amount to send memo on-chain
  const runeAmount = 0.00000001;

  const memo = getWithdrawMemo(symbol, percent * 100);

  const sendOrder = {
    inputs: [
      {
        address: walletAddress,
        coins: [
          {
            denom: RUNE,
            amount: runeAmount,
          },
        ],
      },
    ],
    outputs: [
      {
        address: poolAddress,
        coins: [
          {
            denom: RUNE,
            amount: runeAmount,
          },
        ],
      },
    ],
  };

  return sendTrustSignedTx({
    walletConnect,
    bncClient,
    walletAddress,
    sendOrder,
    memo,
  });
};

type StakeRequestParam = {
  walletConnect: FixmeType;
  bncClient: FixmeType;
  walletAddress: string;
  runeAmount: TokenAmount;
  tokenAmount: TokenAmount;
  poolAddress: string;
  symbol: string;
};

/**
 * Send stake tx signed by trustwallet
 * @param walletConnect wallet connect object
 * @param bncClient     binance client
 * @param walletAddress User wallet address
 * @param runeAmount    RUNE Amount to stake
 * @param tokenAmount   TOKEN Amount to stake
 * @param poolAddress   RUNE, TOKEN Pool address
 * @param symbol        SYMBOL of token to stake
 */
export const stakeRequestUsingWalletConnect = ({
  walletConnect,
  bncClient,
  walletAddress,
  runeAmount,
  tokenAmount,
  poolAddress,
  symbol,
}: StakeRequestParam) => {
  const memo = getStakeMemo(symbol);

  const runeAmountNumber = runeAmount.amount().toNumber();
  const tokenAmountNumber = tokenAmount.amount().toNumber();

  const sendOrder = {
    inputs: [
      {
        address: walletAddress,
        coins: [
          {
            denom: RUNE,
            amount: runeAmountNumber,
          },
          {
            denom: symbol,
            amount: tokenAmountNumber,
          },
        ],
      },
    ],
    outputs: [
      {
        address: poolAddress,
        coins: [
          {
            denom: RUNE,
            amount: runeAmountNumber,
          },
          {
            denom: symbol,
            amount: tokenAmountNumber,
          },
        ],
      },
    ],
  };

  return sendTrustSignedTx({
    walletConnect,
    bncClient,
    walletAddress,
    sendOrder,
    memo,
  });
};

type SwapRequestParam = {
  walletConnect: FixmeType;
  bncClient: FixmeType;
  walletAddress: string;
  source: string,
  target: string,
  amount: TokenAmount;
  protectSlip: boolean;
  limit: BaseAmount;
  poolAddress: string;
  targetAddress: string;
};

/**
 * Send stake tx signed by trustwallet
 * @param walletConnect wallet connect object
 * @param bncClient     binance client
 * @param walletAddress User wallet address
 * @param source        symbol of source token
 * @param target        symbol of target token
 * @param amount        Token Amount to swap
 * @param protectSlip   slip protect value
 * @param limit         slip limit
 * @param poolAddress   RUNE, TOKEN Pool address
 * @param targetAddress target wallet address
 */
export const swapRequestUsingWalletConnect = ({
  walletConnect,
  bncClient,
  walletAddress,
  source,
  target,
  amount,
  protectSlip,
  limit,
  poolAddress,
  targetAddress = '',
}: SwapRequestParam) => {
  const limitValue = protectSlip && limit ? limit.amount().toString() : '';
  const memo = getSwapMemo(target, targetAddress, limitValue);
  const sourceAmount = amount.amount().toNumber();

  const sendOrder = {
    inputs: [
      {
        address: walletAddress,
        coins: [
          {
            denom: source,
            amount: sourceAmount,
          },
        ],
      },
    ],
    outputs: [
      {
        address: poolAddress,
        coins: [
          {
            denom: source,
            amount: sourceAmount,
          },
        ],
      },
    ],
  };

  return sendTrustSignedTx({
    walletConnect,
    bncClient,
    walletAddress,
    sendOrder,
    memo,
  });
};
