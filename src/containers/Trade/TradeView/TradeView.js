import React, { Fragment, Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TradeCard from '../../../components/trade/tradeCard';

import { ContentWrapper } from './TradeView.style';
import { assets } from './data';

class TradeView extends Component {
  static propTypes = { history: PropTypes.object };

  state = {};

  handleTrade = (type, target) => () => {
    const URL = `/trade/${type}/rune-${target}`;

    this.props.history.push(URL);
  };

  renderTradeList = () => {
    return assets.map((asset, index) => {
      if (asset !== 'rune') {
        return (
          <TradeCard
            className="trade-card"
            asset="bnb"
            target={asset}
            depth={23000}
            poolPrice={1.2}
            marketPrice={1}
            premium={20}
            reward={230}
            onBuy={this.handleTrade('buy', asset)}
            onSell={this.handleTrade('sell', asset)}
            key={index}
          />
        );
      }
      return <Fragment />;
    });
  };

  render() {
    return (
      <ContentWrapper className="trade-view-wrapper">
        <div className="trade-list-view">{this.renderTradeList()}</div>
      </ContentWrapper>
    );
  }
}

export default withRouter(TradeView);
