import React from 'react';
import { storiesOf } from '@storybook/react';

import TxLabel from './txLabel';
import { TxDetailsTypeEnum } from '../../../types/generated/midgard';

storiesOf('Components/Transaction/TxLabel', module).add('default', () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <TxLabel type={TxDetailsTypeEnum.Swap} />
      <TxLabel type={TxDetailsTypeEnum.Stake} />
      <TxLabel type={TxDetailsTypeEnum.Unstake} />
    </div>
  );
});
