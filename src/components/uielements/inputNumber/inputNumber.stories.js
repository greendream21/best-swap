import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, radios, withKnobs } from '@storybook/addon-knobs';
import { Row } from 'antd';

import InputNumber from './inputNumber';

storiesOf('Components/InputNumber', module)
  .add('default', () => {
    return (
      <Row
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '300px',
          height: '300px',
        }}
      >
        <InputNumber color="primary" value={12345} size="small" />
        <InputNumber color="primary" value={12345} size="default" />
        <InputNumber color="primary" value={12345} size="large" />
        <InputNumber color="success" value={12345} size="large" />
        <InputNumber color="warning" value={12345} size="large" />
        <InputNumber color="error" value={12345} size="large" />
      </Row>
    );
  })
  .add(
    'properties',
    () => {
      const inputText = text('Input Number', 'Number');
      const sizeOptions = ['small', 'default', 'large'];
      const colorOptions = ['primary', 'success', 'warning', 'error'];

      const size = radios('size', sizeOptions, 'normal');
      const color = radios('color', colorOptions, 'primary');
      return <InputNumber color={color} sizevalue={size} value={inputText} />;
    },
    { decorator: withKnobs },
  );
