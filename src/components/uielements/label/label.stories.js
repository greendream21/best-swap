import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, radios } from '@storybook/addon-knobs';

import Label from './label';

storiesOf('Components/Label', module)
  .add('default', () => {
    return (
      <div>
        <Label size="tiny" color="normal">
          This is the LABEL!
        </Label>
        <Label size="small" color="normal">
          This is the LABEL!
        </Label>
        <Label size="normal" color="normal">
          This is the LABEL!
        </Label>
        <Label size="big" color="normal">
          This is the LABEL!
        </Label>
        <Label size="large" color="normal" weight="light">
          This is the LABEL!
        </Label>
        <Label size="large" color="normal" weight="bold">
          This is the LABEL!
        </Label>
        <Label size="large" color="normal">
          This is the LABEL!
        </Label>
        <Label size="large" color="primary">
          This is the LABEL!
        </Label>
        <Label size="large" color="success">
          This is the LABEL!
        </Label>
        <Label size="large" color="warning">
          This is the LABEL!
        </Label>
        <Label size="large" color="error">
          This is the LABEL!
        </Label>
        <Label size="large" color="normal">
          This is the LABEL!
        </Label>
        <Label size="large" color="dark">
          This is the LABEL!
        </Label>
        <Label size="large" color="light">
          This is the LABEL!
        </Label>
        <Label size="large" color="gray">
          This is the LABEL!
        </Label>
        <Label size="large" color="input">
          This is the LABEL!
        </Label>
      </div>
    );
  })
  .add('properties', () => {
    const labelText = text('Label Text', 'This is Label Text!');

    const sizeOptions = ['tiny', 'small', 'normal', 'big', 'large'];
    const colorOptions = [
      'primary',
      'success',
      'warning',
      'error',
      'normal',
      'light',
      'dark',
      'gray',
      'input',
      'white',
    ];
    const weightOptions = ['light', 'bold', 'normal'];

    const size = radios('size', sizeOptions, 'normal');
    const weight = radios('weight', weightOptions, 'normal');
    const color = radios('color', colorOptions, 'normal');

    return (
      <Label size={size} color={color} weight={weight}>
        {labelText}
      </Label>
    );
  });
