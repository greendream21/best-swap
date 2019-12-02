import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

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
          <Trend value={0.2} />
          <Trend value={-1.5} />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
