import React from 'react';

import { storiesOf } from '@storybook/react';
import { Row } from 'antd';

import AddWallet from '.';

storiesOf('Components/AddWallet', module).add('default', () => {
  return (
    <Row>
      <AddWallet />
    </Row>
  );
});
