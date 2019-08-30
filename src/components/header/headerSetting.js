import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';

import ConnectionStatus from '../uielements/connectionStatus';

import { menuItems, items } from './data';

const style = {
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 10px',
};

class HeaderSetting extends Component {
  state = {
    curItem: null,
  };

  handleClickItem = ({ key }) => {
    this.setState({
      curItem: key,
    });
  };

  renderMenu = () => {
    const menu = (
      <Menu
        onClick={this.handleClickItem}
        style={style}
        className="connection-menu-items"
      >
        {menuItems.map(item => {
          const { label, key, status } = item;
          return (
            <Menu.Item style={itemStyle} key={key}>
              <ConnectionStatus color={status} />
              <span style={{ paddingLeft: '10px', fontWeight: 'bold' }}>
                {label}
              </span>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return menu;
  };

  render() {
    const { curItem } = this.state;
    const { status = 'red' } = items[curItem] || {};
    return (
      <Dropdown overlay={this.renderMenu()} trigger={['click']}>
        <a className="ant-dropdown-link" href="/">
          <ConnectionStatus color={status} />
          <Icon type="down" />
        </a>
      </Dropdown>
    );
  }
}

export default HeaderSetting;
