import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Slider } from 'antd';

export const SliderWrapper = styled(Slider)`
  &.ant-slider {
    margin-bottom: 25px;
    .ant-slider-rail {
      height: 5px;
      background: linear-gradient(
        to right,
        ${palette('primary', 5)} 0%,
        ${palette('primary', 1)} 50%,
        ${palette('primary', 5)} 100%
      );
    }

    .ant-slider-track {
      background: transparent;
    }

    .ant-slider-handle {
      width: 30px;
      height: 30px;
      margin-top: -12px;
      margin-left: -15px;
      border: none;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    }

    &:hover {
      .ant-slider-track {
        background: ${palette('primary', 1)};
      }
    }
  }
`;
