import { TokenAmount } from '@thorchain/asgardex-token';
import { FixmeType } from '../../types/bepswap';

import { CHAIN_ID } from '../../env';

const NETWORK_ID = 714;
const RUNE = 'RUNE-B1A';

type StakeRequestParam = {
  walletConnect: FixmeType;
  bncClient: FixmeType;
  walletAddress: string;
  runeAmount: TokenAmount;
  tokenAmount: TokenAmount;
  poolAddress: string;
  symbol: string;
};

export const stakeRequestUsingWalletConnect = ({
  walletConnect,
  bncClient,
  walletAddress,
  runeAmount,
  tokenAmount,
  poolAddress,
  symbol,
}: StakeRequestParam) => {
  return new Promise((resolve, reject) => {
    if (walletConnect) {
      bncClient
        .getAccount(walletAddress)
        .then((response: FixmeType) => {
          const account = response.result;
          console.log('AccountInfo:', account);
          const tx: FixmeType = {
            accountNumber: account.account_number.toString(),
            chainId: CHAIN_ID,
            sequence: account.sequence.toString(),
          };

          const runeAmountNumber = runeAmount.amount().toNumber();
          const tokenAmountNumber = tokenAmount.amount().toNumber();

          tx.send_order = {
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

          walletConnect
            .trustSignTransaction(NETWORK_ID, tx)
            .then((result: FixmeType) => {
              console.log('Successfully signed stake tx msg:', result);
              bncClient
                .sendRawTransaction(result, true)
                .then((response: FixmeType) => {
                  console.log('Response', response);
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
