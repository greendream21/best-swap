import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';
import { Input } from 'antd';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import FormGroup from './formGroup';

storiesOf('Components/FormGroup', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <FormGroup title="User Name" description="Input your username here!">
          <Input placeholder="username" />
        </FormGroup>
      </AppHolder>
    </ThemeProvider>
  );
});
