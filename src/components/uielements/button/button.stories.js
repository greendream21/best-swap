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
            <Button sizeType="small" color="primary">
              Primary Filled Small
            </Button>
            <Button sizeType="small" color="primary" viewType="outline">
              Primary Outlined Small
            </Button>
            <Button sizeType="small" color="primary" viewType="ghost">
              Primary Ghost Small
            </Button>
          </Row>
          <Row>
            <Button sizeType="normal" color="primary">
              Primary Filled Normal
            </Button>
            <Button sizeType="normal" color="primary" viewType="outline">
              Primary Outlined Normal
            </Button>
            <Button sizeType="normal" color="primary" viewType="ghost">
              Primary Ghost Normal
            </Button>
          </Row>
          <Row>
            <Button sizeType="big" color="primary">
              Primary Filled Big
            </Button>
            <Button sizeType="big" color="primary" viewType="outline">
              Primary Outlined Big
            </Button>
            <Button sizeType="big" color="primary" viewType="ghost">
              Primary Ghost Big
              <Icon type="arrow-right" />
            </Button>
          </Row>
          <Row>
            <Button sizeType="big" color="success">
              success Filled
            </Button>
            <Button sizeType="big" color="success" viewType="outline">
              success Outlined
            </Button>
            <Button sizeType="big" color="success" viewType="ghost">
              success Ghost
              <Icon type="arrow-right" />
            </Button>
          </Row>
          <Row>
            <Button sizeType="big" color="warning">
              warning Filled
            </Button>
            <Button sizeType="big" color="warning" viewType="outline">
              warning Outlined
            </Button>
            <Button sizeType="big" color="warning" viewType="ghost">
              warning Ghost
              <Icon type="arrow-right" />
            </Button>
          </Row>
          <Row>
            <Button sizeType="big" color="error">
              error Filled
            </Button>
            <Button sizeType="big" color="error" viewType="outline">
              error Outlined
            </Button>
            <Button sizeType="big" color="error" viewType="ghost">
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

    const size = radios('size', sizeOptions, 'normal');
    const color = radios('color', colorOptions, 'primary');
    const type = radios('type', typeOptions, 'default');
    return (
      <Button sizeType={size} color={color} viewType={type}>
        {buttonText}
      </Button>
    );
  });
