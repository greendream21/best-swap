import React from 'react';
import { storiesOf } from '@storybook/react';

import TokenSelect from './tokenSelect';
import { tokenAmount } from '../../../../helpers/tokenHelper';

storiesOf('Components/Tokens/TokenSelect', module).add('default', () => {
  return (
    <div style={{ padding: '10px' }}>
      <TokenSelect
        asset="bnb"
        price={tokenAmount(100)}
        priceIndex={{ RUNE: '111' }}
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
  );
});
