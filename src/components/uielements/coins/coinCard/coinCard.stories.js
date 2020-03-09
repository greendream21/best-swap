import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import CoinCard from './coinCard';

storiesOf('Components/Coins/CoinCard', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div style={{ display: 'flex', padding: '20px' }}>
          <CoinCard
            title="You are swapping"
            asset="bnb"
            assetData={[
              {
                asset: 'rune',
              },
              {
                asset: 'tomo',
              },
            ]} // AssetPair[]
            amount={1.354}
            price={600}
            priceIndex={{
              RUNE: 1,
            }}
            withSelection
          />
          <CoinCard
            title="You will receive"
            asset="bolt"
            amount={13549}
            price={596}
            slip={2}
          />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
