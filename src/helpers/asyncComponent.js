import React, { Component } from 'react';

import ReactPlaceholder from 'react-placeholder';

import PropTypes from 'prop-types';
import 'react-placeholder/lib/reactPlaceholder.css';

class AsyncComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Component: undefined,
    };
  }

  async componentDidMount() {
    this.mounted = true;

    const { componentArguement } = this.props;
    let Component;

    switch (componentArguement) {
      case 'googleChart': {
        const { Chart: googleChart } = await this.props.load;

        Component = googleChart;
        break;
      }
      default: {
        const { default: newComponent } = await this.props.load;

        Component = newComponent;
      }
    }

    if (this.mounted) {
      this.setState({
        Component: <Component {...this.props.componentProps} />,
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const Component = this.state.Component || <div />;

    return (
      <ReactPlaceholder type="text" rows={7} ready={Component !== undefined}>
        {Component}
      </ReactPlaceholder>
    );
  }
}

AsyncComponent.propTypes = {
  componentArguement: PropTypes.object,
  componentProps: PropTypes.object,
  load: PropTypes.object,
};

export default AsyncComponent;
