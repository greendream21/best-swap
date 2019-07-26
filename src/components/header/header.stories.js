import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../AppStyle';
import { defaultTheme } from '../../settings';

import Header from './header';

storiesOf('Layout/Header', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <Header />
      </AppHolder>
    </ThemeProvider>
  );
});
