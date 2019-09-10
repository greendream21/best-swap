import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectionWrapper } from './selection.style';
import Button from '../button';

class Selection extends Component {
  static propTypes = {
    className: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    className: '',
  };

  state = {
    focused: 100,
  };

  handleClick = value => {
    const { onSelect } = this.props;

    onSelect(value);
    this.setState({
      focused: value,
    });
  };

  render() {
    const { className, ...props } = this.props;
    const { focused } = this.state;

    return (
      <SelectionWrapper className={`selection-wrapper ${className}`} {...props}>
        <Button
          onClick={() => this.handleClick(25)}
          sizevalue="small"
          typevalue="outline"
          focused={focused === 25}
        >
          25%
        </Button>
        <Button
          onClick={() => this.handleClick(50)}
          sizevalue="small"
          typevalue="outline"
          focused={focused === 50}
        >
          50%
        </Button>
        <Button
          onClick={() => this.handleClick(75)}
          sizevalue="small"
          typevalue="outline"
          focused={focused === 75}
        >
          75%
        </Button>
        <Button
          onClick={() => this.handleClick(100)}
          sizevalue="small"
          typevalue="outline"
          focused={focused === 100}
        >
          All
        </Button>
      </SelectionWrapper>
    );
  }
}

export default Selection;
