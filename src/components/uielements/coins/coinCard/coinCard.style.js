import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { palette } from 'styled-theme';
import { Icon, Input, Divider } from 'antd';
import Label from '../../label';
import { cleanTag } from '../../../../helpers/styleHelper';
import Coin from '../coin';

export const CoinCardWrapper = styled.div`
  .title-label {
    font-style: italic;
  }

  .selection-wrapper {
    min-width: 250px;
    width: auto;
    margin-top: 10px;

    .btn-wrapper {
      width: 20%;
    }
  }
`;

export const CardBorderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 10px;

  border: 1px solid ${palette('border', 0)};
  border-radius: 5px;
  background-color: #fff;
`;

export const CardTopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-width: 250px;
`;

export const AssetCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconBase = cleanTag(Icon, ['open']);
export const DropdownIcon = styled(IconBase)`
  transition: transform 0.2s ease-in-out;
  ${({ open }) =>
    open ? 'transform: rotate(180deg);' : 'transform: rotate(0);'}
  font-size: 18px;
`;

export const DropdownIconHolder = styled.div`
  transition: transform 0.2s ease-in-out;
`;

export const AssetNameLabel = styled(Label).attrs({
  size: 'small',
  weight: 'bold',
})`
  transition: transform 0.2s ease-in-out;
  text-transform: uppercase;
  padding: 5px 0 0;
`;

export const CoinDropdownCoin = styled(Coin)`
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
`;

export const CoinDropdownButton = styled.button`
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
            ${CoinDropdownCoin} {
              opacity: 0.8;
            }
            ${AssetNameLabel} {
              transform: translateY(1px);
            }
            ${DropdownIconHolder} {
              transform: translateY(-1px);
            }
          }
        `
      : ''};
  `}
`;

export const CoinDropdownVerticalColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 32px;
`;

export const AssetData = styled.div.attrs({ className: 'asset-data' })`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 20px 20px 10px 20px;
`;

export const VerticalDivider = styled(Divider).attrs({
  type: 'vertical',
})`
  &.ant-divider {
    margin: 0 10px 0 0;
    height: 20px;
  }
`;

export const HorizontalDivider = styled(Divider)`
  &.ant-divider {
    margin: 2px 0;
    background: ${palette('border', 0)};
  }
`;

export const FooterLabel = styled(Label).attrs({
  size: 'small',
  color: 'gray',
  weight: 'bold',
})`
  padding: 0;
`;

function AutofocusInput(props) {
  const handleFocus = React.useCallback(
    event => {
      event.target.select();
      if (props.onFocus) props.onFocus(event);
    },
    [props],
  );

  return <Input {...props} onFocus={handleFocus} />;
}

AutofocusInput.propTypes = {
  onFocus: PropTypes.func,
};

export const CoinCardInput = styled(AutofocusInput)`
  /* TODO: move these styles to a uielement */
  &.ant-input {
    border: none;
    padding: 0;
    &:focus {
      outline: none;
      border: none;
      box-shadow: none;
    }
  }
  &.ant-input.ant-input-disabled {
    background-color: #fff;
  }
`;
