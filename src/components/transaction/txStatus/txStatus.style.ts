import styled from 'styled-components';
import { RoundValue } from './txStatus';
import { media } from '../../../helpers/styleHelper';

export const TxStatusWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;

  ${(props: { round: RoundValue }) =>
    props.round === 'right'
      ? `
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      `
      : `
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
  `};
  background: #e6e7ec;
  text-transform: uppercase;
  &:hover {
    box-shadow: 2px 2px 4px 1px #aab5c4;
    cursor: pointer;
  }

  height: 30px;
  padding: 8px 8px;
  ${media.sm`
    height: 40px;
    padding: 10px 18px;
  `}

  .txStatus-type {
    font-size: 10px;
    letter-spacing: 0.7px;
    padding-right: 6px;
    color: #aab5c4;
    ${media.sm`
      font-size: 12px;
      letter-spacing: 1px;
      padding-right: 20px;
    `}
  }
`;

export const TxStatusContent = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-transform: uppercase;

  .txStatus-amount,
  .txStatus-asset {
    color: #606b7a;
    font-size: 13px;
    letter-spacing: 0.7px;
    padding: 0 2px;
    ${media.sm`
      font-size: 15px;
      letter-spacing: 1px;
      padding: 0 2px;
    `}
  }
`;

export const Seperator = styled.div`
  width: 1px;
  height: 20px;
  border-left: 1px solid #e6e7ec;
  margin: 0 2px;
  ${media.sm`
    margin: 0 15px;
  `}
`;
