import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

import Header from '../../components/header';
import Footer from '../../components/footer';
import AppRouter from './AppRouter';
import { ContentWrapper } from './App.style';

class App extends Component {
  static propTypes = {
    match: PropTypes.shape({
      url: PropTypes.string.isRequired,
    }).isRequired,
  };

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

export default App;
