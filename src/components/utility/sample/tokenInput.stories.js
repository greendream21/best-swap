import React from 'react';
import { storiesOf } from '@storybook/react';

import TokenInput from './tokenInput';

storiesOf('Components/Utility/Sample', module).add('default', () => {
  return <TokenInput />;
});
