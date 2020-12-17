import React from 'react';

import { storiesOf } from '@storybook/react';

import SlipVerifyModal from './slipVerifyModal';

storiesOf('Components/Modal/SlipVerifyModal', module).add('normal', () => {
  return (
    <SlipVerifyModal
      slipPercent={7}
      onConfirm={() => console.log('confirm')}
      visible
    />
  );
}).add('strict', () => {
  return (
    <SlipVerifyModal
      slipPercent={17}
      onConfirm={() => console.log('confirm')}
      visible
    />
  );
});
