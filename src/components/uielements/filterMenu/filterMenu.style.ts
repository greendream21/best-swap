import * as A from 'antd';
import styled from 'styled-components';

// export const MenuItem = styled<MenuProps & MenuItemProps>(AntdMenu.Item)`
export const MenuItem = styled(A.Menu.Item)`
  ${({ disabled }) => (disabled ? 'opacity: 0.5' : '')}
`;

export const Menu = A.Menu;
