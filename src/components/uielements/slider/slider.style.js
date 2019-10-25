import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Slider } from 'antd';

export const SliderWrapper = styled(Slider)`
  &.ant-slider {
    margin-bottom: 25px;
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
