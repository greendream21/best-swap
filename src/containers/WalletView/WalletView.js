import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import CoinList from '../../components/uielements/coins/coinList';

import { assetsData, stakeData } from './data';

const { TabPane } = Tabs;

class WalletView extends Component {
  static propTypes = {
    status: PropTypes.bool,
  };

  static defaultProps = {
    status: '',
  };

  state = {
    curAsset: 0,
    curStake: 0,
  };

  handleConnect = () => {
    this.props.history.push('/connect');
  };

  handleSelectAsset = key => {
    this.setState({
      curAsset: key,
    });
  };

  handleSelectStake = key => {
    this.setState({
      curStake: key,
    });
  };

  renderAssetTitle = () => {
    const { status } = this.props;

    if (status === 'connected') {
      return 'Tokens in your wallet:';
    }
    return 'Connect your wallet';
  };

  renderStakeTitle = () => {
    const { status } = this.props;

    if (status === 'connected') {
      return 'Your current stakes are:';
    }
    return '';
  };

  render() {
    const { status } = this.props;
    const { curAsset, curStake } = this.state;

    return (
      <WalletViewWrapper>
        <Tabs defaultActiveKey="assets" onChange={this.handleChangeTab}>
          <TabPane tab="assets" key="assets">
            <Label className="asset-title-label">
              {this.renderAssetTitle()}
            </Label>
            {!status && (
              <Button onClick={this.handleConnect} color="success">
                connect
              </Button>
            )}
            {status && (
              <CoinList
                data={assetsData}
                value={curAsset}
                onSelect={this.handleSelectAsset}
              />
            )}
          </TabPane>
          <TabPane tab="stakes" key="stakes">
            <Label className="asset-title-label">
              {this.renderStakeTitle()}
            </Label>
            {status && (
              <CoinList
                data={stakeData}
                value={curStake}
                onSelect={this.handleSelectStake}
              />
            )}
          </TabPane>
        </Tabs>
      </WalletViewWrapper>
    );
  }
}

export default withRouter(WalletView);
