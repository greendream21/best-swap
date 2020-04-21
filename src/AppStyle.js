import styled from 'styled-components';
import { palette, font } from 'styled-theme';
import { media } from './helpers/styleHelper';

import normalFont from './assets/font/Montserrat-Regular.otf';
import lightFont from './assets/font/Montserrat-Light.otf';
import mediumFont from './assets/font/Montserrat-Medium.otf';
import boldFont from './assets/font/Montserrat-Bold.otf';
import italicFont from './assets/font/Montserrat-LightItalic.otf';

const AppHolder = styled.div`
  @font-face {
    font-family: 'Montserrat';
    src: url(${normalFont});
    font-weight: normal;
  }
  @font-face {
    font-family: 'Montserrat Light';
    src: url(${lightFont});
    font-weight: lighter;
  }
  @font-face {
    font-family: 'Montserrat Bold';
    src: url(${boldFont});
    font-weight: bold;
  }
  @font-face {
    font-family: 'Montserrat Medium';
    src: url(${mediumFont});
    font-weight: medium;
  }
  @font-face {
    font-family: 'Montserrat Italic';
    src: url(${italicFont});
    font-weight: italic;
  }

  font-family: ${font('primary', 0)};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  p,
  li,
  input,
  textarea,
  span,
  div,
  img,
  th,
  td,
  svg {
    margin-bottom: 0;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &::selection {
      background: ${palette('primary', 0)};
      color: ${palette('background', 1)};
    }
  }

  section.ant-layout {
    background: ${palette('background', 1)};
  }

  .ant-popover {
    .ant-popover-arrow {
      border-color: ${palette('background', 1)};
    }
    .ant-popover-inner {
      background-color: ${palette('background', 1)};
    }
  }

  .ant-popover-inner-content {
    padding: 6px;
    font-size: 11px;
    letter-spacing: 0.5px;
    font-family: 'Montserrat';
    src: url(${normalFont});
  }

  .ant-row:not(.ant-form-item) {
    ${'' /* margin-left: -8px;
    margin-right: -8px; */};
    &:before,
    &:after {
      display: none;
    }
  }

  .ant-row > div {
    padding: 0;
  }

  .desktop-view {
    display: none;
    ${media.sm`
      display: block;
    `}
  }
`;

export default AppHolder;
