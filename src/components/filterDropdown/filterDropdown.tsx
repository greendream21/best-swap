import React, { useCallback } from 'react';
import { Dropdown, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';

import Button from '../uielements/button';
import { Menu } from './filterDropdown.style';

type Props = {
  onClick?: (key: string) => void;
};

type MenuItem = {
  icon: string;
  title: string;
  key: string;
};

type MenuItems = MenuItem[];

const FilterDropdown: React.FC<Props> = (props: Props): JSX.Element => {
  const { onClick } = props;

  const handleClickItem = useCallback(
    ({ key }: ClickParam) => {
      if (onClick) onClick(key);
    },
    [onClick],
  );

  const renderMenu = () => {
    const items: MenuItems = [
      {
        icon: 'database',
        title: 'All',
        key: 'all',
      },
      {
        icon: 'swap',
        title: 'Swap',
        key: 'swap',
      },
      {
        icon: 'double-right',
        title: 'Stake',
        key: 'stake',
      },
      {
        icon: 'import',
        title: 'Withdraw',
        key: 'withdraw',
      },
    ];

    return (
      <Menu className="filterDropdown-menu-items" onClick={handleClickItem}>
        {items.map(item => {
          return (
            <Menu.Item key={item.key}>
              <Icon type={item.icon} /> {item.title}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={renderMenu()} trigger={['click']}>
      <Button color="primary" typevalue="outline">
        Filter <Icon type="caret-down" />
      </Button>
    </Dropdown>
  );
};

export default FilterDropdown;
