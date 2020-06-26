export enum SwapSendView {
  DETAIL = 'detail',
  SEND = 'send',
}

export type TxResult = {
  type: string;
  amount: string;
  token: string;
};
