import React from 'react';

import { storiesOf } from '@storybook/react';

import ConfirmIcon from './confirmIcon';

storiesOf('Components/ConfirmIcon', module).add('default', () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100px',
        height: '100px',
      }}
    >
      <ConfirmIcon />
    </div>
  );
});
