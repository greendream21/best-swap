import React from 'react';
import { storiesOf } from '@storybook/react';
import { Input } from 'antd';

import FormGroup from './formGroup';

storiesOf('Components/FormGroup', module).add('default', () => {
  return (
    <FormGroup title="User Name" description="Input your username here!">
      <Input placeholder="username" />
    </FormGroup>
  );
});
