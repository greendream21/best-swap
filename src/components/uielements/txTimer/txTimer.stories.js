import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import TxTimer from './txTimer';

storiesOf('Components/TxTimer', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <TxTimer />
      </AppHolder>
    </ThemeProvider>
  );
});
