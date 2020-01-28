import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import TokenInfoLoader from '.';

storiesOf('Utility/loaders/PoolStake', module).add('TokenInfoLoader', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            width: '1000px',
          }}
        >
          <TokenInfoLoader />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
