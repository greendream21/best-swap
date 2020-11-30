import React, { Component } from 'react';

import Draggable from 'react-draggable';

import PropTypes from 'prop-types';

import CoinIcon from '../coins/coinIcon';
import { DragWrapper, TitleLabel } from './drag.style';

class Drag extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  }

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
    // const { success } = this.state;

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

    const overlapLimit = 164;
    const successLimit = 190;

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
    const { focused, disabled } = this.state;

    if (!focused || disabled) {
      return false;
    }

    const { x } = pos;

    const successLimit = 190;

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
    const {
      source,
      target,
      title,
      className,
      onConfirm,
      disabled: disabledProp,
      ...props
    } = this.props;
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
      right: 202,
    };

    return (
      <div className={`drag-wrapper ${className}`}>
        <DragWrapper
          overlap={overlap}
          success={success}
          missed={missed}
          disabled={disabledProp}
          dragging={dragging}
          {...props}
        >
          <Draggable
            disabled={disabledProp}
            position={pos}
            axis="x"
            bounds={dragBounds}
            {...dragHandlers}
          >
            <CoinIcon
              onMouseEnter={this.handleFocus}
              onMouseLeave={this.handleBlur}
              className="source-asset"
              data-test="source-asset"
              type={source}
              size="small"
            />
          </Draggable>
          {title && <TitleLabel color="input">{title}</TitleLabel>}
          <CoinIcon
            className="target-asset"
            data-test="target-asset"
            type={target}
            size="small"
          />
        </DragWrapper>
      </div>
    );
  }
}

Drag.propTypes = {
  source: PropTypes.string.isRequired,
  target: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  reset: PropTypes.bool,
  onConfirm: PropTypes.func,
  onDrag: PropTypes.func,
  className: PropTypes.string,
};

Drag.defaultProps = {
  onConfirm: () => {},
  onDrag: () => {},
  reset: true,
  title: '',
  className: '',
};

export default Drag;
