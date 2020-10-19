import React from 'react';

import { baseToToken, baseAmount } from '@thorchain/asgardex-token';
import Label from '../../uielements/label';
import { TxStatusWrapper, TxStatusContent, Seperator } from './txStatus.style';

import { Coin } from '../../../types/generated/midgard';
import { getAssetFromString } from '../../../redux/midgard/utils';
import { getShortTokenAmount } from '../../../helpers/stringHelper';
import { BINANCE_TX_BASE_URL } from '../../../helpers/apiHelper';

export type RoundValue = 'left' | 'right';

export type Props = {
  type: string;
  data: Coin[];
  txID?: string;
  round: RoundValue;
};

const TxStatus: React.FC<Props> = (props: Props): JSX.Element => {
  const { type, data, round, txID } = props;
  const txURL = txID ? BINANCE_TX_BASE_URL + txID : '#';

  const renderTxStatus = () => {
    return (
      <TxStatusWrapper className="txStatus-wrapper" round={round}>
        <p className="txStatus-type">{type}</p>
        {data.map((txDetail: Coin, index) => {
          const { asset, amount } = txDetail;
          const { ticker: assetValue } = getAssetFromString(asset);
          const tokenAmount = baseToToken(baseAmount(amount));
          const amountValue = getShortTokenAmount(tokenAmount);

          return (

            <TxStatusContent className="tx-status-content" key={index}>
              <p className="txStatus-amount">{amountValue}</p>
              <p className="txStatus-asset">{assetValue}</p>
              {index < data.length - 1 ? <Seperator /> : ''}
            </TxStatusContent>
          );
        })}
        {!data.length && <Label color="gray">PENDING</Label>}
      </TxStatusWrapper>
    );
  };
  if (txID) {
    return (
      <a href={txURL} target="_blank" rel="noopener noreferrer">
        {renderTxStatus()}
      </a>
    );
  }
  return renderTxStatus();
};

export default TxStatus;
