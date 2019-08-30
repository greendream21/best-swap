import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import ConnectionStatus from './connectionStatus';

storiesOf('Components/ConnectionStatus', module).add('default', () => {
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
          <ConnectionStatus color="red" />
          <ConnectionStatus color="yellow" />
          <ConnectionStatus color="green" />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
