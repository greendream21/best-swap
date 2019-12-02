import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import StepBar from './stepBar';

storiesOf('Components/StepBar', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div style={{ padding: '20px' }}>
          <StepBar />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
