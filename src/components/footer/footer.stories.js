import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../AppStyle';
import { defaultTheme } from '../../settings';

import Footer from './footer';

storiesOf('Layout/Footer', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <Footer />
      </AppHolder>
    </ThemeProvider>
  );
});
