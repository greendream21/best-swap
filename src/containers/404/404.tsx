/* eslint-disable react/no-unescaped-entities */
import React, { Component } from 'react';

import Label from 'components/uielements/label';

import { AppLayout } from './style';

class Page404 extends Component {
  render() {
    return (
      <AppLayout>
        <Label size="large">404</Label>
        <Label size="big">Woops! Something went wrong!</Label>
      </AppLayout>
    );
  }
}

export default Page404;
