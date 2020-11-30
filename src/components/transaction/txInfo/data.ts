import {
  TxDetails,
  TxDetailsTypeEnum,
  TxDetailsStatusEnum,
} from 'types/generated/midgard';

export const txData1: TxDetails = {
  pool: 'BNB',
  type: TxDetailsTypeEnum.Stake,
  status: TxDetailsStatusEnum.Success,
  in: {
    txID: 'txid',
    memo: 'txmemo',
    address: 'walletaddr',
    coins: [
      {
        asset: 'RUNE',
        amount: '1.24',
      },
      {
        asset: 'BNB',
        amount: '2.56',
      },
    ],
  },
  out: [
    {
      txID: 'txid',
      memo: 'txmemo',
      address: 'walletaddr',
      coins: [
        {
          asset: 'BNB',
          amount: '2.56',
        },
      ],
    },
  ],
  date: 1550102400,
  gas: {
    asset: 'RUNE',
    amount: '1',
  },
  events: {
    fee: '1.234',
    stakeUnits: '100',
    slip: '0.3',
  },
};

export const txData2: TxDetails = {
  pool: 'BNB',
  type: TxDetailsTypeEnum.Swap,
  status: TxDetailsStatusEnum.Success,
  in: {
    txID: 'txid',
    memo: 'txmemo',
    address: 'walletaddr',
    coins: [
      {
        asset: 'RUNE',
        amount: '1.24',
      },
      {
        asset: 'BNB',
        amount: '12.34',
      },
    ],
  },
  out: [
    {
      txID: 'txid',
      memo: 'txmemo',
      address: 'walletaddr',
      coins: [
        {
          asset: 'RUNE',
          amount: '2.56',
        },
      ],
    },
  ],
  date: 1550102400,
  gas: {
    asset: 'RUNE',
    amount: '1',
  },
  events: {
    fee: '1.234',
    stakeUnits: '100',
    slip: '0.3',
  },
};

export const txData3: TxDetails = {
  pool: 'BNB',
  type: TxDetailsTypeEnum.Unstake,
  status: TxDetailsStatusEnum.Success,
  in: {
    txID: 'txid',
    memo: 'txmemo',
    address: 'walletaddr',
    coins: [
      {
        asset: 'RUNE',
        amount: '1.24',
      },
    ],
  },
  out: [
    {
      txID: 'txid',
      memo: 'txmemo',
      address: 'walletaddr',
      coins: [
        {
          asset: 'BNB',
          amount: '2.56',
        },
        {
          asset: 'BNB',
          amount: '3.56',
        },
      ],
    },
  ],
  date: 1550102400,
  gas: {
    asset: 'RUNE',
    amount: '1',
  },
  events: {
    fee: '1.234',
    stakeUnits: '100',
    slip: '0.3',
  },
};

export const txData4: TxDetails = {
  pool: 'BNB',
  type: TxDetailsTypeEnum.Stake,
  status: TxDetailsStatusEnum.Success,
  in: {
    txID: 'txid',
    memo: 'txmemo',
    address: 'walletaddr',
    coins: [
      {
        asset: 'RUNE',
        amount: '1.24',
      },
      {
        asset: 'BNB',
        amount: '2.56',
      },
    ],
  },
  out: [
    {
      txID: 'txid',
      memo: 'txmemo',
      address: 'walletaddr',
      coins: [
        {
          asset: 'BNB',
          amount: '2.56',
        },
      ],
    },
  ],
  date: 1550102400,
  gas: {
    asset: 'RUNE',
    amount: '1',
  },
  events: {
    fee: '1.234',
    stakeUnits: '100',
    slip: '0.3',
  },
};
