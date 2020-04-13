import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import TokenInput from './tokenInput';
import { tokenAmount } from '../../../../helpers/tokenHelper';

storiesOf('Components/Tokens/TokenInput', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div style={{ padding: '20px' }}>
          <TokenInput
            title="swap amount"
            status="slip 2%"
            amount={tokenAmount(12345)}
            label="$usd 217.29"
            onChange={value => {
              console.log('value ', value.toString());
            }}
          />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
