import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { LeftOutlined, SyncOutlined } from '@ant-design/icons';

import Label from '../label';
import { HeaderWrapper } from './viewHeader.style';

class ViewHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

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
            <LeftOutlined />
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
            <SyncOutlined spin={loading} />
          </Label>
        )}
      </HeaderWrapper>
    );
  }
}

ViewHeader.propTypes = {
  title: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  back: PropTypes.bool,
  onBack: PropTypes.func,
};

ViewHeader.defaultProps = {
  title: '',
  actionText: '',
  back: true,
  onAction: () => {},
  onBack: () => {},
};

export default ViewHeader;
