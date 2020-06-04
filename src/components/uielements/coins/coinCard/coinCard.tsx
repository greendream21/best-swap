import React, { useCallback } from 'react';
import { Dropdown } from 'antd';
import { sortBy as _sortBy } from 'lodash';

import BigNumber from 'bignumber.js';
import { bn, delay, formatBN, validBNOrZero } from '@thorchain/asgardex-util';
import { TokenAmount, tokenAmount } from '@thorchain/asgardex-token';
import Label from '../../label';
import Selection from '../../selection';
import CoinInputAdvanced from '../coinInputAdvanced';
import CoinCardMenu from './coinCardMenu';
import {
  AssetCardFooter,
  AssetData,
  AssetNameLabel,
  CardBorderWrapper,
  CardTopRow,
  CoinCardWrapper,
  CoinDropdownButton,
  CoinDropdownCoin,
  CoinDropdownVerticalColumn,
  DropdownIcon,
  DropdownIconHolder,
  FooterLabel,
  HorizontalDivider,
} from './coinCard.style';

import Ref from '../../../../helpers/event/ref';
import clickedInNode from '../../../../helpers/event/clickedInNode';
import { PriceDataIndex } from '../../../../redux/midgard/types';
import { FixmeType, AssetPair } from '../../../../types/bepswap';

type DropdownCarretProps = {
  open: boolean;
  onClick?: () => void;
  className?: string;
};
const DropdownCarret: React.FC<DropdownCarretProps> = ({
  open,
  onClick = () => {},
  className = '',
}): JSX.Element => {
  const onClickHandler = useCallback(() => {
    onClick();
  }, [onClick]);

  return (
    <DropdownIconHolder>
      <DropdownIcon
        open={open}
        className={className}
        type="caret-down"
        onClick={onClickHandler}
      />
    </DropdownIconHolder>
  );
};

type Props = {
  asset: string;
  assetData: AssetPair[];
  amount: TokenAmount;
  price: BigNumber;
  priceIndex: PriceDataIndex;
  unit: string;
  slip?: number;
  title: string;
  searchDisable: string[];
  withSelection: boolean;
  withSearch: boolean;
  onSelect: (value: number) => void;
  onChange: (value: BigNumber) => void;
  onChangeAsset: (asset: string) => void;
  className: string;
  max: number;
  disabled: boolean;
  dataTestWrapper: string;
  dataTestInput: string;
  children: React.ReactNode;
  inputProps: {
    'data-test': string;
    tabIndex: string;
  };
  'data-test': string;
};

type State = {
  openDropdown: boolean;
  percentButtonSelected: number;
};

class CoinCard extends React.Component<Props, State> {
  ref = React.createRef();

  menuRef = React.createRef();

  static readonly defaultProps: Partial<Props> = {
    asset: 'bnb',
    assetData: [],
    amount: tokenAmount(0),
    price: bn(0),
    unit: 'RUNE',
    title: '',
    withSelection: false,
    withSearch: false,
    searchDisable: [],
    onSelect: (_: number) => {},
    onChange: (_: BigNumber) => {},
    onChangeAsset: (_: string) => {},
    className: '',
    max: 1000000,
    disabled: false,
    children: null,
    inputProps: { 'data-test': '', tabIndex: '0' },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      openDropdown: false,
      percentButtonSelected: 0,
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

  onChange = (value: BigNumber) => {
    this.props.onChange(value);
  };

  handleVisibleChange = (openDropdown: boolean) => {
    this.setState({
      openDropdown,
    });
  };

  handleResetPercentButtons = () => {
    this.setState({ percentButtonSelected: 0 });
  };

  handleDropdownButtonClicked = () => {
    const { openDropdown } = this.state;
    this.handleVisibleChange(!openDropdown);
  };

  handlePercentSelected = (percentButtonSelected: number) => {
    const { onSelect } = this.props;
    this.setState({ percentButtonSelected });
    onSelect(percentButtonSelected);
  };

  handleChangeAsset = async (asset: string) => {
    const { onChangeAsset } = this.props;

    this.setState({ openDropdown: false });

    // Wait for the dropdown to close
    await delay(500);
    this.handleResetPercentButtons();
    onChangeAsset(asset);
  };

  renderMenu() {
    const {
      assetData,
      asset,
      priceIndex,
      unit,
      withSearch,
      searchDisable,
      'data-test': dataTest,
    } = this.props;
    const sortedAssetData = _sortBy(assetData, ['asset']);

    return (
      <Ref innerRef={this.handleMenuRef}>
        <CoinCardMenu
          data-test={dataTest}
          assetData={sortedAssetData}
          asset={asset}
          priceIndex={priceIndex}
          unit={unit}
          withSearch={withSearch}
          searchDisable={searchDisable}
          onSelect={this.handleChangeAsset}
        />
      </Ref>
    );
  }

  renderDropDownButton() {
    const { assetData, asset } = this.props;
    const { openDropdown: open } = this.state;
    const disabled = assetData.length === 0;
    return (
      <CoinDropdownButton
        data-test="coin-dropdown-button"
        disabled={disabled}
        onClick={this.handleDropdownButtonClicked}
      >
        <CoinDropdownCoin type={asset} size="big" />
        {!disabled ? (
          <CoinDropdownVerticalColumn>
            <DropdownCarret className="caret-down" open={open} />
          </CoinDropdownVerticalColumn>
        ) : null}
      </CoinDropdownButton>
    );
  }

  render() {
    const {
      asset,
      amount,
      price,
      priceIndex,
      unit,
      slip,
      title,
      max,
      withSelection,
      onSelect,
      onChange,
      onChangeAsset,
      className,
      withSearch,
      searchDisable,
      children,
      inputProps,
      ...props
    } = this.props;
    const { openDropdown, percentButtonSelected } = this.state;

    // TODO (Rudi): render dropown menu as bottom fixed sheet for mobile
    return (
      <Ref innerRef={this.handleRef}>
        <CoinCardWrapper className={`coinCard-wrapper ${className}`} {...props}>
          {title && <Label className="title-label">{title}</Label>}

          <Dropdown
            overlay={this.renderMenu()}
            trigger={[]}
            visible={openDropdown}
          >
            <CardBorderWrapper>
              <AssetNameLabel>{asset}</AssetNameLabel>
              <HorizontalDivider />
              <CardTopRow>
                <AssetData>
                  <CoinInputAdvanced
                    className="asset-amount-label"
                    size="large"
                    value={amount.amount()}
                    onChangeValue={this.onChange}
                    {...inputProps}
                  />
                  <HorizontalDivider color="primary" />
                  <AssetCardFooter>
                    <FooterLabel>
                      {`${unit} ${formatBN(
                        validBNOrZero(amount.amount().multipliedBy(price)),
                      )}`}
                    </FooterLabel>
                    {slip !== undefined && (
                      <FooterLabel
                        className="asset-slip-label"
                        size="small"
                        color="gray"
                        weight="bold"
                      >
                        SLIP: {slip.toFixed(0)} %
                      </FooterLabel>
                    )}
                  </AssetCardFooter>
                </AssetData>
                {this.renderDropDownButton()}
              </CardTopRow>
            </CardBorderWrapper>
          </Dropdown>
          {withSelection && (
            <Selection
              selected={percentButtonSelected}
              onSelect={this.handlePercentSelected}
            />
          )}
          {children}
        </CoinCardWrapper>
      </Ref>
    );
  }
}

export default CoinCard;
