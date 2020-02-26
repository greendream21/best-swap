import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import Header from '../../components/header';
import Footer from '../../components/footer';
import AppRouter from './AppRouter';
import { ContentWrapper } from './App.style';
import { COMMIT_HASH } from '../../helpers/envHelper';

class App extends Component {
  render() {
    const { url } = this.props.match;

    return (
      <Layout data-test="bepswap-app">
        <Header title="SWAP AND STAKE BEP2 ASSETS" />
        <ContentWrapper>
          <AppRouter url={url} />
        </ContentWrapper>
        <Footer commitHash={COMMIT_HASH} />
      </Layout>
    );
  }
}

App.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
