import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Label from '../../../components/uielements/label';
import CoinButton from '../../../components/uielements/coins/coinButton';
import SwapCard from '../../../components/swap/swapCard';

import { ContentWrapper } from './SwapView.style';
import { assets } from './data';

class SwapView extends Component {
  state = {
    activeAsset: 'bnb',
  };

  handleChooseBasePair = asset => () => {
    this.setState({
      activeAsset: asset,
    });
  };

  handleSwap = (source, target) => () => {
    const URL = `/swap/detail/${source}-${target}`;

    this.props.history.push(URL);
  };

  renderAssets = () => {
    const { activeAsset } = this.state;

    return assets.map((asset, index) => {
      return (
        <CoinButton
          cointype={asset}
          onClick={this.handleChooseBasePair(asset)}
          focused={asset === activeAsset}
          key={index}
        />
      );
    });
  };

  renderSwapList = () => {
    const { activeAsset } = this.state;

    return assets.map((asset, index) => {
      if (asset !== activeAsset) {
        return (
          <SwapCard
            className="swap-card"
            asset={activeAsset}
            target={asset}
            depth={234.0}
            volumn={340.0}
            transaction={1234}
            slip={0.2}
            trade={2345}
            onSwap={this.handleSwap(activeAsset, asset)}
            key={index}
          />
        );
      }
    });
  };

  render() {
    return (
      <ContentWrapper className="swap-view-wrapper">
        <div className="view-title">
          <Label size="normal" weight="bold" color="normal">
            CHOOSE BASE PAIR
          </Label>
        </div>
        <div className="asset-button-group">{this.renderAssets()}</div>
        <div className="swap-list-view">{this.renderSwapList()}</div>
      </ContentWrapper>
    );
  }
}

export default withRouter(SwapView);
