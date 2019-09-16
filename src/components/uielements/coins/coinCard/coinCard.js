import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Divider, Input, Icon, Dropdown } from 'antd';

import Coin from '../coin';
import Label from '../../label';
import Selection from '../../selection';

import { CoinCardWrapper, Menu } from './coinCard.style';
import CoinData from '../coinData';

class CoinCard extends Component {
  static propTypes = {
    asset: PropTypes.string,
    assetData: PropTypes.array,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    slip: PropTypes.number,
    title: PropTypes.string,
    withSelection: PropTypes.bool,
    onSelect: PropTypes.func,
    onChange: PropTypes.func,
    onChangeAsset: PropTypes.func,
    className: PropTypes.string,
    max: PropTypes.number,
  };

  static defaultProps = {
    asset: 'bnb',
    assetData: [],
    amount: 0,
    price: 0,
    slip: undefined,
    title: '',
    withSelection: false,
    onSelect: () => {},
    onChange: () => {},
    onChangeAsset: () => {},
    className: '',
    max: 1000000,
  };

  state = {
    openDropdown: false,
    focusedDropdown: true,
    blurCard: false,
  };

  onChange = e => {
    this.props.onChange(e.target.value);
  };

  handleVisibleChange = openDropdown => {
    this.setState({
      openDropdown,
    });
  };

  handleBlurDropdown = e => {
    const { blurCard } = this.state;
    if (blurCard) {
      this.setState({
        openDropdown: false,
      });
    } else {
      this.setState({
        focusedDropdown: false,
      });
    }
  };

  handleBlurCard = e => {
    const { focusedDropdown } = this.state;
    if (!focusedDropdown) {
      this.setState({
        openDropdown: false,
      });
    } else {
      this.setState({
        blurCard: true,
      });
    }
  };

  handleChangeAsset = asset => {
    const { onChangeAsset } = this.props;

    onChangeAsset(asset.key);
  };

  toggleDropdown = () => {
    this.setState(prevState => ({
      openDropdown: !prevState.openDropdown,
      focusedDropdown: true,
      blurCard: false,
    }));
  };

  renderMenu = () => {
    const { assetData, asset } = this.props;

    return (
      <Menu onClick={this.handleChangeAsset} onBlur={this.handleBlurDropdown}>
        {assetData.map(data => {
          const { asset: assetName, price } = data;
          const tokenName = assetName.split('-')[0];
          if (tokenName.toLowerCase() === asset.toLowerCase()) {
            return <Fragment key={asset} />;
          }

          return (
            <Menu.Item key={assetName}>
              <CoinData asset={tokenName} price={price} />
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  renderDropDown = () => {
    const { assetData } = this.props;
    const { openDropdown } = this.state;

    const iconType = openDropdown ? 'caret-up' : 'caret-down';

    if (assetData.length) {
      return (
        <Icon
          className="dropdown-icon"
          type={iconType}
          onClick={this.toggleDropdown}
        />
      );
    }
  };

  render() {
    const {
      asset,
      assetData,
      amount,
      price,
      slip,
      title,
      max,
      withSelection,
      onSelect,
      onChange,
      onChangeAsset,
      className,
      ...props
    } = this.props;
    const { openDropdown } = this.state;

    return (
      <Dropdown
        overlay={this.renderMenu()}
        trigger={['']}
        visible={openDropdown}
        onVisibleChange={this.handleVisibleChange}
      >
        <CoinCardWrapper
          className={`coinCard-wrapper ${className}`}
          onBlur={this.handleBlurCard}
          {...props}
        >
          {title && <Label className="title-label">{title}</Label>}
          <div className="card-wrapper">
            <Coin type={asset} size="small" />
            <div className="asset-data">
              <Label className="asset-name-label" size="small" weight="bold">
                {asset}
              </Label>
              <Input
                className="asset-amount-label"
                size="big"
                value={amount}
                style={{ width: '100%' }}
                onChange={this.onChange}
                {...props}
              />
              <Divider />
              <div className="asset-card-footer">
                <Label size="small" color="gray" weight="bold">
                  {`$USD ${(amount * price).toFixed(2)}`}
                </Label>
                {slip !== undefined && (
                  <Label
                    className="asset-slip-label"
                    size="small"
                    color="gray"
                    weight="bold"
                  >
                    SLIP: {slip.toFixed(0)} %
                  </Label>
                )}
              </div>
            </div>
            {this.renderDropDown()}
          </div>
          {withSelection && <Selection onSelect={onSelect} />}
        </CoinCardWrapper>
      </Dropdown>
    );
  }
}

export default CoinCard;
