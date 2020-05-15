/* eslint-disable no-alert */
import React from 'react';
import { storiesOf } from '@storybook/react';

import Drag from './drag';

storiesOf('Components/Drag', module).add('default', () => {
  return (
    <div style={{ padding: '20px' }}>
      <Drag
        source="bnb"
        target="rune"
        title="Drag to swap"
        onConfirm={() => alert('confirmed!')}
      />

      <Drag
        source="blue"
        target="confirm"
        title="Drag to confirm"
        onConfirm={() => alert('confirmed!')}
      />
    </div>
  );
});
