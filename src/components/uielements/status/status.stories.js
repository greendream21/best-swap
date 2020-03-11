import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Status from './status';

storiesOf('Components/Status', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <Status title="pool" value="bnb:bolt" />
        <Status loading />
        <Status title="pool2" value="bnb:bolt" direction="horizontal" />
        <Status loading direction="horizontal" />
      </AppHolder>
    </ThemeProvider>
  );
});
