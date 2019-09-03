import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import ConfirmIcon from './confirmIcon';

storiesOf('Components/ConfirmIcon', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100px',
            height: '100px',
          }}
        >
          <ConfirmIcon />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
