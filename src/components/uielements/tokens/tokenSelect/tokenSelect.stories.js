import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../../AppStyle';
import { defaultTheme } from '../../../../settings';

import TokenSelect from './tokenSelect';

storiesOf('Components/Tokens/TokenSelect', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <div style={{ padding: '10px' }}>
          <TokenSelect
            asset="bnb"
            priceIndex={{ RUNE: 1 }}
            assetData={[
              {
                asset: 'rune',
                price: 100,
              },
              {
                asset: 'tomo',
                price: 100,
              },
            ]}
          />
        </div>
      </AppHolder>
    </ThemeProvider>
  );
});
