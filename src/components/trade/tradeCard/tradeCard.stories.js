import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';
import TradeCard from './tradeCard';

storiesOf('Components/TradeCard', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '940px' }}
        >
          <TradeCard
            asset="rune"
            target="tomo"
            depth={23000}
            poolPrice={1.2}
            marketPrice={1}
            premium={20}
            reward={230}
          />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
