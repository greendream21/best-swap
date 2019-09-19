import styled from 'styled-components';
import { palette } from 'styled-theme';
import UIButton from '../button';

export const SelectionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 200px;
`;

export const Button = styled(UIButton).attrs({
  sizevalue: 'small',
  typevalue: 'outline',
})`
  min-width: 45px;
  width: 45px;
  /* TODO: create specific style for muted buttons to avoid using !important */
  border-color: ${palette('border', 0)} !important;
  color: ${palette('border', 0)} !important;
`;
