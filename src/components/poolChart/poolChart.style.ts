import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Line } from 'react-chartjs-2';

export const ChartContainer = styled('div')`
  background: ${palette('background', 0)};
  margin-left: 20px;

  padding: 10px 20px;
  border-radius: 4px;
  width: calc(100% - 20px);
  height: 362px;
`;

export const ChartHeaderType = styled('div')`
  display: flex;
  align-items: center;
`;

export const ChartHeaderItem = styled('div')`
  margin-right: 20px;
  &:last-child{
    margin-right: 0px;
  }
`;

export const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const TypeContainer = styled('div')`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 20px;
  }
`;

export const TimeContainer = styled('div')`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 20px;
  }
`;

export const HeaderToggle = styled('span')`
  color: ${palette('text', 0)};
  font-size: 18px;
  font-weight: ${props => props.toggled ? '600' : 'normal'};
  &:hover {
    opacity: 0.8;
  }
  cursor: pointer;
`;

export const LineChartContainer = styled('div')`
  margin-top: 10px;
  width: calc(100% - 10px);
  height: calc(100% - 40px);
  .chartjs-render-monitor{
    height: 100% !important;
  }
`;

export const LineChart = styled(Line)`
  width: 100%;
  height: 100%;
`;
