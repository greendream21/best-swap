import { TransferResult } from '@thorchain/asgardex-binance';
import { TokenAmount } from '@thorchain/asgardex-token';
import { isValidBN } from '@thorchain/asgardex-util';

import { FixmeType, Nothing, Maybe } from 'types/bepswap';

export enum SwapErrorMsg {
  INVALID_SYMBOL = 'Send asset is invalid.',
  INVALID_AMOUNT = 'Send amount is invalid.',
  MISSING_WALLET = 'Wallet address is missing or invalid.',
  MISSING_DEST_ADDRESS = 'Recipient Address is invalid.',
}

export const validateTx = ({
  sourceSymbol,
  amount,
  fromAddress,
  toAddress,
}: {
  sourceSymbol: string;
  amount: TokenAmount;
  fromAddress: string;
  toAddress: string;
}): Maybe<SwapErrorMsg> => {
  if (!sourceSymbol) {
    return SwapErrorMsg.INVALID_SYMBOL;
  }
  if (!fromAddress) {
    return SwapErrorMsg.MISSING_WALLET;
  }
  if (!toAddress) {
    return SwapErrorMsg.MISSING_DEST_ADDRESS;
  }

  const amountValue = amount.amount();
  // amount can't be NaN or an INFITIY number
  // The latter check is needed for Binance API, which accepts numbers only
  const validAmount =
    isValidBN(amountValue) &&
    amountValue.isGreaterThan(0) &&
    amountValue.isFinite();
  // validate values - needed for single swap and double swap
  if (!validAmount) {
    return SwapErrorMsg.INVALID_AMOUNT;
  }
  return Nothing;
};

export const normalTx = ({
  bncClient,
  sourceSymbol,
  amount,
  fromAddress,
  toAddress,
  memo = '',
}: {
  bncClient: FixmeType;
  sourceSymbol: string;
  amount: TokenAmount;
  fromAddress: string;
  toAddress: string;
  memo?: string;
}): Promise<TransferResult> => {
  return new Promise((resolve, reject) => {
    const validationErrorMsg = validateTx({
      sourceSymbol,
      amount,
      fromAddress,
      toAddress,
    });

    if (validationErrorMsg) {
      return reject(new Error(validationErrorMsg));
    }

    const amountNumber = amount.amount().toNumber();

    bncClient
      .transfer(fromAddress, toAddress, amountNumber, sourceSymbol, memo)
      .then((response: TransferResult) => resolve(response))
      .catch((error: Error) => reject(error));
  });
};
