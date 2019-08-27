import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Label from '../../../components/uielements/label';
import AddIcon from '../../../components/uielements/addIcon';
import PoolCard from '../../../components/pool/poolCard';

import { ContentWrapper } from './PoolView.style';
import { assets } from './data';

class PoolView extends Component {
  state = {
    activeAsset: 'rune',
  };

  handleStake = (source, target) => () => {
    const URL = `/pool/stake-new/${source}-${target}`;

    this.props.history.push(URL);
  };

  handleNewPool = () => {
    const URL = '/pool/new/rune';

    this.props.history.push(URL);
  };

  renderPoolList = () => {
    const { activeAsset } = this.state;

    return assets.map((asset, index) => {
      if (asset !== activeAsset) {
        return (
          <PoolCard
            className="pool-card"
            asset={activeAsset}
            target={asset}
            depth={234000}
            volume={1000}
            transaction={100}
            liq={1}
            roi={10}
            onStake={this.handleStake(activeAsset, asset)}
            key={index}
          />
        );
      }
    });
  };

  render() {
    return (
      <ContentWrapper className="pool-view-wrapper">
        <div className="pool-list-view">{this.renderPoolList()}</div>
        <div className="add-new-pool" onClick={this.handleNewPool}>
          <AddIcon />
          <Label size="normal" weight="bold" color="normal">
            ADD NEW POOL
          </Label>
        </div>
      </ContentWrapper>
    );
  }
}

export default withRouter(PoolView);
