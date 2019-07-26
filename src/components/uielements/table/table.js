import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TableWrapper } from './table.style';

class Table extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { className, ...props } = this.props;

    return (
      <TableWrapper
        className={`table-wrapper ${className}`}
        pagination={false}
        {...props}
      />
    );
  }
}

export default Table;
