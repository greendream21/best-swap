import React, { useCallback } from 'react';
import { Dropdown, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';

import { TxDetailsTypeEnum } from '../../types/generated/midgard';
import { Menu, DesktopButton, MobileButton } from './filterDropdown.style';

export type FilterValue = TxDetailsTypeEnum.Swap | TxDetailsTypeEnum.Stake | TxDetailsTypeEnum.Unstake | 'all';

type Props = {
  value: string;
  onClick?: (key: string) => void;
};

type MenuItem = {
  icon: string;
  title: string;
  key: FilterValue;
};

type MenuItems = MenuItem[];

const FilterDropdown: React.FC<Props> = (props: Props): JSX.Element => {
  const { value, onClick } = props;

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
        title: 'ALL',
        key: 'all',
      },
      {
        icon: 'swap',
        title: 'SWAP',
        key: TxDetailsTypeEnum.Swap,
      },
      {
        icon: 'double-right',
        title: 'STAKE',
        key: TxDetailsTypeEnum.Stake,
      },
      {
        icon: 'import',
        title: 'WITHDRAW',
        key: TxDetailsTypeEnum.Unstake,
      },
    ];

    return (
      <Menu
        className="filterDropdown-menu-items"
        onClick={handleClickItem}
        selectedKeys={[value]}
      >
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
      <div className="dropdown-wrapper">
        <DesktopButton color="primary" typevalue="outline">
          {value} <Icon type="caret-down" />
        </DesktopButton>
        <MobileButton color="primary" typevalue="ghost">
          <Icon type="filter" />
        </MobileButton>
      </div>
    </Dropdown>
  );
};

export default FilterDropdown;
