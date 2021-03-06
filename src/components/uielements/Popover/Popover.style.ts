import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
import { palette } from 'styled-theme';

export const TooltipContent = styled.div`
  width: 300px;

  font-size: 14px;
  color: ${palette('text', 0)};

  z-index: 99999;
`;


export const PopoverIcon = styled(InfoCircleOutlined)`
  color: ${props => palette(props.color, 0)};
  margin: 0 10px;
`;
