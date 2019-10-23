import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import CoinPair from './coinPair';

storiesOf('Components/Coins/CoinPair', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div style={{ display: 'flex' }}>
          <CoinPair from="rune" to="bnb" size="small" />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
