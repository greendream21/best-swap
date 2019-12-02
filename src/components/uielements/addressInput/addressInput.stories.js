import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import AddressInput from './addressInput';

storiesOf('Components/AddressInput', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '500px',
          }}
        >
          <AddressInput />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
