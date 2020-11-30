import React from 'react';

import { storiesOf } from '@storybook/react';
import { bn } from '@thorchain/asgardex-util';

import TokenInfo from './tokenInfo';

storiesOf('Components/Tokens/TokenInfo', module).add('default', () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
      <TokenInfo
        asset="rune"
        target="bnb"
        trend={bn(2.66)}
        value="$12000"
        label="Depth"
      />
    </div>
  );
});
