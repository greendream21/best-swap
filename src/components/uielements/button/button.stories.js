import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, radios, boolean } from '@storybook/addon-knobs';
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
            <Button sizevalue="small" color="primary">
              Primary Filled Small
            </Button>
            <Button sizevalue="small" color="primary" typevalue="outline">
              Primary Outlined Small
            </Button>
            <Button sizevalue="small" color="primary" typevalue="ghost">
              Primary Ghost Small
            </Button>
          </Row>
          <Row>
            <Button sizevalue="normal" color="primary">
              Primary Filled Normal
            </Button>
            <Button sizevalue="normal" color="primary" typevalue="outline">
              Primary Outlined Normal
            </Button>
            <Button sizevalue="normal" color="primary" typevalue="ghost">
              Primary Ghost Normal
            </Button>
          </Row>
          <Row>
            <Button sizevalue="big" color="primary">
              Primary Filled Big
            </Button>
            <Button sizevalue="big" color="primary" typevalue="outline">
              Primary Outlined Big
            </Button>
            <Button sizevalue="big" color="primary" typevalue="ghost">
              Primary Ghost Big
              <Icon type="arrow-right" />
            </Button>
          </Row>
          <Row>
            <Button sizevalue="big" color="success">
              success Filled
            </Button>
            <Button sizevalue="big" color="success" typevalue="outline">
              success Outlined
            </Button>
            <Button sizevalue="big" color="success" typevalue="ghost">
              success Ghost
              <Icon type="arrow-right" />
            </Button>
          </Row>
          <Row>
            <Button sizevalue="big" color="warning">
              warning Filled
            </Button>
            <Button sizevalue="big" color="warning" typevalue="outline">
              warning Outlined
            </Button>
            <Button sizevalue="big" color="warning" typevalue="ghost">
              warning Ghost
              <Icon type="arrow-right" />
            </Button>
          </Row>
          <Row>
            <Button sizevalue="big" color="error">
              error Filled
            </Button>
            <Button sizevalue="big" color="error" typevalue="outline">
              error Outlined
            </Button>
            <Button sizevalue="big" color="error" typevalue="ghost">
              Error Ghost
              <Icon type="arrow-right" />
            </Button>
          </Row>
        </AppHolder>
      </ThemeProvider>
    );
  })
  .add('properties', () => {
    const buttonText = text('Button Text', 'button');
    const sizeOptions = ['small', 'normal', 'big'];
    const colorOptions = ['primary', 'success', 'warning', 'error'];
    const typeOptions = ['default', 'outline', 'ghost'];

    const size = radios('size', sizeOptions, 'normal');
    const color = radios('color', colorOptions, 'primary');
    const type = radios('type', typeOptions, 'default');
    const focused = boolean('focused', false);

    return (
      <Button sizevalue={size} color={color} typevalue={type} focused={focused}>
        {buttonText}
      </Button>
    );
  });
