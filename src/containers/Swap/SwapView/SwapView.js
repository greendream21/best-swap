import React, { Fragment, Component } from 'react';
import { withRouter } from 'react-router-dom';

import Label from '../../../components/uielements/label';
import CoinButton from '../../../components/uielements/coins/coinButton';
import SwapCard from '../../../components/swap/swapCard';

import ChainService from '../../../clients/chainservice';
import StateChain from '../../../clients/statechain';
import { ContentWrapper } from './SwapView.style';
import { assets } from './data';

class SwapView extends Component {
  state = {
    activeAsset: 'rune',
    loadingPools: true,
  };

  constructor(props) {
    super(props);
    console.info('Swap Pool List');

    this.refreshPools();
  }

  refreshPools = () => {
    StateChain.listPools()
      .then(async response => {
        const pools = await Promise.all(
          response.data.map(async pool => {
            return await ChainService.getPool(pool.ticker)
              .then(async response => {
                const poolData = response.data;
                return await ChainService.swapData(pool.ticker)
                  .then(response => {
                    const swapData = response.data;
                    return {
                      target: pool.ticker.toLowerCase(),
                      depth: poolData.depth, // TODO: should multiply this by USD price of rune
                      volume: poolData.vol24hr,
                      transaction: swapData.aveTxTkn, //TODO: clarify what is meant by average tx. consider both sides.
                      swaps: poolData.numSwaps,
                      slip: swapData.aveSlipTkn,
                      asset: 'rune',
                    };
                  })
                  .catch(error => {
                    console.error(error);
                    this.setState({ loadingPools: false });
                  });
              })
              .catch(error => {
                console.error(error);
                this.setState({ loadingPools: false });
              });
          }),
        );
        this.setState({ pools: pools, loadingPools: false });
      })
      .catch(error => {
        console.error(error);
        this.setState({ loadingPools: false });
      });
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
    const asset = 'rune';
    return (
      <CoinButton
        cointype={asset}
        onClick={this.handleChooseBasePair(asset)}
        focused={asset === activeAsset}
        disabled={asset !== 'rune'} // enable only rune for base pair
        key={0}
      />
    );
  };

  renderSwapList = () => {
    const { activeAsset } = this.state;
    if (this.state.loadingPools) {
      return 'loading pools...';
    } else {
      return this.state.pools.map((asset, index) => {
        if (asset !== activeAsset) {
          return (
            <SwapCard
              className="swap-card"
              asset={'rune'}
              target={asset.target}
              depth={asset.depth}
              volume={asset.volume}
              transaction={asset.transaction}
              slip={asset.slip}
              trade={asset.swaps}
              onSwap={this.handleSwap(activeAsset, asset.target)}
              key={index}
            />
          );
        }
        return <Fragment />;
      });
    }
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
