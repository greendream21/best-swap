/* eslint-disable */
import { Children, Component } from 'react';
import { findDOMNode } from 'react-dom';

/**
 * This component exposes a callback prop that always returns the DOM node of both functional and class component
 * children.
 */

class Ref extends Component {
  componentDidMount() {
    this.handleRef(this.props.innerRef, findDOMNode(this));
  }

  componentWillUnmount() {
    this.handleRef(this.props.innerRef, null);
  }

  handleRef = (ref, node) => {
    if (typeof ref === 'function') {
      ref(node);
      return;
    }

    if (ref !== null && typeof ref === 'object') {
      ref.current = node;
    }
  };

  render() {
    const { children } = this.props;

    return Children.only(children);
  }
}

export default Ref;
