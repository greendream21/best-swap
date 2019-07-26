import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import ViewHeader from './viewHeader';

storiesOf('Components/ViewHeader', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <ViewHeader title="This is title!" actionText="refresh" />
      </AppHolder>
    </ThemeProvider>
  );
});
