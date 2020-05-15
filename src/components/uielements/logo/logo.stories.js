import React from 'react';
import { storiesOf } from '@storybook/react';
import { radios } from '@storybook/addon-knobs';
import { Row } from 'antd';

import Logo from './logo';

storiesOf('Components/Logos', module)
  .add('default', () => {
    return (
      <div>
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
        <Row>
          <Logo name="binanceDex" type="long" />
        </Row>
      </div>
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
