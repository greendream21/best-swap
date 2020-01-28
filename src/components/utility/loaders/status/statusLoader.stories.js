import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import StatusLoader from '.';

storiesOf('Utility/loaders/PoolStake', module).add('StatusLoader', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            width: '200px',
          }}
        >
          <StatusLoader />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
