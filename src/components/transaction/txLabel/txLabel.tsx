import React from 'react';

import {
  SwapOutlined,
  DoubleRightOutlined,
  ImportOutlined,
} from '@ant-design/icons';

import { TxDetailsTypeEnum } from 'types/generated/midgard';

import { TxLabelWrapper } from './txLabel.style';

type Props = {
  type?: TxDetailsTypeEnum;
};

const TxLabel: React.FC<Props> = (props: Props): JSX.Element => {
  const { type } = props;
  let label = '';
  let TxIcon = <SwapOutlined />;

  if (type === TxDetailsTypeEnum.Swap) {
    label = 'swap';
    TxIcon = <SwapOutlined />;
  }

  if (type === TxDetailsTypeEnum.DoubleSwap) {
    label = 'double swap';
    TxIcon = <SwapOutlined />;
  }

  if (type === TxDetailsTypeEnum.Unstake) {
    label = 'withdraw';
    TxIcon = <ImportOutlined />;
  }

  if (type === TxDetailsTypeEnum.Stake) {
    label = 'add liquidity';
    TxIcon = <DoubleRightOutlined />;
  }

  return (
    <TxLabelWrapper className="txLabel-wrapper">
      <p>{label}</p>
      <div className="tx-label-icon">{TxIcon}</div>
    </TxLabelWrapper>
  );
};

export default TxLabel;
