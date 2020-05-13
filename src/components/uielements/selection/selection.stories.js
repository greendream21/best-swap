import React from 'react';
import { storiesOf } from '@storybook/react';

import Selection from './selection';

storiesOf('Components/Selection', module).add('default', () => {
  return (
    <div>
      <Selection onSelect={() => {}} />
      <Selection onSelect={() => {}} />
    </div>
  );
});
