import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { PoolWrapper } from './Pool.style';
import ActionView from '../../ActionView';

class Pools extends Component {
  render() {
    return (
      <PoolWrapper>
        <ActionView type="pool" view={'view'} />
      </PoolWrapper>
    );
  }
}

export default withRouter(Pools);
