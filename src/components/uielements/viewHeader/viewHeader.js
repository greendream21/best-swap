import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import Label from '../label';
import { HeaderWrapper } from './viewHeader.style';

class ViewHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    actionText: PropTypes.string,
    onAction: PropTypes.func,
    back: PropTypes.bool,
    onBack: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    actionText: '',
    back: true,
    onAction: () => {},
    onBack: () => {},
  };

  render() {
    const {
      title,
      actionText,
      back,
      onAction,
      onBack,
      ...otherProps
    } = this.props;
    return (
      <HeaderWrapper {...otherProps}>
        {back && (
          <Label color="primary" weight="bold" onClick={onBack}>
            <Icon type="left" />
            <span>Back</span>
          </Label>
        )}
        {title && (
          <Label color="normal" size="normal" weight="bold">
            {title}
          </Label>
        )}
        {actionText && (
          <Label color="primary" weight="bold" onClick={onAction}>
            <span>{actionText}</span>
            <Icon type="sync" />
          </Label>
        )}
      </HeaderWrapper>
    );
  }
}

export default ViewHeader;
