import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, number } from '@storybook/addon-knobs';

import TxProgress from '.';

storiesOf('Components/TxProgress', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    return (
      <TxProgress
        status={boolean('status', false)}
        value={number('value', 0)}
        maxValue={number('max value', 100)}
      />
    );
  });
