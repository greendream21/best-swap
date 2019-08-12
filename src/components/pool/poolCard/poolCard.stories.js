import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';
import PoolCard from './poolCard';

storiesOf('Components/PoolCard', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '940px' }}
        >
          <PoolCard
            asset="rune"
            target="tomo"
            depth={234000}
            volumn={1000}
            transaction={100}
            liq={1}
            roi={10}
          />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
