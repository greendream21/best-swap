import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import Coin from './coin';

storiesOf('Components/Coins/Coin', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div style={{ display: 'flex' }}>
          <Coin type="bnb" size="small" />
          <Coin type="bolt" size="small" />
          <Coin type="rune" size="small" />
          <Coin type="ankr" size="small" />
          <Coin type="ftm" size="small" />
          <Coin type="tomo" size="small" />
        </div>
        <div style={{ display: 'flex' }}>
          <Coin type="bnb" size="big" />
          <Coin type="bolt" size="big" />
          <Coin type="rune" size="big" />
          <Coin type="ankr" size="big" />
          <Coin type="ftm" size="big" />
          <Coin type="tomo" size="big" />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
