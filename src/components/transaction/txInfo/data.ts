import {
  EventDetails,
  EventDetailsTypeEnum,
  EventDetailsStatusEnum,
} from '../../../types/generated/midgard';

export const txData1: EventDetails = {
  pool: 'BNB',
  type: EventDetailsTypeEnum.Stake,
  status: EventDetailsStatusEnum.Success,
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

export const txData2: EventDetails = {
  pool: 'BNB',
  type: EventDetailsTypeEnum.Swap,
  status: EventDetailsStatusEnum.Success,
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

export const txData3: EventDetails = {
  pool: 'BNB',
  type: EventDetailsTypeEnum.Unstake,
  status: EventDetailsStatusEnum.Success,
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

export const txData4: EventDetails = {
  pool: 'BNB',
  type: EventDetailsTypeEnum.Stake,
  status: EventDetailsStatusEnum.Success,
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
