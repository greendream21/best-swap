import React from 'react';
import { storiesOf } from '@storybook/react';

import LabelLoader from '.';

storiesOf('Utility/loaders/PoolStake', module).add('LabelLoader', () => {
  return (
    <div
      style={{
        width: '200px',
      }}
    >
      <LabelLoader />
    </div>
  );
});
