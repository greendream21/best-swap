import React, { Component } from 'react';

import { PoolWrapper } from './Pool.style';
import ActionView from '../../ActionView';

class Pool extends Component {
  render() {
    return (
      <PoolWrapper>
        <ActionView type="pools" view="view" />
      </PoolWrapper>
    );
  }
}

export default Pool;
