import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { SelectionWrapper, Button } from './selection.style';

class Selection extends Component {
  handleClick = value => {
    const { onSelect } = this.props;
    onSelect(value);
  };

  render() {
    const { className, selected, ...props } = this.props;

    return (
      <SelectionWrapper className={`selection-wrapper ${className}`} {...props}>
        <Button
          data-test="selection-button-25"
          onClick={() => this.handleClick(25)}
          focused={selected === 25}
          tabIndex="-1"
        >
          25%
        </Button>
        <Button
          data-test="selection-button-50"
          onClick={() => this.handleClick(50)}
          focused={selected === 50}
          tabIndex="-1"
        >
          50%
        </Button>
        <Button
          data-test="selection-button-75"
          onClick={() => this.handleClick(75)}
          focused={selected === 75}
          tabIndex="-1"
        >
          75%
        </Button>
        <Button
          data-test="selection-button-100"
          onClick={() => this.handleClick(100)}
          focused={selected === 100}
          tabIndex="-1"
        >
          All
        </Button>
      </SelectionWrapper>
    );
  }
}

Selection.propTypes = {
  className: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.number,
};

Selection.defaultProps = {
  className: '',
  selected: 0,
};

export default Selection;
