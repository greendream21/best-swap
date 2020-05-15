import React from 'react';
import { storiesOf } from '@storybook/react';

import SwapLoader from '.';

storiesOf('Utility/loaders/SwapList', module).add('default', () => {
  return (
    <div
      style={{
        width: '1000px',
      }}
    >
      <SwapLoader />
    </div>
  );
});
