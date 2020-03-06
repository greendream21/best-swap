import React from 'react';

import { TxStatusWrapper, TxStatusContent, Seperator } from './txStatus.style';
import { Coin } from '../../../types/generated/midgard';

export type RoundValue = 'left' | 'right';

export type Props = {
  type: string;
  data: Coin[];
  round: RoundValue;
};

const TxStatus: React.FC<Props> = (props: Props): JSX.Element => {
  const { type, data, round } = props;

  return (
    <TxStatusWrapper className="txStatus-wrapper" round={round}>
      <p className="txStatus-type">{type}</p>
      {data.map((txDetail, index) => {
        const { asset, amount } = txDetail;

        return (
          <TxStatusContent className="tx-status-content" key={index}>
            <p className="txStatus-amount">{amount}</p>
            <p className="txStatus-asset">{asset}</p>
            {index < data.length - 1 ? <Seperator /> : ''}
          </TxStatusContent>
        );
      })}
    </TxStatusWrapper>
  );
};

export default TxStatus;
