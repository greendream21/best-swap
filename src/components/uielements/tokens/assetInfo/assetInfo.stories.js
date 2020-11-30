import React from 'react';

import { storiesOf } from '@storybook/react';

import AssetInfo from './assetInfo';

storiesOf('Components/Tokens/AssetInfo', module).add('default', () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
      <AssetInfo asset="bnb" />
      <AssetInfo asset="bnb" />
      <AssetInfo asset="ftm" />
      <AssetInfo asset="rune" />
      <AssetInfo asset="ankr" />
      <AssetInfo asset="bolt" />
      <AssetInfo asset="tomo" />
    </div>
  );
});
