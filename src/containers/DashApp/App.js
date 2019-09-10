import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import Header from '../../components/header';
import Footer from '../../components/footer';
import AppRouter from './AppRouter';
import { ContentWrapper } from './App.style';

import walletActions from '../../redux/wallet/actions';

const { refreshBalance, refreshStake } = walletActions;

class App extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    refreshBalance: PropTypes.func.isRequired,
    refreshStake: PropTypes.func.isRequired,
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    const { user, refreshBalance, refreshStake } = this.props;

    if (user && user.wallet) {
      const address = user.wallet;

      refreshBalance(address);
      refreshStake(address);
    }
  }

  render() {
    const { url } = this.props.match;

    return (
      <Layout>
        <Header title="SWAP AND STAKE BEP2 ASSETS" />
        <ContentWrapper>
          <AppRouter url={url} />
        </ContentWrapper>
        <Footer />
      </Layout>
    );
  }
}

export default connect(
  state => ({
    user: state.Wallet.user,
  }),
  {
    refreshBalance,
    refreshStake,
  },
)(App);
