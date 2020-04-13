import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { bn } from '@thorchain/asgardex-util';
import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import CoinData from './coinData';

storiesOf('Components/Coins/CoinData', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '300px' }}
        >
          <CoinData asset="bnb" price={bn(217.92)} />
          <CoinData asset="bnb" assetValue={2.49274} price={bn(217.92)} />
          <CoinData asset="ftm" assetValue={2.49274} price={bn(217.92)} />
          <CoinData asset="rune" assetValue={2.49274} price={bn(217.92)} />
          <CoinData asset="ankr" assetValue={2.49274} price={bn(217.92)} />
          <CoinData asset="bolt" assetValue={2.49274} price={bn(217.92)} />
          <CoinData asset="tomo" assetValue={2.49274} price={bn(217.92)} />
          <CoinData
            asset="bnb"
            target="bolt"
            assetValue={2.49274}
            targetValue={0.49555}
            price={bn(217.92)}
          />
          <CoinData
            asset="bnb"
            target="bolt"
            assetValue={2.49274}
            targetValue={0.49555}
            price={bn(217.92)}
            size="big"
          />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
