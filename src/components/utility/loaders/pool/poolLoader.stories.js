import React from 'react';
import { storiesOf } from '@storybook/react';

import PoolLoader from '.';

storiesOf('Utility/loaders/PoolList', module).add('default', () => {
  return (
    <div
      style={{
        width: '1000px',
      }}
    >
      <PoolLoader />
    </div>
  );
});
