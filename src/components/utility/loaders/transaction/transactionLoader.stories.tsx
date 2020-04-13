import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import TransactionLoader from '.';

storiesOf('Utility/loaders/Transaction', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            width: '1000px',
          }}
        >
          <TransactionLoader />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
