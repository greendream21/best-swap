import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';
import SwapCard from './swapCard';

storiesOf('Components/SwapCard', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '940px' }}
        >
          <SwapCard
            asset="bnb"
            target="bolt"
            depth={234.0}
            volumn={340.0}
            transaction={1234}
            slip={0.2}
            trade={2345}
          />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
