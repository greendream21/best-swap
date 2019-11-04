import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

// import TokenInput from './tokenInput';

storiesOf('Components/Utility/Sample', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>{/* <TokenInput /> */}</AppHolder>
    </ThemeProvider>
  );
});
