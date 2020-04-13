import React from 'react';

import { TxStatusWrapper, TxStatusContent, Seperator } from './txStatus.style';
import { Coin } from '../../../types/generated/midgard';
import { getAssetFromString } from '../../../redux/midgard/utils';
import {
  formatBaseAsTokenAmount,
  baseAmount,
} from '../../../helpers/tokenHelper';
import { TESTNET_TX_BASE_URL } from '../../../helpers/apiHelper';

export type RoundValue = 'left' | 'right';

export type Props = {
  type: string;
  data: Coin[];
  txID?: string;
  round: RoundValue;
};

const TxStatus: React.FC<Props> = (props: Props): JSX.Element => {
  const { type, data, round, txID } = props;
  const txURL = txID ? TESTNET_TX_BASE_URL + txID : '#';

  return (
    <a href={txURL} target="_blank" rel="noopener noreferrer">
      <TxStatusWrapper className="txStatus-wrapper" round={round}>
        <p className="txStatus-type">{type}</p>
        {data.map((txDetail: Coin, index) => {
          const { asset, amount } = txDetail;
          const { ticker: assetValue } = getAssetFromString(asset);
          const amountValue = formatBaseAsTokenAmount(baseAmount(amount));

          return (
            <TxStatusContent className="tx-status-content" key={index}>
              <p className="txStatus-amount">{amountValue}</p>
              <p className="txStatus-asset">{assetValue}</p>
              {index < data.length - 1 ? <Seperator /> : ''}
            </TxStatusContent>
          );
        })}
      </TxStatusWrapper>
    </a>
  );
};

export default TxStatus;
