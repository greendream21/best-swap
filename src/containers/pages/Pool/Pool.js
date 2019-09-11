import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { PoolWrapper } from './Pool.style';
import ActionView from '../../ActionView';

class Pool extends Component {
  render() {
    const { ticker } = this.props.match.params;

    return (
      <PoolWrapper>
        <ActionView type="pools" ticker={ticker} view="pool" />
      </PoolWrapper>
    );
  }
}

export default withRouter(Pool);
