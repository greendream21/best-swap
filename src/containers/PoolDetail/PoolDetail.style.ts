import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import ContentView from 'components/utility/contentView';

import { media } from 'helpers/styleHelper';

export const ContentWrapper = styled(ContentView)`
  padding: 0;

  .pool-caption-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;

    display: none;
    ${media.sm`
      display: flex;
    `}

    &.mobile-view {
      display: flex;
      flex-direction: column;
      ${media.sm`
        display: none;
      `}
    }
  }
`;

export const PoolCaptionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${media.sm`
    justify-content: center;
  `}
`;

export const PoolCaptionTitle = styled.span`
  font-family: 'Exo 2';
  font-weight: bold;
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${palette('text', 0)};
  margin-right: 20px;
`;

export const PoolCaptionPrice = styled.span`
  font-family: 'Exo 2';
  font-weight: normal;
  font-size: 20px;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${palette('text', 0)};
  ${media.sm`
    font-size: 32px;
  `}
`;

export const PoolCaptionButtonsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
  width: 250px;

  ${media.sm`
    margin-top: 0px;
  `}

  .btn-wrapper {
    margin-left: 10px;
  }
`;

export const ChartContainer = styled.div`
  margin-left: 0px;
  ${media.md`
    margin-left: 16px;
  `}
`;

export const PopoverContent = styled.div`
  width: 300px;
  font-size: '11px';
  color: ${palette('text', 0)};
`;

export const PopoverIcon = styled(InfoCircleOutlined)`
  color: ${props => palette(props.color, 0)};
  margin: 0 10px;
`;
