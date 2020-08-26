import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Line } from 'react-chartjs-2';

import { media } from '../../helpers/styleHelper';

type HeaderToggleProps = {
  primary?: boolean;
};

type BlurWrapperProps = {
  isBlur?: boolean;
};

type ChartContainerProps = {
  gradientStart?: string;
  gradientStop?: string;
};

export const ChartContainer = styled.div`
  background: ${palette('background', 0)};
  padding: 5px;
  border-radius: 4px;
  width: 100%;
  height: 100%;  
  ${media.lg`
    padding: 10px 20px;
    height: 362px;
  `}
  background-image: ${(props: ChartContainerProps) =>
    `linear-gradient(to bottom, ${props.gradientStart}, ${props.gradientStop})`};
`;

export const ChartHeaderType = styled.div`
  display: flex;
  align-items: center;
`;

export const ChartHeaderItem = styled.div`
  margin-right: 20px;
  &:last-child {
    margin-right: 0px;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const TypeContainer = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 20px;
  }
`;

export const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-right: 20px;
  }
`;

export const HeaderToggle = styled.span`
  color: ${palette('text', 0)};
  font-size: 14px !important;
  font-weight: ${(props: HeaderToggleProps) =>
    props.primary ? '600' : 'normal'};
  cursor: pointer;
  ${media.sm`
    font-size: 18px;
    &:hover {
      opacity: 0.8;
    }
  `}
`;

export const LineChartContainer = styled.div`
  margin-top: 10px;
  position: relative;
  width: calc(100% - 10px);
  height: calc(100% - 40px);
  min-height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export const LineChart = styled(Line)`
  width: 100%;
  font-family: 'Exo 2';
`;

export const ComingSoonWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${palette('text', 1)};
`;

export const ComingSoonText = styled.p`
  text-transform: uppercase;
  margin: 10px 0 0;
  padding: 0;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
`;

export const BlurWrapper = styled.div<BlurWrapperProps>`
  width: 100%;
  height: 100%;
  filter: ${props => (props.isBlur ? 'blur(10px)' : 'none')};
`;
