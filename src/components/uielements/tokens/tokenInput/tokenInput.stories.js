import React from 'react';
import { storiesOf } from '@storybook/react';

import { tokenAmount } from '@thorchain/asgardex-token';
import TokenInput from './tokenInput';

storiesOf('Components/Tokens/TokenInput', module).add('default', () => {
  return (
    <div style={{ padding: '20px' }}>
      <TokenInput
        title="swap amount"
        status="slip 2%"
        amount={tokenAmount(12345)}
        label="$usd 217.29"
        onChange={value => {
          console.log('value ', value.toString());
        }}
      />
    </div>
  );
});
