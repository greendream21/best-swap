import { transparentize } from 'polished';
import styled from 'styled-components';
import { palette } from 'styled-theme';

export const ContentTitleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 64px;

  background-color: ${props =>
    transparentize(0.5, props.theme.palette.gray[0])};
  border-radius: 1px solid ${palette('gray', 1)};

  color: ${palette('text', 0)};
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  text-transform: uppercase;

  border-radius: 14px;
`;
