import React from 'react';

import { storiesOf } from '@storybook/react';
import { Row } from 'antd';

import WalletButton from './walletButton';

storiesOf('Components/Button/WalletButton', module).add('default', () => {
  return (
    <Row>
      <WalletButton />
      <WalletButton connected address="bnb12345645645645edf" />
    </Row>
  );
});
