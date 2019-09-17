import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectionWrapper, Button } from './selection.style';

class Selection extends Component {
  static propTypes = {
    className: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    selected: PropTypes.number,
  };

  static defaultProps = {
    className: '',
    selected: 0,
  };

  handleClick = value => {
    const { onSelect } = this.props;
    console.log({ value });
    onSelect(value);
  };

  render() {
    const { className, selected, ...props } = this.props;
    console.log({ selected });
    return (
      <SelectionWrapper className={`selection-wrapper ${className}`} {...props}>
        <Button
          onClick={() => this.handleClick(25)}
          sizevalue="small"
          typevalue="outline"
          focused={selected === 25}
        >
          25%
        </Button>
        <Button
          onClick={() => this.handleClick(50)}
          sizevalue="small"
          typevalue="outline"
          focused={selected === 50}
        >
          50%
        </Button>
        <Button
          onClick={() => this.handleClick(75)}
          sizevalue="small"
          typevalue="outline"
          focused={selected === 75}
        >
          75%
        </Button>
        <Button
          onClick={() => this.handleClick(100)}
          sizevalue="small"
          typevalue="outline"
          focused={selected === 100}
        >
          All
        </Button>
      </SelectionWrapper>
    );
  }
}

export default Selection;
