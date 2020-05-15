import React from 'react';
import { storiesOf } from '@storybook/react';
import TxInfo from './txInfo';
import { txData1, txData2, txData3, txData4 } from './data';

storiesOf('Components/Transaction/TxInfo', module).add('default', () => {
  return (
    <div>
      <TxInfo data={txData1} />
      <TxInfo data={txData2} />
      <TxInfo data={txData3} />
      <TxInfo data={txData4} />
    </div>
  );
});
