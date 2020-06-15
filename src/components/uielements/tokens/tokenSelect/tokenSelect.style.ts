import styled, { css } from 'styled-components';
import { palette } from 'styled-theme';
import { CaretDownOutlined } from '@ant-design/icons';
import { transition } from '../../../../settings/style-util';
import { cleanTag } from '../../../../helpers/styleHelper';

export const TokenSelectWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 216px;
  height: 60px;
  text-transform: uppercase;
  ${transition()};
`;

const IconBase = cleanTag(CaretDownOutlined, ['open']);
export const DropdownIcon = styled(IconBase)`
  transition: transform 0.2s ease-in-out;
  ${({ open }) =>
    open ? 'transform: rotate(180deg);' : 'transform: rotate(0);'}
  font-size: 18px;

  svg {
    font-size: 14px;
    color: ${palette('text', 1)};
  }
`;

export const DropdownIconHolder = styled.div`
  transition: transform 0.2s ease-in-out;
`;

export const TokenDropdownButton = styled.button`
  ${({ disabled }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    &:focus {
      outline: none;
    }
    > * {
      margin-right: 10px;
    }

    ${!disabled
      ? css`
          &:hover {
            ${DropdownIconHolder} {
              transform: translateY(-1px);
            }
          }
        `
      : ''};
  `}
`;
