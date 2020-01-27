import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import TokenDetailLoader from '.';

storiesOf('Utility/loaders/TokenDetail', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            width: '400px',
          }}
        >
          <TokenDetailLoader />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
