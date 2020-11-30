import React from 'react';

import { storiesOf } from '@storybook/react';

import CoinButton from './coinButton';

storiesOf('Components/Coins/CoinButton', module).add('default', () => {
  return (
    <div>
      <CoinButton cointype="bnb" focused />
      <CoinButton cointype="rune" />
      <CoinButton cointype="bolt" />
      <CoinButton cointype="ankr" />
      <CoinButton cointype="ftm" />
      <CoinButton cointype="tomo" />
    </div>
  );
});
