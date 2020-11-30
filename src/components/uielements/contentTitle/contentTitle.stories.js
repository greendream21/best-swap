import React from 'react';

import { storiesOf } from '@storybook/react';

import ContentTitle from './contentTitle';

storiesOf('Components/ContentTitle', module).add('default', () => {
  return <ContentTitle>you are swapping</ContentTitle>;
});
