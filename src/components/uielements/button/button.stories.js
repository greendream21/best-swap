import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, radios } from '@storybook/addon-knobs';
import { ThemeProvider } from 'styled-components';
import { Row, Icon } from 'antd';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Button from './button';
import './button.stories.scss';

storiesOf('Components/Button', module)
  .add('default', () => {
    return (
      <ThemeProvider theme={defaultTheme}>
        <AppHolder>
          <Row>
            <Button size="small" color="primary">
              Primary Filled Small
            </Button>
            <Button size="small" color="primary" type="outline">
              Primary Outlined Small
            </Button>
            <Button size="small" color="primary" type="ghost">
              Primary Ghost Small
            </Button>
          </Row>
          <Row>
            <Button size="normal" color="primary">
              Primary Filled Normal
            </Button>
            <Button size="normal" color="primary" type="outline">
              Primary Outlined Normal
            </Button>
            <Button size="normal" color="primary" type="ghost">
              Primary Ghost Normal
            </Button>
          </Row>
          <Row>
            <Button size="big" color="primary">
              Primary Filled Big
            </Button>
            <Button size="big" color="primary" type="outline">
              Primary Outlined Big
            </Button>
            <Button size="big" color="primary" type="ghost">
              Primary Ghost Big
              <Icon type="arrow-right" />
            </Button>
          </Row>
          <Row>
            <Button size="big" color="success">
              success Filled
            </Button>
            <Button size="big" color="success" type="outline">
              success Outlined
            </Button>
            <Button size="big" color="success" type="ghost">
              success Ghost
              <Icon type="arrow-right" />
            </Button>
          </Row>
          <Row>
            <Button size="big" color="warning">
              warning Filled
            </Button>
            <Button size="big" color="warning" type="outline">
              warning Outlined
            </Button>
            <Button size="big" color="warning" type="ghost">
              warning Ghost
              <Icon type="arrow-right" />
            </Button>
          </Row>
          <Row>
            <Button size="big" color="error">
              error Filled
            </Button>
            <Button size="big" color="error" type="outline">
              error Outlined
            </Button>
            <Button size="big" color="error" type="ghost">
              Error Ghost
              <Icon type="arrow-right" />
            </Button>
          </Row>
        </AppHolder>
      </ThemeProvider>
    );
  })
  .add('properties', () => {
    const buttonText = text('Button Text', 'button', 'button');
    const sizeOptions = ['small', 'normal', 'big'];
    const colorOptions = ['primary', 'success', 'warning', 'error'];
    const typeOptions = ['default', 'outline', 'ghost'];

    const size = radios('size', sizeOptions, 'small');
    const color = radios('color', colorOptions, 'primary');
    const type = radios('type', typeOptions, 'default');
    return (
      <Button size={size} color={color} type={type}>
        {buttonText}
      </Button>
    );
  });
