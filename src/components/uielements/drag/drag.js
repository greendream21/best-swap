import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';

import CoinIcon from '../coins/coinIcon';
import { coinGroup } from '../../../settings';
import { DragWrapper, TitleLabel } from './drag.style';

class Drag extends Component {
  static propTypes = {
    source: PropTypes.oneOf(coinGroup).isRequired,
    target: PropTypes.oneOf(coinGroup).isRequired,
    title: PropTypes.string,
    onConfirm: PropTypes.func,
    className: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onConfirm: () => {},
    title: '',
    className: '',
  };

  state = {
    focused: true,
    overlap: false,
    success: false,
    disabled: false,
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
    const { focused, disabled } = this.state;

    if (!focused || disabled) {
      return false;
    }
  };

  handleDragging = (e, pos) => {
    e.preventDefault();
    e.stopPropagation();

    const { onConfirm } = this.props;
    const { focused, disabled, overlap, success } = this.state;

    if (!focused || disabled) {
      return false;
    }

    const { x } = pos;

    const overlapLimit = 110;
    const successLimit = 150;

    console.log(x);
    if (x >= successLimit && !success) {
      this.setState(
        {
          success: true,
          overlap: false,
          disabled: true,
        },
        () => {
          onConfirm();
        },
      );
    } else if (x >= overlapLimit && !overlap) {
      this.setState({
        overlap: true,
      });
    } else if (x <= overlapLimit && overlap) {
      this.setState({
        overlap: false,
      });
    }
    return true;
  };

  render() {
    const { source, target, title, className, ...props } = this.props;
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
      <div className={`drag-wrapper ${className}`}>
        <DragWrapper overlap={overlap} success={success} {...props}>
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
        {title && <TitleLabel color="input">{title}</TitleLabel>}
      </div>
    );
  }
}

export default Drag;
