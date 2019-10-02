import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { PoolWrapper } from './Pool.style';
import ActionView from '../../ActionView';

class Pool extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const { symbol, action } = this.props.match.params;
    const view = action || 'pool';

    return (
      <PoolWrapper>
        <ActionView type="pools" symbol={symbol} view={view} />
      </PoolWrapper>
    );
  }
}

export default withRouter(Pool);
