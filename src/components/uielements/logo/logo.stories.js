import React from 'react';
import { storiesOf } from '@storybook/react';
import { radios } from '@storybook/addon-knobs';
import { ThemeProvider } from 'styled-components';
import { Row } from 'antd';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Logo from './logo';

storiesOf('Components/Logos', module)
  .add('default', () => {
    return (
      <ThemeProvider theme={defaultTheme}>
        <AppHolder>
          <Row>
            <Logo name="bepswap" type="normal" />
          </Row>
          <Row>
            <Logo name="bepswap" type="long" />
          </Row>
          <Row>
            <Logo name="bepswap" type="large" />
          </Row>
          <Row>
            <Logo name="thorchain" type="long" />
          </Row>
        </AppHolder>
      </ThemeProvider>
    );
  })
  .add('properties', () => {
    const nameOptions = ['bepswap', 'thorchain'];
    const typeOptions = ['normal', 'long', 'large'];

    const name = radios('name', nameOptions, 'bepswap');
    const type = radios('type', typeOptions, 'long');
    return (
      <Row>
        <Logo name={name} type={type} />
      </Row>
    );
  });
