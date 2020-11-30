import React from 'react';

import { storiesOf } from '@storybook/react';

import { assetsData, stakeData } from './data';
import CoinList from './index';

storiesOf('Components/Coins/CoinList', module).add('default', () => {
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', width: '800px' }}>
        <div style={{ display: 'inline-block', width: '400px' }}>
          <CoinList
            data={assetsData}
            priceIndex={{
              RUNE: 1,
            }}
            selected={[assetsData[2], assetsData[3]]}
            onSelect={() => {}}
            style={{ height: '200px' }}
          />
        </div>
        <div style={{ display: 'block', width: '400px' }}>
          <CoinList
            data={stakeData}
            selected={[stakeData[1]]}
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
    </div>
  );
});
