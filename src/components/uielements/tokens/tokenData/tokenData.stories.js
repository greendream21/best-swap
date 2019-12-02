import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import TokenData from './tokenData';

storiesOf('Components/Tokens/TokenData', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '300px' }}
        >
          <TokenData asset="bnb" price={217.92} />
          <TokenData asset="bnb" assetValue={2.49274} price={217.92} />
          <TokenData asset="ftm" assetValue={2.49274} price={217.92} />
          <TokenData asset="rune" assetValue={2.49274} price={217.92} />
          <TokenData asset="ankr" assetValue={2.49274} price={217.92} />
          <TokenData asset="bolt" assetValue={2.49274} price={217.92} />
          <TokenData asset="tomo" assetValue={2.49274} price={217.92} />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
