import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

import { coinGroup } from '../../../settings';
import { DragWrapper } from './drag.style';
import CoinIcon from '../coins/coinIcon';

class Drag extends Component {
  static propTypes = {
    source: PropTypes.oneOf(coinGroup).isRequired,
    target: PropTypes.oneOf(coinGroup).isRequired,
    onConfirm: PropTypes.func,
    className: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onConfirm: () => {},
    className: '',
  };

  state = {
    focused: true,
    overlap: false,
    success: false,
  };

  handleFocus = e => {
    e.preventDefault();
    this.setState({
      focused: true,
    });
  };

  handleBlur = e => {
    e.preventDefault();
    this.setState({
      focused: false,
    });
  };

  handleDragStart = e => {
    e.preventDefault();
    e.stopPropagation();
    const { focused } = this.state;

    if (!focused) {
      return false;
    }
  };

  handleDragging = (e, pos) => {
    e.preventDefault();
    e.stopPropagation();

    const { onConfirm } = this.props;
    const { focused } = this.state;

    if (!focused) {
      return false;
    }

    const { x } = pos;

    const overlapLimit = 110;
    const successLimit = 150;

    if (x >= successLimit) {
      this.setState(
        {
          success: true,
          overlap: false,
        },
        () => {
          onConfirm();
        },
      );
    } else if (x >= overlapLimit) {
      this.setState({
        overlap: true,
      });
    }
  };

  render() {
    const { source, target, className, ...props } = this.props;
    const { overlap, success } = this.state;
    const dragHandlers = {
      onStart: this.handleDragStart,
      onDrag: this.handleDragging,
    };
    const dragBounds = {
      left: 0,
      top: 0,
      bottom: 0,
      right: 150,
    };

    return (
      <DragWrapper
        overlap={overlap}
        success={success}
        className={`drag-wrapper ${className}`}
        {...props}
      >
        <Draggable axis="x" bounds={dragBounds} {...dragHandlers}>
          <CoinIcon
            onMouseEnter={this.handleFocus}
            onMouseLeave={this.handleBlur}
            className="source-asset"
            type={source}
          />
        </Draggable>
        <CoinIcon className="target-asset" type={target} />
      </DragWrapper>
    );
  }
}

export default Drag;
