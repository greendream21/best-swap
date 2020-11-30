import React from 'react';

import { storiesOf } from '@storybook/react';

import ViewHeader from './viewHeader';

storiesOf('Components/ViewHeader', module).add('default', () => {
  return <ViewHeader title="This is title!" actionText="refresh" />;
});
