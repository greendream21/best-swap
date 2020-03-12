import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import CoinButton from './coinButton';

storiesOf('Components/Coins/CoinButton', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <CoinButton cointype="bnb" focused />
        <CoinButton cointype="rune" />
        <CoinButton cointype="bolt" />
        <CoinButton cointype="ankr" />
        <CoinButton cointype="ftm" />
        <CoinButton cointype="tomo" />
      </AppHolder>
    </ThemeProvider>
  );
});
