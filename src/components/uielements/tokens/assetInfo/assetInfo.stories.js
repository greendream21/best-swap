import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import AssetInfo from './assetInfo';

storiesOf('Components/Tokens/AssetInfo', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '300px' }}
        >
          <AssetInfo asset="bnb" />
          <AssetInfo asset="bnb" />
          <AssetInfo asset="ftm" />
          <AssetInfo asset="rune" />
          <AssetInfo asset="ankr" />
          <AssetInfo asset="bolt" />
          <AssetInfo asset="tomo" />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
