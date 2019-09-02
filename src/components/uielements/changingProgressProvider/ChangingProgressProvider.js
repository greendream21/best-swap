import React from 'react';
import PropTypes from 'prop-types';

class ChangingProgressProvider extends React.Component {
  static propTypes = {
    reset: PropTypes.bool,
  };

  static defaultProps = {
    interval: 1000,
    reset: false,
  };

  state = {
    valuesIndex: 0,
  };

  interval = null;

  componentDidMount() {
    this.startTimer();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reset === false && this.props.reset === true) {
      clearInterval(this.interval);
    }
    if (prevProps.reset === true && this.props.reset === false) {
      this.startTimer();
    }
  }

  startTimer = () => {
    this.interval = setInterval(() => {
      this.setState({
        valuesIndex: (this.state.valuesIndex + 1) % this.props.values.length,
      });
    }, this.props.interval);
  };

  render() {
    return this.props.children(this.props.values[this.state.valuesIndex]);
  }
}

export default ChangingProgressProvider;
