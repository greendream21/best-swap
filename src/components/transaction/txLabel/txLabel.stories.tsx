import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';
import TxLabel from './txLabel';
import { TxDetailsTypeEnum } from '../../../types/generated/midgard';

storiesOf('Components/Transaction/TxLabel', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}
        >
          <TxLabel type={TxDetailsTypeEnum.Swap} />
          <TxLabel type={TxDetailsTypeEnum.Stake} />
          <TxLabel type={TxDetailsTypeEnum.Unstake} />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
