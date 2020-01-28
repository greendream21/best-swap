import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import LabelLoader from '.';

storiesOf('Utility/loaders/PoolStake', module).add('LabelLoader', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            width: '200px',
          }}
        >
          <LabelLoader />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
