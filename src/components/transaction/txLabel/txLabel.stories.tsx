import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';
import TxLabel from './txLabel';
import { EventDetailsTypeEnum } from '../../../types/generated/midgard';

storiesOf('Components/Transaction/TxLabel', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{ display: 'flex', flexDirection: 'column', padding: '20px' }}
        >
          <TxLabel type={EventDetailsTypeEnum.Swap} />
          <TxLabel type={EventDetailsTypeEnum.Stake} />
          <TxLabel type={EventDetailsTypeEnum.Unstake} />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
