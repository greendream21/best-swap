import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { palette } from 'styled-theme';

import Table from 'components/uielements/table';
import ContentView from 'components/utility/contentView';

import { media } from 'helpers/styleHelper';

export const ContentWrapper = styled(ContentView)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: ${palette('background', 3)};
  padding: 0;

  .content-loader {
    rect {
      width: 100%;
      ${media.sm`
        display: 80%;
      `}
    }
  }

  .pool-list-view {
    padding-top: 10px;
    .pool-card {
      margin-bottom: 10px;
    }
  }
`;

export const StyledTable = styled(Table)`
  tr:hover {
    cursor: pointer;
  }
`;

export const PoolViewTools = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 25px;

  .add-new-pool {
    display: flex;
    align-items: center;
    cursor: pointer;
    max-width: 160px;

    .label-wrapper {
      padding-left: 20px;
    }
  }
`;

export const PoolSearchWrapper = styled.div`
  margin-top: 10px;
`;

export const ActionHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const ActionColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .action-column-wrapper {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 250px;
  }
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
