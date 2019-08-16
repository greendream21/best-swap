import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { WalletViewWrapper } from './WalletView.style';
import Tabs from '../../components/uielements/tabs';
import Label from '../../components/uielements/label';
import Button from '../../components/uielements/button';
import CoinList from '../../components/uielements/coins/coinList';

import { assetsData, stakeData } from './data';
import { getPair } from '../../helpers/stringHelper';

const { TabPane } = Tabs;

class WalletView extends Component {
  static propTypes = {
    page: PropTypes.string,
    view: PropTypes.string,
    info: PropTypes.string,
    status: PropTypes.bool,
  };

  static defaultProps = {
    page: '',
    view: '',
    info: '',
    status: '',
  };

  state = {};

  getAssetNameByIndex = index => {
    return assetsData[index].asset || '';
  };

  getAssetIndexByName = asset => {
    return assetsData.findIndex(data => data.asset === asset);
  };

  handleConnect = () => {
    this.props.history.push('/connect');
  };

  handleSelectAsset = key => {
    const { page, view, info } = this.props;

    if (!info) return;

    const pair = getPair(info);
    const { source } = pair;
    const newAssetName = this.getAssetNameByIndex(key);

    const URL = `/${page}/${view}/${source}-${newAssetName}`;

    this.props.history.push(URL);
  };

  handleSelectStake = key => {};

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

  getSelectedAsset = pair => {
    const { page } = this.props;

    if (page === 'pool' || page === 'trade') {
      const { target } = pair;
      const targetIndex = this.getAssetIndexByName(target);

      return [targetIndex];
    }
    return [];
  };

  render() {
    const { info, status } = this.props;
    const pair = getPair(info);
    const { source } = pair;
    const selectedAsset = this.getSelectedAsset(pair);
    const sourceIndex = this.getAssetIndexByName(source);

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
                value={sourceIndex}
                selected={selectedAsset}
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
                value={sourceIndex}
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
