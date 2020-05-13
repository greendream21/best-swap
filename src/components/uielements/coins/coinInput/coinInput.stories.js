import React from 'react';
import { storiesOf } from '@storybook/react';

import CoinInput from './coinInput';

storiesOf('Components/Coins/CoinInput', module).add('default', () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
        background: 'gray',
      }}
    >
      <CoinInput
        title="Select token to swap:"
        asset="rune"
        amount={10000}
        price={0.04}
      />
      <CoinInput
        title="Select token to swap:"
        asset="rune"
        amount={10000}
        price={0.04}
        slip={1}
        reverse
      />
    </div>
  );
});
