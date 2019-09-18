import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Row } from 'antd';

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
          const { label, key, status, url } = item;
          return (
            <Menu.Item style={itemStyle} key={key}>
              <ConnectionStatus color={status} />
              <div>
                <Row>
                  <span style={{ paddingLeft: '10px', fontWeight: 'bold' }}>
                    {label}
                  </span>
                </Row>
                <Row>
                  <span
                    style={{
                      paddingLeft: '10px',
                      color: '#808080',
                      textTransform: 'lowercase',
                    }}
                  >
                    {url}
                  </span>
                </Row>
              </div>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return menu;
  };

  render() {
    const { curItem } = this.state;
    const { status = 'green' } = items[curItem] || {};
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
