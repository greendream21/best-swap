import React from 'react';
import PropTypes from 'prop-types';

class WSEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ws: window.WebSocket
        ? new window.WebSocket(this.props.url, this.props.protocol)
        : new window.MozWebSocket(this.props.url, this.props.protocol),
      attempts: 1,
    };
  }

  componentDidMount() {
    this.setupWebsocket();
  }

  componentWillUnmount() {
    this.shouldReconnect = false;
    clearTimeout(this.timeoutID);

    const websocket = this.state.ws;
    websocket.close();
  }

  setupWebsocket = () => {
    const websocket = this.state.ws;

    // pass the websocket to parent
    this.props.onRef(websocket);

    websocket.onopen = () => {
      this.logging('Websocket connected');
      if (typeof this.props.onOpen === 'function') this.props.onOpen();
    };

    websocket.onerror = e => {
      if (typeof this.props.onError === 'function') this.props.onError(e);
    };

    websocket.onmessage = evt => {
      this.props.onMessage(evt.data);
    };

    this.shouldReconnect = this.props.reconnect;
    websocket.onclose = evt => {
      this.logging(
        `Websocket disconnected,the reason: ${evt.reason},the code: ${evt.code}`,
      );

      if (typeof this.props.onClose === 'function') {
        this.props.onClose(evt.code, evt.reason);
      }

      if (this.shouldReconnect) {
        const time = this.generateInterval(this.state.attempts);

        this.timeoutID = setTimeout(() => {
          this.setState(prevState => ({
            attempts: prevState.attempts + 1,
          }));
          this.setState({
            ws: window.WebSocket
              ? new window.WebSocket(this.props.url, this.props.protocol)
              : new window.MozWebSocket(this.props.url, this.props.protocol),
          });
          this.setupWebsocket();
        }, time);
      }
    };
  };

  generateInterval = k => {
    if (this.props.reconnectIntervalInMilliSeconds > 0) {
      return this.props.reconnectIntervalInMilliSeconds;
    }
    const logK = 2 ** k;

    return Math.min(30, logK - 1) * 1000;
  };

  logging = logline => {
    if (this.props.debug === true) {
      console.log(logline);
    }
  };

  sendMessage = message => {
    const websocket = this.state.ws;

    websocket.send(message);
  };

  render() {
    return <React.Fragment />;
  }
}

WSEvent.defaultProps = {
  debug: false,
  reconnect: true,
};

WSEvent.propTypes = {
  url: PropTypes.string.isRequired,
  onMessage: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onError: PropTypes.func,
  onRef: PropTypes.func,
  debug: PropTypes.bool,
  reconnect: PropTypes.bool,
  protocol: PropTypes.string,
  reconnectIntervalInMilliSeconds: PropTypes.number,
};

export default WSEvent;
