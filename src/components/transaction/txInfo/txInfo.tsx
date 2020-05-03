import React from 'react';

import { bnOrZero, formatBN } from '@thorchain/asgardex-util';
import TxStatus from '../txStatus';
import { TxInfoWrapper, Seperator, Dash } from './txInfo.style';
import { TxDetails, TxDetailsTypeEnum } from '../../../types/generated/midgard';
import {
  formatBaseAsTokenAmount,
  baseAmount,
} from '../../../helpers/tokenHelper';

type Props = {
  data: TxDetails;
};

const TxInfo: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    data: { type, events, in: _in, out },
  } = props;

  // swap tx
  if (type === TxDetailsTypeEnum.Swap) {
    const inData = _in?.coins?.[0];
    const outData = out?.[0]?.coins?.[0];
    const fee = baseAmount(events?.fee);
    const feeLabel = `${formatBaseAsTokenAmount(fee)} RUNE`;
    const slipValue = bnOrZero(events?.slip).multipliedBy(100);
    const slipValueLabel = `${formatBN(slipValue)}%`;

    return (
      <TxInfoWrapper className="txInfo-wrapper swap-tx">
        <div className="txInfo-main-data">
          <TxStatus
            type="in"
            data={inData ? [inData] : []}
            txID={_in?.txID}
            round="left"
          />
          <Seperator />
          <TxStatus
            type="out"
            data={outData ? [outData] : []}
            txID={out?.[0]?.txID}
            round="right"
          />
        </div>
        <div className="txInfo-extra-data">
          <div className="tx-event-label left-margin">
            <p className="tx-event-title">FEE</p>
            <p className="tx-event-value">{feeLabel}</p>
          </div>
          <Dash />
          <div className="tx-event-label">
            <p className="tx-event-title">SLIP</p>
            <p className="tx-event-value">{slipValueLabel}</p>
          </div>
        </div>
      </TxInfoWrapper>
    );
  }

  // withdraw tx
  if (type === TxDetailsTypeEnum.Unstake) {
    const outData1 = out?.[0]?.coins?.[0];
    const outData2 = out?.[1]?.coins?.[0];
    const outData = outData1 && outData2 ? [outData1, outData2] : [];

    return (
      <TxInfoWrapper className="txInfo-wrapper withdraw-tx">
        <div className="txInfo-main-data">
          <TxStatus type="in" data={[]} round="left" />
          <Seperator />
          <TxStatus
            type="out"
            data={outData || []}
            txID={out?.[0]?.txID}
            round="right"
          />
        </div>
      </TxInfoWrapper>
    );
  }

  // stake tx
  if (type === TxDetailsTypeEnum.Stake) {
    const inData1 = _in?.coins?.[0];
    const inData2 = _in?.coins?.[1];
    const inData = inData1 && inData2 ? [inData1, inData2] : [];

    return (
      <TxInfoWrapper className="txInfo-wrapper stake-tx">
        <div className="txInfo-main-data">
          <TxStatus type="in" data={inData} txID={_in?.txID} round="left" />
          <Seperator />
          <TxStatus type="out" data={[]} round="right" />
        </div>
      </TxInfoWrapper>
    );
  }
  return <TxInfoWrapper className="txInfo-wrapper" />;
};

export default TxInfo;
