import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppRouter from './AppRouter';

class App extends Component {
  render() {
    const { url } = this.props.match;

    return (
      <div>
        <AppRouter url={url} />
      </div>
    );
  }
}

App.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
