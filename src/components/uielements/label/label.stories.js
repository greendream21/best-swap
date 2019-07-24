import React from 'react';
import { storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import AppHolder from '../../../AppStyle';
import { defaultTheme } from '../../../settings';

import Label from './label';

storiesOf('Components/Label', module).add('default', () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <AppHolder>
        <Label size="tiny" color="normal">
          This is the LABEL!
        </Label>
        <Label size="smaller" color="normal">
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
      </AppHolder>
    </ThemeProvider>
  );
});
