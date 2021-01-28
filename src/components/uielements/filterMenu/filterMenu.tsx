import React, { useCallback, useState, useMemo } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { ClickParam } from 'antd/lib/menu';

import Input from '../input';
import { Menu, MenuItem } from './filterMenu.style';

const style: React.CSSProperties = {
  maxHeight: '400px',
  overflowY: 'auto',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

type Props = {
  onSelect?: (value: string) => void;
  filterFunction: (item: string, searchTerm: string) => boolean;
  searchEnabled?: boolean;
  cellRenderer: (data: string) => { key: string; node: JSX.Element };
  data: string[];
  disableItemFilter?: (item: string) => boolean;
  placeholder?: string;
  selectedKeys?: string[];
};

const FilterMenu: React.FC<Props> = ({
  onSelect = _ => {},
  searchEnabled = false,
  data,
  filterFunction,
  cellRenderer,
  disableItemFilter = _ => false,
  placeholder = 'Search Token ...',
  selectedKeys = [],
  ...otherProps
}): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClick = useCallback(
    (event: ClickParam) => {
      // (Rudi) bail if this is triggered by the search menu item
      if (!event || !event.key || event.key === '_search') return;

      setSearchTerm('');
      onSelect(event.key);
    },
    [onSelect],
  );

  const handleSearchChanged = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newSearchTerm = event.currentTarget.value;
      setSearchTerm(newSearchTerm);
    },
    [],
  );

  const filteredData: string[] = useMemo(
    () =>
      searchTerm === ''
        ? data
        : data.filter(item => filterFunction(item, searchTerm)),
    [data, filterFunction, searchTerm],
  );

  return (
    <Menu
      {...otherProps}
      style={style}
      selectedKeys={selectedKeys}
      onClick={handleClick}
    >
      {searchEnabled && (
        <Menu.Item disabled key="_search">
          <Input
            value={searchTerm}
            onChange={handleSearchChanged}
            placeholder={placeholder}
            sizevalue="big"
            typevalue="ghost"
            suffix={<SearchOutlined />}
          />
        </Menu.Item>
      )}
      {filteredData.map((item: string) => {
        const { key, node } = cellRenderer(item);
        const disableItem = disableItemFilter(item);

        return (
          <MenuItem disabled={disableItem} key={key}>
            {node}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default FilterMenu;
