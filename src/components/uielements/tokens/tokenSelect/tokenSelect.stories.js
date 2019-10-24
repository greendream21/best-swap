import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import TokenSelect from './tokenSelect';

storiesOf('Components/Utility/Sample', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <TokenSelect />
      </AppHolder>
    </ThemeProvider>
  );
});
