import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { util } from 'asgardex-common';
import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Trend from './trend';

storiesOf('Components/Trend', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
          }}
        >
          <Trend amount={util.bn(0.2)} />
          <Trend amount={util.bn(-1.5)} />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
