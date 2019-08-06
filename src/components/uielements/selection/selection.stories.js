import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Selection from './selection';

storiesOf('Components/Selection', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <Selection onSelect={() => {}} />
        <Selection onSelect={() => {}} />
      </AppHolder>
    </ThemeProvider>
  );
});
