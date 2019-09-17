import { Menu as AntdMenu } from 'antd';
import styled from 'styled-components';

export const MenuItem = styled(AntdMenu.Item)`
  ${({ disabled }) => (disabled ? 'opacity: 0.5' : '')}
`;

export const Menu = AntdMenu;
