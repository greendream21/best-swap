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

  state = {
    loading: false,
  };

  handleRefresh = () => {
    const { onAction } = this.props;

    onAction();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 1000);
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
    const { loading } = this.state;

    return (
      <HeaderWrapper {...otherProps}>
        {back && (
          <Label color="primary" weight="bold" onClick={onBack}>
            <Icon type="left" />
            <span>Back</span>
          </Label>
        )}
        {title && (
          <Label color="normal" size="big" weight="bold">
            {title}
          </Label>
        )}
        {actionText && (
          <Label onClick={this.handleRefresh} color="primary" weight="bold">
            <span>{actionText}</span>
            <Icon type="sync" spin={loading} />
          </Label>
        )}
      </HeaderWrapper>
    );
  }
}

export default ViewHeader;
