import React from 'react';

import { SwapIcon, StakeIcon, WithdrawIcon } from '../../icons/txIcons';
import { TxLabelWrapper } from './txLabel.style';
import { EventDetailsTypeEnum } from '../../../types/generated/midgard';

type Props = {
  type?: EventDetailsTypeEnum;
};

const TxLabel: React.FC<Props> = (props: Props): JSX.Element => {
  const { type } = props;
  let label = '';
  let TxIcon = SwapIcon;

  if (type === EventDetailsTypeEnum.Swap) {
    label = 'swap';
    TxIcon = SwapIcon;
  }

  if (type === EventDetailsTypeEnum.Unstake) {
    label = 'withdraw';
    TxIcon = WithdrawIcon;
  }

  if (type === EventDetailsTypeEnum.Stake) {
    label = 'stake';
    TxIcon = StakeIcon;
  }

  return (
    <TxLabelWrapper className="txLabel-wrapper">
      <p>{label}</p>
      <div className="tx-label-icon">
        <TxIcon />
      </div>
    </TxLabelWrapper>
  );
};

export default TxLabel;
