import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import PoolLoader from '.';

storiesOf('Utility/loaders/PoolList', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            width: '1000px',
          }}
        >
          <PoolLoader />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
