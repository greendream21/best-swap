import React from 'react';

import { storiesOf } from '@storybook/react';

import AddIcon from './addIcon';

storiesOf('Components/AddIcon', module).add('default', () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
      }}
    >
      <AddIcon />
    </div>
  );
});
