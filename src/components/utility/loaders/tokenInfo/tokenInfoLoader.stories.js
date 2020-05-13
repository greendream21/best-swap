import React from 'react';
import { storiesOf } from '@storybook/react';

import TokenInfoLoader from '.';

storiesOf('Utility/loaders/PoolStake', module).add('TokenInfoLoader', () => {
  return (
    <div
      style={{
        width: '1000px',
      }}
    >
      <TokenInfoLoader />
    </div>
  );
});
