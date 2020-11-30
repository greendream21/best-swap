import React from 'react';

import { storiesOf } from '@storybook/react';

import Header from './header';

storiesOf('Layout/Header', module).add('default', () => {
  return <Header />;
});
