import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Slider } from 'antd';

export const SliderWrapper = styled(Slider)`
  &.ant-slider {
    .ant-slider-rail {
      height: 5px;
      background: linear-gradient(
        to right,
        #eceeef 0%,
        #50e3c2 50%,
        #eceeef 100%
      );
    }

    .ant-slider-track {
      background: transparent;
    }

    .ant-slider-handle {
      width: 30px;
      height: 30px;
      margin-top: -12px;
      border: none;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    }
  }
`;
