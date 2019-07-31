import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, radios } from '@storybook/addon-knobs';
import { ThemeProvider } from 'styled-components';
import { Row } from 'antd';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Input from './input';

storiesOf('Components/Input', module)
  .add('default', () => {
    return (
      <ThemeProvider theme={defaultTheme}>
        <AppHolder>
          <Row
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '300px',
              height: '300px',
            }}
          >
            <Input color="primary" sizevalue="small" value="this is text!" />
            <Input color="primary" sizevalue="normal" value="this is text!" />
            <Input color="primary" sizevalue="big" value="this is text!" />
            <Input color="success" sizevalue="big" value="this is text!" />
            <Input color="warning" sizevalue="big" value="this is text!" />
            <Input color="error" sizevalue="big" value="this is text!" />
          </Row>
        </AppHolder>
      </ThemeProvider>
    );
  })
  .add('properties', () => {
    const inputText = text('Input Text', 'text');
    const sizeOptions = ['small', 'normal', 'big'];
    const colorOptions = ['primary', 'success', 'warning', 'error'];

    const size = radios('size', sizeOptions, 'normal');
    const color = radios('color', colorOptions, 'primary');
    return <Input color={color} sizevalue={size} value={inputText} />;
  });
