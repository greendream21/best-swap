import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import DynamicCoin from './dynamicCoin';

storiesOf('Components/Coins/DynamicCoin', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div style={{ display: 'flex' }}>
          <DynamicCoin type="bnb" size="big" />
          <DynamicCoin type="bolt" size="big" />
          <DynamicCoin type="rune" size="big" />
          <DynamicCoin type="ankr" size="big" />
          <DynamicCoin type="ftm" size="big" />
          <DynamicCoin type="tomo" size="big" />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
