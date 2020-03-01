import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Menu as Unstyled } from 'antd';

export const Menu = styled(Unstyled)`
  i {
    color: ${palette('primary', 1)};
  }
  .ant-dropdown-menu-item:hover,
  .ant-dropdown-menu-submenu-title:hover {
    background: #F4F5F7;
  }
`;
