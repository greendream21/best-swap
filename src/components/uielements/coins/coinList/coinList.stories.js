import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import CoinList from './coinList';
import { assetsData, stakeData } from './data';

storiesOf('Components/Coins/CoinList', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div style={{ display: 'flex', flexDirection: 'row', width: '800px' }}>
          <div style={{ display: 'inline-block', width: '400px' }}>
            <CoinList
              data={assetsData}
              value={2}
              priceIndex={{
                RUNE: 1,
              }}
              onSelect={() => {}}
              style={{ height: '200px' }}
            />
          </div>
          <div style={{ display: 'block', width: '400px' }}>
            <CoinList
              data={stakeData}
              selected={[1]}
              priceIndex={{
                RUNE: 1,
              }}
              onSelect={() => {}}
              style={{ height: '200px' }}
            />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '800px',
            marginTop: '20px',
          }}
        >
          <div style={{ display: 'inline-block', width: '400px' }}>
            <CoinList
              data={assetsData}
              size="big"
              priceIndex={{
                RUNE: 1,
              }}
              onSelect={() => {}}
              style={{ height: '200px' }}
            />
          </div>
          <div style={{ display: 'block', width: '400px' }}>
            <CoinList
              data={stakeData}
              size="big"
              priceIndex={{
                RUNE: 1,
              }}
              onSelect={() => {}}
              style={{ height: '200px' }}
            />
          </div>
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
