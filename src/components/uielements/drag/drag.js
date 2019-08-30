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
    reset: PropTypes.bool,
    onConfirm: PropTypes.func,
    onDrag: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    onConfirm: () => {},
    onDrag: () => {},
    reset: true,
    title: '',
    className: '',
  };

  state = {
    focused: true,
    overlap: false,
    success: false,
    disabled: false,
    missed: false,
    dragging: false,
    pos: {
      x: 0,
      y: 0,
    },
  };

  componentDidUpdate = prevProps => {
    if (prevProps.reset === false && this.props.reset === true) {
      this.handleReset();
    }
  };

  handleFocus = e => {
    e.preventDefault();
    this.setState({
      focused: true,
    });
  };

  handleReset = () => {
    this.setState({
      focused: false,
      success: false,
      overlap: false,
      disabled: false,
      missed: true,
      dragging: false,
      pos: {
        x: 0,
        y: 0,
      },
    });
  };

  handleBlur = e => {
    e.preventDefault();
    const { success } = this.state;

    // if (!success) {
    //   this.handleReset();
    // }
  };

  handleDragStart = e => {
    e.preventDefault();
    e.stopPropagation();
    const { onDrag } = this.props;
    const { focused, disabled } = this.state;

    if (!focused || disabled) {
      return false;
    }

    onDrag();

    this.setState({
      missed: false,
      dragging: true,
    });
  };

  handleDragging = (e, pos) => {
    e.preventDefault();
    e.stopPropagation();

    const { focused, disabled, overlap, success } = this.state;

    if (!focused || disabled) {
      return false;
    }

    const { x } = pos;

    const overlapLimit = 110;
    const successLimit = 135;

    if (x >= successLimit && !success) {
      this.setState({
        success: true,
      });
    }
    if (x >= overlapLimit && !overlap) {
      this.setState({
        overlap: true,
      });
    } else if (x <= overlapLimit && overlap) {
      this.setState({
        overlap: false,
      });
    }

    this.setState({
      pos,
    });

    return true;
  };

  handleDragStop = (e, pos) => {
    const { onConfirm } = this.props;
    const { focused, disabled, overlap, success } = this.state;

    if (!focused || disabled) {
      return false;
    }

    const { x } = pos;

    const successLimit = 135;

    if (x >= successLimit) {
      this.setState(
        () => ({
          success: true,
          overlap: false,
          disabled: true,
        }),
        () => {
          onConfirm();
        },
      );
    } else {
      this.handleReset();
    }
    return true;
  };

  render() {
    const { source, target, title, className, ...props } = this.props;
    const { pos, overlap, success, missed, dragging } = this.state;
    const dragHandlers = {
      onStart: this.handleDragStart,
      onDrag: this.handleDragging,
      onStop: this.handleDragStop,
    };
    const dragBounds = {
      left: 0,
      top: 0,
      bottom: 0,
      right: 150,
    };

    return (
      <div className={`drag-wrapper ${className}`}>
        <DragWrapper
          overlap={overlap}
          success={success}
          missed={missed}
          dragging={dragging}
          {...props}
        >
          <Draggable
            position={pos}
            axis="x"
            bounds={dragBounds}
            {...dragHandlers}
          >
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
