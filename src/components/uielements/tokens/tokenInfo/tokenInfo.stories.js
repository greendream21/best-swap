import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { util } from 'asgardex-common';
import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import TokenInfo from './tokenInfo';

storiesOf('Components/Tokens/TokenInfo', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '300px' }}
        >
          <TokenInfo
            asset="rune"
            target="bnb"
            trend={util.bn(2.66)}
            value="$12000"
            label="Depth"
          />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
