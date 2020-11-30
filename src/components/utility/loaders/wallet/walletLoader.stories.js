import React from 'react';

import { storiesOf } from '@storybook/react';

import { AssetLoader, StakeLoader } from '.';

storiesOf('Utility/loaders/Wallet', module)
  .add('Asset', () => {
    return (
      <div
        style={{
          width: '1000px',
        }}
      >
        <AssetLoader />
      </div>
    );
  })
  .add('Stake', () => {
    return (
      <div
        style={{
          width: '1000px',
        }}
      >
        <StakeLoader />
      </div>
    );
  });
