import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';

import TxView from './txView';

storiesOf('Components/TxView', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    return (
      <TxView
        status={boolean('status', false)}
        value={number('value', 0)}
        maxValue={number('max value', 100)}
      />
    );
  });
