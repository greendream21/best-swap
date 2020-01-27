import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'antd';

import {
  TokenSelectWrapper,
  TokenDropdownButton,
  DropdownIconHolder,
  DropdownIcon,
} from './tokenSelect.style';

import TokenMenu from './tokenMenu';
import TokenData from '../tokenData';
import Ref from '../../../../helpers/event/ref';
import clickedInNode from '../../../../helpers/event/clickedInNode';

function DropdownCarret({ open, onClick, className }) {
  return (
    <DropdownIconHolder>
      <DropdownIcon
        open={open}
        className={className}
        type="caret-down"
        onClick={onClick}
      />
    </DropdownIconHolder>
  );
}

DropdownCarret.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

class TokenSelect extends Component {
  static propTypes = {
    assetData: PropTypes.array.isRequired,
    asset: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    priceIndex: PropTypes.object.isRequired,
    priceUnit: PropTypes.string,
    withSearch: PropTypes.bool,
    searchDisable: PropTypes.array,
    onSelect: PropTypes.func.isRequired,
    onChangeAsset: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    priceUnit: 'RUNE',
    withSearch: true,
    searchDisable: [],
    onChangeAsset: () => {},
    className: '',
  };

  state = {
    openDropdown: false,
  };

  ref = React.createRef();

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleRef = ref => {
    if (ref) {
      this.ref = ref;
    }
  };

  handleMenuRef = menuRef => {
    if (menuRef) {
      this.menuRef = menuRef;
    }
  };

  handleDocumentClick = e => {
    if (
      this.ref &&
      !clickedInNode(this.ref, e) &&
      !clickedInNode(this.menuRef, e)
    ) {
      this.setState({
        openDropdown: false,
      });
    }
  };

  handleVisibleChange = openDropdown => {
    this.setState({
      openDropdown,
    });
  };

  handleDropdownButtonClicked = () => {
    const { openDropdown } = this.state;
    this.handleVisibleChange(!openDropdown);
  };

  handleChangeAsset = asset => {
    const { onChangeAsset } = this.props;

    this.setState({ openDropdown: false });

    // HACK: Wait for the dropdown to close
    setTimeout(() => {
      onChangeAsset(asset.key);
    }, 500);
  };

  renderDropDownButton() {
    const { assetData } = this.props;
    const { openDropdown: open } = this.state;
    const disabled = assetData.length === 0;

    return (
      <TokenDropdownButton
        disabled={disabled}
        onClick={this.handleDropdownButtonClicked}
        data-test="coin-dropdown-button"
      >
        {!disabled ? (
          <DropdownCarret className="caret-down" open={open} />
        ) : null}
      </TokenDropdownButton>
    );
  }

  renderMenu = () => {
    const {
      assetData,
      asset,
      priceIndex,
      priceUnit,
      withSearch,
      searchDisable,
    } = this.props;
    const dataTest = this.props['data-test']; // eslint-disable-line
    const menuDataTest = `${dataTest}-menu`;

    return (
      <Ref innerRef={this.handleMenuRef}>
        <TokenMenu
          assetData={assetData}
          asset={asset}
          priceIndex={priceIndex}
          priceUnit={priceUnit}
          withSearch={withSearch}
          searchDisable={searchDisable}
          onSelect={this.handleChangeAsset}
          data-test={menuDataTest}
        />
      </Ref>
    );
  };

  render() {
    const {
      asset,
      price,
      priceIndex,
      priceUnit,
      assetData,
      onChangeAsset,
      className,
      ...props
    } = this.props;
    const { openDropdown } = this.state;

    return (
      <Ref innerRef={this.handleRef}>
        <Dropdown
          overlay={this.renderMenu()}
          trigger={[]}
          visible={openDropdown}
        >
          <TokenSelectWrapper
            className={`tokenSelect-wrapper ${className}`}
            {...props}
          >
            <TokenData asset={asset} price={price} priceUnit={priceUnit} />
            {this.renderDropDownButton()}
          </TokenSelectWrapper>
        </Dropdown>
      </Ref>
    );
  }
}

export default TokenSelect;
