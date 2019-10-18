import React from 'react';
import PropTypes from 'prop-types';

class ChangingProgressProvider extends React.Component {
  static propTypes = {
    reset: PropTypes.bool,
    status: PropTypes.bool,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    interval: 1000,
    reset: false,
    status: false,
    onChange: () => {},
  };

  state = {
    valuesIndex: 0,
  };

  interval = null;

  componentDidMount() {
    // this.startTimer();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reset === false && this.props.reset === true) {
      clearInterval(this.interval);
    }
    if (prevProps.reset === true && this.props.reset === false) {
      this.setState(
        () => ({
          valuesIndex: 0,
        }),
        () => {
          this.startTimer();
        },
      );
    }

    if (prevProps.status === false && this.props.status === true) {
      this.startTimer();
    }
    if (prevProps.status === true && this.props.status === false) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startTimer = () => {
    const { onChange } = this.props;

    this.interval = setInterval(() => {
      // TODO: use callback version as this may cause bugs
      const valuesIndex =
        // eslint-disable-next-line react/prop-types,react/no-access-state-in-setstate
        (this.state.valuesIndex + 1) % this.props.values.length;

      this.setState({
        valuesIndex,
      });
      onChange(valuesIndex);
      // eslint-disable-next-line react/prop-types
    }, this.props.interval);
  };

  render() {
    // eslint-disable-next-line react/prop-types
    return this.props.children(this.props.values[this.state.valuesIndex]);
  }
}

export default ChangingProgressProvider;
