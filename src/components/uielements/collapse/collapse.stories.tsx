import React from 'react';
import { storiesOf } from '@storybook/react';

import Collapse from './collapse';
import { faqs } from './data';

storiesOf('Components/Collapse', module).add('default', () => {
  return <Collapse data={faqs} />;
});
