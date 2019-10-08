import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import SwapLoader from '.';

storiesOf('Utility/loaders/SwapList', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            width: '1000px',
          }}
        >
          <SwapLoader />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
