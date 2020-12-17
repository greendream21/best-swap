import React from 'react';

import { storiesOf } from '@storybook/react';

import VerifyModal from './verifyModal';

storiesOf('Components/Modal/VerifyModal', module).add('normal', () => {
  return (
    <VerifyModal
      title="Slip Confirmation"
      description="Slip is high, Are you sure you want to continue?"
      verifyLevel="normal"
      onConfirm={() => console.log('confirm')}
      visible
    />
  );
}).add('strict', () => {
  return (
    <VerifyModal
      title="Slip Confirmation"
      description="Slip is very high, Please type COFIRM to continue."
      verifyLevel="high"
      onConfirm={() => console.log('confirm')}
      visible
    />
  );
});
