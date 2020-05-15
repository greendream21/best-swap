import React from 'react';
import { storiesOf } from '@storybook/react';

import TransactionLoader from '.';

storiesOf('Utility/loaders/Transaction', module).add('default', () => {
  return (
    <div
      style={{
        width: '1000px',
      }}
    >
      <TransactionLoader />
    </div>
  );
});
