import styled from 'styled-components';
import { palette } from 'styled-theme';

export const TrendWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props =>
    props.trend ? palette('success', 0) : palette('error', 0)};
  .label-wrapper {
    padding: 0 3px;
    color: ${props =>
      props.trend ? palette('success', 0) : palette('error', 0)};
  }
`;
