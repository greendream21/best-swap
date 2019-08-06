import styled from 'styled-components';
import { palette, key } from 'styled-theme';

export const SelectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;

  button {
    min-width: 45px !important;
    width: 45px;
    border-color: ${palette('border', 0)} !important;
    color: ${palette('border', 0)} !important;
  }
`;
