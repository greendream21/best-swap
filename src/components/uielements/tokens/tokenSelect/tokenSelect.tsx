import React from 'react';

import { delay, formatBN } from '@thorchain/asgardex-util';
import { Dropdown } from 'antd';
import BigNumber from 'bignumber.js';

import { PriceDataIndex } from 'redux/midgard/types';

import clickedInNode from 'helpers/event/clickedInNode';
import Ref from 'helpers/event/ref';

import { FixmeType } from 'types/bepswap';

import TokenData from '../tokenData';
import TokenMenu from './tokenMenu';
import {
  TokenSelectWrapper,
  TokenDropdownButton,
  DropdownIconHolder,
  DropdownIcon,
} from './tokenSelect.style';

type DropdownCarretProps = {
  className?: string;
  open: boolean;
  onClick?: () => void;
};

const DropdownCarret: React.FC<DropdownCarretProps> = (
  props: DropdownCarretProps,
): JSX.Element => {
  const { open, onClick = () => {}, className = '' } = props;
  return (
    <DropdownIconHolder>
      <DropdownIcon open={open} className={className} onClick={onClick} />
    </DropdownIconHolder>
  );
};

type Props = {
  assetData: string[];
  asset: string;
  price: BigNumber;
  priceIndex: PriceDataIndex;
  withSearch?: boolean;
  searchDisable?: string[];
  onSelect: (_: number) => void;
  onChangeAsset?: (asset: string) => void;
  className?: string;
  'data-test': string;
};

type State = {
  openDropdown: boolean;
};

class TokenSelect extends React.Component<Props, State> {
  ref = React.createRef();

  menuRef = React.createRef();

  constructor(props: Props) {
    super(props);
    this.state = {
      openDropdown: false,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
  }

  handleRef = (ref: FixmeType) => {
    if (ref) {
      this.ref = ref;
    }
  };

  handleMenuRef = (menuRef: FixmeType) => {
    if (menuRef) {
      this.menuRef = menuRef;
    }
  };

  handleDocumentClick = (e: MouseEvent) => {
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

  handleVisibleChange = (openDropdown: boolean) => {
    this.setState({
      openDropdown,
    });
  };

  handleDropdownButtonClicked = () => {
    const { openDropdown } = this.state;
    this.handleVisibleChange(!openDropdown);
  };

  handleChangeAsset = async (asset: string) => {
    const { onChangeAsset } = this.props;

    this.setState({ openDropdown: false });

    if (onChangeAsset) {
      // Wait for the dropdown to close
      await delay(500);
      onChangeAsset(asset);
    }
  };

  renderDropDownButton() {
    const { assetData } = this.props;
    const { openDropdown: open } = this.state;
    const disabled = !assetData || assetData.length === 0;

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
      withSearch = true,
      searchDisable = [],
      'data-test': dataTest,
    } = this.props;
    const menuDataTest = `${dataTest}-menu`;

    return (
      <Ref innerRef={this.handleMenuRef}>
        <TokenMenu
          assetData={assetData}
          asset={asset}
          priceIndex={priceIndex}
          withSearch={withSearch}
          searchDisable={searchDisable}
          onSelect={this.handleChangeAsset}
          data-test={menuDataTest}
        />
      </Ref>
    );
  };

  render() {
    const { asset, price, className = '' } = this.props;
    const { openDropdown } = this.state;

    return (
      <Ref innerRef={this.handleRef}>
        <Dropdown
          overlay={this.renderMenu()}
          trigger={[]}
          visible={openDropdown}
        >
          <TokenSelectWrapper className={`tokenSelect-wrapper ${className}`}>
            <TokenData asset={asset} priceValue={formatBN(price)} />
            {this.renderDropDownButton()}
          </TokenSelectWrapper>
        </Dropdown>
      </Ref>
    );
  }
}

export default TokenSelect;
