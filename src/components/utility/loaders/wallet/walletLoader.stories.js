import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import { AssetLoader, StakeLoader } from '.';

storiesOf('Utility/loaders/Wallet', module)
  .add('Asset', () => {
    return (
      <ThemeProvider theme={defaultTheme}>
        <AppHolder>
          <div
            style={{
              width: '1000px',
            }}
          >
            <AssetLoader />
          </div>
        </AppHolder>
      </ThemeProvider>
    );
  })
  .add('Stake', () => {
    return (
      <ThemeProvider theme={defaultTheme}>
        <AppHolder>
          <div
            style={{
              width: '1000px',
            }}
          >
            <StakeLoader />
          </div>
        </AppHolder>
      </ThemeProvider>
    );
  });
