import React from 'react';

import { storiesOf } from '@storybook/react';
import { bn } from '@thorchain/asgardex-util';

import TokenCard from './tokenCard';

storiesOf('Components/Tokens/TokenCard', module).add('default', () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '800px' }}>
      <TokenCard
        title="You are swapping"
        inputTitle="swap amount"
        asset="bnb"
        assetData={[
          {
            asset: 'rune',
            price: 100,
          },
          {
            asset: 'tomo',
            price: 100,
          },
        ]}
        amount={bn(1.354)}
        price={bn(600)}
        withSelection
        priceIndex={{
          RUNE: 1,
        }}
      />
    </div>
  );
});
