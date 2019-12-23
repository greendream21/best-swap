import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Form, notification, Icon } from 'antd';
import { crypto } from '@binance-chain/javascript-sdk';

import Binance from '../../../clients/binance';

import Label from '../../../components/uielements/label';
import Status from '../../../components/uielements/status';
import CoinIcon from '../../../components/uielements/coins/coinIcon';
import CoinCard from '../../../components/uielements/coins/coinCard';
import Slider from '../../../components/uielements/slider';
import Drag from '../../../components/uielements/drag';
import Input from '../../../components/uielements/input';
import { greyArrowIcon } from '../../../components/icons';

import midgardActions from '../../../redux/midgard/actions';
import binanceActions from '../../../redux/binance/actions';

import { ContentWrapper, PrivateModal } from './PoolCreate.style';
import { getUserFormat, getTickerFormat } from '../../../helpers/stringHelper';
import {
  getCreatePoolCalc,
  getCreatePoolTokens,
  confirmCreatePool,
} from '../utils';

const {
  getPools,
  getStakerPoolData,
  getRunePrice,
  getPoolAddress,
} = midgardActions;
const { getBinanceTokens, getBinanceMarkets } = binanceActions;

class PoolCreate extends Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    assetData: PropTypes.array.isRequired,
    pools: PropTypes.array.isRequired,
    poolAddress: PropTypes.string.isRequired,
    poolData: PropTypes.object.isRequired,
    stakerPoolData: PropTypes.object.isRequired,
    assets: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    runePrice: PropTypes.number.isRequired,
    getPools: PropTypes.func.isRequired,
    getPoolAddress: PropTypes.func.isRequired,
    getStakerPoolData: PropTypes.func.isRequired,
    getRunePrice: PropTypes.func.isRequired,
    getBinanceTokens: PropTypes.func.isRequired,
    getBinanceMarkets: PropTypes.func.isRequired,
    binanceData: PropTypes.object.isRequired,
    history: PropTypes.object,
  };

  state = {
    dragReset: true,
    openPrivateModal: false,
    invalidPassword: false,
    password: '',
    runeAmount: 0,
    tokenAmount: 0,
    balance: 100,
    fR: 1,
    fT: 1,
    selectedRune: 0,
    selectedToken: 0,
    runeTotal: 0,
    tokenTotal: 0,
  };

  componentDidMount() {
    const {
      getPools,
      getPoolAddress,
      getRunePrice,
      getBinanceMarkets,
      getBinanceTokens,
    } = this.props;

    getPools();
    getPoolAddress();
    getRunePrice();
    this.getStakerData();
    getBinanceTokens();
    getBinanceMarkets();
  }

  getStakerData = () => {
    const {
      getStakerPoolData,
      symbol,
      user: { wallet },
    } = this.props;

    if (wallet) {
      getStakerPoolData({ asset: symbol, address: wallet });
    }
  };

  handleChange = key => e => {
    this.setState({
      [key]: e.target.value,
      invalidPassword: false,
    });
  };

  handleChangeTokenAmount = tokenName => amount => {
    const { assetData, symbol } = this.props;
    const { fR, fT } = this.state;

    let newValue;
    const source = getTickerFormat(tokenName);

    const sourceAsset = assetData.find(data => {
      const { asset } = data;
      const tokenName = getTickerFormat(asset);
      if (tokenName === source) {
        return true;
      }
      return false;
    });

    const targetToken = assetData.find(data => {
      const { asset } = data;
      if (asset.toLowerCase() === symbol.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (!sourceAsset || !targetToken) {
      return;
    }

    const balance = tokenName === 'rune' ? fR : fT;

    const totalAmount = !sourceAsset ? 0 : sourceAsset.assetValue * balance;

    if (tokenName === 'rune') {
      newValue = amount;

      if (totalAmount < newValue) {
        this.setState({
          runeAmount: totalAmount,
          selectedRune: 0,
        });
      } else {
        this.setState({
          runeAmount: newValue,
          selectedRune: 0,
        });
      }
    } else {
      newValue = amount;

      if (totalAmount < newValue) {
        this.setState({
          tokenAmount: totalAmount,
          selectedToken: 0,
        });
      } else {
        this.setState({
          tokenAmount: newValue,
          selectedToken: 0,
        });
      }
    }
  };

  handleSelectTokenAmount = token => amount => {
    const { assetData, symbol } = this.props;
    const { fR, fT } = this.state;

    const selectedToken = assetData.find(data => {
      const { asset } = data;
      const tokenName = getTickerFormat(asset);
      if (tokenName === token.toLowerCase()) {
        return true;
      }
      return false;
    });

    const targetToken = assetData.find(data => {
      const { asset } = data;
      if (asset.toLowerCase() === symbol.toLowerCase()) {
        return true;
      }
      return false;
    });

    if (!selectedToken || !targetToken) {
      return;
    }

    const balance = token === 'rune' ? fR : fT;
    const totalAmount = selectedToken.assetValue || 0;
    const newValue = ((totalAmount * amount) / 100) * balance;

    if (token === 'rune') {
      this.setState({
        runeAmount: newValue,
        selectedRune: amount,
        runeTotal: totalAmount,
      });
    } else {
      this.setState({
        tokenAmount: newValue,
        selectedToken: amount,
        tokenTotal: totalAmount,
      });
    }
  };

  handleChangeBalance = balance => {
    const { selectedRune, selectedToken, runeTotal, tokenTotal } = this.state;
    const fR = balance < 100 ? 1 : (201 - balance) / 100;
    const fT = balance > 100 ? 1 : balance / 100;

    if (selectedRune > 0) {
      const runeAmount = ((runeTotal * selectedRune) / 100) * fR;
      this.setState({
        runeAmount,
      });
    }
    if (selectedToken > 0) {
      const tokenAmount = ((tokenTotal * selectedToken) / 100) * fT;
      this.setState({
        tokenAmount,
      });
    }
    this.setState({
      balance,
      fR,
      fT,
    });
  };

  handleCreatePool = () => {
    const {
      user: { keystore, wallet },
    } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    if (!wallet) {
      return;
    }

    if (Number(runeAmount) <= 0 || Number(tokenAmount) <= 0) {
      notification.error({
        message: 'Stake Invalid',
        description: 'You need to enter an amount to stake.',
      });
      this.setState({
        dragReset: true,
      });
      return;
    }

    if (keystore) {
      this.handleOpenPrivateModal();
    } else if (wallet) {
      this.handleConfirmCreate();
    }
  };

  handleConfirmCreate = async () => {
    const {
      user: { wallet },
    } = this.props;
    const { runeAmount, tokenAmount } = this.state;

    try {
      const { result } = await confirmCreatePool(
        Binance,
        wallet,
        runeAmount,
        tokenAmount,
        this.data,
      );
      console.log('create pool result: ', result);
      this.hash = result[0].hash;
      notification.success({
        message: 'Create Pool Success',
        description: 'Pool created successfully.',
      });
    } catch (error) {
      notification.error({
        message: 'Create Pool Failed',
        description: 'Create Pool information is not valid.',
      });
      console.log(error); // eslint-disable-line no-console
    }
    this.setState({
      dragReset: true,
    });
  };

  handleOpenPrivateModal = () => {
    this.setState({
      openPrivateModal: true,
    });
  };

  handleClosePrivateModal = () => {
    this.setState({
      openPrivateModal: false,
      dragReset: true,
    });
  };

  handleConfirmPassword = e => {
    e.preventDefault();

    const {
      user: { keystore, wallet },
    } = this.props;
    const { password } = this.state;

    try {
      const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      Binance.setPrivateKey(privateKey);
      const address = crypto.getAddressFromPrivateKey(
        privateKey,
        Binance.getPrefix(),
      );
      if (wallet === address) {
        this.handleConfirmCreate();
      }

      this.setState({
        openPrivateModal: false,
      });
    } catch (error) {
      this.setState({
        password: '',
        invalidPassword: true,
      });
      console.log(error); // eslint-disable-line no-console
    }
  };

  handleDrag = () => {
    this.setState({
      dragReset: false,
    });
  };

  handleSelectTraget = asset => {
    const URL = `/pool/${asset}/new`;

    this.props.history.push(URL);
  };

  renderAssetView = () => {
    const { symbol, runePrice, assetData, pools, poolAddress } = this.props;

    const {
      runeAmount,
      tokenAmount,
      balance,
      dragReset,
      openPrivateModal,
      invalidPassword,
      password,
    } = this.state;

    const source = 'rune';
    const target = getTickerFormat(symbol);

    const tokensData = getCreatePoolTokens(assetData, pools);

    const tokenInfo = tokensData.find(
      token => token.asset.toLowerCase() === symbol.toLowerCase(),
    );
    const tokenPrice = tokenInfo ? tokenInfo.price : 0;

    this.data = getCreatePoolCalc(
      symbol,
      poolAddress,
      runeAmount,
      runePrice,
      tokenAmount,
    );
    const { poolPrice, depth, share } = this.data;

    console.log('create pool calc data: ', this.data);

    const poolAttrs = [
      { key: 'price', title: 'Pool Price', value: `$${poolPrice}` },
      {
        key: 'depth',
        title: 'Pool Depth',
        value: `$${getUserFormat(depth)}`,
      },
      { key: 'share', title: 'Your Share', value: `${share}%` },
    ];

    return (
      <>
        <Label className="label-title" size="normal" weight="bold">
          ADD ASSETS
        </Label>
        <Label className="label-description" size="normal">
          Select the maximum deposit to stake.
        </Label>
        <Label className="label-no-padding" size="normal">
          Note: Pools always have RUNE as the base asset.
        </Label>
        <div className="stake-card-wrapper">
          <CoinCard
            asset={source}
            amount={runeAmount}
            price={runePrice}
            onChange={this.handleChangeTokenAmount('rune')}
            onSelect={this.handleSelectTokenAmount('rune')}
            withSelection
          />
          <CoinCard
            asset={target}
            assetData={tokensData}
            amount={tokenAmount}
            price={tokenPrice}
            onChangeAsset={this.handleSelectTraget}
            onChange={this.handleChangeTokenAmount(target)}
            onSelect={this.handleSelectTokenAmount(target)}
            withSelection
            withSearch
          />
        </div>
        <Label className="label-title" size="normal" weight="bold">
          ADJUST PRICE
        </Label>
        <Label size="normal">
          Fine tune balances to ensure you starting pool price matches the
          market price.
        </Label>
        <Slider
          onChange={this.handleChangeBalance}
          value={balance}
          min={1}
          max={200}
          tooltipVisible={false}
        />
        <div className="create-pool-info-wrapper">
          <div className="create-token-detail">
            <div className="info-status-wrapper">
              {poolAttrs.map(info => {
                return <Status className="share-info-status" {...info} />;
              })}
            </div>
            <Drag
              title="Drag to create pool"
              source="blue"
              target="confirm"
              reset={dragReset}
              onConfirm={this.handleCreatePool}
              onDrag={this.handleDrag}
            />
          </div>
        </div>
        <PrivateModal
          title="PASSWORD CONFIRMATION"
          visible={openPrivateModal}
          onOk={this.handleConfirmPassword}
          onCancel={this.handleClosePrivateModal}
          okText="CONFIRM"
          cancelText="CANCEL"
        >
          <Form onSubmit={this.handleConfirmPassword}>
            <Form.Item className={invalidPassword ? 'has-error' : ''}>
              <Input
                data-test="password-confirmation-input"
                type="password"
                typevalue="ghost"
                sizevalue="big"
                value={password}
                onChange={this.handleChange('password')}
                prefix={<Icon type="lock" />}
              />
              {invalidPassword && (
                <div className="ant-form-explain">Password is wrong!</div>
              )}
            </Form.Item>
          </Form>
        </PrivateModal>
      </>
    );
  };

  renderTokenDetails = () => {
    const {
      symbol,
      binanceData: { tokenList, marketList },
    } = this.props;
    const target = getTickerFormat(symbol);

    const title = 'TOKEN DETAILS';

    const binanceToken = tokenList.find(token => token.symbol === symbol);
    const binanceMarket = marketList.find(
      market => market.base_asset_symbol === symbol,
    );
    console.log(binanceToken, binanceMarket);

    const token = (binanceToken && binanceToken.name) || target;
    const ticker = (binanceToken && binanceToken.original_symbol) || target;
    const totalSupply = Number(
      (binanceToken && binanceToken.total_supply) || 0,
    );
    const marketPrice = Number(
      (binanceMarket && binanceMarket.list_price) || 0,
    );

    return (
      <>
        <Label className="label-title" size="normal" weight="bold">
          {title}
        </Label>
        {!target && (
          <div className="left-arrow-wrapper">
            <img src={greyArrowIcon} alt="grey-arrow" />
          </div>
        )}
        {target && (
          <div className="new-token-detail-wrapper">
            <div className="new-token-coin">
              <CoinIcon type={target} />
            </div>
            <Status title="Token" value={String(token).toUpperCase()} />
            <Status title="Ticker" value={String(ticker).toUpperCase()} />
            <Status title="Market Price" value={`$${marketPrice.toFixed(2)}`} />
            <Status title="Total Supply" value={totalSupply.toFixed(0)} />
          </div>
        )}
      </>
    );
  };

  render() {
    return (
      <ContentWrapper className="pool-new-wrapper">
        <Row className="pool-new-row">
          <Col className="token-details-view" span={8}>
            {this.renderTokenDetails()}
          </Col>
          <Col className="add-asset-view" span={16}>
            {this.renderAssetView()}
          </Col>
        </Row>
      </ContentWrapper>
    );
  }
}

export default compose(
  connect(
    state => ({
      user: state.Wallet.user,
      assetData: state.Wallet.assetData,
      pools: state.Midgard.pools,
      poolAddress: state.Midgard.poolAddress,
      poolData: state.Midgard.poolData,
      runePrice: state.Midgard.runePrice,
      stakerPoolData: state.Midgard.stakerPoolData,
      binanceData: state.Binance,
    }),
    {
      getPools,
      getPoolAddress,
      getStakerPoolData,
      getRunePrice,
      getBinanceTokens,
      getBinanceMarkets,
    },
  ),
  withRouter,
)(PoolCreate);
