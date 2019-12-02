import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Slider } from 'antd';

export const SliderWrapper = styled(Slider)`
  &.ant-slider {
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom: 10px;

    .ant-slider-rail {
      height: 4px;
      background: ${palette('primary', 0)};
    }

    .ant-slider-track {
      background: transparent;
    }

    .ant-slider-handle {
      width: 14px;
      height: 14px;
      margin-top: -6px;
      margin-left: -6px;
      border: 3px solid ${palette('success', 0)};
      background: #fff;
    }

    .ant-slider-dot {
      display: none;
    }

    &:hover {
      .ant-slider-track {
        background: ${palette('primary', 1)};
      }
    }
  }
`;

export const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;
