import React from 'react';
import { storiesOf } from '@storybook/react';

import ConnectionStatus from './connectionStatus';

storiesOf('Components/ConnectionStatus', module).add('default', () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
      }}
    >
      <ConnectionStatus color="red" />
      <ConnectionStatus color="yellow" />
      <ConnectionStatus color="green" />
    </div>
  );
});
