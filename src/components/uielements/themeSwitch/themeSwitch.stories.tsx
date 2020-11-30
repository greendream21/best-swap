import React from 'react';

import { storiesOf } from '@storybook/react';
import { Row } from 'antd';

import ThemeSwitch from './themeSwitch';

storiesOf('Components/ThemeSwitch', module).add('default', () => {
  return (
    <Row>
      <ThemeSwitch />
    </Row>
  );
});
