import React from 'react';
import { storiesOf } from '@storybook/react';

import TokenDetailLoader from '.';

storiesOf('Utility/loaders/TokenDetail', module).add('default', () => {
  return (
    <div
      style={{
        width: '400px',
      }}
    >
      <TokenDetailLoader />
    </div>
  );
});
